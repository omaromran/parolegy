import { openai, DEFAULT_MODEL } from './openai'
import {
  buildParoleNarrativePrompt,
  type ClientIdentityForNarrative,
  type SupportLetterExcerptForPrompt,
} from './prompts'
import type { ParoleCampaignNarrative } from '@/lib/parole-narrative'
import type { ParoleStructureSection } from '@/lib/knowledge-hub'

function normalizeNarrative(
  raw: { sections?: Array<{ slug?: string; title?: string; content?: string }> },
  structureSections: ParoleStructureSection[]
): ParoleCampaignNarrative {
  const bySlug = new Map((raw.sections ?? []).map((s) => [s.slug, s]))
  const sections = structureSections.map((spec) => {
    const got = bySlug.get(spec.slug)
    return {
      slug: spec.slug,
      title: spec.title,
      content: typeof got?.content === 'string' ? got.content.trim() : '',
    }
  })
  return { sections }
}

export async function generateParoleCampaignNarrative(
  assessmentData: unknown,
  documents: { id: string; type: string; fileName: string }[],
  structureSections: ParoleStructureSection[],
  llmGuidelinesText: string,
  clientIdentity?: ClientIdentityForNarrative,
  supportLetters: SupportLetterExcerptForPrompt[] = [],
  machineLearningExamplesBlock?: string
): Promise<ParoleCampaignNarrative> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.')
  }
  if (structureSections.length === 0) {
    throw new Error('No parole campaign structure is configured in the Knowledge hub (PAROLE_STRUCTURE).')
  }

  const userContent = buildParoleNarrativePrompt(
    assessmentData,
    documents,
    structureSections,
    llmGuidelinesText,
    clientIdentity,
    supportLetters,
    machineLearningExamplesBlock
  )

  const mlSys =
    machineLearningExamplesBlock?.trim() &&
    ' When a pattern library of prior before/after examples is included in the user message, use it only as structural and stylistic guidance alongside PAROLE_STRUCTURE and LLM_GUIDELINES—never copy private or case-specific facts from those examples into the current case.'

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You output one JSON object only. Each narrative section must follow the Knowledge Hub PAROLE_STRUCTURE instructions for that section slug and the LLM_GUIDELINES when they do not conflict; staff instructions per section override generic tone. Modulate tone, emphasis, and risk framing by offense type per the hub’s offense-type guideline, inferred only from assessment and support letters—consistently across all sections, without inventing charges or facts. Ground supporter details and quotes in SUPPORT LETTER TEXT and/or assessment; never invent letter content. Use the provided client name when staff instructions require naming. Never invent facts.' +
          (mlSys || ''),
      },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.55,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  try {
    const parsed = JSON.parse(content) as {
      sections?: Array<{ slug?: string; title?: string; content?: string }>
    }
    return normalizeNarrative(parsed, structureSections)
  } catch (error) {
    console.error('Failed to parse narrative JSON:', error)
    throw new Error('Invalid narrative format from AI')
  }
}
