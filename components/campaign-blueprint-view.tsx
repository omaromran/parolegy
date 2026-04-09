"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type CampaignBlueprint = {
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

export function CampaignBlueprintView({ blueprint }: { blueprint: CampaignBlueprint | null }) {
  if (!blueprint) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No blueprint content to display.
        </CardContent>
      </Card>
    )
  }

  const b = blueprint
  const s = b.sections ?? {}

  return (
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
              <p key={i} className="text-sm">
                {para}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {s.client_letter?.paragraphs?.length || s.client_letter?.salutation ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Letter to the Parole Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {s.client_letter.salutation && <p className="text-sm">{s.client_letter.salutation}</p>}
            {s.client_letter.paragraphs?.map((para, i) => (
              <p key={i} className="text-sm">
                {para}
              </p>
            ))}
            {s.client_letter.closing && <p className="text-sm">{s.client_letter.closing}</p>}
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

      {s.plan_30_90_180?.plan_30?.length ||
      s.plan_30_90_180?.plan_90?.length ||
      s.plan_30_90_180?.plan_180?.length ? (
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

      {s.employment?.history?.length || s.employment?.plan?.length ? (
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

      {s.future?.goals?.length || s.future?.commitments?.length ? (
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
              <p key={i} className="text-sm">
                {para}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
