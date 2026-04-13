"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone } from "lucide-react"
import { SITE_CONTACT } from "@/lib/site-contact"

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b bg-[hsl(220,18%,8%)] text-[hsl(40,20%,96%)]"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[hsl(40,15%,70%)]">
            Texas parole campaigns · Founded 2017
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem]"
          >
            Life as it was meant to be
          </h1>
          <div className="mx-auto mt-10 max-w-2xl border-l-2 border-[hsl(38,45%,55%)] pl-6 text-left">
            <blockquote className="font-serif text-lg italic leading-relaxed text-[hsl(40,12%,88%)] md:text-xl">
              By the time decision-makers evaluate your loved one, the framework is set. There is no
              ambiguity. The concerns have been met. The transformation has been framed. The premise
              for their release is relevant, positioned as an inevitability.
            </blockquote>
            <p className="mt-4 text-sm font-medium text-[hsl(40,20%,92%)]">
              At Parolegy we don&apos;t hope for the best.{" "}
              <span className="text-[hsl(38,50%,62%)]">We engineer the outcome.</span>
            </p>
          </div>
          <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button size="lg" className="bg-[hsl(38,45%,52%)] text-[hsl(220,18%,8%)] hover:bg-[hsl(38,48%,48%)]" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(40,15%,40%)] bg-transparent text-[hsl(40,20%,96%)] hover:bg-white/10 hover:text-white"
              asChild
            >
              <a href={`tel:${SITE_CONTACT.phoneTel}`}>
                <Phone className="mr-2 h-4 w-4" aria-hidden />
                Call {SITE_CONTACT.phoneDisplay}
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-[hsl(40,15%,75%)] hover:bg-white/5 hover:text-white"
              asChild
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
          <p className="mt-10 text-center text-xs text-[hsl(40,10%,55%)]">
            Parolegy is not a law firm and does not provide legal advice. Parole is discretionary; no
            outcome can be guaranteed.
          </p>
        </div>
      </div>
    </section>
  )
}
