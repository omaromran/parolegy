import { db } from '@/lib/db'
import { KNOWLEDGE_DEFAULTS } from '@/lib/knowledge-defaults'

/** Ensure default rows exist (idempotent). */
export async function ensureKnowledgeDefaults(): Promise<void> {
  const count = await db.knowledgeHubEntry.count()
  if (count > 0) return

  await db.knowledgeHubEntry.createMany({
    data: KNOWLEDGE_DEFAULTS.map((d) => ({
      category: d.category,
      slug: d.slug,
      title: d.title,
      content: d.content,
      sortOrder: d.sortOrder,
    })),
  })
}

const CANONICAL_FEARS_TITLE = 'Their specific decision-making fears, by category'

/**
 * Removes legacy standalone "By category" row and folds it into decision-making-fears.
 * Safe to run repeatedly.
 */
export async function migrateKnowledgeHubMergeFearsByCategory(): Promise<void> {
  const legacy = await db.knowledgeHubEntry.findFirst({
    where: { category: 'LLM_GUIDELINES', slug: 'by-category' },
  })
  const fears = await db.knowledgeHubEntry.findFirst({
    where: { category: 'LLM_GUIDELINES', slug: 'decision-making-fears' },
  })

  if (legacy && fears) {
    const merged = [fears.content.trim(), legacy.content.trim()].filter(Boolean).join('\n\n---\n\n')
    await db.knowledgeHubEntry.update({
      where: { id: fears.id },
      data: {
        title: CANONICAL_FEARS_TITLE,
        content: merged,
      },
    })
    await db.knowledgeHubEntry.delete({ where: { id: legacy.id } })
    return
  }

  if (legacy && !fears) {
    await db.knowledgeHubEntry.update({
      where: { id: legacy.id },
      data: {
        slug: 'decision-making-fears',
        title: CANONICAL_FEARS_TITLE,
        sortOrder: 13,
      },
    })
    return
  }

  if (fears && !legacy) {
    const t = fears.title.trim()
    if (t === 'Their specific decision-making fears' || t === 'By category') {
      await db.knowledgeHubEntry.update({
        where: { id: fears.id },
        data: { title: CANONICAL_FEARS_TITLE },
      })
    }
  }
}

/**
 * Default blueprint targets by slug (seed rows). Custom structure rows fall back to index order
 * in {@link blueprintTargetsByStructureIndex}.
 */
const STRUCTURE_SLUG_TO_BLUEPRINT: Record<string, string> = {
  'section-1-synopsis':
    '`case_summary.key_facts` and `sections.synopsis` (analytical synopsis; tone and paragraph shape must follow this section’s instructions)',
  'section-2-letter':
    '`sections.client_letter` (voice, remorse, commitments—follow this section’s instructions exactly)',
  'section-3-behavioral':
    '`sections.strengths.bullets` (behavioral / psychological “things you should know”—substantive bullets, not generic traits; follow this section’s framing)',
  'section-4-parole-plan':
    '`sections.plan_30_90_180`, `sections.home_plan`, `sections.transportation`, and `sections.employment` (one coherent parole plan; split content across these fields per this section)',
  'section-5-support':
    '`sections.support_letters` (supporters and summaries—follow credibility and quote rules here)',
  'section-6-treatment':
    '`sections.treatment_plan` and `sections.future` (post-release treatment & reentry; include `treatment_plan` when assessment or records imply treatment, aftercare, or supervision needs)',
}

/** When a PAROLE_STRUCTURE row has a non-seed slug, map by position among structure entries (same order as seeds). */
const BLUEPRINT_FALLBACK_BY_INDEX: readonly string[] = [
  '`case_summary.key_facts` + `sections.synopsis`',
  '`sections.client_letter`',
  '`sections.strengths`',
  '`sections.plan_30_90_180`, `home_plan`, `transportation`, `employment`',
  '`sections.support_letters`',
  '`sections.treatment_plan`, `sections.future`',
]

function blueprintTargetForStructureEntry(
  entry: { slug: string; title: string },
  index: number
): string {
  return STRUCTURE_SLUG_TO_BLUEPRINT[entry.slug] ?? BLUEPRINT_FALLBACK_BY_INDEX[Math.min(index, BLUEPRINT_FALLBACK_BY_INDEX.length - 1)]!
}

/**
 * Tells the model exactly which JSON keys each Knowledge Hub structure block controls.
 */
export function buildBlueprintFieldMappingBlock(
  structure: { slug: string; title: string; sortOrder: number }[]
): string {
  const sorted = [...structure].sort((a, b) => a.sortOrder - b.sortOrder)
  const lines: string[] = []
  lines.push('=== MANDATORY: APPLY EACH STRUCTURE SECTION TO THESE BLUEPRINT FIELDS ===')
  lines.push(
    'The numbered "Parole campaign structure" blocks above are not optional context. For each row below, the narrative you write in the named JSON paths must directly implement that structure section’s title and body (tone, emphasis, and constraints).'
  )
  lines.push(
    '`panel_concerns` and `narrative_strategy` should align with LLM guidelines and support the structure sections (especially synopsis, letter, strengths, and plan).'
  )
  lines.push('')
  sorted.forEach((e, i) => {
    const target = blueprintTargetForStructureEntry(e, i)
    lines.push(`${i + 1}. [${e.title}] → ${target}`)
  })
  lines.push('')
  lines.push(
    '`sections.toc` must be a string array of section titles in booklet reading order; use the Knowledge Hub structure titles (shortened if needed) so the table of contents reflects the same campaign architecture.'
  )
  return lines.join('\n')
}

/**
 * Serialized block for campaign generation prompts. Staff-authored content in the Knowledge hub
 * takes precedence over generic instructions.
 */
export async function getKnowledgeContextForPrompt(): Promise<string> {
  await ensureKnowledgeDefaults()
  await migrateKnowledgeHubMergeFearsByCategory()
  const entries = await db.knowledgeHubEntry.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  })

  const structure = entries.filter((e) => e.category === 'PAROLE_STRUCTURE')
  const guidelines = entries.filter((e) => e.category === 'LLM_GUIDELINES')

  const lines: string[] = []

  lines.push('=== PAROLE CAMPAIGN STRUCTURE (authoritative section-by-section instructions) ===')
  for (const e of structure) {
    lines.push(`\n--- ${e.title} ---\n${e.content.trim()}`)
  }

  lines.push('\n\n')
  lines.push(buildBlueprintFieldMappingBlock(structure))

  lines.push('\n\n=== PAROLEGY LLM GUIDELINES (follow in all narrative choices) ===')
  for (const e of guidelines) {
    lines.push(`\n--- ${e.title} ---\n${e.content.trim()}`)
  }

  return lines.join('\n')
}

export type ParoleStructureSection = { slug: string; title: string; content: string }

/** Ordered Knowledge Hub rows for PAROLE_STRUCTURE (campaign section definitions). */
export async function getParoleStructureSections(): Promise<ParoleStructureSection[]> {
  await ensureKnowledgeDefaults()
  await migrateKnowledgeHubMergeFearsByCategory()
  const entries = await db.knowledgeHubEntry.findMany({
    where: { category: 'PAROLE_STRUCTURE' },
    orderBy: { sortOrder: 'asc' },
  })
  return entries.map((e) => ({
    slug: e.slug,
    title: e.title,
    content: e.content.trim(),
  }))
}

/** LLM_GUIDELINES only, for narrative generation (paired with {@link getParoleStructureSections}). */
export async function getLlmGuidelinesForPrompt(): Promise<string> {
  await ensureKnowledgeDefaults()
  await migrateKnowledgeHubMergeFearsByCategory()
  const guidelines = await db.knowledgeHubEntry.findMany({
    where: { category: 'LLM_GUIDELINES' },
    orderBy: { sortOrder: 'asc' },
  })
  const lines: string[] = ['=== PAROLEGY LLM GUIDELINES ===']
  for (const e of guidelines) {
    lines.push(`\n--- ${e.title} ---\n${e.content.trim()}`)
  }
  return lines.join('\n')
}
