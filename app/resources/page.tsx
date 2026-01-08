import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const resources = [
  {
    title: "How to Write Support Letters",
    description: "Guidance on crafting effective support letters that demonstrate credibility and genuine support.",
    comingSoon: false,
  },
  {
    title: "How to Prepare for Unit Parole Officer Interview",
    description: "Tips and strategies for preparing for your unit parole officer interview.",
    comingSoon: false,
  },
  {
    title: "How to Organize Certificates",
    description: "Best practices for organizing and presenting certificates and documentation.",
    comingSoon: false,
  },
  {
    title: "Reentry Basics",
    description: "Essential information about reentry planning, including housing, employment, and support networks.",
    comingSoon: false,
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Resources
          </h1>
          <p className="text-muted-foreground mb-12">
            Helpful guides and templates to support your parole campaign process.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {resource.comingSoon ? (
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link href={`/resources/${resource.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Guide
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="font-serif text-2xl font-bold mb-4">Downloadable Templates</h2>
            <p className="text-muted-foreground mb-4">
              Templates and examples will be available here. Check back soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
