import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { readFile } from 'fs/promises'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

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
  if (!doc || doc.case.userId !== user.id) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const filePath = path.join(UPLOADS_DIR, doc.caseId, path.basename(doc.storageKey))
  try {
    const buf = await readFile(filePath)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${encodeURIComponent(doc.fileName)}"`,
      },
    })
  } catch (err) {
    console.error('Error serving document file:', err)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
