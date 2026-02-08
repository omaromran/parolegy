import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'STAFF'])(
  async (req: NextRequest, user: { userId: string }) => {
    try {
      const pathname = req.nextUrl.pathname
      const id = pathname.split('/').filter(Boolean).pop()
      if (!id) {
        return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
      }

      const caseRecord = await db.case.findFirst({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          assessmentResponses: true,
        },
      })

      if (!caseRecord) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 })
      }

      let responses: Record<string, unknown> = {}
      if (caseRecord.assessmentResponses?.responses) {
        try {
          responses = JSON.parse(caseRecord.assessmentResponses.responses)
        } catch {
          // ignore
        }
      }

      return NextResponse.json({
        case: {
          id: caseRecord.id,
          clientName: caseRecord.clientName,
          tdcjNumber: caseRecord.tdcjNumber,
          unit: caseRecord.unit,
          district: caseRecord.district,
          paroleEligibilityDate: caseRecord.paroleEligibilityDate,
          nextReviewDate: caseRecord.nextReviewDate,
          status: caseRecord.status,
          serviceOption: caseRecord.serviceOption,
          createdAt: caseRecord.createdAt,
          updatedAt: caseRecord.updatedAt,
          user: caseRecord.user,
          assessment: caseRecord.assessmentResponses
            ? {
                id: caseRecord.assessmentResponses.id,
                completedAt: caseRecord.assessmentResponses.completedAt,
                updatedAt: caseRecord.assessmentResponses.updatedAt,
                responses,
              }
            : null,
        },
      })
    } catch (error) {
      console.error('Error fetching case:', error)
      return NextResponse.json(
        { error: 'Failed to fetch case' },
        { status: 500 }
      )
    }
  }
)

const VALID_STATUSES = [
  'DRAFT', 'INTAKE', 'ASSESSMENT_IN_PROGRESS', 'DOCUMENTS_PENDING',
  'AI_DRAFT_READY', 'TEAM_REVIEW', 'CLIENT_REVIEW', 'APPROVED', 'SUBMITTED', 'ARCHIVED',
]

export const PATCH = requireRole(['ADMIN', 'STAFF'])(
  async (req: NextRequest) => {
    try {
      const pathname = req.nextUrl.pathname
      const id = pathname.split('/').filter(Boolean).pop()
      if (!id) {
        return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
      }

      const body = await req.json().catch(() => ({}))
      const { status } = body as { status?: string }

      if (!status || !VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        )
      }

      const caseRecord = await db.case.findFirst({ where: { id } })
      if (!caseRecord) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 })
      }

      await db.case.update({
        where: { id },
        data: { status },
      })

      return NextResponse.json({ success: true, status })
    } catch (error) {
      console.error('Error updating case:', error)
      return NextResponse.json(
        { error: 'Failed to update case' },
        { status: 500 }
      )
    }
  }
)
