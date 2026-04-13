import { Hero } from "@/components/landing/hero"
import { Approach } from "@/components/landing/approach"
import { HowParoleWorks } from "@/components/landing/how-parole-works"
import { SuccessRate } from "@/components/landing/success-rate"
import { Testimonials } from "@/components/landing/testimonials"
import { ContactStrip } from "@/components/landing/contact-strip"
import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function HomePage() {
  const home = await getMergedSiteBlocks("home")
  return (
    <MarketingChrome>
      <main className="flex-1">
        <Hero copy={home} />
        <Approach copy={home} />
        <HowParoleWorks copy={home} />
        <SuccessRate copy={home} />
        <Testimonials copy={home} />
        <ContactStrip copy={home} />
      </main>
    </MarketingChrome>
  )
}
