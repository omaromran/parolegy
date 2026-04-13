"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link"

type CaseSummary = {
  id: string
  clientName: string
  tdcjNumber: string
  assessment: { completedAt: string | null } | null
  meetsRequiredDocuments?: boolean
}

type NarrativeSection = { slug: string; title: string; content: string }

type CampaignSummary = {
  id: string
  version: number
  language: string
  status: string
  reviewCycle: number
  createdAt: string
  renderedPdfUrl: string | null
  narrative?: { sections: NarrativeSection[] } | null
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  AI_GENERATED: "Parolegy AI Generated",
  TEAM_EDITED: "Team Edited",
  CLIENT_APPROVED: "Client Approved",
  FINAL: "Final",
}

export default function CampaignPage() {
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => (res.ok ? res.json() : { cases: [] }))
      .then((data) => {
        const list = data.cases || []
        setCases(list)
        const first = list[0]
        setCaseId(first?.id ?? null)
      })
      .catch(() => setCases([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!caseId) {
      setCampaigns([])
      return
    }
    fetch(`/api/campaigns?caseId=${encodeURIComponent(caseId)}`)
      .then((res) => (res.ok ? res.json() : { campaigns: [] }))
      .then((data) => setCampaigns(data.campaigns || []))
      .catch(() => setCampaigns([]))
  }, [caseId])

  const primaryCase = cases.find((c) => c.id === caseId) ?? cases[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
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
        <div className="max-w-6xl mx-auto">
          <DashboardBackLink />
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Parole campaign</h1>
            <p className="text-muted-foreground max-w-2xl">
              Staff publish your parole campaign here when it is ready. You only see content after
              publication. The print-ready booklet view is not available yet.
            </p>
          </div>

          {primaryCase && campaigns.length === 0 && (
            <Card className="mb-8 border-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Nothing published yet. Finish your assessment and required uploads. Staff are notified,
                  then they generate the campaign and publish it to your dashboard when it is ready.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/assessment">Assessment</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/uploads">Uploads</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {campaigns.length > 0 && (
            <div className="grid gap-6">
              <h2 className="font-semibold text-lg">Your campaigns</h2>
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Campaign Version {campaign.version}</CardTitle>
                        <CardDescription>
                          Created {formatDateShort(campaign.createdAt)} · Language:{" "}
                          {campaign.language.toUpperCase()}
                        </CardDescription>
                      </div>
                      <Badge>{statusLabels[campaign.status] || campaign.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 flex-wrap">
                      <Button
                        size="sm"
                        type="button"
                        disabled
                        className="opacity-50"
                        title="Print-ready booklet coming soon"
                      >
                        Parole campaign (booklet)
                      </Button>
                      <Button variant="outline" size="sm" disabled title="Coming soon">
                        Download PDF
                      </Button>
                    </div>
                    {campaign.narrative?.sections?.length ? (
                      <div className="space-y-3 pt-2 border-t">
                        <p className="text-sm font-medium">Published narrative</p>
                        {campaign.narrative.sections.map((sec) => (
                          <div key={sec.slug} className="rounded-md border bg-muted/30 p-4">
                            <h3 className="text-sm font-semibold mb-2">{sec.title}</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {sec.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!primaryCase && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Complete your assessment first to create a case. Staff will generate your parole campaign
                  when your materials are ready.
                </p>
                <Button asChild>
                  <Link href="/dashboard/assessment">Start assessment</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-10 pt-6 border-t">
            <DashboardBackLink />
          </div>
        </div>
      </main>
    </div>
  )
}
