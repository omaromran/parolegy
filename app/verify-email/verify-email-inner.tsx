"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function VerifyEmailInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<"idle" | "loading" | "ok" | "bad">("idle")

  useEffect(() => {
    if (!token) {
      setState("bad")
      return
    }
    setState("loading")
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => {
        setState(res.ok ? "ok" : "bad")
      })
      .catch(() => setState("bad"))
  }, [token])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Email verification</CardTitle>
        <CardDescription>
          {state === "loading" && "Confirming your email…"}
          {state === "ok" && "Your email is verified. You can continue to onboarding or log in."}
          {state === "bad" &&
            "This link is invalid or has expired. Request a new account or contact support if you need help."}
          {state === "idle" && "Preparing…"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {state === "ok" ? (
          <>
            <Button asChild>
              <Link href="/onboarding">Continue</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </>
        ) : state === "bad" ? (
          <Button asChild>
            <Link href="/signup">Create account</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
