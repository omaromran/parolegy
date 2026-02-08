import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { sendAssessmentSubmittedNotification } from '@/lib/email'

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
    include: { assessmentResponses: true },
  })

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  if (!caseRecord.assessmentResponses) {
    return NextResponse.json({ responses: {} })
  }

  let responses: Record<string, unknown> = {}
  try {
    responses = JSON.parse(caseRecord.assessmentResponses.responses)
  } catch {
    // ignore
  }
  return NextResponse.json({ responses, caseId })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { caseId, responses } = body as { caseId?: string; responses: Record<string, unknown> }

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'responses required' }, { status: 400 })
    }

    const tdcjNumber = String(responses.tdcj_number ?? '').trim()
    const unit = String(responses.unit ?? '').trim()
    const clientName = (user.name || user.email || 'My Case').trim()

    if (caseId) {
      const caseRecord = await db.case.findFirst({
        where: { id: caseId, userId: user.id },
        include: { assessmentResponses: true },
      })
      if (!caseRecord) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 })
      }

      const paroleEligibilityDate = responses.parole_eligibility_date
        ? new Date(String(responses.parole_eligibility_date))
        : null
      const nextReviewDate = responses.next_review_date
        ? new Date(String(responses.next_review_date))
        : null

      await db.case.update({
        where: { id: caseId },
        data: {
          clientName,
          tdcjNumber: tdcjNumber || caseRecord.tdcjNumber,
          unit: unit || (caseRecord.unit ?? null),
          paroleEligibilityDate: paroleEligibilityDate && !isNaN(paroleEligibilityDate.getTime()) ? paroleEligibilityDate : caseRecord.paroleEligibilityDate,
          nextReviewDate: nextReviewDate && !isNaN(nextReviewDate.getTime()) ? nextReviewDate : caseRecord.nextReviewDate,
          district: (responses.district as string) || (caseRecord.district ?? null),
          status: 'ASSESSMENT_IN_PROGRESS',
        },
      })

      if (caseRecord.assessmentResponses) {
        await db.assessmentResponse.update({
          where: { caseId },
          data: {
            responses: JSON.stringify(responses),
            rawData: JSON.stringify(responses),
            completedAt: new Date(),
          },
        })
      } else {
        await db.assessmentResponse.create({
          data: {
            caseId,
            responses: JSON.stringify(responses),
            rawData: JSON.stringify(responses),
            completedAt: new Date(),
          },
        })
      }

      sendAssessmentSubmittedNotification({
        caseId,
        clientName,
        tdcjNumber: tdcjNumber || caseRecord.tdcjNumber,
        userEmail: user.email,
        userName: user.name,
      }).catch((err) => console.error('Assessment notification email failed:', err))

      return NextResponse.json({ success: true, caseId })
    }

    const paroleEligibilityDate = responses.parole_eligibility_date
      ? new Date(String(responses.parole_eligibility_date))
      : null
    const nextReviewDate = responses.next_review_date
      ? new Date(String(responses.next_review_date))
      : null

    const newCase = await db.case.create({
      data: {
        userId: user.id,
        clientName,
        tdcjNumber: tdcjNumber || 'PENDING',
        unit: unit || null,
        paroleEligibilityDate: paroleEligibilityDate && !isNaN(paroleEligibilityDate.getTime()) ? paroleEligibilityDate : null,
        nextReviewDate: nextReviewDate && !isNaN(nextReviewDate.getTime()) ? nextReviewDate : null,
        district: (responses.district as string) || null,
        status: 'ASSESSMENT_IN_PROGRESS',
      },
    })

    await db.assessmentResponse.create({
      data: {
        caseId: newCase.id,
        responses: JSON.stringify(responses),
        rawData: JSON.stringify(responses),
        completedAt: new Date(),
      },
    })

    sendAssessmentSubmittedNotification({
      caseId: newCase.id,
      clientName: newCase.clientName,
      tdcjNumber: newCase.tdcjNumber,
      userEmail: user.email,
      userName: user.name,
    }).catch((err) => console.error('Assessment notification email failed:', err))

    return NextResponse.json({ success: true, caseId: newCase.id })
  } catch (error) {
    console.error('Assessment save error:', error)
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    )
  }
}
