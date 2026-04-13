import { cache } from 'react'
import { db } from '@/lib/db'
import {
  SITE_PAGE_DEFAULTS,
  listSitePageSlugs,
  type SitePageSlug,
} from '@/lib/site-content-defaults'

export type SiteBlocks = Record<string, string>

function defaultsForSlug(slug: string): SiteBlocks {
  const d = SITE_PAGE_DEFAULTS[slug as SitePageSlug]
  if (!d) return {}
  return { ...(d as Record<string, string>) }
}

export async function getMergedSiteBlocks(slug: SitePageSlug | string): Promise<SiteBlocks> {
  const defaults = defaultsForSlug(slug)
  try {
    const row = await db.sitePageContent.findUnique({ where: { slug } })
    let overrides: SiteBlocks = {}
    if (row?.blocksJson) {
      try {
        const parsed = JSON.parse(row.blocksJson) as unknown
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          overrides = Object.fromEntries(
            Object.entries(parsed as Record<string, unknown>).filter(
              ([, v]) => typeof v === 'string'
            ) as [string, string][]
          )
        }
      } catch {
        /* ignore invalid JSON */
      }
    }
    return { ...defaults, ...overrides }
  } catch {
    // Build-time / DB not migrated yet: table missing or unreachable — ship defaults only.
    return defaults
  }
}

/** Dedupe layout fetch within one request. */
export const getLayoutSiteBlocks = cache(async () => getMergedSiteBlocks('layout'))

export function computeOverridesFromMerged(slug: SitePageSlug | string, merged: SiteBlocks): SiteBlocks {
  const defaults = defaultsForSlug(slug)
  const out: SiteBlocks = {}
  for (const key of Object.keys(merged)) {
    const v = merged[key]
    if (v === undefined) continue
    if (defaults[key] !== v) {
      out[key] = v
    }
  }
  return out
}

export { listSitePageSlugs }
