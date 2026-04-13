"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const P = SITE_PAGE_DEFAULTS.pricing as Record<string, string>

function pt(copy: Record<string, string>, key: string): string {
  return copy[key] ?? P[key] ?? ""
}

const priceLabel =
  process.env.NEXT_PUBLIC_PRODUCT_PRICE_LABEL?.trim() || "One-time package"

const featureKeys = ["feature_0", "feature_1", "feature_2", "feature_3"] as const

export function PricingPageClient({ copy }: { copy: Record<string, string> }) {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const startCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Could not start checkout")
      }
      if (data.url) {
        window.location.href = data.url as string
        return
      }
      throw new Error("No checkout URL returned")
    } catch (e: unknown) {
      toast({
        title: "Checkout",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <main className="flex-1 container py-16 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">{pt(copy, "card_title")}</CardTitle>
          <CardDescription>{pt(copy, "card_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-3xl font-serif font-semibold tracking-tight">{priceLabel}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {featureKeys.map((key) => (
              <li key={key} className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                <span>{pt(copy, key)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">{pt(copy, "stripe_note")}</p>
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-md bg-muted" />
          ) : user && (user.role === "CLIENT" || user.role === "FAMILY") ? (
            user.hasPaidAccess ? (
              <Button className="w-full" size="lg" asChild>
                <Link href="/dashboard">{pt(copy, "btn_dashboard")}</Link>
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={() => startCheckout()}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? pt(copy, "btn_checkout_loading") : pt(copy, "btn_checkout")}
              </Button>
            )
          ) : (
            <Button className="w-full" size="lg" asChild>
              <Link href="/signup">{pt(copy, "btn_signup")}</Link>
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/onboarding" className="underline hover:text-foreground">
              {pt(copy, "link_onboarding")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
