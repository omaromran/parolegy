"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDateShort, formatDate } from "@/lib/utils"
import { ASSESSMENT_SECTIONS, getQuestionLabel } from "@/lib/assessment-labels"
import { ScrollText, Sparkles, Trash2 } from "lucide-react"

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  INTAKE: "Intake",
  ASSESSMENT_IN_PROGRESS: "Assessment in Progress",
  DOCUMENTS_PENDING: "Documents Pending",
  AI_DRAFT_READY: "AI Draft Ready",
  TEAM_REVIEW: "Team Review",
  CLIENT_REVIEW: "Client Review",
  APPROVED: "Approved",
  SUBMITTED: "Submitted",
  ARCHIVED: "Archived",
}

type ParoleNarrativeSection = { slug: string; title: string; content: string }

type CampaignSummary = {
  id: string
  version: number
  language: string
  status: string
  reviewCycle: number
  createdAt: string
  renderedPdfUrl: string | null
  publishedToClient: boolean
  narrative: { sections: ParoleNarrativeSection[] } | null
}

type DocumentSummary = {
  id: string
  type: string
  fileName: string
  mimeType: string
  size: number
  createdAt: string
}

type CaseDetail = {
  id: string
  clientName: string
  tdcjNumber: string
  unit: string | null
  district: string | null
  paroleEligibilityDate: string | null
  nextReviewDate: string | null
  status: string
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string }
  assessment: {
    id: string
    completedAt: string | null
    updatedAt: string
    responses: Record<string, unknown>
  } | null
  campaigns: CampaignSummary[]
  documents: DocumentSummary[]
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  SUPPORT_LETTER: "Support letter",
  PHOTO: "Photo",
  CERTIFICATE: "Certificate",
  EMPLOYMENT_PLAN: "Employment plan",
  HOUSING_PLAN: "Housing plan",
  OTHER: "Other",
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const campaignStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  AI_GENERATED: "Parolegy AI Generated",
  TEAM_EDITED: "Team Edited",
  CLIENT_APPROVED: "Client Approved",
  FINAL: "Final",
}

export default function AdminCaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [savingStatus, setSavingStatus] = useState(false)
  const [generatingCampaign, setGeneratingCampaign] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null)
  const [publishingCampaignId, setPublishingCampaignId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const reloadCase = useCallback(async () => {
    const res = await fetch(`/api/admin/cases/${id}`)
    if (res.status === 401) throw new Error("Session expired—please log in again")
    if (res.status === 403) throw new Error("You do not have access to this case")
    if (res.status === 404) throw new Error("Case not found")
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string }).error || "Failed to load case")
    }
    const data = await res.json()
    const c = data.case
    setCaseData({
      ...c,
      campaigns: c.campaigns ?? [],
      documents: c.documents ?? [],
    })
    setStatus(c.status)
    setLoadError(null)
  }, [id])

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setLoadError(null)
    reloadCase()
      .catch((e: unknown) => {
        setCaseData(null)
        setLoadError(e instanceof Error ? e.message : "Failed to load case")
      })
      .finally(() => setIsLoading(false))
  }, [id, reloadCase])

  const canGenerateStaff = useMemo(() => {
    if (!caseData?.assessment?.completedAt) return false
    const c: Record<string, number> = {}
    for (const d of caseData.documents) {
      c[d.type] = (c[d.type] || 0) + 1
    }
    return (c.SUPPORT_LETTER || 0) >= 3 && (c.PHOTO || 0) >= 10
  }, [caseData])

  const handleGenerateCampaign = async () => {
    if (!caseData || !canGenerateStaff) return
    setGeneratingCampaign(true)
    setGenerateError(null)
    try {
      const res = await fetch(`/api/admin/cases/${caseData.id}/campaign/generate`, {
        method: "POST",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGenerateError(data.error || "Generation failed")
        return
      }
      await reloadCase()
    } catch {
      setGenerateError("Generation failed")
    } finally {
      setGeneratingCampaign(false)
    }
  }

  const handlePublishCampaign = async (campaignId: string, publish: boolean) => {
    setPublishingCampaignId(campaignId)
    setGenerateError(null)
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedToClient: publish }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGenerateError(data.error || "Failed to update publish status")
        return
      }
      await reloadCase()
    } catch {
      setGenerateError("Failed to update publish status")
    } finally {
      setPublishingCampaignId(null)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (
      !window.confirm(
        "Delete this generated campaign? This removes the narrative and stored campaign data for this version."
      )
    ) {
      return
    }
    setDeletingCampaignId(campaignId)
    setGenerateError(null)
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGenerateError(data.error || "Failed to delete campaign")
        return
      }
      await reloadCase()
    } catch {
      setGenerateError("Failed to delete campaign")
    } finally {
      setDeletingCampaignId(null)
    }
  }

  const handleUpdateStatus = async () => {
    if (!caseData || status === caseData.status) return
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setCaseData((prev) => (prev ? { ...prev, status } : null))
    } catch {
      alert("Failed to update status")
    } finally {
      setSavingStatus(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!caseData && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center max-w-md">
          {loadError || "Case not found"}
        </p>
        <Button asChild><Link href="/admin">Back to Admin</Link></Button>
      </div>
    )
  }

  if (!caseData) {
    return null
  }

  const responses = caseData.assessment?.responses || {}

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-medium">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{caseData.clientName}</CardTitle>
                <CardDescription>
                  TDCJ #{caseData.tdcjNumber}
                  {caseData.unit && ` • ${caseData.unit}`}
                  <br />
                  {caseData.user.name || caseData.user.email} ({caseData.user.email})
                </CardDescription>
              </div>
              <Badge>{statusLabels[caseData.status] || caseData.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Parole eligibility date</p>
                <p className="font-medium">
                  {caseData.paroleEligibilityDate
                    ? formatDateShort(caseData.paroleEligibilityDate)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Next review date</p>
                <p className="font-medium">
                  {caseData.nextReviewDate
                    ? formatDateShort(caseData.nextReviewDate)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Assessment completed</p>
                <p className="font-medium">
                  {caseData.assessment?.completedAt
                    ? formatDate(caseData.assessment.completedAt)
                    : "—"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Update status (review)</p>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  onClick={handleUpdateStatus}
                  disabled={savingStatus || status === caseData.status}
                >
                  {savingStatus ? "Saving…" : "Save status"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Parole campaign</h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Generate campaign builds a Knowledge hub–aligned narrative (one block per structure
                section). When it is ready, publish it so the client and family can see it on their
                dashboard. Clients only submit assessment and uploads—they never generate the campaign.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleGenerateCampaign}
              disabled={!canGenerateStaff || generatingCampaign}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generatingCampaign ? "Generating…" : "Generate campaign"}
            </Button>
          </div>
          {!canGenerateStaff && (
            <p className="text-sm text-amber-800 dark:text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
              Requires completed assessment and minimum uploads (3 support letters, 10 photos).
            </p>
          )}
          {generateError && (
            <p className="text-sm text-destructive">{generateError}</p>
          )}
          {caseData.campaigns.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No campaign yet. Use Generate campaign when the client&apos;s materials are ready.
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {caseData.campaigns.map((camp) => (
                <li key={camp.id}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-base">
                          Version {camp.version} · Cycle {camp.reviewCycle}
                        </CardTitle>
                        <CardDescription>
                          {formatDateShort(camp.createdAt)} · {camp.language.toUpperCase()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary">
                          {campaignStatusLabels[camp.status] || camp.status}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete this campaign"
                          disabled={deletingCampaignId === camp.id}
                          onClick={() => handleDeleteCampaign(camp.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          {camp.publishedToClient ? (
                            <Badge variant="default" className="font-normal">
                              Published to client
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="font-normal">
                              Not visible to client yet
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition-transform"
                            asChild
                          >
                            <Link
                              href={`/admin/cases/${caseData.id}/campaign/${camp.id}/narrative`}
                            >
                              <ScrollText className="h-4 w-4 shrink-0" aria-hidden />
                              Parole campaign narrative
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            disabled
                            className="opacity-50"
                            title="Print-ready booklet coming soon"
                          >
                            Parole campaign
                          </Button>
                        </div>
                        <div className="flex justify-end sm:justify-end sm:ml-auto shrink-0 w-full sm:w-auto">
                          <Button
                            size="sm"
                            type="button"
                            variant={camp.publishedToClient ? "outline" : "default"}
                            className="w-full sm:w-auto"
                            disabled={publishingCampaignId === camp.id}
                            onClick={() =>
                              handlePublishCampaign(camp.id, !camp.publishedToClient)
                            }
                          >
                            {publishingCampaignId === camp.id
                              ? "Saving…"
                              : camp.publishedToClient
                                ? "Unpublish from client"
                                : "Publish to client"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6 mt-10">
          <div>
            <h2 className="font-serif text-xl font-semibold">Assessment submission</h2>
            <p className="text-sm text-muted-foreground mt-1">
              What the client submitted from the dashboard assessment (used as input to campaign generation).
            </p>
          </div>

          {caseData.assessment ? (
            <>
              {ASSESSMENT_SECTIONS.map((section) => {
                const hasAny = section.questionIds.some(
                  (qid) => responses[qid] != null && String(responses[qid]).trim() !== ""
                )
                if (!hasAny) return null
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.questionIds.map((qid) => {
                        const val = responses[qid]
                        if (val == null || String(val).trim() === "") return null
                        return (
                          <div key={qid}>
                            <p className="text-sm text-muted-foreground">{getQuestionLabel(qid)}</p>
                            <p className="text-sm whitespace-pre-wrap">{String(val)}</p>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No assessment submitted yet.
              </CardContent>
            </Card>
          )}

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-serif text-lg font-semibold">Uploaded documents</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Files the client uploaded from the dashboard (support letters, photos, etc.). Open or
                download using your staff session.
              </p>
            </div>
            {caseData.documents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No documents uploaded yet.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/40 text-left">
                          <th className="p-3 font-medium">Type</th>
                          <th className="p-3 font-medium">File name</th>
                          <th className="p-3 font-medium whitespace-nowrap">Size</th>
                          <th className="p-3 font-medium whitespace-nowrap">Uploaded</th>
                          <th className="p-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caseData.documents.map((doc) => (
                          <tr key={doc.id} className="border-b last:border-0">
                            <td className="p-3 align-top">
                              <Badge variant="outline" className="font-normal">
                                {DOCUMENT_TYPE_LABELS[doc.type] || doc.type.replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="p-3 align-top max-w-[200px] sm:max-w-xs">
                              <span className="break-all">{doc.fileName}</span>
                              <p className="text-xs text-muted-foreground mt-0.5">{doc.mimeType}</p>
                            </td>
                            <td className="p-3 align-top whitespace-nowrap text-muted-foreground">
                              {formatFileSize(doc.size)}
                            </td>
                            <td className="p-3 align-top whitespace-nowrap text-muted-foreground">
                              {formatDateShort(doc.createdAt)}
                            </td>
                            <td className="p-3 align-top">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={`/api/documents/${doc.id}/file`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View / download
                                </a>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
