import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { getMergedSiteBlocks } from "@/lib/site-content"
import { ContactPageClient } from "./contact-client"

export default async function ContactPage() {
  const copy = await getMergedSiteBlocks("contact")
  return (
    <MarketingChrome>
      <ContactPageClient copy={copy} />
    </MarketingChrome>
  )
}
