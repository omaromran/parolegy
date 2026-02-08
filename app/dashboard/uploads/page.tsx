"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, File, X, Download, ExternalLink, Image } from "lucide-react"

const documentTypes = [
  { id: "SUPPORT_LETTER", label: "Support Letter", min: 3, max: 10 },
  { id: "PHOTO", label: "Photo", min: 10, max: 20 },
  { id: "CERTIFICATE", label: "Certificate", min: 0, max: 50 },
  { id: "EMPLOYMENT_PLAN", label: "Employment Plan", min: 0, max: 5 },
  { id: "HOUSING_PLAN", label: "Housing Plan", min: 0, max: 5 },
  { id: "OTHER", label: "Other", min: 0, max: 20 },
]

// Sample files from /samples (hosted in repo, from public domain / test sources)
const SAMPLE_FILES: Record<string, { url: string; filename: string; count: number }[]> = {
  SUPPORT_LETTER: [
    { url: "/samples/support-letter.pdf", filename: "support-letter-1.pdf", count: 3 },
  ],
  PHOTO: [
    { url: "/samples/photo-family.jpg", filename: "photo-family.jpg", count: 5 },
    { url: "/samples/photo-person.png", filename: "photo-person.png", count: 5 },
  ],
  CERTIFICATE: [
    { url: "/samples/certificate.pdf", filename: "GED-certificate.pdf", count: 1 },
  ],
  EMPLOYMENT_PLAN: [
    { url: "/samples/employment-plan.pdf", filename: "employment-plan.pdf", count: 1 },
  ],
  HOUSING_PLAN: [
    { url: "/samples/housing-plan.pdf", filename: "housing-plan.pdf", count: 1 },
  ],
  OTHER: [
    { url: "/samples/support-letter.pdf", filename: "additional-note.pdf", count: 1 },
  ],
}

async function fetchAsFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}`)
  const blob = await res.blob()
  const mime = res.headers.get("content-type") || blob.type || "application/octet-stream"
  return new File([blob], filename, { type: mime })
}

type SavedDocument = {
  id: string
  type: string
  fileName: string
  mimeType: string
  size: number
  createdAt: string
}

const typeLabels: Record<string, string> = {
  SUPPORT_LETTER: "Support Letter",
  PHOTO: "Photo",
  CERTIFICATE: "Certificate",
  EMPLOYMENT_PLAN: "Employment Plan",
  HOUSING_PLAN: "Housing Plan",
  OTHER: "Other",
}

export default function UploadsPage() {
  const router = useRouter()
  const [uploads, setUploads] = useState<Record<string, File[]>>({
    SUPPORT_LETTER: [],
    PHOTO: [],
    CERTIFICATE: [],
    EMPLOYMENT_PLAN: [],
    HOUSING_PLAN: [],
    OTHER: [],
  })
  const [loadingSamples, setLoadingSamples] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [casesLoading, setCasesLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => (res.ok ? res.json() : { cases: [] }))
      .then((data) => {
        const first = (data.cases || [])[0]
        setCaseId(first?.id ?? null)
      })
      .catch(() => setCaseId(null))
      .finally(() => setCasesLoading(false))
  }, [])

  const loadDocuments = () => {
    if (!caseId) return
    setDocumentsLoading(true)
    fetch(`/api/documents?caseId=${encodeURIComponent(caseId)}`)
      .then((res) => (res.ok ? res.json() : { documents: [] }))
      .then((data) => setSavedDocuments(data.documents || []))
      .catch(() => setSavedDocuments([]))
      .finally(() => setDocumentsLoading(false))
  }

  useEffect(() => {
    if (caseId) loadDocuments()
    else setSavedDocuments([])
  }, [caseId])

  const handleFileSelect = (type: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setUploads({
      ...uploads,
      [type]: [...uploads[type], ...fileArray],
    })
  }

  const handleRemove = (type: string, index: number) => {
    setUploads({
      ...uploads,
      [type]: uploads[type].filter((_, i) => i !== index),
    })
  }

  const handleLoadSamples = async () => {
    setLoadingSamples(true)
    try {
      const next: Record<string, File[]> = { ...uploads }
      for (const [type, entries] of Object.entries(SAMPLE_FILES)) {
        const files: File[] = []
        for (const entry of entries) {
          for (let i = 0; i < entry.count; i++) {
            const name = entry.count > 1 ? entry.filename.replace(/(\.\w+)$/, `-${i + 1}$1`) : entry.filename
            const file = await fetchAsFile(entry.url, name)
            files.push(file)
          }
        }
        next[type] = [...(next[type] || []), ...files]
      }
      setUploads(next)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to load sample documents")
    } finally {
      setLoadingSamples(false)
    }
  }

  const handleUpload = async () => {
    if (!caseId) {
      alert("Please complete your assessment first to create a case, then you can upload documents.")
      return
    }
    const total = Object.values(uploads).reduce((n, arr) => n + arr.length, 0)
    if (total === 0) {
      alert("Please add at least one file to upload.")
      return
    }
    setUploading(true)
    setUploadError(null)
    let done = 0
    let lastError: string | null = null
    for (const docType of documentTypes) {
      const files = uploads[docType.id] || []
      for (const file of files) {
        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("caseId", caseId)
          formData.append("type", docType.id)
          const res = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            lastError = data.error || `Upload failed for ${file.name}`
          }
          done++
        } catch (e) {
          lastError = e instanceof Error ? e.message : "Upload failed"
          done++
        }
      }
    }
    setUploading(false)
    if (lastError) {
      setUploadError(lastError)
    } else {
      setUploadError(null)
      setUploads({
        SUPPORT_LETTER: [],
        PHOTO: [],
        CERTIFICATE: [],
        EMPLOYMENT_PLAN: [],
        HOUSING_PLAN: [],
        OTHER: [],
      })
      loadDocuments()
      router.push("/dashboard")
    }
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
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground mb-4">
            Upload support letters, photos, certificates, and other documents for your parole campaign.
          </p>
          {casesLoading ? (
            <p className="text-sm text-muted-foreground mb-4">Loading…</p>
          ) : !caseId ? (
            <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
              Complete your <Link href="/dashboard/assessment" className="underline font-medium">assessment</Link> first to create a case. Then you can upload documents here.
            </div>
          ) : null}

          <div className="mb-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadSamples}
              disabled={loadingSamples}
              className="text-muted-foreground"
            >
              <Download className="mr-2 h-4 w-4" />
              {loadingSamples ? "Loading samples…" : "Load sample documents"}
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">
              Adds sample PDFs and images so you can test without real files.
            </span>
          </div>

          {uploadError && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {uploadError}
            </div>
          )}

          {caseId && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Uploaded documents</CardTitle>
                <CardDescription>
                  Preview or manage documents you’ve already uploaded.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : savedDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {savedDocuments.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between gap-4 rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {d.mimeType.startsWith("image/") ? (
                            <Image className="h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="text-sm truncate">{d.fileName}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {typeLabels[d.type] || d.type} · {(d.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`/api/documents/${d.id}/file`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Preview
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {documentTypes.map((docType) => {
              const typeUploads = uploads[docType.id]
              const count = typeUploads.length
              const meetsMin = count >= docType.min
              const exceedsMax = count > docType.max

              return (
                <Card key={docType.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{docType.label}</CardTitle>
                        <CardDescription>
                          {docType.min > 0
                            ? `Minimum: ${docType.min}, Maximum: ${docType.max}`
                            : `Maximum: ${docType.max}`}
                          {count > 0 && ` • ${count} uploaded`}
                        </CardDescription>
                      </div>
                      {!meetsMin && docType.min > 0 && (
                        <span className="text-sm text-destructive">Required</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept={docType.id === "PHOTO" ? "image/*" : "application/pdf,image/*"}
                            onChange={(e) => handleFileSelect(docType.id, e.target.files)}
                            className="hidden"
                          />
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose Files
                            </span>
                          </Button>
                        </label>
                      </div>
                      {typeUploads.length > 0 && (
                        <div className="space-y-2">
                          {typeUploads.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(docType.id, index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !caseId}
            >
              {uploading ? "Uploading…" : "Upload All Files"}
            </Button>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Photo Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Only non-deceptive enhancements allowed: crop, brightness/contrast, denoise, background blur</li>
                <li>Do NOT change identity, add props, uniforms, or alter reality</li>
                <li>Photos should humanize and show positive aspects of life and relationships</li>
                <li>Include captions where helpful to provide context</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
