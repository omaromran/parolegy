import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">
            Terms of Service
          </h1>
          <Card className="p-8">
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By using Parolegy, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Service Description</h2>
                <p className="text-muted-foreground">
                  Parolegy provides tools and services to help create parole campaign materials. We are not a law firm and do not provide legal advice.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">User Responsibilities</h2>
                <p className="text-muted-foreground">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Providing accurate and truthful information</li>
                  <li>Not fabricating facts, credentials, or certificates</li>
                  <li>Obtaining consent before uploading third-party materials</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">No Guarantees</h2>
                <p className="text-muted-foreground">
                  Parole is discretionary, and results are not guaranteed. Parolegy does not guarantee parole approval or any specific outcome.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Parolegy shall not be liable for any indirect, incidental, special, or consequential damages arising from use of our services.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about these Terms, please contact us at ebonie@parolegy.com
                </p>
              </section>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
