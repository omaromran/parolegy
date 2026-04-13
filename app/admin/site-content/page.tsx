"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type PageMeta = { slug: string; label: string; blockCount: number }

export default function AdminSiteContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [pages, setPages] = useState<PageMeta[]>([])
  const [slug, setSlug] = useState<string | null>(null)
  const [merged, setMerged] = useState<Record<string, string>>({})
  const [loadingList, setLoadingList] = useState(true)
  const [loadingPage, setLoadingPage] = useState(false)
  const [saving, setSaving] = useState(false)

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/me")
    if (!res.ok) {
      router.push("/login")
      return
    }
    const data = await res.json()
    if (data.user?.role !== "ADMIN" && data.user?.role !== "STAFF") {
      router.push("/dashboard")
      return
    }
    setUser(data.user)
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!user) return
    fetch("/api/admin/site-content")
      .then((r) => (r.ok ? r.json() : { pages: [] }))
      .then((d) => setPages(d.pages || []))
      .catch(() => setPages([]))
      .finally(() => setLoadingList(false))
  }, [user])

  const loadSlug = async (s: string) => {
    setLoadingPage(true)
    setSlug(s)
    try {
      const res = await fetch(`/api/admin/site-content/${encodeURIComponent(s)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setMerged(data.merged || {})
    } catch (e) {
      toast({
        title: "Could not load page",
        description: e instanceof Error ? e.message : "Error",
        variant: "destructive",
      })
      setSlug(null)
      setMerged({})
    } finally {
      setLoadingPage(false)
    }
  }

  const handleSave = async () => {
    if (!slug) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/site-content/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: merged }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setMerged(data.merged || merged)
      toast({ title: "Saved", description: "Website copy updated." })
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Error",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key: string, value: string) => {
    setMerged((prev) => ({ ...prev, [key]: value }))
  }

  if (!user && loadingList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!user) return null

  const sortedKeys = Object.keys(merged).sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-sm font-medium">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold mb-2">Website copy</h1>
        <p className="text-muted-foreground mb-8">
          Edit public-facing text by page. Values that match the built-in default are not stored in the
          database. Use the placeholder{" "}
          <code className="text-xs bg-muted px-1 rounded">{"{mailing}"}</code> in the home contact strip
          note only (it is replaced with the mailing address).
        </p>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pages</CardTitle>
              <CardDescription>Select a page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 max-h-[70vh] overflow-y-auto">
              {loadingList ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                pages.map((p) => (
                  <Button
                    key={p.slug}
                    variant={slug === p.slug ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => loadSlug(p.slug)}
                  >
                    <span className="truncate">{p.slug}</span>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {!slug ? (
              <p className="text-sm text-muted-foreground">Choose a page from the list.</p>
            ) : loadingPage ? (
              <p className="text-sm text-muted-foreground">Loading fields…</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="font-semibold text-lg">{slug}</h2>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
                <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                  {sortedKeys.map((key) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">{key}</label>
                      <Textarea
                        value={merged[key] ?? ""}
                        onChange={(e) => updateField(key, e.target.value)}
                        rows={Math.min(8, Math.max(2, Math.ceil((merged[key]?.length || 0) / 80)))}
                        className="text-sm min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
