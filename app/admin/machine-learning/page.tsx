"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, Trash2, Plus, FileIcon } from "lucide-react"
import { formatDateShort } from "@/lib/utils"

const FILE_ACCEPT = [
  "image/*",
  "application/pdf",
  ".pdf",
  "application/msword",
  ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".docx",
  "text/plain",
  ".txt",
  "text/markdown",
  ".md",
].join(",")

const API = "/api/admin/ml-learnings"

type MlFile = {
  id: string
  side: string
  fileName: string
  mimeType: string
  size: number
  createdAt: string
}

type MlLearning = {
  id: string
  createdAt: string
  files: MlFile[]
}

export default function AdminMachineLearningPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [authLoading, setAuthLoading] = useState(true)
  const [learnings, setLearnings] = useState<MlLearning[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState<{ learningId: string; side: string } | null>(null)

  useEffect(() => {
    let cancelled = false
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
        if (!cancelled) setAuthLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  const load = useCallback(() => {
    return fetch(API)
      .then((r) => (r.ok ? r.json() : { learnings: [] }))
      .then((d) => setLearnings(d.learnings || []))
      .catch(() => setLearnings([]))
  }, [])

  useEffect(() => {
    if (authLoading) return
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [authLoading, load])

  const handleCreateLearning = async () => {
    setCreating(true)
    try {
      const res = await fetch(API, { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not create learning")
      }
      if (data.learning) {
        setLearnings((prev) => [data.learning, ...prev])
      } else {
        await load()
      }
      toast({ title: "Learning added" })
    } catch (e) {
      toast({
        title: "Could not add learning",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteLearning = async (id: string) => {
    const ok = window.confirm(
      "Delete this learning and all uploaded before/after files? This cannot be undone."
    )
    if (!ok) return
    setDeletingId(id)
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Delete failed")
      }
      setLearnings((prev) => prev.filter((l) => l.id !== id))
      toast({ title: "Learning deleted" })
    } catch (e) {
      toast({
        title: "Could not delete",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpload = async (learningId: string, side: "BEFORE" | "AFTER", fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : []
    if (files.length === 0) return
    setUploading({ learningId, side })
    const uploaded: MlFile[] = []
    const failures: string[] = []
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.set("file", file)
        fd.set("side", side)
        try {
          const res = await fetch(`${API}/${learningId}/upload`, {
            method: "POST",
            body: fd,
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            const msg =
              typeof data.error === "string" ? data.error : `Upload failed (${res.status})`
            failures.push(`${file.name}: ${msg}`)
            continue
          }
          if (data.file) {
            uploaded.push(data.file as MlFile)
          }
        } catch {
          failures.push(`${file.name}: Network error`)
        }
      }

      if (uploaded.length > 0) {
        setLearnings((prev) =>
          prev.map((l) =>
            l.id === learningId
              ? {
                  ...l,
                  files: [...l.files, ...uploaded].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                  ),
                }
              : l
          )
        )
      }

      if (uploaded.length > 0 && failures.length === 0) {
        toast({
          title: uploaded.length === 1 ? "File uploaded" : `${uploaded.length} files uploaded`,
        })
      } else if (uploaded.length > 0 && failures.length > 0) {
        toast({
          title: `${uploaded.length} uploaded, ${failures.length} failed`,
          description: failures.slice(0, 3).join(" · ") + (failures.length > 3 ? " …" : ""),
        })
      } else if (failures.length > 0) {
        toast({
          title: "Upload failed",
          description: failures.slice(0, 3).join(" · ") + (failures.length > 3 ? " …" : ""),
          variant: "destructive",
        })
      }
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteFile = async (learningId: string, fileId: string) => {
    try {
      const res = await fetch(`${API}/${learningId}/files/${fileId}`, {
        method: "DELETE",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Delete failed")
      }
      setLearnings((prev) =>
        prev.map((l) =>
          l.id === learningId ? { ...l, files: l.files.filter((f) => f.id !== fileId) } : l
        )
      )
      toast({ title: "File removed" })
    } catch (e) {
      toast({
        title: "Could not remove file",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      })
    }
  }

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
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Machine learning</h1>
              <p className="text-muted-foreground max-w-2xl text-sm">
                Build a shared pattern library for the whole team. For each learning, upload what the client or
                family submitted (before) and the parole campaign Parolegy produced (after). Every time staff
                generate a campaign, the model uses <strong>all</strong> of these examples together with the
                Knowledge hub structure and LLM guidelines—so narrative quality improves from real
                before/after pairs. The model must still ground facts in the <em>current</em> case’s assessment
                and support letters; it must not copy private details from other matters.
              </p>
            </div>
            <Button type="button" onClick={handleCreateLearning} disabled={creating}>
              <Plus className="mr-2 h-4 w-4" />
              {creating ? "Adding…" : "Create new learning"}
            </Button>
          </div>

          {learnings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No learnings yet</CardTitle>
                <CardDescription>
                  Click &quot;Create new learning&quot; to add your first before/after pair from completed
                  cases.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <ul className="space-y-8">
              {learnings.map((L, index) => (
                <li key={L.id}>
                  <Card>
                    <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
                      <div>
                        <CardTitle className="text-lg">Learning {learnings.length - index}</CardTitle>
                        <CardDescription>Added {formatDateShort(L.createdAt)}</CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === L.id}
                        onClick={() => handleDeleteLearning(L.id)}
                      >
                        <Trash2 className="h-4 w-4 sm:mr-1" />
                        {deletingId === L.id ? "Deleting…" : "Delete learning"}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {(["BEFORE", "AFTER"] as const).map((side) => {
                          const files = L.files.filter((f) => f.side === side)
                          const label =
                            side === "BEFORE"
                              ? "Before — what they submitted"
                              : "After — our parole campaign"
                          const busy =
                            uploading?.learningId === L.id && uploading.side === side
                          return (
                            <div
                              key={side}
                              className="rounded-lg border bg-muted/30 p-4 flex flex-col min-h-[200px]"
                            >
                              <h3 className="font-medium text-sm mb-3">{label}</h3>
                              <ul className="space-y-2 flex-1 mb-3">
                                {files.length === 0 ? (
                                  <li className="text-xs text-muted-foreground">No files yet.</li>
                                ) : (
                                  files.map((f) => (
                                    <li
                                      key={f.id}
                                      className="flex items-center justify-between gap-2 text-sm rounded-md border bg-background px-2 py-1.5"
                                    >
                                      <span className="flex items-center gap-2 min-w-0">
                                        <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="truncate" title={f.fileName}>
                                          {f.fileName}
                                        </span>
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        aria-label={`Remove ${f.fileName}`}
                                        onClick={() => handleDeleteFile(L.id, f.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </li>
                                  ))
                                )}
                              </ul>
                              <div className="space-y-1">
                                <input
                                  id={`upload-${L.id}-${side}`}
                                  type="file"
                                  accept={FILE_ACCEPT}
                                  multiple
                                  className="sr-only"
                                  disabled={busy}
                                  onChange={(e) => {
                                    handleUpload(L.id, side, e.target.files)
                                    e.target.value = ""
                                  }}
                                />
                                <Button type="button" variant="secondary" size="sm" disabled={busy} asChild>
                                  <label htmlFor={`upload-${L.id}-${side}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {busy ? "Uploading…" : "Upload files"}
                                  </label>
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Select one or more files (hold Cmd or Ctrl to multi-select).
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
