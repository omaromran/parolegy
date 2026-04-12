"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/** Legacy URL: account types are no longer selected at signup. */
export default function ChooseTierRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/onboarding")
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  )
}
