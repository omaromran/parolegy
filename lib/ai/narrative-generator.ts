import { openai, DEFAULT_MODEL } from './openai'
import { buildParoleNarrativePrompt, type ClientIdentityForNarrative } from './prompts'
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
  clientIdentity?: ClientIdentityForNarrative
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
    clientIdentity
  )

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You output one JSON object only. Each narrative section must follow the Knowledge Hub PAROLE_STRUCTURE instructions for that section slug; those instructions override generic tone when they conflict. Use the provided client name when staff instructions require naming. Never invent facts.',
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
