import { Suspense } from "react"
import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { ResetPasswordForm } from "./reset-password-form"

export default async function ResetPasswordPage() {
  return (
    <MarketingChrome>
      <Suspense
        fallback={
          <main className="flex-1 flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </main>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </MarketingChrome>
  )
}
