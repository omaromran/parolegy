import fs from 'fs'
import path from 'path'

function stripEnvQuotes(s: string): string {
  const t = s.trim()
  if (t.length >= 2) {
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1)
    }
  }
  return t
}

function parseDatabaseUrlFromEnvFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null
  const text = fs.readFileSync(filePath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    if (key !== 'DATABASE_URL') continue
    const val = stripEnvQuotes(trimmed.slice(eq + 1))
    if (val.startsWith('postgresql://') || val.startsWith('postgres://')) return val
  }
  return null
}

function isPostgresUrl(url: string | undefined): boolean {
  const u = url?.trim() || ''
  return u.startsWith('postgresql://') || u.startsWith('postgres://')
}

/**
 * Next.js merges env so **shell `DATABASE_URL` wins** over `.env` / `.env.local`.
 * A leftover `export DATABASE_URL=file:./dev.db` breaks Prisma (this app is PostgreSQL-only).
 * If the current value is not a Postgres URL, take `DATABASE_URL` from project `.env` / `.env.local`
 * (`.env.local` wins when both define a valid URL).
 */
export function ensurePostgresDatabaseUrlFromProjectFiles(): void {
  if (isPostgresUrl(process.env.DATABASE_URL)) return
  const root = process.cwd()
  const fromDotEnv = parseDatabaseUrlFromEnvFile(path.join(root, '.env'))
  const fromLocal = parseDatabaseUrlFromEnvFile(path.join(root, '.env.local'))
  const resolved = fromLocal ?? fromDotEnv
  if (resolved) {
    process.env.DATABASE_URL = resolved
  }
}
