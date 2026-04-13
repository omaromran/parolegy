import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { deleteStoredMlFiles } from '@/lib/ml-learning-storage'

export const DELETE = requireRole(['ADMIN', 'STAFF'])(
  async (
    _req: NextRequest,
    _user: { userId: string },
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      const id = context ? (await context.params).id : undefined
      if (!id) {
        return NextResponse.json({ error: 'Learning ID required' }, { status: 400 })
      }

      const existing = await db.mlLearning.findFirst({
        where: { id },
        include: { files: true },
      })

      if (!existing) {
        return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
      }

      await deleteStoredMlFiles(existing.id, existing.files)
      await db.mlLearning.delete({ where: { id: existing.id } })

      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error('admin ml-learnings DELETE', e)
      return NextResponse.json({ error: 'Failed to delete learning' }, { status: 500 })
    }
  }
)
