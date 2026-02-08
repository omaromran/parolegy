"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

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
  serviceOption?: number
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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [cases, setCases] = useState<CaseWithAssessment[]>([])
  const [casesLoading, setCasesLoading] = useState(true)

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
                Complete your first assessment to create a case and build your parole campaign.
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
                Your cases. Edit and click Complete to re-submit. Upload documents when ready.
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
                        <Link href="/dashboard/uploads">Upload documents</Link>
                      </Button>
                      {c.serviceOption === 3 && c.assessment?.completedAt && c.meetsRequiredDocuments && (
                        <Button asChild size="sm">
                          <Link href="/dashboard/campaign">Generate campaign</Link>
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
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
                  <span className="text-sm">Campaign generated</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/assessment">Complete assessment</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/uploads">Upload documents</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/campaign">View campaign</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service option</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Self-serve — AI campaign generator
              </p>
              <Button variant="outline" size="sm" disabled>
                Change option
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
