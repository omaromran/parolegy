import { Hero } from "@/components/landing/hero"
import { HowParoleWorks } from "@/components/landing/how-parole-works"
import { WhyParolegyWorks } from "@/components/landing/why-parolegy-works"
import { SuccessRate } from "@/components/landing/success-rate"
import { Services } from "@/components/landing/services"
import { CampaignPreview } from "@/components/landing/campaign-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowParoleWorks />
        <WhyParolegyWorks />
        <SuccessRate />
        <Services />
        <CampaignPreview />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
