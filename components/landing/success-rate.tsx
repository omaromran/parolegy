import { Card } from "@/components/ui/card"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const H = SITE_PAGE_DEFAULTS.home as Record<string, string>

function ht(copy: Record<string, string> | undefined, key: string): string {
  return copy?.[key] ?? H[key] ?? ""
}

type Props = { copy?: Record<string, string> }

export function SuccessRate({ copy }: Props) {
  return (
    <section className="container py-16 md:py-24" aria-labelledby="proven-heading">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 id="proven-heading" className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            {ht(copy, "success_heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {ht(copy, "success_intro_a")}
            <strong className="text-foreground">{ht(copy, "success_intro_bold")}</strong>
            {ht(copy, "success_intro_b")}
          </p>
        </div>
        <Card className="overflow-hidden border-2 p-8 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <p className="font-serif text-5xl font-bold tracking-tight md:text-6xl">{ht(copy, "success_stat_tx")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{ht(copy, "success_stat_tx_label")}</p>
              </div>
              <div>
                <p className="font-serif text-5xl font-bold tracking-tight text-primary md:text-6xl">
                  {ht(copy, "success_stat_ratio")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{ht(copy, "success_stat_ratio_label")}</p>
              </div>
            </div>
            <div className="space-y-6" role="img" aria-label="Comparison of Texas average and Parolegy clients">
              <div>
                <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{ht(copy, "success_bar_tx")}</span>
                  <span>{ht(copy, "success_stat_tx")}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-muted-foreground/35"
                    style={{ width: "34%" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{ht(copy, "success_bar_client")}</span>
                  <span className="text-foreground">{ht(copy, "success_bar_client_cap")}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">{ht(copy, "success_footnote")}</p>
        </Card>
      </div>
    </section>
  )
}
