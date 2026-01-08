"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "Parolegy helped us create a campaign that truly represented my brother's transformation. The attention to detail and understanding of what panels need to see made all the difference.",
    author: "Family Member",
    rating: 5,
  },
  {
    quote: "The team at Parolegy understood our situation and helped us present our case professionally. We're grateful for their expertise and compassion.",
    author: "Family Member",
    rating: 5,
  },
  {
    quote: "Working with Parolegy gave us confidence that we were presenting the best possible case. Their guidance through the process was invaluable.",
    author: "Family Member",
    rating: 5,
  },
  {
    quote: "The campaign booklet they created was professional and comprehensive. It addressed all the concerns we were worried about.",
    author: "Family Member",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          What Families Say
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Real feedback from families who have worked with Parolegy.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <p className="text-sm font-medium">— {testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/testimonials">Read More Testimonials</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
