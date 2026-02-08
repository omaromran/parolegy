import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
  }

  const campaign = await db.campaign.findFirst({
    where: { id },
    include: {
      case: {
        select: {
          id: true,
          userId: true,
          clientName: true,
          tdcjNumber: true,
        },
      },
    },
  })

  if (!campaign || campaign.case.userId !== user.id) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  let blueprint = null
  try {
    blueprint = JSON.parse(campaign.blueprintJson)
  } catch {
    // ignore
  }

  return NextResponse.json({
    campaign: {
      id: campaign.id,
      version: campaign.version,
      language: campaign.language,
      status: campaign.status,
      reviewCycle: campaign.reviewCycle,
      createdAt: campaign.createdAt,
      renderedPdfUrl: campaign.renderedPdfUrl,
      caseId: campaign.caseId,
      clientName: campaign.case.clientName,
      tdcjNumber: campaign.case.tdcjNumber,
      blueprint,
    },
  })
}
