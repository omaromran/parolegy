import Link from "next/link"
import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMergedSiteBlocks } from "@/lib/site-content"

export default async function CheckoutCancelPage() {
  const b = await getMergedSiteBlocks("checkout_cancel")
  const t = (k: string) => b[k] ?? ""

  return (
    <MarketingChrome>
      <main className="flex-1 container flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("desc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/pricing">{t("btn_pricing")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/onboarding">{t("btn_onboarding")}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </MarketingChrome>
  )
}
