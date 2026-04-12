import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import { SITE_CONTACT, mapsUrlOffice } from "@/lib/site-contact"

export function ContactStrip() {
  return (
    <section
      className="border-t bg-[hsl(220,16%,12%)] py-16 text-[hsl(40,18%,95%)] md:py-20"
      aria-labelledby="contact-strip-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <h2 id="contact-strip-heading" className="font-serif text-3xl font-bold md:text-4xl">
            Start with a conversation
          </h2>
          <p className="mt-3 max-w-2xl text-[hsl(40,12%,78%)]">
            There is no fee for the initial assessment call. It is a focused conversation to understand
            the conviction, where the case sits in the parole process, prior outcomes, and whether
            Parolegy is the right fit. We do not provide legal advice, promises, or predictions—only an
            honest read of how the situation is likely being viewed.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(38,48%,58%)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(40,12%,70%)]">
                  Phone
                </p>
                <a
                  href={`tel:${SITE_CONTACT.phoneTel}`}
                  className="mt-1 block text-lg font-medium hover:underline"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
                <p className="mt-1 text-sm text-[hsl(40,10%,65%)]">Press 0 for a live representative</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(38,48%,58%)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(40,12%,70%)]">
                  Email
                </p>
                <a
                  href={`mailto:${SITE_CONTACT.emailPrimary}`}
                  className="mt-1 block text-lg font-medium hover:underline"
                >
                  {SITE_CONTACT.emailPrimary}
                </a>
                <p className="mt-1 text-sm text-[hsl(40,10%,65%)]">{SITE_CONTACT.hours}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(38,48%,58%)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(40,12%,70%)]">
                  Office
                </p>
                <address className="mt-1 not-italic text-sm leading-relaxed text-[hsl(40,15%,88%)]">
                  {SITE_CONTACT.office.street}
                  <br />
                  {SITE_CONTACT.office.cityStateZip}
                </address>
                <a
                  href={mapsUrlOffice()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-[hsl(38,50%,65%)] hover:underline"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-[hsl(38,45%,52%)] text-[hsl(220,18%,8%)] hover:bg-[hsl(38,48%,48%)]"
              asChild
            >
              <a href={`tel:${SITE_CONTACT.phoneTel}`}>Call now</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(40,15%,35%)] bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Contact form &amp; mailing address</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs text-[hsl(40,8%,55%)]">
            Paperwork and support materials may also be mailed to: {SITE_CONTACT.mailing.line1},{" "}
            {SITE_CONTACT.mailing.line2}, {SITE_CONTACT.mailing.line3}. Details on the contact page.
          </p>
        </div>
      </div>
    </section>
  )
}
