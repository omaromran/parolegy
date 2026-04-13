import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { getMergedSiteBlocks } from "@/lib/site-content"
import { SignupForm } from "./signup-form"

export default async function SignupPage() {
  const copy = await getMergedSiteBlocks("signup")
  return (
    <MarketingChrome>
      <SignupForm copy={copy} />
    </MarketingChrome>
  )
}
