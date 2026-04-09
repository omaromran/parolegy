import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireRole } from '@/lib/middleware'

const ROSTER_REL = ['public', 'data', 'roster']
const PIPELINE_OUT = ['pipeline', 'output']

async function firstExistingDir(): Promise<string | null> {
  const cwd = process.cwd()
  for (const parts of [ROSTER_REL, PIPELINE_OUT]) {
    const dir = path.join(cwd, ...parts)
    try {
      await fs.access(dir)
      return dir
    } catch {
      /* try next */
    }
  }
  return null
}

export const GET = requireRole(['ADMIN', 'STAFF'])(async (_req, _user) => {
  try {
    const dir = await firstExistingDir()
    if (!dir) {
      return NextResponse.json({
        directory: null,
        files: [],
        message: 'No roster output yet. Run pipeline (see pipeline/README.md).',
      })
    }
    const names = await fs.readdir(dir)
    const rosterFiles = names
      .filter(
        (n) =>
          /^daily_roster_\d{4}-\d{2}-\d{2}\.(csv|json)$/.test(n) ||
          /^new_today_\d{4}-\d{2}-\d{2}\.(csv|json)$/.test(n) ||
          /^summary_\d{4}-\d{2}-\d{2}\.json$/.test(n) ||
          /^pipeline_run_\d{4}-\d{2}-\d{2}\.json$/.test(n) ||
          n === 'latest_summary.json'
      )
      .sort()
      .reverse()

    return NextResponse.json({
      directory: dir,
      files: rosterFiles,
      downloadBase: '/api/admin/roster/file',
    })
  } catch (e) {
    console.error('admin roster list', e)
    return NextResponse.json({ error: 'Failed to list roster files' }, { status: 500 })
  }
})
