import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { Card, CardContent } from "@/components/ui/card"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function TestimonialsPage() {
  const b = await getMergedSiteBlocks("testimonials_page")
  const t = (k: string) => b[k] ?? ""

  const testimonials = [0, 1, 2, 3, 4, 5].map((i) => ({
    quote: t(`t${i}_quote`),
    author: t(`t${i}_author`),
    category: t(`t${i}_category`),
    rating: 5,
  }))

  return (
    <MarketingChrome>
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">{t("title")}</h1>
          <p className="text-center text-muted-foreground mb-12">{t("subtitle")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
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
    </MarketingChrome>
  )
}
