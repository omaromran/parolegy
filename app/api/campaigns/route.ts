import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const caseId = request.nextUrl.searchParams.get('caseId')
  if (!caseId) {
    return NextResponse.json({ error: 'caseId required' }, { status: 400 })
  }

  const caseRecord = await db.case.findFirst({
    where: { id: caseId, userId: user.id },
  })
  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  const campaigns = await db.campaign.findMany({
    where: { caseId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      version: true,
      language: true,
      status: true,
      reviewCycle: true,
      createdAt: true,
      renderedPdfUrl: true,
    },
  })

  return NextResponse.json({ campaigns })
}
