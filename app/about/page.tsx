import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function AboutPage() {
  const b = await getMergedSiteBlocks("about")
  const t = (k: string) => b[k] ?? ""

  const campaignList = [t("campaign_li_0"), t("campaign_li_1"), t("campaign_li_2"), t("campaign_li_3")]

  return (
    <MarketingChrome>
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{t("title")}</h1>
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">{t("story_heading")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("story_p1")}</p>
              <p className="text-muted-foreground leading-relaxed mt-4">{t("story_p2")}</p>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">{t("campaign_heading")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("campaign_p1")}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4 ml-4">
                {campaignList.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">{t("approach_section_heading")}</h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("card_compassion_title")}</CardTitle>
                    <CardDescription>{t("card_compassion_desc")}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("card_professional_title")}</CardTitle>
                    <CardDescription>{t("card_professional_desc")}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("card_data_title")}</CardTitle>
                    <CardDescription>{t("card_data_desc")}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("card_results_title")}</CardTitle>
                    <CardDescription>{t("card_results_desc")}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
    </MarketingChrome>
  )
}
