import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const caseId = request.nextUrl.searchParams.get('caseId')
  if (!caseId) {
    return NextResponse.json({ error: 'caseId required' }, { status: 400 })
  }

  const caseRecord = await db.case.findFirst({
    where: { id: caseId, userId: user.id },
  })
  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  const documents = await db.document.findMany({
    where: { caseId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      fileName: true,
      mimeType: true,
      size: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    documents: documents.map((d) => ({
      id: d.id,
      type: d.type,
      fileName: d.fileName,
      mimeType: d.mimeType,
      size: d.size,
      createdAt: d.createdAt,
    })),
  })
}
