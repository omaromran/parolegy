import { Hero } from "@/components/landing/hero"
import { Approach } from "@/components/landing/approach"
import { HowParoleWorks } from "@/components/landing/how-parole-works"
import { SuccessRate } from "@/components/landing/success-rate"
import { Testimonials } from "@/components/landing/testimonials"
import { ContactStrip } from "@/components/landing/contact-strip"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Approach />
        <HowParoleWorks />
        <SuccessRate />
        <Testimonials />
        <ContactStrip />
      </main>
      <Footer />
    </div>
  )
}
