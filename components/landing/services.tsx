"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const services = [
  {
    name: "White-Glove \"Done For You\"",
    option: 1,
    price: "Contact for pricing",
    description: "Family + incarcerated client provide info and uploads, Parolegy team handles everything.",
    features: [
      "Unlimited review cycles until approval",
      "Intake + assessment + narrative engineering",
      "Campaign booklet design + reentry guide",
      "Support letters coaching",
      "Interview prep guidance",
      "Ongoing iteration per review cycle",
    ],
    cta: "Schedule Consultation",
  },
  {
    name: "Hybrid \"Self-Serve + Consultation + Team Review\"",
    option: 2,
    price: "Contact for pricing",
    description: "Client/family create account, complete guided assessment wizard, upload docs/photos.",
    features: [
      "Schedule call with Ebonie/team (built-in scheduling)",
      "AI pre-builds a draft campaign",
      "Team reviews/edits, then generates final",
      "Reentry guide included",
      "Video guidance at each step",
    ],
    cta: "Get Started",
  },
  {
    name: "Self-Serve \"AI Campaign Generator\"",
    option: 3,
    price: "Contact for pricing",
    description: "Client/family create account, complete wizard, upload docs/photos, click Generate.",
    features: [
      "AI produces campaign booklet + reentry guide automatically",
      "Step-by-step video guidance",
      "Optional paid add-on \"Team Review\"",
    ],
    cta: "Get Started",
  },
]

export function Services() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Choose Your Service Option
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Three ways to create your Parole Campaign, from full-service to self-serve.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.option} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <div className="mt-4 text-2xl font-bold">{service.price}</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/signup?option=${service.option}`}>{service.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
