import { promises as fs } from 'fs'
import path from 'path'

const ROSTER_REL = ['public', 'data', 'roster']
const PIPELINE_OUT = ['pipeline', 'output']

export type RosterRow = Record<string, unknown>

let rowsCache: { filePath: string; mtimeMs: number; rows: RosterRow[] } | null = null

export async function rosterBaseDir(): Promise<string | null> {
  const cwd = process.cwd()
  for (const parts of [ROSTER_REL, PIPELINE_OUT]) {
    const dir = path.join(cwd, ...parts)
    try {
      await fs.access(dir)
      return dir
    } catch {
      /* continue */
    }
  }
  return null
}

/** Latest `daily_roster_YYYY-MM-DD.json` by date in filename. */
export async function latestDailyRosterJsonPath(): Promise<string | null> {
  const dir = await rosterBaseDir()
  if (!dir) return null
  const names = await fs.readdir(dir)
  const daily = names.filter((n) => /^daily_roster_\d{4}-\d{2}-\d{2}\.json$/.test(n))
  if (!daily.length) return null
  daily.sort((a, b) => {
    const da = a.match(/daily_roster_(\d{4}-\d{2}-\d{2})\.json/)?.[1] ?? ''
    const db = b.match(/daily_roster_(\d{4}-\d{2}-\d{2})\.json/)?.[1] ?? ''
    return db.localeCompare(da)
  })
  return path.join(dir, daily[0]!)
}

export async function loadDailyRosterRows(): Promise<{ rows: RosterRow[]; filePath: string | null; date: string | null }> {
  const filePath = await latestDailyRosterJsonPath()
  if (!filePath) {
    return { rows: [], filePath: null, date: null }
  }
  const stat = await fs.stat(filePath)
  const m = filePath.match(/daily_roster_(\d{4}-\d{2}-\d{2})\.json$/)
  const date = m?.[1] ?? null

  if (
    rowsCache &&
    rowsCache.filePath === filePath &&
    rowsCache.mtimeMs === stat.mtimeMs
  ) {
    return { rows: rowsCache.rows, filePath, date }
  }

  const raw = await fs.readFile(filePath, 'utf-8')
  const parsed = JSON.parse(raw) as unknown
  const rows = Array.isArray(parsed) ? (parsed as RosterRow[]) : []
  rowsCache = { filePath, mtimeMs: stat.mtimeMs, rows }
  return { rows, filePath, date }
}

export function clearRosterCache(): void {
  rowsCache = null
}
