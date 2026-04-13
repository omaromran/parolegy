import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const H = SITE_PAGE_DEFAULTS.home as Record<string, string>

function ht(copy: Record<string, string> | undefined, key: string): string {
  return copy?.[key] ?? H[key] ?? ""
}

const pillarKeys = [
  { title: "approach_0_title", desc: "approach_0_desc" },
  { title: "approach_1_title", desc: "approach_1_desc" },
  { title: "approach_2_title", desc: "approach_2_desc" },
] as const

type Props = { copy?: Record<string, string> }

export function Approach({ copy }: Props) {
  return (
    <section className="container py-16 md:py-24" aria-labelledby="approach-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="approach-heading" className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            {ht(copy, "approach_heading")}
          </h2>
          <p className="mt-4 text-muted-foreground">{ht(copy, "approach_sub")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillarKeys.map((p) => (
            <Card key={p.title} className="border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{ht(copy, p.title)}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{ht(copy, p.desc)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
