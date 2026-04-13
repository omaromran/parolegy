import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'STAFF'])(async () => {
  try {
    const learnings = await db.mlLearning.findMany({
      include: { files: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ learnings })
  } catch (e) {
    console.error('admin ml-learnings GET', e)
    return NextResponse.json({ error: 'Failed to load learnings' }, { status: 500 })
  }
})

export const POST = requireRole(['ADMIN', 'STAFF'])(async () => {
  try {
    const learning = await db.mlLearning.create({
      data: {},
      include: { files: true },
    })
    return NextResponse.json({ learning })
  } catch (e) {
    console.error('admin ml-learnings POST', e)
    return NextResponse.json({ error: 'Failed to create learning' }, { status: 500 })
  }
})
