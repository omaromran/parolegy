"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const L = SITE_PAGE_DEFAULTS.layout as Record<string, string>

function lt(layout: Record<string, string> | undefined, key: string): string {
  return layout?.[key] ?? L[key] ?? ""
}

export function Header({ layoutCopy }: { layoutCopy?: Record<string, string> }) {
  const { user, isLoading, logout } = useAuth()
  const portalHref =
    user?.role === "ADMIN" || user?.role === "STAFF" ? "/admin" : "/dashboard"
  const portalLabel =
    user?.role === "ADMIN" || user?.role === "STAFF"
      ? lt(layoutCopy, "portal_admin")
      : lt(layoutCopy, "portal_dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold">{lt(layoutCopy, "brand_name")}</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {lt(layoutCopy, "nav_pricing")}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {lt(layoutCopy, "nav_about")}
          </Link>
          <Link href="/testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            {lt(layoutCopy, "nav_testimonials")}
          </Link>
          <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
            {lt(layoutCopy, "nav_resources")}
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            {lt(layoutCopy, "nav_faq")}
          </Link>
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoading ? (
            <div
              className="h-9 w-36 animate-pulse rounded-md bg-muted/60"
              aria-hidden
            />
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground max-w-[140px] truncate">
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href={portalHref}>{portalLabel}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                {lt(layoutCopy, "header_logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{lt(layoutCopy, "header_login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{lt(layoutCopy, "header_signup")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
