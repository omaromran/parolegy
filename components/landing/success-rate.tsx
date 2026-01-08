import { Card, CardContent } from "@/components/ui/card"

export function SuccessRate() {
  return (
    <section className="container py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Proven Results
          </h2>
          <p className="text-muted-foreground">
            Parolegy&apos;s approval rate is approximately 3x the Texas average
          </p>
        </div>
        <Card className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-6xl font-bold mb-2">~34%</div>
              <p className="text-muted-foreground mb-6">Texas average parole approval rate</p>
              <div className="text-6xl font-bold mb-2">~3x</div>
              <p className="text-muted-foreground">Parolegy client approval rate*</p>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-primary/20 rounded flex items-center px-4">
                <div className="h-full bg-primary rounded" style={{ width: '34%' }}></div>
                <span className="ml-4 text-sm">Texas Average</span>
              </div>
              <div className="h-8 bg-primary rounded flex items-center px-4">
                <span className="text-white font-semibold">Parolegy Clients</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            *Based on Parolegy clients vs. TX average approval rate. Methodology available upon request.
          </p>
        </Card>
      </div>
    </section>
  )
}
