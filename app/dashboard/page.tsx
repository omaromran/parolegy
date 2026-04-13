"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

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

type CaseWithAssessment = {
  id: string
  clientName: string
  tdcjNumber: string
  unit: string | null
  status: string
  createdAt: string
  updatedAt: string
  assessment: {
    id: string
    completedAt: string | null
    updatedAt: string
  } | null
  documentCounts?: Record<string, number>
  meetsRequiredDocuments?: boolean
  hasCampaigns?: boolean
}

function totalDocumentCount(counts: Record<string, number> | undefined): number {
  if (!counts) return 0
  return Object.values(counts).reduce((a, n) => a + n, 0)
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading, logout } = useAuth()
  const [cases, setCases] = useState<CaseWithAssessment[]>([])
  const [casesLoading, setCasesLoading] = useState(true)
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    fetch("/api/cases")
      .then((res) => (res.ok ? res.json() : { cases: [] }))
      .then((data) => {
        setCases(data.cases || [])
      })
      .catch(() => setCases([]))
      .finally(() => setCasesLoading(false))
  }, [user])

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

  const submissions = cases.filter((c) => c.assessment?.completedAt)
  const hasRequiredDocuments = cases.some((c) => c.meetsRequiredDocuments === true)
  const hasCampaign = cases.some((c) => c.hasCampaigns === true)

  const handleDeleteCase = async (caseId: string, clientName: string) => {
    const ok = window.confirm(
      `Delete the case for ${clientName}? This permanently removes the assessment, uploaded documents, and any campaigns for this case. This cannot be undone.`
    )
    if (!ok) return

    setDeletingCaseId(caseId)
    try {
      const res = await fetch(`/api/cases/${caseId}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to delete case")
      }
      setCases((prev) => prev.filter((c) => c.id !== caseId))
      toast({ title: "Case deleted" })
    } catch (e) {
      toast({
        title: "Could not delete case",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setDeletingCaseId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <span className="text-sm text-muted-foreground">
              {user.name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>

        {casesLoading ? (
          <Card className="mb-8">
            <CardContent className="py-8">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : cases.length === 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Get started</CardTitle>
              <CardDescription>
                Complete your first assessment to create a case. Parolegy staff build and publish your
                parole campaign—you only submit information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/assessment">Start assessment</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">My submissions</CardTitle>
              <CardDescription>
                Submit assessment answers and uploads. Staff are notified; they generate the campaign and
                publish it to this dashboard when it is ready.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {cases.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{c.clientName}</p>
                        <Badge>{statusLabels[c.status] || c.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        TDCJ #{c.tdcjNumber}
                        {c.unit && ` · ${c.unit}`}
                      </p>
                      {c.assessment?.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed {formatDateShort(c.assessment.completedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/assessment?caseId=${c.id}`}>
                          {c.assessment?.completedAt ? "Edit" : "Continue assessment"}
                        </Link>
                      </Button>
                      {c.assessment?.completedAt && (
                        <Button asChild size="sm">
                          <Link href={`/dashboard/assessment?caseId=${c.id}`}>
                            Re-submit
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/uploads">
                          {totalDocumentCount(c.documentCounts) >= 1
                            ? "Modify Documents"
                            : "Upload documents"}
                        </Link>
                      </Button>
                      {c.hasCampaigns && (
                        <Button asChild size="sm" variant="outline">
                          <Link href="/dashboard/campaign">Parole campaign</Link>
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingCaseId === c.id}
                        title="Delete this case"
                        aria-label={
                          deletingCaseId === c.id ? "Deleting case" : "Delete case"
                        }
                        onClick={() => handleDeleteCase(c.id, c.clientName)}
                      >
                        <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden />
                        <span className="hidden sm:inline">
                          {deletingCaseId === c.id ? "Deleting…" : "Delete case"}
                        </span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Account created</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={cases.length > 0 ? "text-green-500" : "text-gray-400"}>
                    {cases.length > 0 ? "✓" : "○"}
                  </span>
                  <span className="text-sm">Case created</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={submissions.length > 0 ? "text-green-500" : "text-yellow-500"}>
                    {submissions.length > 0 ? "✓" : "○"}
                  </span>
                  <span className="text-sm">Assessment {submissions.length > 0 ? "completed" : "in progress"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={hasRequiredDocuments ? "text-green-500" : "text-gray-400"}>
                    {hasRequiredDocuments ? "✓" : "○"}
                  </span>
                  <span className="text-sm">
                    Documents uploaded {hasRequiredDocuments ? "(3+ letters, 10+ photos)" : "(min 3 support letters, 10 photos)"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={hasCampaign ? "text-green-500" : "text-gray-400"}>
                    {hasCampaign ? "✓" : "○"}
                  </span>
                  <span className="text-sm">Received Parole Campaign from Parolegy Team</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After you submit your assessment and documents, Parolegy staff are notified. They prepare
                your parole campaign and publish it here so you can read it when it is ready.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
