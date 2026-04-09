import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { ensureKnowledgeDefaults, migrateKnowledgeHubMergeFearsByCategory } from '@/lib/knowledge-hub'

export const GET = requireRole(['ADMIN', 'STAFF'])(async () => {
  try {
    await ensureKnowledgeDefaults()
    await migrateKnowledgeHubMergeFearsByCategory()
    const entries = await db.knowledgeHubEntry.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json({ entries })
  } catch (e) {
    console.error('admin knowledge GET', e)
    return NextResponse.json({ error: 'Failed to load knowledge hub' }, { status: 500 })
  }
})
