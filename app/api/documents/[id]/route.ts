import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { deleteUploadedDocument } from '@/lib/document-storage'

export const runtime = 'nodejs'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
  }

  const doc = await db.document.findFirst({
    where: { id },
    include: {
      case: { select: { userId: true } },
    },
  })
  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const isOwner = doc.case.userId === user.id
  const isStaff = user.role === 'ADMIN' || user.role === 'STAFF'
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  try {
    await deleteUploadedDocument(doc.caseId, doc.storageKey)
  } catch (err) {
    console.error('deleteUploadedDocument:', err, { documentId: id, caseId: doc.caseId })
    return NextResponse.json({ error: 'Failed to remove file' }, { status: 500 })
  }

  await db.document.delete({ where: { id: doc.id } })

  return NextResponse.json({ ok: true })
}
