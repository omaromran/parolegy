"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { SectionCopyButton } from "@/components/section-copy-button"

type NarrativeSection = { slug: string; title: string; content: string }

type CampaignPayload = {
  id: string
  version: number
  language: string
  status: string
  reviewCycle: number
  createdAt: string
  caseId: string
  clientName: string
  tdcjNumber: string
  narrative: { sections: NarrativeSection[] } | null
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  AI_GENERATED: "Parolegy AI Generated",
  TEAM_EDITED: "Team Edited",
  CLIENT_APPROVED: "Client Approved",
  FINAL: "Final",
}

export default function AdminCampaignNarrativePage() {
  const params = useParams()
  const caseId = params.id as string
  const campaignId = params.campaignId as string

  const [campaign, setCampaign] = useState<CampaignPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campaignId) return
    fetch(`/api/admin/campaigns/${campaignId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data: { campaign: CampaignPayload }) => setCampaign(data.campaign))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false))
  }, [campaignId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!campaign || campaign.caseId !== caseId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Campaign not found</p>
        <Button asChild>
          <Link href={caseId ? `/admin/cases/${caseId}` : "/admin"}>Back</Link>
        </Button>
      </div>
    )
  }

  const sections = campaign.narrative?.sections ?? []

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
      <main className="container py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/admin/cases/${caseId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to case
          </Link>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold">Parole campaign narrative</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign.clientName} · TDCJ #{campaign.tdcjNumber} · Version {campaign.version}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDateShort(campaign.createdAt)} · {campaign.language.toUpperCase()}
            </p>
          </div>
          <Badge variant="secondary">{statusLabels[campaign.status] || campaign.status}</Badge>
        </div>

        {sections.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              No narrative sections for this campaign yet. Generate the campaign from the case page
              first.
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-4">
            {sections.map((sec) => (
              <li key={sec.slug}>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold leading-snug pr-2">
                      {sec.title}
                    </CardTitle>
                    <SectionCopyButton text={sec.content} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sec.content}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
