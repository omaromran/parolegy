"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const H = SITE_PAGE_DEFAULTS.home as Record<string, string>

function ht(copy: Record<string, string> | undefined, key: string): string {
  return copy?.[key] ?? H[key] ?? ""
}

const items = [
  { quote: "testimonial_0_quote", author: "testimonial_0_author" },
  { quote: "testimonial_1_quote", author: "testimonial_1_author" },
  { quote: "testimonial_2_quote", author: "testimonial_2_author" },
] as const

type Props = { copy?: Record<string, string> }

export function Testimonials({ copy }: Props) {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24" aria-labelledby="testimonials-heading">
      <div className="container mx-auto max-w-6xl">
        <h2 id="testimonials-heading" className="text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
          {ht(copy, "testimonials_heading")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{ht(copy, "testimonials_sub")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.quote}>
              <CardContent className="pt-6">
                <blockquote className="text-base leading-relaxed text-foreground">
                  &ldquo;{ht(copy, t.quote)}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-medium text-muted-foreground">— {ht(copy, t.author)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link href="/testimonials">{ht(copy, "testimonials_more")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
