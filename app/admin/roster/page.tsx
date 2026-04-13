"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download } from "lucide-react"

type TableRow = {
  full_name: string
  facility: string
  facility_address: string
  city: string
  state: string
  zip_code: string
  inmate_id: string
  source_state: string
  offense: string
  projected_release_date: string
  sentence_start_date: string
}

type TableResponse = {
  filePath: string | null
  date: string | null
  totalAll: number
  totalFiltered: number
  page: number
  limit: number
  sourceStates: string[]
  rows: TableRow[]
  error?: string
}

export default function AdminRosterPage() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(true)
  const [data, setData] = useState<TableResponse | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(50)
  const [facilityFilter, setFacilityFilter] = useState("")
  const [facilityApplied, setFacilityApplied] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [nameApplied, setNameApplied] = useState("")
  const [sourceState, setSourceState] = useState<string>("ALL")

  const fetchTable = useCallback(async () => {
    setTableLoading(true)
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        facility: facilityApplied,
        name: nameApplied,
        source_state: sourceState === "ALL" ? "" : sourceState,
      })
      const res = await fetch(`/api/admin/roster/table?${q}`)
      if (!res.ok) {
        setData({
          filePath: null,
          date: null,
          totalAll: 0,
          totalFiltered: 0,
          page: 1,
          limit,
          sourceStates: [],
          rows: [],
          error: "Could not load population data",
        })
        return
      }
      setData(await res.json())
    } finally {
      setTableLoading(false)
    }
  }, [page, limit, facilityApplied, nameApplied, sourceState])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const me = await fetch("/api/auth/me")
        if (!me.ok) {
          router.push("/login")
          return
        }
        const u = await me.json()
        if (u.user?.role !== "ADMIN" && u.user?.role !== "STAFF") {
          router.push("/dashboard")
          return
        }
      } finally {
        if (!cancelled) setAuthLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (authLoading) return
    fetchTable()
  }, [authLoading, fetchTable])

  const applyFilters = () => {
    setPage(1)
    setFacilityApplied(facilityFilter.trim())
    setNameApplied(nameFilter.trim())
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalFiltered / data.limit))
    : 1

  const csvHref =
    data?.date != null
      ? `/api/admin/roster/file?name=${encodeURIComponent(`daily_roster_${data.date}.csv`)}`
      : null

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8 max-w-[1400px]">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Incarcerated population database</h1>
          <p className="text-muted-foreground max-w-3xl">
            Search and filter people from the latest consolidated export (
            <code className="text-sm bg-muted px-1 rounded">daily_roster_*.json</code>
            ), built by <code className="text-sm bg-muted px-1 rounded">pipeline/main.py</code>. Filter by
            facility and state source. Coverage depends on which state scrapers are enabled: Texas alone is
            ~140k+ rows; most other states are still stubs until implemented.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              {data?.date && (
                <>
                  Dataset date <strong>{data.date}</strong>
                  {data.totalAll > 0 && (
                    <>
                      {" "}
                      · <strong>{data.totalAll.toLocaleString()}</strong> people total
                    </>
                  )}
                </>
              )}
              {!data?.date && !tableLoading && "No population export found yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label htmlFor="roster-name" className="text-sm font-medium">
                Name or ID (contains)
              </label>
              <p className="text-xs text-muted-foreground">
                Searches the full dataset before pagination—use Apply so matches on any page appear here.
              </p>
              <Input
                id="roster-name"
                placeholder="e.g. Garcia, John or 12345"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label htmlFor="facility" className="text-sm font-medium">
                Prison / facility (contains)
              </label>
              <Input
                id="facility"
                placeholder="e.g. Polunsky, Ramsey"
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="secondary" onClick={applyFilters}>
                Apply filters
              </Button>
            </div>
            <div className="space-y-2 w-full md:w-56">
              <span className="text-sm font-medium block">Jurisdiction</span>
              <Select
                value={sourceState}
                onValueChange={(v) => {
                  setSourceState(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {(data?.sourceStates || []).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {csvHref && (
              <Button variant="outline" asChild>
                <a href={csvHref}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {tableLoading
                ? "Loading…"
                : `${data?.totalFiltered.toLocaleString() ?? 0} matching rows`}
            </CardTitle>
            <CardDescription>
              Showing page {data?.page ?? 1} of {totalPages} ({data?.limit ?? limit} per page)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.error && <p className="text-destructive text-sm mb-4">{data.error}</p>}
            {!tableLoading && data && data.totalAll === 0 && (
              <p className="text-muted-foreground">
                Run{" "}
                <code className="text-xs bg-muted px-1 rounded">cd pipeline && python3 main.py --state TX</code>{" "}
                then refresh. Only states you scrape appear here.
              </p>
            )}
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="p-2 font-medium whitespace-nowrap">Name</th>
                    <th className="p-2 font-medium whitespace-nowrap">Facility</th>
                    <th className="p-2 font-medium whitespace-nowrap">City</th>
                    <th className="p-2 font-medium whitespace-nowrap">ST</th>
                    <th className="p-2 font-medium whitespace-nowrap">ID</th>
                    <th className="p-2 font-medium whitespace-nowrap">Src</th>
                    <th className="p-2 font-medium min-w-[140px]">Offense</th>
                    <th className="p-2 font-medium whitespace-nowrap">Proj. release</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.rows || []).map((r, i) => (
                    <tr key={`${r.inmate_id}-${r.source_state}-${i}`} className="border-b last:border-0">
                      <td className="p-2 align-top">{r.full_name}</td>
                      <td className="p-2 align-top max-w-[220px]">{r.facility}</td>
                      <td className="p-2 align-top">{r.city}</td>
                      <td className="p-2 align-top">{r.state}</td>
                      <td className="p-2 align-top font-mono text-xs">{r.inmate_id}</td>
                      <td className="p-2 align-top">{r.source_state}</td>
                      <td className="p-2 align-top max-w-[280px] text-muted-foreground">{r.offense}</td>
                      <td className="p-2 align-top whitespace-nowrap">{r.projected_release_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && data.totalFiltered > 0 && (
              <div className="flex items-center justify-between gap-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || tableLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || tableLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
