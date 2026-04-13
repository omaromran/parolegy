import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { Card, CardContent } from "@/components/ui/card"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function TermsPage() {
  const b = await getMergedSiteBlocks("terms")
  const t = (k: string) => b[k] ?? ""
  const s3Items = [t("s3_li_0"), t("s3_li_1"), t("s3_li_2"), t("s3_li_3")]

  return (
    <MarketingChrome>
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">{t("title")}</h1>
          <Card className="p-8">
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s1_h")}</h2>
                <p className="text-muted-foreground">{t("s1_p")}</p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s2_h")}</h2>
                <p className="text-muted-foreground">{t("s2_p")}</p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s3_h")}</h2>
                <p className="text-muted-foreground">{t("s3_p")}</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  {s3Items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s4_h")}</h2>
                <p className="text-muted-foreground">{t("s4_p")}</p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s5_h")}</h2>
                <p className="text-muted-foreground">{t("s5_p")}</p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">{t("s6_h")}</h2>
                <p className="text-muted-foreground">{t("s6_p")}</p>
              </section>
            </div>
          </Card>
        </div>
      </main>
    </MarketingChrome>
  )
}
