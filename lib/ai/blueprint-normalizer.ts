import type { CampaignBlueprint } from './openai'

const empty = (x: unknown): x is undefined | null => x == null
const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : [])
const str = (x: unknown): string => (typeof x === 'string' ? x : '')

/** Ensures blueprint has all fields the PDF expects, with safe defaults. */
export function normalizeBlueprint(raw: Partial<CampaignBlueprint> | null): CampaignBlueprint {
  const s = raw?.sections ?? {}
  return {
    case_summary: {
      client_name: str(raw?.case_summary?.client_name) || 'Client',
      tdcj_number: str(raw?.case_summary?.tdcj_number) || '—',
      key_facts: arr(raw?.case_summary?.key_facts),
    },
    panel_concerns: arr(raw?.panel_concerns).map((p: any) => ({
      concern: str(p?.concern),
      evidence: str(p?.evidence),
      mitigation: str(p?.mitigation),
    })),
    narrative_strategy: {
      themes: arr(raw?.narrative_strategy?.themes),
      tone: str(raw?.narrative_strategy?.tone) || 'respectful',
      do_not_say: arr(raw?.narrative_strategy?.do_not_say),
    },
    sections: {
      cover: {
        tagline: str(s?.cover?.tagline) || 'Parole Campaign',
        client_photo_available: Boolean(s?.cover?.client_photo_available),
      },
      toc: arr(s?.toc).length ? arr(s.toc).map(String) : ['Synopsis', 'Client Letter', 'Strengths', 'Reentry Plan', 'Home Plan', 'Transportation', 'Employment', 'Future', 'Support Letters', 'Closing'],
      synopsis: {
        title: str(s?.synopsis?.title) || 'Executive Summary',
        paragraphs: arr(s?.synopsis?.paragraphs).map(String).filter(Boolean),
      },
      client_letter: {
        salutation: str(s?.client_letter?.salutation) || 'Dear Members of the Board,',
        paragraphs: arr(s?.client_letter?.paragraphs).map(String).filter(Boolean),
        closing: str(s?.client_letter?.closing) || 'Respectfully,',
      },
      strengths: {
        bullets: arr(s?.strengths?.bullets).map(String).filter(Boolean),
      },
      plan_30_90_180: {
        plan_30: arr(s?.plan_30_90_180?.plan_30).map(String).filter(Boolean),
        plan_90: arr(s?.plan_30_90_180?.plan_90).map(String).filter(Boolean),
        plan_180: arr(s?.plan_30_90_180?.plan_180).map(String).filter(Boolean),
      },
      home_plan: {
        address: str(s?.home_plan?.address) || undefined,
        description: str(s?.home_plan?.description) || 'See assessment.',
        stability_factors: arr(s?.home_plan?.stability_factors).map(String).filter(Boolean),
      },
      transportation: {
        description: str(s?.transportation?.description) || 'See assessment.',
        details: arr(s?.transportation?.details).map(String).filter(Boolean),
      },
      employment: {
        history: arr(s?.employment?.history).map(String).filter(Boolean),
        opportunities: arr(s?.employment?.opportunities).map(String).filter(Boolean),
        plan: arr(s?.employment?.plan).map(String).filter(Boolean),
      },
      future: {
        goals: arr(s?.future?.goals).map(String).filter(Boolean),
        commitments: arr(s?.future?.commitments).map(String).filter(Boolean),
      },
      support_letters: {
        supporters: arr(s?.support_letters?.supporters).map((x: any) => ({
          name: str(x?.name),
          relationship: str(x?.relationship),
          summary: str(x?.summary),
        })),
        letters: arr(s?.support_letters?.letters).map((x: any) => ({
          id: str(x?.id),
          improved_text: empty(x?.improved_text) ? undefined : str(x.improved_text),
        })),
      },
      treatment_plan: empty(s?.treatment_plan)
        ? undefined
        : {
            description: str(s?.treatment_plan?.description),
            commitments: arr(s?.treatment_plan?.commitments).map(String).filter(Boolean),
          },
      closing: {
        paragraphs: arr(s?.closing?.paragraphs).map(String).filter(Boolean),
      },
    },
    citations_to_user_uploads: arr(raw?.citations_to_user_uploads).map((c: any) => ({
      section: str(c?.section),
      doc_id: str(c?.doc_id),
      reason: str(c?.reason),
    })),
    compliance_checks: {
      truthfulness_confirmed: Boolean(raw?.compliance_checks?.truthfulness_confirmed),
      missing_info: arr(raw?.compliance_checks?.missing_info).map(String).filter(Boolean),
    },
  }
}
