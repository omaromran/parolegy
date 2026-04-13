import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { listSitePageSlugs, SITE_PAGE_DEFAULTS } from '@/lib/site-content-defaults'

export const GET = requireRole(['ADMIN', 'STAFF'])(async () => {
  const slugs = listSitePageSlugs()
  const pages = slugs.map((slug) => ({
    slug,
    label: slug.replace(/_/g, ' '),
    blockCount: Object.keys(SITE_PAGE_DEFAULTS[slug] ?? {}).length,
  }))
  return NextResponse.json({ pages })
})
