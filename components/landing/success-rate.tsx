import { Card } from "@/components/ui/card"

export function SuccessRate() {
  return (
    <section className="container py-16 md:py-24" aria-labelledby="proven-heading">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 id="proven-heading" className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            Proven results
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Parolegy&apos;s approval rate is approximately{" "}
            <strong className="text-foreground">3× the Texas average</strong>—based on Parolegy
            clients compared to statewide parole approval rates. Methodology available upon request.
          </p>
        </div>
        <Card className="overflow-hidden border-2 p-8 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <p className="font-serif text-5xl font-bold tracking-tight md:text-6xl">~34%</p>
                <p className="mt-1 text-sm text-muted-foreground">Approximate Texas average parole approval rate</p>
              </div>
              <div>
                <p className="font-serif text-5xl font-bold tracking-tight text-primary md:text-6xl">~3×</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Parolegy client experience vs. that statewide baseline*
                </p>
              </div>
            </div>
            <div className="space-y-6" role="img" aria-label="Comparison of Texas average and Parolegy clients">
              <div>
                <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Texas average</span>
                  <span>~34%</span>
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
                  <span>Parolegy clients</span>
                  <span className="text-foreground">Higher approval rate*</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            *Based on Parolegy clients vs. TX average approval rate. Not a guarantee of future results;
            every case depends on individual facts and discretion of the Board.
          </p>
        </Card>
      </div>
    </section>
  )
}
