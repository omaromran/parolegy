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

export default function AdminCampaignBookletPage() {
  const params = useParams()
  const caseId = params.id as string
  const campaignId = params.campaignId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [documents, setDocuments] = useState<BookletDocument[]>([])

  useEffect(() => {
    if (!campaignId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/campaigns/${campaignId}`)
        if (!res.ok) throw new Error("Campaign not found")
        const data = await res.json()
        const c = data.campaign as CampaignDetail
        if (cancelled) return
        if (c.caseId !== caseId) {
          setError("Campaign does not belong to this case")
          setLoading(false)
          return
        }
        setCampaign(c)
        const caseRes = await fetch(`/api/admin/cases/${caseId}`)
        if (caseRes.ok) {
          const caseData = await caseRes.json()
          const docs = (caseData.case?.documents || []) as BookletDocument[]
          if (!cancelled) setDocuments(docs)
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
  }, [campaignId, caseId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <p>Loading booklet…</p>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-200">
        <p className="text-muted-foreground">{error || "Not found"}</p>
        <Button asChild>
          <Link href={`/admin/cases/${caseId}/campaign/${campaignId}/narrative`}>
            Back to narrative
          </Link>
        </Button>
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
      backHref={`/admin/cases/${caseId}/campaign/${campaignId}/narrative`}
      toolbarTitle="Parole campaign booklet (admin preview)"
    />
  )
}
