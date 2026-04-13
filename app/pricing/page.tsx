import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { getMergedSiteBlocks } from "@/lib/site-content"
import { PricingPageClient } from "./pricing-client"

export default async function PricingPage() {
  const copy = await getMergedSiteBlocks("pricing")
  return (
    <MarketingChrome>
      <PricingPageClient copy={copy} />
    </MarketingChrome>
  )
}
