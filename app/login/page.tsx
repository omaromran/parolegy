import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { getMergedSiteBlocks } from "@/lib/site-content"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  const copy = await getMergedSiteBlocks("login")
  return (
    <MarketingChrome>
      <LoginForm copy={copy} />
    </MarketingChrome>
  )
}
