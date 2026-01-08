import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HowParoleWorks() {
  return (
    <section className="container py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          How Parole Works in Texas
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Understanding the process helps you prepare effectively.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Parole is a Privilege</CardTitle>
              <CardDescription>
                Not a right. Texas parole is discretionary, determined by a review process—not a court hearing.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>7–10 Minutes Per Case</CardTitle>
              <CardDescription>
                Panel members spend approximately 7–10 minutes reviewing each case. Your written materials must make an immediate impact.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What They Review</CardTitle>
              <CardDescription>
                DA offense info, victim impact statements, criminal history, TDCJ conduct/programming, support network indicators, and any packet/campaign submitted.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Focus on Written Material</CardTitle>
              <CardDescription>
                Since there&apos;s no hearing, your campaign booklet is your primary opportunity to demonstrate readiness, accountability, and a safe reentry plan.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
