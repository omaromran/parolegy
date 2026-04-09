"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Entry = {
  id: string
  category: string
  slug: string
  title: string
  content: string
  sortOrder: number
  updatedAt: string
}

const CAT_LABEL: Record<string, string> = {
  PAROLE_STRUCTURE: "Parole campaign structure",
  LLM_GUIDELINES: "Parolegy LLM guidelines",
}

export default function AdminKnowledgeHubPage() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { title: string; content: string }>>({})
  const [tab, setTab] = useState<"structure" | "guidelines">("structure")

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const me = await fetch("/api/auth/me")
        if (!me.ok) {
          router.push("/login")
          return
        }
        const data = await me.json()
        if (data.user?.role !== "ADMIN" && data.user?.role !== "STAFF") {
          router.push("/dashboard")
          return
        }
      } finally {
        if (!c) setAuthLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [router])

  useEffect(() => {
    if (authLoading) return
    fetch("/api/admin/knowledge")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { entries: Entry[] }) => {
        setEntries(data.entries || [])
        const d: Record<string, { title: string; content: string }> = {}
        for (const e of data.entries || []) {
          d[e.id] = { title: e.title, content: e.content }
        }
        setDrafts(d)
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [authLoading])

  const save = async (id: string) => {
    const draft = drafts[id]
    if (!draft) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/knowledge/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draft.title, content: draft.content }),
      })
      if (!res.ok) throw new Error("save failed")
      const data = await res.json()
      const updated = data.entry as Entry
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    } catch {
      alert("Could not save. Try again.")
    } finally {
      setSavingId(null)
    }
  }

  const structure = entries.filter((e) => e.category === "PAROLE_STRUCTURE")
  const guidelines = entries.filter((e) => e.category === "LLM_GUIDELINES")

  const renderList = (list: Entry[]) => (
    <div className="space-y-6">
      {list.map((e) => (
        <Card key={e.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif">{e.title}</CardTitle>
            <CardDescription className="text-xs font-mono">
              {e.slug} · sort {e.sortOrder}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label htmlFor={`title-${e.id}`} className="text-sm font-medium">
                Display title
              </label>
              <input
                id={`title-${e.id}`}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={drafts[e.id]?.title ?? ""}
                onChange={(ev) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [e.id]: { ...prev[e.id], title: ev.target.value, content: prev[e.id]?.content ?? "" },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={`content-${e.id}`} className="text-sm font-medium">
                Content (used verbatim in AI prompt)
              </label>
              <Textarea
                id={`content-${e.id}`}
                rows={10}
                className="font-mono text-sm"
                value={drafts[e.id]?.content ?? ""}
                onChange={(ev) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [e.id]: { title: prev[e.id]?.title ?? e.title, content: ev.target.value },
                  }))
                }
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Updated {new Date(e.updatedAt).toLocaleString()}
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => save(e.id)}
                disabled={savingId === e.id}
              >
                {savingId === e.id ? "Saving…" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <main className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Knowledge hub</h1>
          <p className="text-muted-foreground max-w-2xl">
            Content here is injected into the parole campaign <strong>AI generation</strong> prompt as the
            Parolegy Knowledge Hub. Edit structure and guidelines so every generated campaign follows your
            voice, section purposes, and constraints. Only admins and staff can view this page.
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            type="button"
            variant={tab === "structure" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("structure")}
          >
            {CAT_LABEL.PAROLE_STRUCTURE}
          </Button>
          <Button
            type="button"
            variant={tab === "guidelines" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("guidelines")}
          >
            {CAT_LABEL.LLM_GUIDELINES}
          </Button>
        </div>
        {tab === "structure" ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Maps to how the blueprint should treat each major campaign section (synopsis, letter, analysis,
              plan, support, treatment/reentry).
            </p>
            {renderList(structure)}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Language standards, psychological framing, panel behavior, and absolute prohibitions for the
              model.
            </p>
            {renderList(guidelines)}
          </>
        )}
      </main>
    </div>
  )
}
