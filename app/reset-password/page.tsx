"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { useToast } from "@/hooks/use-toast"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset link. Please request a new one.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reset failed')
      }

      toast({
        title: "Password reset",
        description: data.message,
      })
      router.push('/login')
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

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container flex items-center justify-center py-16">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Invalid link</CardTitle>
              <CardDescription>
                This reset link is missing or invalid. Please request a new password reset from the login page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request new link</Link>
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
            <CardTitle className="font-serif text-2xl">Set new password</CardTitle>
            <CardDescription>
              Enter your new password below. It must be at least 8 characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  New password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
