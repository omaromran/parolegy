import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const points = [
  {
    title: "Parole is a privilege",
    description:
      "Not a right. Texas parole is discretionary, determined through administrative review—not a courtroom hearing where you argue live before a judge.",
  },
  {
    title: "Minutes, not hours",
    description:
      "Panel members may spend roughly 7–10 minutes with each file. Your written packet and campaign narrative have to work immediately—there is little room for buried context.",
  },
  {
    title: "What they actually read",
    description:
      "DA summaries, victim impact materials, criminal history, TDCJ conduct and programming, indicators of support—and any parole packet or campaign your team submits.",
  },
  {
    title: "Your written case is the hearing",
    description:
      "Without a traditional hearing, your documents are often the clearest statement of accountability, stability, and plan. That is where Parolegy concentrates the work.",
  },
]

export function HowParoleWorks() {
  return (
    <section
      className="border-y bg-muted/40 py-16 md:py-24"
      aria-labelledby="how-parole-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <h2
            id="how-parole-heading"
            className="text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            How parole review works in Texas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            When you understand the constraints families are working inside, it is easier to see why
            preparation, framing, and documentation matter as much as they do.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {points.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
