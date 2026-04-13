import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import {
  SITE_PAGE_DEFAULTS,
  listSitePageSlugs,
  type SitePageSlug,
} from '@/lib/site-content-defaults'
import { computeOverridesFromMerged, getMergedSiteBlocks } from '@/lib/site-content'

function isValidSlug(s: string): s is SitePageSlug {
  return listSitePageSlugs().includes(s as SitePageSlug)
}

export const GET = requireRole(['ADMIN', 'STAFF'])(
  async (
    _req: NextRequest,
    _user: unknown,
    context: { params: Promise<{ slug: string }> } | undefined
  ) => {
    const { slug } = (await context?.params) ?? { slug: '' }
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: 'Unknown page slug' }, { status: 404 })
    }
    const merged = await getMergedSiteBlocks(slug)
    const defaults = SITE_PAGE_DEFAULTS[slug] as Record<string, string>
    let stored: Record<string, string> = {}
    try {
      const row = await db.sitePageContent.findUnique({ where: { slug } })
      if (row?.blocksJson) {
        try {
          const p = JSON.parse(row.blocksJson) as unknown
          if (p && typeof p === 'object' && !Array.isArray(p)) {
            stored = Object.fromEntries(
              Object.entries(p as Record<string, unknown>).filter(([, v]) => typeof v === 'string')
            ) as Record<string, string>
          }
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* table may not exist until db push */
    }
    return NextResponse.json({ slug, defaults, merged, storedOverrides: stored })
  }
)

export const PUT = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: unknown,
    context: { params: Promise<{ slug: string }> } | undefined
  ) => {
    const { slug } = (await context?.params) ?? { slug: '' }
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: 'Unknown page slug' }, { status: 404 })
    }
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const blocks = (body as { blocks?: unknown })?.blocks
    if (!blocks || typeof blocks !== 'object' || Array.isArray(blocks)) {
      return NextResponse.json({ error: 'blocks object required' }, { status: 400 })
    }
    const defaults = SITE_PAGE_DEFAULTS[slug] as Record<string, string>
    const merged: Record<string, string> = { ...defaults }
    for (const [k, v] of Object.entries(blocks as Record<string, unknown>)) {
      if (typeof v === 'string') merged[k] = v
    }
    const overrides = computeOverridesFromMerged(slug, merged)
    const blocksJson = JSON.stringify(overrides)
    try {
      await db.sitePageContent.upsert({
        where: { slug },
        create: { slug, blocksJson },
        update: { blocksJson },
      })
    } catch (e) {
      console.error('site content upsert', e)
      return NextResponse.json(
        { error: 'Database error. Run prisma db push (or migrate) to add SitePageContent.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ ok: true, merged: await getMergedSiteBlocks(slug) })
  }
)
