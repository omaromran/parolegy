import { Suspense } from "react"
import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { VerifyEmailInner } from "./verify-email-inner"

export default async function VerifyEmailPage() {
  return (
    <MarketingChrome>
      <main className="flex-1 container flex items-center justify-center py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-lg border bg-card p-6 text-sm text-muted-foreground">
              Loading…
            </div>
          }
        >
          <VerifyEmailInner />
        </Suspense>
      </main>
    </MarketingChrome>
  )
}
