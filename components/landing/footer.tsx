import Link from "next/link"
import { SITE_CONTACT } from "@/lib/site-contact"

const languages = [
  "English", "Spanish", "French", "Hindi", "Urdu", "Arabic", "Vietnamese",
  "Chinese", "Portuguese", "Tagalog", "Korean", "Igbo", "Twi", "Yoruba",
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Parolegy</h3>
            <p className="text-sm text-muted-foreground">
              Founded 2017. Parole campaign preparation for Texas families—focused, documented, and
              aligned with how review actually works.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a href={`tel:${SITE_CONTACT.phoneTel}`} className="hover:text-primary">
                {SITE_CONTACT.phoneDisplay}
              </a>
              <span className="mx-1 text-border">·</span>
              <a href={`mailto:${SITE_CONTACT.emailPrimary}`} className="hover:text-primary">
                {SITE_CONTACT.emailPrimary}
              </a>
            </p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {SITE_CONTACT.office.street}, {SITE_CONTACT.office.cityStateZip}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Languages</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Available in:
            </p>
            <p className="text-xs text-muted-foreground">
              {languages.join(", ")}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Parolegy. All rights reserved.</p>
          <p className="mt-2">
            Parolegy is not a law firm and does not provide legal advice. Parole is discretionary, and results are not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  )
}
