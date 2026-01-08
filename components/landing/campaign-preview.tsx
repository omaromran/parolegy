import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  "Campaign Synopsis",
  "Client Letter to Parole Board",
  "Things You Should Know / Strengths",
  "30 | 90 | 180 Day Plan",
  "Home Plan",
  "Transportation Plan",
  "Employment History & Opportunities",
  "Future Plans",
  "Letters of Support",
  "Post-Release Treatment Plan",
  "Closing Page",
]

export function CampaignPreview() {
  return (
    <section className="container py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          What You&apos;ll Produce
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A premium, magazine-style Parole Campaign booklet that is structured, coherent, and addresses what panels need to see.
        </p>
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Campaign Structure</h3>
              <ul className="space-y-2">
                {sections.map((section, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm w-8">{index + 1}.</span>
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Design Features:</strong> Premium typography (Libre Baskerville), intentional layout, thick paper (32lb), tasteful use of photos to humanize, professional quotes and callouts, consistent spacing, 20–40 pages depending on content.
              </p>
            </div>
          </div>
        </Card>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Note: Preview images use mock/redacted data to protect client privacy.
          </p>
        </div>
      </div>
    </section>
  )
}
