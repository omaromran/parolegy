"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"

const priceLabel =
  process.env.NEXT_PUBLIC_PRODUCT_PRICE_LABEL?.trim() || "One-time package"

export default function PricingPage() {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Parole campaign access</CardTitle>
            <CardDescription>
              Single plan — full self-serve workflow: assessment, uploads, and your
              campaign narrative on the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-3xl font-serif font-semibold tracking-tight">
              {priceLabel}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Guided parole readiness assessment",
                "Secure document uploads",
                "AI-assisted campaign narrative, reviewed by our team",
                "Dashboard access for you and your family",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Secure payment processed by Stripe. You will receive a confirmation email
              after payment.
            </p>
            {isLoading ? (
              <div className="h-10 animate-pulse rounded-md bg-muted" />
            ) : user &&
              (user.role === "CLIENT" || user.role === "FAMILY") ? (
              user.hasPaidAccess ? (
                <Button className="w-full" size="lg" asChild>
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => startCheckout()}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Redirecting…" : "Pay with Stripe"}
                </Button>
              )
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link href="/signup">Create an account to continue</Link>
              </Button>
            )}
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/onboarding" className="underline hover:text-foreground">
                Back to onboarding
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
