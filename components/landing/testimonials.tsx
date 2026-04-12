"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote:
      "They understand the Texas Board of Pardons and Paroles in depth—what the process expects and how to prepare. We felt guided instead of overwhelmed.",
    author: "Family member",
  },
  {
    quote:
      "Professional, clear, and patient when other places had rushed us off the phone. For the first time we understood what would actually help our loved one’s file.",
    author: "Family member",
  },
  {
    quote:
      "Navigating parole is isolating. Having a team that treated our family with respect—and knew the details that matter in review—made the difference for us.",
    author: "Family member",
  },
]

export function Testimonials() {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24" aria-labelledby="testimonials-heading">
      <div className="container mx-auto max-w-6xl">
        <h2 id="testimonials-heading" className="text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
          What families say
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Many families prefer private thank-you notes to public posts—we respect that. When people do
          share publicly, their stories often focus on clarity, responsiveness, and how it felt to have
          experienced help with a discretionary process.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.author + t.quote.slice(0, 24)}>
              <CardContent className="pt-6">
                <blockquote className="text-base leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-medium text-muted-foreground">— {t.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link href="/testimonials">More testimonials</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
