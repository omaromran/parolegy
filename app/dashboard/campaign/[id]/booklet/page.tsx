"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParoleCampaignBooklet, type BookletDocument } from "@/components/parole-campaign-booklet"
import { normalizeBlueprint } from "@/lib/ai/blueprint-normalizer"
import type { CampaignBlueprint } from "@/lib/ai/openai"

type CampaignDetail = {
  id: string
  caseId: string
  clientName: string
  tdcjNumber: string
  blueprint: CampaignBlueprint | null
}

export default function DashboardCampaignBookletPage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [documents, setDocuments] = useState<BookletDocument[]>([])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/campaigns/${id}`)
        if (!res.ok) throw new Error("Campaign not found")
        const data = await res.json()
        const c = data.campaign as CampaignDetail
        if (cancelled) return
        setCampaign(c)
        const docRes = await fetch(`/api/documents?caseId=${encodeURIComponent(c.caseId)}`)
        if (docRes.ok) {
          const docData = await docRes.json()
          const list = (docData.documents || []) as BookletDocument[]
          if (!cancelled) setDocuments(list)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <p>Loading booklet…</p>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-200 px-4">
        <p className="text-muted-foreground text-center">{error || "Not found"}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/campaign">Parole campaign</Link>
          </Button>
        </div>
      </div>
    )
  }

  const blueprint = normalizeBlueprint(campaign.blueprint)

  return (
    <ParoleCampaignBooklet
      blueprint={blueprint}
      clientName={campaign.clientName}
      tdcjNumber={campaign.tdcjNumber}
      documents={documents}
      documentHref={(docId) => `/api/documents/${docId}/file`}
      backHref="/dashboard/campaign"
      backLabel="← Parole campaign"
      dashboardHref="/dashboard"
      dashboardLabel="Dashboard"
      toolbarTitle="Your parole campaign booklet"
    />
  )
}
