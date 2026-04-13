import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const H = SITE_PAGE_DEFAULTS.home as Record<string, string>

function ht(copy: Record<string, string> | undefined, key: string): string {
  return copy?.[key] ?? H[key] ?? ""
}

const pointKeys = [
  { title: "how_0_title", desc: "how_0_desc" },
  { title: "how_1_title", desc: "how_1_desc" },
  { title: "how_2_title", desc: "how_2_desc" },
  { title: "how_3_title", desc: "how_3_desc" },
] as const

type Props = { copy?: Record<string, string> }

export function HowParoleWorks({ copy }: Props) {
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
            {ht(copy, "how_heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{ht(copy, "how_sub")}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {pointKeys.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{ht(copy, item.title)}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{ht(copy, item.desc)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
