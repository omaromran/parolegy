import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { resolveKnowledgeEntryId } from '@/lib/route-params'

export const PATCH = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: { userId: string },
    context?: { params?: { id?: string } | Promise<{ id?: string }> }
  ) => {
  try {
    const id = await resolveKnowledgeEntryId(req, context)
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({}))
    const { title, content, sortOrder } = body as {
      title?: string
      content?: string
      sortOrder?: number
    }

    const existing = await db.knowledgeHubEntry.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const updated = await db.knowledgeHubEntry.update({
      where: { id },
      data: {
        ...(typeof title === 'string' ? { title: title.trim() } : {}),
        ...(typeof content === 'string' ? { content } : {}),
        ...(typeof sortOrder === 'number' && Number.isFinite(sortOrder) ? { sortOrder } : {}),
      },
    })

    return NextResponse.json({ entry: updated })
  } catch (e) {
    console.error('admin knowledge PATCH', e)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
})
