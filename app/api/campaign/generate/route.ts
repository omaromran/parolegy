import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { generateCampaignBlueprint } from '@/lib/ai/campaign-generator'
import { normalizeBlueprint } from '@/lib/ai/blueprint-normalizer'
import { generateCampaignPDF } from '@/lib/pdf/generator'
import { db } from '@/lib/db'

const REQUIRED_DOCS = { SUPPORT_LETTER: 3, PHOTO: 10 }

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { caseId } = body

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
    }

    const caseData = await db.case.findFirst({
      where: { id: caseId, userId: user.id },
      include: {
        assessmentResponses: true,
        documents: true,
      },
    })

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    if (caseData.serviceOption !== 3) {
      return NextResponse.json(
        { error: 'Campaign generation is only available for self-serve (option 3)' },
        { status: 400 }
      )
    }

    if (!caseData.assessmentResponses?.completedAt) {
      return NextResponse.json(
        { error: 'Complete your assessment before generating a campaign' },
        { status: 400 }
      )
    }

    const docCounts: Record<string, number> = {}
    for (const d of caseData.documents) {
      docCounts[d.type] = (docCounts[d.type] || 0) + 1
    }
    const hasRequiredDocs =
      (docCounts.SUPPORT_LETTER || 0) >= REQUIRED_DOCS.SUPPORT_LETTER &&
      (docCounts.PHOTO || 0) >= REQUIRED_DOCS.PHOTO
    if (!hasRequiredDocs) {
      return NextResponse.json(
        { error: 'Upload required documents (min 3 support letters, 10 photos) before generating' },
        { status: 400 }
      )
    }

    // Generate campaign blueprint
    const rawBlueprint = await generateCampaignBlueprint(
      caseData.assessmentResponses?.responses || {},
      caseData.documents,
      caseData
    )
    const blueprint = normalizeBlueprint(rawBlueprint as any)

    // Generate PDF
    const pdfBuffer = await generateCampaignPDF(
      blueprint,
      caseData.clientName,
      caseData.tdcjNumber
    )

    // Save campaign to database
    const campaign = await db.campaign.create({
      data: {
        caseId: caseData.id,
        version: 1,
        language: 'en',
        blueprintJson: JSON.stringify(blueprint),
        status: 'AI_GENERATED',
        reviewCycle: 1,
      },
    })

    // TODO: Upload PDF to S3/storage and get URL
    // const pdfUrl = await uploadToStorage(pdfBuffer, `campaigns/${campaign.id}.pdf`)

    return NextResponse.json({
      campaignId: campaign.id,
      blueprint,
      // pdfUrl,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate campaign'
    console.error('Error generating campaign:', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
