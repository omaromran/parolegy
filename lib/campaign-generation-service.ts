import { db } from '@/lib/db'
import { normalizeBlueprint } from '@/lib/ai/blueprint-normalizer'
import type { CampaignBlueprint } from '@/lib/ai/openai'
import { generateParoleCampaignNarrative } from '@/lib/ai/narrative-generator'
import {
  getParoleStructureSections,
  getLlmGuidelinesForPrompt,
} from '@/lib/knowledge-hub'
import type { ParoleCampaignNarrative } from '@/lib/parole-narrative'
import { extractSupportLetterTexts } from '@/lib/support-letter-extraction'
import { buildMachineLearningExamplesForPrompt } from '@/lib/ml-learning-extraction'

const REQUIRED_DOCS = { SUPPORT_LETTER: 3, PHOTO: 10 }

function httpError(message: string, status: number) {
  const e = new Error(message) as Error & { status: number }
  e.status = status
  return e
}

/**
 * Staff-side generation: Parolegy LLM + Knowledge hub sections → stored narrative (print-ready booklet disabled for now).
 */
export async function generateCampaignForCase(caseId: string): Promise<{
  campaignId: string
  narrative: ParoleCampaignNarrative
  blueprint: CampaignBlueprint
}> {
  const caseData = await db.case.findFirst({
    where: { id: caseId },
    include: {
      assessmentResponses: true,
      documents: true,
    },
  })

  if (!caseData) {
    throw httpError('Case not found', 404)
  }

  if (!caseData.assessmentResponses?.completedAt) {
    throw httpError('Complete assessment before generating a campaign', 400)
  }

  const docCounts: Record<string, number> = {}
  for (const d of caseData.documents) {
    docCounts[d.type] = (docCounts[d.type] || 0) + 1
  }
  const hasRequiredDocs =
    (docCounts.SUPPORT_LETTER || 0) >= REQUIRED_DOCS.SUPPORT_LETTER &&
    (docCounts.PHOTO || 0) >= REQUIRED_DOCS.PHOTO
  if (!hasRequiredDocs) {
    throw httpError(
      'Upload required documents (min 3 support letters, 10 photos) before generating',
      400
    )
  }

  const structureSections = await getParoleStructureSections()
  const llmGuidelines = await getLlmGuidelinesForPrompt()

  let assessmentPayload: Record<string, unknown> = {}
  try {
    const raw = caseData.assessmentResponses?.responses
    if (typeof raw === 'string' && raw.trim()) {
      assessmentPayload = JSON.parse(raw) as Record<string, unknown>
    } else if (raw && typeof raw === 'object') {
      assessmentPayload = raw as Record<string, unknown>
    }
  } catch {
    assessmentPayload = {}
  }

  const docRefs = caseData.documents.map((d) => ({
    id: d.id,
    type: d.type,
    fileName: d.fileName,
  }))

  const supportLetters = await extractSupportLetterTexts(caseData.documents)

  const mlLearnings = await db.mlLearning.findMany({
    where: { userId: caseData.userId },
    include: { files: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  const machineLearningExamplesBlock = await buildMachineLearningExamplesForPrompt(
    mlLearnings.map((L) => ({
      id: L.id,
      files: L.files.map((f) => ({
        learningId: f.learningId,
        fileName: f.fileName,
        storageKey: f.storageKey,
        mimeType: f.mimeType,
        side: f.side,
        createdAt: f.createdAt,
      })),
    }))
  )

  const narrative = await generateParoleCampaignNarrative(
    assessmentPayload,
    docRefs,
    structureSections,
    llmGuidelines,
    {
      clientName: caseData.clientName,
      tdcjNumber: caseData.tdcjNumber,
    },
    supportLetters,
    machineLearningExamplesBlock || undefined
  )

  const blueprint = normalizeBlueprint({})

  const latest = await db.campaign.findFirst({
    where: { caseId },
    orderBy: { version: 'desc' },
  })
  const nextVersion = latest ? latest.version + 1 : 1

  const campaign = await db.campaign.create({
    data: {
      caseId: caseData.id,
      version: nextVersion,
      language: 'en',
      blueprintJson: JSON.stringify(blueprint),
      narrativeJson: JSON.stringify(narrative),
      publishedToClient: false,
      status: 'AI_GENERATED',
      reviewCycle: 1,
    },
  })

  return { campaignId: campaign.id, narrative, blueprint }
}
