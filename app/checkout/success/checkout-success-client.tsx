"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CheckoutSuccessClient() {
  const router = useRouter()
  const [status, setStatus] = useState<"working" | "done" | "error">("working")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" })
        if (!res.ok) throw new Error("refresh failed")
        if (!cancelled) {
          setStatus("done")
          router.replace("/dashboard")
        }
      } catch {
        if (!cancelled) setStatus("error")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="flex-1 container flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Payment successful</CardTitle>
          <CardDescription>
            {status === "working" && "Updating your account…"}
            {status === "done" && "Redirecting to your dashboard…"}
            {status === "error" &&
              "Your payment went through, but we could not refresh your session. Sign in again or open the dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {status === "error" ? (
            <>
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}
