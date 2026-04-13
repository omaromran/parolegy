import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { deleteUploadedDocument } from '@/lib/document-storage'
import { mlLearningStorageCaseId } from '@/lib/ml-learning-storage'

export const DELETE = requireRole(['ADMIN', 'STAFF'])(
  async (
    _req: NextRequest,
    _user: { userId: string },
    context?: { params: Promise<{ id: string; fileId: string }> }
  ) => {
    try {
      const params = context ? await context.params : undefined
      const learningId = params?.id
      const fileId = params?.fileId
      if (!learningId || !fileId) {
        return NextResponse.json({ error: 'Learning and file ID required' }, { status: 400 })
      }

      const learning = await db.mlLearning.findFirst({
        where: { id: learningId },
      })
      if (!learning) {
        return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
      }

      const file = await db.mlLearningFile.findFirst({
        where: { id: fileId, learningId },
      })
      if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }

      await deleteUploadedDocument(mlLearningStorageCaseId(learningId), file.storageKey)
      await db.mlLearningFile.delete({ where: { id: fileId } })

      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error('admin ml-learnings file DELETE', e)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }
  }
)
