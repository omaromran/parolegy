"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { Sparkles } from "lucide-react"

type CaseSummary = {
  id: string
  clientName: string
  tdcjNumber: string
  serviceOption: number
  assessment: { completedAt: string | null } | null
  meetsRequiredDocuments?: boolean
}

type CampaignSummary = {
  id: string
  version: number
  language: string
  status: string
  reviewCycle: number
  createdAt: string
  renderedPdfUrl: string | null
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  AI_GENERATED: "AI Generated",
  TEAM_EDITED: "Team Edited",
  CLIENT_APPROVED: "Client Approved",
  FINAL: "Final",
}

export default function CampaignPage() {
  const router = useRouter()
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  const isSelfServe = primaryCase?.serviceOption === 3
  const hasAssessment = !!primaryCase?.assessment?.completedAt
  const hasRequiredDocs = primaryCase?.meetsRequiredDocuments === true
  const canGenerate = isSelfServe && hasAssessment && hasRequiredDocs

  const handleGenerate = async () => {
    if (!caseId || !canGenerate) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/campaign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Failed to generate campaign")
        return
      }
      setCampaigns((prev) => [
        {
          id: data.campaignId,
          version: 1,
          language: "en",
          status: "AI_GENERATED",
          reviewCycle: 1,
          createdAt: new Date().toISOString(),
          renderedPdfUrl: null,
        },
        ...prev,
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate campaign")
    } finally {
      setGenerating(false)
    }
  }

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
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Campaign Builder</h1>
              <p className="text-muted-foreground">
                Generate and manage your parole campaign booklets (self-serve)
              </p>
            </div>
            {primaryCase && (
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {generating ? "Generating…" : "Generate campaign"}
              </Button>
            )}
          </div>

          {!canGenerate && primaryCase && (
            <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  {!isSelfServe && "Campaign generation is available only for self-serve (option 3)."}
                  {isSelfServe && !hasAssessment && "Complete your assessment first."}
                  {isSelfServe && hasAssessment && !hasRequiredDocs && "Upload required documents (min 3 support letters, 10 photos) first."}
                </p>
                <div className="mt-2 flex gap-2">
                  {!hasAssessment && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/assessment">Complete assessment</Link>
                    </Button>
                  )}
                  {hasAssessment && !hasRequiredDocs && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/uploads">Upload documents</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
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
                          Created {formatDateShort(campaign.createdAt)} · Language: {campaign.language.toUpperCase()}
                        </CardDescription>
                      </div>
                      <Badge>{statusLabels[campaign.status] || campaign.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 flex-wrap">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/campaign/${campaign.id}`}>View</Link>
                      </Button>
                      <Button variant="outline" size="sm">Download PDF</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!primaryCase && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Complete your assessment first to create a case, then you can generate a campaign.
                </p>
                <Button asChild>
                  <Link href="/dashboard/assessment">Start assessment</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {primaryCase && campaigns.length === 0 && canGenerate && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  All set. Click &quot;Generate campaign&quot; to create your first campaign from your assessment and documents.
                </p>
                <Button onClick={handleGenerate} disabled={generating}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generating ? "Generating…" : "Generate your first campaign"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
