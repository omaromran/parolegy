import type { NextRequest } from 'next/server'

type RouteParams = { id?: string } | Promise<{ id?: string }>

/** Next 14 sync params; Next 15 may pass a Promise — normalize for route handlers. */
export async function dynamicSegmentId(
  context: { params?: RouteParams } | undefined
): Promise<string | undefined> {
  if (!context?.params) return undefined
  try {
    const p = await Promise.resolve(context.params)
    return typeof p?.id === 'string' && p.id.length > 0 ? p.id : undefined
  } catch {
    return undefined
  }
}

/** Parse id from paths like .../cases/[id]/... or .../campaigns/[id]/... */
export function idAfterPathSegment(pathname: string, segment: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean)
  const idx = parts.indexOf(segment)
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
  return undefined
}

export async function resolveCaseRouteId(
  req: NextRequest,
  context?: { params?: RouteParams }
): Promise<string | undefined> {
  const fromParams = await dynamicSegmentId(context)
  if (fromParams) return fromParams
  return idAfterPathSegment(req.nextUrl.pathname, 'cases')
}

export async function resolveCampaignRouteId(
  req: NextRequest,
  context?: { params?: RouteParams }
): Promise<string | undefined> {
  const fromParams = await dynamicSegmentId(context)
  if (fromParams) return fromParams
  return idAfterPathSegment(req.nextUrl.pathname, 'campaigns')
}

export async function resolveKnowledgeEntryId(
  req: NextRequest,
  context?: { params?: RouteParams }
): Promise<string | undefined> {
  const fromParams = await dynamicSegmentId(context)
  if (fromParams) return fromParams
  return idAfterPathSegment(req.nextUrl.pathname, 'knowledge')
}
