"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Present your plan, not your past.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
          Make plans, make progress, make parole.
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Parole campaign creation that helps demonstrate readiness, rehabilitation, and a safe reentry plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Talk to a Parolegist</Link>
          </Button>
        </div>
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Founded 2017 • Texas-focused • Unlimited cycles (Option 1) • Bilingual output
          </p>
        </div>
      </div>
    </section>
  )
}
