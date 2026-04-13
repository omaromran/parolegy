import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { deleteUploadedDocument } from '@/lib/document-storage'
import { mlLearningStorageCaseId } from '@/lib/ml-learning-storage'

type RouteContext = { params: Promise<{ id: string; fileId: string }> }

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id: learningId, fileId } = await context.params

  const learning = await db.mlLearning.findFirst({
    where: { id: learningId, userId: user.id },
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
}
