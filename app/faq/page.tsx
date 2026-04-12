import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PAROLEGY_FAQ, type FaqBlock } from "@/lib/faq-parolegy"
import { SITE_CONTACT } from "@/lib/site-contact"

export const metadata: Metadata = {
  title: "FAQ | Parolegy",
  description:
    "Frequently asked questions about Parolegy’s parole campaign services, fees, consultations, paperwork, and the Texas parole process.",
}

function FaqBlockView({ block }: { block: FaqBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{block.text}</p>
      )
    case "list":
      if (block.ordered) {
        return (
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        )
      }
      return (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case "note":
      return (
        <p className="border-l-2 border-primary/40 bg-muted/50 py-3 pl-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <span className="font-semibold text-foreground">Note: </span>
          {block.text}
        </p>
      )
    default:
      return null
  }
}

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="border-b bg-muted/30 py-12 md:py-16">
          <div className="container max-w-3xl">
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-muted-foreground">
              If you cannot find an answer here, call{" "}
              <a href={`tel:${SITE_CONTACT.phoneTel}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                {SITE_CONTACT.phoneDisplay}
              </a>{" "}
              and press 0, or email{" "}
              <a
                href={`mailto:${SITE_CONTACT.emailPrimary}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_CONTACT.emailPrimary}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 md:py-16">
          <div className="divide-y rounded-lg border bg-card">
            {PAROLEGY_FAQ.map((item) => (
              <details
                key={item.id}
                id={item.id}
                className="group px-4 py-2 md:px-6 md:py-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none py-4 font-serif text-lg font-semibold text-foreground pr-8 transition-colors hover:text-primary md:text-xl">
                  {item.question}
                </summary>
                <div className="space-y-4 border-t border-border/60 pb-6 pt-4">
                  {item.blocks.map((block, i) => (
                    <FaqBlockView key={i} block={block} />
                  ))}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Ready to talk?{" "}
            <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
              Contact Parolegy
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              create an account
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
