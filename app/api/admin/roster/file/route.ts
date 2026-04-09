import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireRole } from '@/lib/middleware'

const SAFE =
  /^(daily_roster_\d{4}-\d{2}-\d{2}\.(csv|json)|new_today_\d{4}-\d{2}-\d{2}\.(csv|json)|summary_\d{4}-\d{2}-\d{2}\.json|pipeline_run_\d{4}-\d{2}-\d{2}\.json|latest_summary\.json)$/

const ROSTER_REL = ['public', 'data', 'roster']
const PIPELINE_OUT = ['pipeline', 'output']

async function resolvePath(filename: string): Promise<string | null> {
  const cwd = process.cwd()
  for (const parts of [ROSTER_REL, PIPELINE_OUT]) {
    const full = path.join(cwd, ...parts, filename)
    const resolved = path.resolve(full)
    const base = path.resolve(cwd, ...parts)
    if (!resolved.startsWith(base)) {
      return null
    }
    try {
      await fs.access(resolved)
      return resolved
    } catch {
      /* try next dir */
    }
  }
  return null
}

export const GET = requireRole(['ADMIN', 'STAFF'])(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''
  if (!SAFE.test(name)) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 })
  }
  try {
    const resolved = await resolvePath(name)
    if (!resolved) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    const buf = await fs.readFile(resolved)
    const isCsv = name.endsWith('.csv')
    return new NextResponse(buf, {
      headers: {
        'Content-Type': isCsv ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${name}"`,
      },
    })
  } catch (e) {
    console.error('admin roster file', e)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
})
