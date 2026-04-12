import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Checkout cancelled</CardTitle>
            <CardDescription>
              No charge was made. You can return to pricing whenever you are ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/pricing">Back to pricing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/onboarding">Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
