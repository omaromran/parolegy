import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { loadDailyRosterRows, type RosterRow } from '@/lib/roster-data'

function str(r: RosterRow, key: string): string {
  const v = r[key]
  if (v == null) return ''
  return String(v)
}

export const GET = requireRole(['ADMIN', 'STAFF'])(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(200, Math.max(10, parseInt(searchParams.get('limit') || '50', 10) || 50))
    const facilityQ = (searchParams.get('facility') || '').trim().toLowerCase()
    const nameQ = (searchParams.get('name') || '').trim().toLowerCase()
    const sourceState = (searchParams.get('source_state') || '').trim().toUpperCase()

    const { rows: all, filePath, date } = await loadDailyRosterRows()

    let filtered = all
    if (sourceState && sourceState !== 'ALL') {
      filtered = filtered.filter((r) => str(r, 'source_state').toUpperCase() === sourceState)
    }
    if (facilityQ) {
      filtered = filtered.filter((r) =>
        str(r, 'facility').toLowerCase().includes(facilityQ)
      )
    }
    if (nameQ) {
      filtered = filtered.filter((r) => {
        const full = str(r, 'full_name').toLowerCase()
        const first = str(r, 'first_name').toLowerCase()
        const last = str(r, 'last_name').toLowerCase()
        const id = str(r, 'inmate_id').toLowerCase()
        return (
          full.includes(nameQ) ||
          id.includes(nameQ) ||
          first.includes(nameQ) ||
          last.includes(nameQ) ||
          `${first} ${last}`.trim().includes(nameQ)
        )
      })
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const pageRows = filtered.slice(start, start + limit)

    const sourcesSet = new Set<string>()
    for (const r of all) {
      const s = str(r, 'source_state').trim()
      if (s) sourcesSet.add(s.toUpperCase())
    }
    const sourceStates = Array.from(sourcesSet).sort()

    return NextResponse.json({
      filePath,
      date,
      totalAll: all.length,
      totalFiltered: total,
      page,
      limit,
      sourceStates,
      rows: pageRows.map((r) => ({
        full_name: str(r, 'full_name'),
        facility: str(r, 'facility'),
        facility_address: str(r, 'facility_address'),
        city: str(r, 'city'),
        state: str(r, 'state'),
        zip_code: str(r, 'zip_code'),
        inmate_id: str(r, 'inmate_id'),
        source_state: str(r, 'source_state'),
        offense: str(r, 'offense'),
        projected_release_date: str(r, 'projected_release_date'),
        sentence_start_date: str(r, 'sentence_start_date'),
      })),
    })
  } catch (e) {
    console.error('admin roster table', e)
    return NextResponse.json({ error: 'Failed to load roster data' }, { status: 500 })
  }
})
