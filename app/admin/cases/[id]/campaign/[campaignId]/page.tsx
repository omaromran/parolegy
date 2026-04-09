import { redirect } from "next/navigation"

export default function AdminCampaignBlueprintRedirectPage({
  params,
}: {
  params: { id: string; campaignId: string }
}) {
  redirect(
    `/admin/cases/${params.id}/campaign/${params.campaignId}/narrative`
  )
}
