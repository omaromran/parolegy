"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"

type Blueprint = {
  case_summary?: { client_name?: string; tdcj_number?: string; key_facts?: string[] }
  panel_concerns?: Array<{ concern?: string; evidence?: string; mitigation?: string }>
  narrative_strategy?: { themes?: string[]; tone?: string; do_not_say?: string[] }
  sections?: {
    cover?: { tagline?: string }
    toc?: string[]
    synopsis?: { title?: string; paragraphs?: string[] }
    client_letter?: { salutation?: string; paragraphs?: string[]; closing?: string }
    strengths?: { bullets?: string[] }
    plan_30_90_180?: { plan_30?: string[]; plan_90?: string[]; plan_180?: string[] }
    home_plan?: { description?: string; stability_factors?: string[] }
    transportation?: { description?: string; details?: string[] }
    employment?: { history?: string[]; opportunities?: string[]; plan?: string[] }
    future?: { goals?: string[]; commitments?: string[] }
    support_letters?: { supporters?: Array<{ name?: string; relationship?: string; summary?: string }> }
    treatment_plan?: { description?: string; commitments?: string[] }
    closing?: { paragraphs?: string[] }
  }
  compliance_checks?: { truthfulness_confirmed?: boolean; missing_info?: string[] }
}

type CampaignDetail = {
  id: string
  version: number
  language: string
  status: string
  reviewCycle: number
  createdAt: string
  renderedPdfUrl: string | null
  caseId: string
  clientName: string
  tdcjNumber: string
  blueprint: Blueprint | null
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  AI_GENERATED: "AI Generated",
  TEAM_EDITED: "Team Edited",
  CLIENT_APPROVED: "Client Approved",
  FINAL: "Final",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/campaigns/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setCampaign(data.campaign))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Campaign not found</p>
        <Button asChild>
          <Link href="/dashboard/campaign">Back to Campaign</Link>
        </Button>
      </div>
    )
  }

  const b = campaign.blueprint
  const s = b?.sections ?? {}

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/campaign" className="text-sm font-medium">
              Campaign
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/campaign" className="text-sm text-muted-foreground hover:underline">
            ← Back to Campaign
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Campaign Version {campaign.version}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {campaign.clientName} · TDCJ #{campaign.tdcjNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created {formatDateShort(campaign.createdAt)}
                </p>
              </div>
              <Badge>{statusLabels[campaign.status] || campaign.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/campaign">Back to list</Link>
            </Button>
          </CardContent>
        </Card>

        {!b && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No blueprint content to display.
            </CardContent>
          </Card>
        )}

        {b && (
          <div className="space-y-8">
            {b.case_summary?.key_facts?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Case summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {b.case_summary.key_facts.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {b.panel_concerns?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Panel concerns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {b.panel_concerns.map((p, i) => (
                    <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-sm">{p.concern}</p>
                      <p className="text-sm text-muted-foreground mt-1">Evidence: {p.evidence}</p>
                      <p className="text-sm text-muted-foreground">Mitigation: {p.mitigation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {s.synopsis?.paragraphs?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{s.synopsis.title || "Synopsis"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.synopsis.paragraphs.map((para, i) => (
                    <p key={i} className="text-sm">{para}</p>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {(s.client_letter?.paragraphs?.length || s.client_letter?.salutation) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Letter to the Parole Board</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.client_letter.salutation && (
                    <p className="text-sm">{s.client_letter.salutation}</p>
                  )}
                  {s.client_letter.paragraphs?.map((para, i) => (
                    <p key={i} className="text-sm">{para}</p>
                  ))}
                  {s.client_letter.closing && (
                    <p className="text-sm">{s.client_letter.closing}</p>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {s.strengths?.bullets?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {s.strengths.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {(s.plan_30_90_180?.plan_30?.length || s.plan_30_90_180?.plan_90?.length || s.plan_30_90_180?.plan_180?.length) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reentry plan: 30 / 90 / 180 days</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {s.plan_30_90_180?.plan_30?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">First 30 days</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.plan_30_90_180.plan_30.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {s.plan_30_90_180?.plan_90?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">Days 31–90</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.plan_30_90_180.plan_90.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {s.plan_30_90_180?.plan_180?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">Days 91–180</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.plan_30_90_180.plan_180.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {s.home_plan?.description ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Home plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{s.home_plan.description}</p>
                  {s.home_plan.stability_factors?.length ? (
                    <ul className="list-disc list-inside text-sm">
                      {s.home_plan.stability_factors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {s.transportation?.description ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transportation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{s.transportation.description}</p>
                  {s.transportation.details?.length ? (
                    <ul className="list-disc list-inside text-sm mt-2">
                      {s.transportation.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {(s.employment?.history?.length || s.employment?.plan?.length) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.employment.history?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">History</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.employment.history.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {s.employment.plan?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">Plan</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.employment.plan.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {(s.future?.goals?.length || s.future?.commitments?.length) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Future plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.future.goals?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">Goals</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.future.goals.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {s.future.commitments?.length ? (
                    <div>
                      <p className="font-medium text-sm mb-1">Commitments</p>
                      <ul className="list-disc list-inside text-sm">
                        {s.future.commitments.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {s.support_letters?.supporters?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Letters of support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {s.support_letters.supporters.map((sup, i) => (
                    <div key={i}>
                      <p className="font-medium text-sm">
                        {sup.name} — {sup.relationship}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{sup.summary}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {s.closing?.paragraphs?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Closing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {s.closing.paragraphs.map((para, i) => (
                    <p key={i} className="text-sm">{para}</p>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}
