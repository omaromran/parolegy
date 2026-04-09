import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { generateCampaignForCase } from '@/lib/campaign-generation-service'
import { resolveCaseRouteId } from '@/lib/route-params'

export const POST = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: { userId: string },
    context?: { params?: { id?: string } | Promise<{ id?: string }> }
  ) => {
  try {
    const caseId = await resolveCaseRouteId(req, context)
    if (!caseId) {
      return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
    }

    const result = await generateCampaignForCase(caseId)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const e = error as Error & { status?: number }
    const status = typeof e.status === 'number' ? e.status : 500
    const message = e instanceof Error ? e.message : 'Failed to generate campaign'
    console.error('admin campaign generate', error)
    return NextResponse.json({ error: message }, { status })
  }
})
