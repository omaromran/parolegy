"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDateShort, formatDate } from "@/lib/utils"
import { ASSESSMENT_SECTIONS, getQuestionLabel } from "@/lib/assessment-labels"

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

type CaseDetail = {
  id: string
  clientName: string
  tdcjNumber: string
  unit: string | null
  district: string | null
  paroleEligibilityDate: string | null
  nextReviewDate: string | null
  status: string
  serviceOption: number
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string }
  assessment: {
    id: string
    completedAt: string | null
    updatedAt: string
    responses: Record<string, unknown>
  } | null
}

export default function AdminCaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/cases/${id}`)
      .then((res) => {
        if (res.status === 404 || !res.ok) throw new Error("Case not found")
        return res.json()
      })
      .then((data) => {
        setCaseData(data.case)
        setStatus(data.case.status)
      })
      .catch(() => setCaseData(null))
      .finally(() => setIsLoading(false))
  }, [id])

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

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Case not found</p>
        <Button asChild><Link href="/admin">Back to Admin</Link></Button>
      </div>
    )
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
                <p className="text-muted-foreground">Service option</p>
                <p className="font-medium">
                  {caseData.serviceOption === 1 && "White-Glove"}
                  {caseData.serviceOption === 2 && "Hybrid"}
                  {caseData.serviceOption === 3 && "Self-Serve"}
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

        {caseData.assessment && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-semibold">Assessment responses</h2>
            {ASSESSMENT_SECTIONS.map((section) => {
              const hasAny = section.questionIds.some((qid) => responses[qid] != null && String(responses[qid]).trim() !== "")
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
                          <p className="text-sm text-muted-foreground">
                            {getQuestionLabel(qid)}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{String(val)}</p>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!caseData.assessment && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No assessment submitted yet.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
