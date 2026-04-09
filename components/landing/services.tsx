"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const pillars = [
  {
    title: "You submit the facts",
    description:
      "Create an account as the incarcerated person or a family member. Complete the assessment and upload documents—no campaign is generated on your side.",
    features: [
      "Guided assessment aligned to parole review",
      "Support letters, photos, and records in one place",
      "Staff are notified when you submit",
    ],
  },
  {
    title: "Parolegy builds the campaign",
    description:
      "Our team uses your materials and the Knowledge hub to draft the parole campaign narrative. You do not self-generate the campaign.",
    features: [
      "Structured narrative aligned to Texas review expectations",
      "Iterates with staff until the draft is ready",
      "Print-ready booklet when that feature is enabled",
    ],
  },
  {
    title: "Published when ready",
    description:
      "When the draft meets your expectations, staff publish it from the admin portal. Then it becomes visible to you and your family in the dashboard.",
    features: [
      "Clear visibility only after staff publish",
      "Blueprint and narrative access for approved versions",
    ],
  },
]

export function Services() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Submit your information; Parolegy staff prepare and publish your parole campaign—you do not
          generate it yourself.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Card key={p.title} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {p.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup">Create account</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
