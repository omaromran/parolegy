import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import { SITE_CONTACT, mapsUrlOffice } from "@/lib/site-contact"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const H = SITE_PAGE_DEFAULTS.home as Record<string, string>

function ht(copy: Record<string, string> | undefined, key: string): string {
  return copy?.[key] ?? H[key] ?? ""
}

type Props = { copy?: Record<string, string> }

export function ContactStrip({ copy }: Props) {
  const mailing = `${SITE_CONTACT.mailing.line1}, ${SITE_CONTACT.mailing.line2}, ${SITE_CONTACT.mailing.line3}`
  const mailNote = ht(copy, "strip_mail_note").replace("{mailing}", mailing)

  return (
    <section
      className="border-t bg-[hsl(220,16%,12%)] py-16 text-[hsl(40,18%,95%)] md:py-20"
      aria-labelledby="contact-strip-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <h2 id="contact-strip-heading" className="font-serif text-3xl font-bold md:text-4xl">
            {ht(copy, "strip_heading")}
          </h2>
          <p className="mt-3 max-w-2xl text-[hsl(40,12%,78%)]">{ht(copy, "strip_sub")}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(38,48%,58%)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(40,12%,70%)]">
                  {ht(copy, "strip_phone_label")}
                </p>
                <a
                  href={`tel:${SITE_CONTACT.phoneTel}`}
                  className="mt-1 block text-lg font-medium hover:underline"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
                <p className="mt-1 text-sm text-[hsl(40,10%,65%)]">{ht(copy, "strip_phone_hint")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(38,48%,58%)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(40,12%,70%)]">
                  {ht(copy, "strip_email_label")}
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
                  {ht(copy, "strip_office_label")}
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
                  {ht(copy, "strip_maps")}
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
              <a href={`tel:${SITE_CONTACT.phoneTel}`}>{ht(copy, "strip_btn_call")}</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(40,15%,35%)] bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">{ht(copy, "strip_btn_contact")}</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs text-[hsl(40,8%,55%)]">{mailNote}</p>
        </div>
      </div>
    </section>
  )
}
