import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const pillars = [
  {
    title: "Narrative Engineering",
    description: "We help structure your story to address panel concerns while highlighting genuine transformation and accountability.",
  },
  {
    title: "Psychology & Behavior Analytics",
    description: "Understanding what resonates with parole panels based on years of experience and data.",
  },
  {
    title: "Premium Design",
    description: "A visually engaging, magazine-style campaign—not a messy packet. Printed on thick paper (32lb) with intentional fonts and layout.",
  },
  {
    title: "Reentry Planning",
    description: "Concrete, credible plans for housing, employment, transportation, and support networks that demonstrate readiness.",
  },
  {
    title: "Supporter Credibility",
    description: "Coaching on support letters and ensuring your network is presented effectively.",
  },
]

export function WhyParolegyWorks() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Why Parolegy Works
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our approach combines narrative engineering, psychology, design, and reentry planning to create campaigns that address public safety concerns, remorse, accountability, rehabilitation, and supporter credibility.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>What makes us different:</strong> Most people do nothing, DIY a homemade packet, or pay attorneys who often submit unedited materials with a generic cover letter, producing low-quality and low-impact packets. Parolegy delivers a premium, structured, coherent campaign that addresses what panels need to see.
          </p>
        </div>
      </div>
    </section>
  )
}
