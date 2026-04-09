import OpenAI from 'openai'

// Only initialize OpenAI if API key is provided (optional for build)
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

/** Legacy preview IDs that OpenAI removed; map so old .env values still work. */
const LEGACY_MODEL_FALLBACK: Record<string, string> = {
  'gpt-4-turbo-preview': 'gpt-4o',
  'gpt-4-1106-preview': 'gpt-4o',
}

function resolveDefaultModel(): string {
  const raw = process.env.OPENAI_MODEL?.trim()
  if (!raw) return 'gpt-4o'
  return LEGACY_MODEL_FALLBACK[raw] ?? raw
}

export const DEFAULT_MODEL = resolveDefaultModel()

// Campaign Blueprint Schema
export interface CampaignBlueprint {
  case_summary: {
    client_name: string
    tdcj_number: string
    key_facts: string[]
  }
  panel_concerns: Array<{
    concern: string
    evidence: string
    mitigation: string
  }>
  narrative_strategy: {
    themes: string[]
    tone: string
    do_not_say: string[]
  }
  sections: {
    cover: {
      tagline: string
      client_photo_available: boolean
    }
    toc: string[]
    synopsis: {
      title: string
      paragraphs: string[]
    }
    client_letter: {
      salutation: string
      paragraphs: string[]
      closing: string
    }
    strengths: {
      bullets: string[]
    }
    plan_30_90_180: {
      plan_30: string[]
      plan_90: string[]
      plan_180: string[]
    }
    home_plan: {
      address?: string
      description: string
      stability_factors: string[]
    }
    transportation: {
      description: string
      details: string[]
    }
    employment: {
      history: string[]
      opportunities: string[]
      plan: string[]
    }
    future: {
      goals: string[]
      commitments: string[]
    }
    support_letters: {
      supporters: Array<{
        name: string
        relationship: string
        summary: string
      }>
      letters: Array<{
        id: string
        improved_text?: string
      }>
    }
    treatment_plan?: {
      description: string
      commitments: string[]
    }
    closing: {
      paragraphs: string[]
    }
  }
  citations_to_user_uploads: Array<{
    section: string
    doc_id: string
    reason: string
  }>
  compliance_checks: {
    truthfulness_confirmed: boolean
    missing_info: string[]
  }
}
