import Link from "next/link"
import { SITE_CONTACT } from "@/lib/site-contact"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const L = SITE_PAGE_DEFAULTS.layout as Record<string, string>

function lt(layout: Record<string, string> | undefined, key: string): string {
  return layout?.[key] ?? L[key] ?? ""
}

export function Footer({ layoutCopy }: { layoutCopy?: Record<string, string> }) {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">{lt(layoutCopy, "footer_brand_heading")}</h3>
            <p className="text-sm text-muted-foreground">{lt(layoutCopy, "footer_tagline")}</p>
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
            <h4 className="font-semibold mb-4">{lt(layoutCopy, "footer_col_company")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_pricing")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_about")}
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_testimonials")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_resources")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_faq")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{lt(layoutCopy, "footer_col_legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  {lt(layoutCopy, "footer_link_terms")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{lt(layoutCopy, "footer_col_languages")}</h4>
            <p className="text-sm text-muted-foreground mb-2">{lt(layoutCopy, "footer_languages_intro")}</p>
            <p className="text-xs text-muted-foreground">{lt(layoutCopy, "footer_languages_list")}</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {lt(layoutCopy, "footer_copyright_suffix")}
          </p>
          <p className="mt-2">{lt(layoutCopy, "footer_disclaimer")}</p>
        </div>
      </div>
    </footer>
  )
}
