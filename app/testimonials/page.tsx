import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote: "Parolegy helped us create a campaign that truly represented my brother's transformation. The attention to detail and understanding of what panels need to see made all the difference.",
    author: "Family Member",
    category: "Family",
    rating: 5,
  },
  {
    quote: "The team at Parolegy understood our situation and helped us present our case professionally. We&apos;re grateful for their expertise and compassion.",
    author: "Family Member",
    category: "Family",
    rating: 5,
  },
  {
    quote: "Working with Parolegy gave us confidence that we were presenting the best possible case. Their guidance through the process was invaluable.",
    author: "Family Member",
    category: "Family",
    rating: 5,
  },
  {
    quote: "The campaign booklet they created was professional and comprehensive. It addressed all the concerns we were worried about.",
    author: "Family Member",
    category: "Family",
    rating: 5,
  },
  {
    quote: "Professional, responsive, and truly caring. They made a difficult process much more manageable.",
    author: "Family Member",
    category: "Professionalism",
    rating: 5,
  },
  {
    quote: "Communication was excellent throughout. They kept us informed and answered all our questions promptly.",
    author: "Family Member",
    category: "Communication",
    rating: 5,
  },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
            Testimonials
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Real feedback from families who have worked with Parolegy.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">— {testimonial.author}</p>
                    <span className="text-xs text-muted-foreground">{testimonial.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
