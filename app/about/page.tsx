import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            About Parolegy
          </h1>
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Parolegy was founded in 2017 by Ebonie Conner with a mission to help parole-eligible incarcerated people and their families create high-quality Parole Campaign booklets that improve parole approval outcomes in Texas.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We believe in second chances and the power of time restored to families. Our work is rooted in compassion, professionalism, and a deep understanding of what parole panels need to see.
              </p>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">What is a Parole Campaign?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Parole Campaign is fundamentally different from a traditional &quot;packet.&quot; While many people submit unedited materials with generic cover letters, a Parole Campaign is:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4 ml-4">
                <li>Premium and visually engaging, printed on thick paper (32lb) with intentional fonts and layout</li>
                <li>Structured and coherent, addressing public safety concerns, remorse, accountability, rehabilitation, reentry plan, and supporter credibility</li>
                <li>Designed for impact in the 7–10 minutes panel members spend reviewing each case</li>
                <li>Created through narrative engineering, behavior/linguistic analytics, psychology, reentry planning, and strong graphic design</li>
              </ul>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">Our Approach</h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compassionate</CardTitle>
                    <CardDescription>
                      We understand this is a difficult time for families. Our approach is non-judgmental and empowering.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>
                      We maintain the highest standards of quality, ethics, and accuracy in everything we create.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Data-Driven</CardTitle>
                    <CardDescription>
                      Our methods are informed by years of experience and understanding of what works with parole panels.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Results-Focused</CardTitle>
                    <CardDescription>
                      We measure success by helping families present their best case and improve outcomes.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
