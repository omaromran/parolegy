import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id: caseId } = await params
  if (!caseId) {
    return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
  }

  const existing = await db.case.findFirst({
    where: { id: caseId, userId: user.id },
    select: { id: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  await db.case.delete({ where: { id: caseId } })

  return NextResponse.json({ success: true })
}
