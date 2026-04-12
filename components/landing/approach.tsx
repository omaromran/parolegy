import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const pillars = [
  {
    title: "Clarity before the review",
    description:
      "We help frame how the case is understood—so risk, progress, and release readiness are communicated with precision, not left to assumption.",
  },
  {
    title: "Reduce ambiguity",
    description:
      "Discretionary parole means decision-makers act on what they see in the file. We focus on materials and narrative that reduce perceived risk and strengthen confidence in a safe plan.",
  },
  {
    title: "Advantage engineering",
    description:
      "This is not outcome assurance—it is disciplined preparation: positioning, documentation, and support that align with how Texas parole review actually works.",
  },
]

export function Approach() {
  return (
    <section className="container py-16 md:py-24" aria-labelledby="approach-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="approach-heading" className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            Built for how Texas parole is decided
          </h2>
          <p className="mt-4 text-muted-foreground">
            Families engage Parolegy because we increase decision-maker confidence by reducing perceived
            risk and ambiguity—while staying honest about what no one can guarantee.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title} className="border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{p.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{p.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
