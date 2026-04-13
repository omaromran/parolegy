import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { readUploadedDocument, usesObjectStorage } from '@/lib/document-storage'

export const runtime = 'nodejs'

export async function GET(
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
    const buf = await readUploadedDocument(doc.caseId, doc.storageKey)
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${encodeURIComponent(doc.fileName)}"`,
      },
    })
  } catch (err) {
    console.error('Error serving document file:', err, {
      documentId: id,
      caseId: doc.caseId,
      storageKey: doc.storageKey,
      storageMode: usesObjectStorage() ? 's3' : 'local',
    })
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
