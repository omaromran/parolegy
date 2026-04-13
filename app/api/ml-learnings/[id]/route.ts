import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { deleteStoredMlFiles } from '@/lib/ml-learning-storage'

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await context.params

  const existing = await db.mlLearning.findFirst({
    where: { id, userId: user.id },
    include: { files: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
  }

  await deleteStoredMlFiles(existing.id, existing.files)
  await db.mlLearning.delete({ where: { id: existing.id } })

  return NextResponse.json({ ok: true })
}
