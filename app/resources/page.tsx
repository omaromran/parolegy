import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function ResourcesPage() {
  const b = await getMergedSiteBlocks("resources")
  const t = (k: string) => b[k] ?? ""

  const resources = [
    { title: t("r0_title"), desc: t("r0_desc"), comingSoon: false },
    { title: t("r1_title"), desc: t("r1_desc"), comingSoon: false },
    { title: t("r2_title"), desc: t("r2_desc"), comingSoon: false },
    { title: t("r3_title"), desc: t("r3_desc"), comingSoon: false },
  ]

  return (
    <MarketingChrome>
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground mb-12">{t("intro")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  {resource.comingSoon ? (
                    <Button variant="outline" disabled>
                      {t("btn_soon")}
                    </Button>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link href={`/resources/${resource.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        {t("btn_view")}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="font-serif text-2xl font-bold mb-4">{t("templates_heading")}</h2>
            <p className="text-muted-foreground mb-4">{t("templates_p")}</p>
          </div>
        </div>
      </main>
    </MarketingChrome>
  )
}
