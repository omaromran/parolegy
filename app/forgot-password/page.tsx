"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setDevResetUrl(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setSent(true)
      if (data.resetUrl) setDevResetUrl(data.resetUrl)

      toast({
        title: "Check your email",
        description: data.message,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container flex items-center justify-center py-16">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Check your email</CardTitle>
              <CardDescription>
                If an account exists with that email, we&apos;ve sent a password reset link. It expires in 1 hour.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {devResetUrl && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium text-muted-foreground mb-1">Development: use this link</p>
                  <Link
                    href={devResetUrl}
                    className="text-primary break-all hover:underline"
                  >
                    {devResetUrl}
                  </Link>
                </div>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Back to Log In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Forgot password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Back to Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
