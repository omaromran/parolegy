import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'

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
