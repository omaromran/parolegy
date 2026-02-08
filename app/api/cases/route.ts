import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const cases = await db.case.findMany({
    where: { userId: user.id },
    include: {
      assessmentResponses: {
        select: { id: true, completedAt: true, updatedAt: true },
      },
      documents: {
        select: { type: true },
      },
      campaigns: {
        select: { id: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const REQUIRED_DOCS = { SUPPORT_LETTER: 3, PHOTO: 10 }

  return NextResponse.json({
    cases: cases.map((c) => {
      const counts: Record<string, number> = {}
      for (const d of c.documents) {
        counts[d.type] = (counts[d.type] || 0) + 1
      }
      const supportCount = counts.SUPPORT_LETTER || 0
      const photoCount = counts.PHOTO || 0
      const meetsRequiredDocuments =
        supportCount >= REQUIRED_DOCS.SUPPORT_LETTER &&
        photoCount >= REQUIRED_DOCS.PHOTO
      const hasCampaigns = (c.campaigns?.length ?? 0) > 0
      return {
        id: c.id,
        clientName: c.clientName,
        tdcjNumber: c.tdcjNumber,
        unit: c.unit,
        status: c.status,
        serviceOption: c.serviceOption,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        assessment: c.assessmentResponses
          ? {
              id: c.assessmentResponses.id,
              completedAt: c.assessmentResponses.completedAt,
              updatedAt: c.assessmentResponses.updatedAt,
            }
          : null,
        documentCounts: counts,
        meetsRequiredDocuments,
        hasCampaigns,
      }
    }),
  })
}
