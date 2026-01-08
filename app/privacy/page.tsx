import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">
            Privacy Policy
          </h1>
          <Card className="p-8">
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-muted-foreground">
                  Parolegy is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Account information (name, email, password)</li>
                  <li>Case information (client name, TDCJ number, assessment responses)</li>
                  <li>Documents and files you upload</li>
                  <li>Communication records</li>
                </ul>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Create and manage your parole campaign</li>
                  <li>Generate campaign materials using AI</li>
                  <li>Provide customer support</li>
                  <li>Improve our services</li>
                </ul>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your data, including encryption at rest and in transit, access controls, and audit logging.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Data Retention</h2>
                <p className="text-muted-foreground">
                  You can request deletion of your data at any time. We will retain data as necessary to comply with legal obligations or resolve disputes.
                </p>
              </section>
              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at ebonie@parolegy.com
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
