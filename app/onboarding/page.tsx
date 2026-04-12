"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim()

export default function OnboardingPage() {
  const { user, isLoading } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Welcome to Parolegy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete these steps to unlock your dashboard and start your parole campaign.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">1. Optional consultation</CardTitle>
            <CardDescription>
              Book a short call if you would like to talk through the process first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calendlyUrl ? (
              <Button variant="outline" asChild>
                <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                  Schedule a call
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Consultation scheduling will appear here when configured. You can continue
                to payment anytime.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">2. Payment</CardTitle>
            <CardDescription>
              One plan — secure checkout with Stripe. After payment you will have full
              dashboard access.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/pricing">Go to pricing &amp; pay</Link>
            </Button>
            {isLoading ? null : user &&
              (user.role === "CLIENT" || user.role === "FAMILY") &&
              user.hasPaidAccess ? (
              <Button variant="secondary" asChild>
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">3. Verify your email</CardTitle>
            <CardDescription>
              Check your inbox for a verification link so we can reach you about your case.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : user?.emailVerified ? (
              <p className="text-sm text-green-700 dark:text-green-400">
                Your email is verified.
              </p>
            ) : user ? (
              <p className="text-sm text-muted-foreground">
                We sent a link to <span className="font-medium text-foreground">{user.email}</span>.
                Didn&apos;t get it? Check spam or sign up again with care — links expire in 48 hours.
              </p>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/signup">Create an account</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
