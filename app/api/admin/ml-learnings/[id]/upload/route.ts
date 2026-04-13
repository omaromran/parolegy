import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { saveUploadedDocument } from '@/lib/document-storage'
import { mlLearningStorageCaseId } from '@/lib/ml-learning-storage'

const SIDES = ['BEFORE', 'AFTER'] as const

export const POST = requireRole(['ADMIN', 'STAFF'])(
  async (
    request: NextRequest,
    user: { userId: string },
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      const learningId = context ? (await context.params).id : undefined
      if (!learningId) {
        return NextResponse.json({ error: 'Learning ID required' }, { status: 400 })
      }

      const learning = await db.mlLearning.findFirst({
        where: { id: learningId },
      })
      if (!learning) {
        return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
      }

      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const side = (formData.get('side') as string | null)?.toUpperCase() || ''

      if (!file) {
        return NextResponse.json({ error: 'Missing file' }, { status: 400 })
      }
      if (!SIDES.includes(side as (typeof SIDES)[number])) {
        return NextResponse.json({ error: 'side must be BEFORE or AFTER' }, { status: 400 })
      }

      const bytes = Buffer.from(await file.arrayBuffer())
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const folder = mlLearningStorageCaseId(learningId)
      const { storageKey } = await saveUploadedDocument(
        folder,
        safeName,
        bytes,
        file.type || 'application/octet-stream'
      )

      const row = await db.mlLearningFile.create({
        data: {
          learningId,
          side,
          fileName: file.name,
          storageKey,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          uploadedBy: user.userId,
        },
      })

      return NextResponse.json({ file: row })
    } catch (error) {
      console.error('admin ml-learnings upload:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
  }
)
