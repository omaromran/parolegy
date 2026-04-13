import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { saveUploadedDocument } from '@/lib/document-storage'
import { mlLearningStorageCaseId } from '@/lib/ml-learning-storage'

const SIDES = ['BEFORE', 'AFTER'] as const

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id: learningId } = await context.params

  const learning = await db.mlLearning.findFirst({
    where: { id: learningId, userId: user.id },
  })
  if (!learning) {
    return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
  }

  try {
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
    const { storageKey } = await saveUploadedDocument(folder, safeName, bytes, file.type || 'application/octet-stream')

    const row = await db.mlLearningFile.create({
      data: {
        learningId,
        side,
        fileName: file.name,
        storageKey,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        uploadedBy: user.id,
      },
    })

    return NextResponse.json({ file: row })
  } catch (error) {
    console.error('ML learning upload:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
