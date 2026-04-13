"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link"
import { useAuth } from "@/hooks/use-auth"
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

export default function MachineLearningPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading, logout } = useAuth()
  const [learnings, setLearnings] = useState<MlLearning[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState<{ learningId: string; side: string } | null>(null)

  const load = useCallback(() => {
    return fetch("/api/ml-learnings")
      .then((r) => (r.ok ? r.json() : { learnings: [] }))
      .then((d) => setLearnings(d.learnings || []))
      .catch(() => setLearnings([]))
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [user, load])

  const handleCreateLearning = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/ml-learnings", { method: "POST" })
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
      const res = await fetch(`/api/ml-learnings/${id}`, { method: "DELETE" })
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
    const file = fileList?.[0]
    if (!file) return
    setUploading({ learningId, side })
    try {
      const fd = new FormData()
      fd.set("file", file)
      fd.set("side", side)
      const res = await fetch(`/api/ml-learnings/${learningId}/upload`, {
        method: "POST",
        body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed")
      }
      setLearnings((prev) =>
        prev.map((l) =>
          l.id === learningId
            ? {
                ...l,
                files: [...l.files, data.file].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ),
              }
            : l
        )
      )
      toast({ title: "File uploaded" })
    } catch (e) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      })
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteFile = async (learningId: string, fileId: string) => {
    try {
      const res = await fetch(`/api/ml-learnings/${learningId}/files/${fileId}`, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/machine-learning" className="text-sm font-medium text-primary">
              Machine learning
            </Link>
            <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <DashboardBackLink />
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Machine learning</h1>
              <p className="text-muted-foreground max-w-2xl text-sm">
                Add before-and-after pairs: what the client or family submitted, and the parole campaign Parolegy
                produced. When staff generate your campaign, the model uses these examples together with the
                standard campaign structure and LLM guidelines—so it learns how strong intake maps to a
                successful narrative. It must still ground every fact in your current assessment and uploads;
                it will not copy private details from other matters into your case.
              </p>
            </div>
            <Button type="button" onClick={handleCreateLearning} disabled={creating}>
              <Plus className="mr-2 h-4 w-4" />
              {creating ? "Adding…" : "Create new learning"}
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : learnings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No learnings yet</CardTitle>
                <CardDescription>
                  Click &quot;Create new learning&quot; to add your first before/after pair.
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
                              <div>
                                <input
                                  id={`upload-${L.id}-${side}`}
                                  type="file"
                                  accept={FILE_ACCEPT}
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
                                    {busy ? "Uploading…" : "Upload"}
                                  </label>
                                </Button>
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
