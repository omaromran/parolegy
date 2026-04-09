"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { user, isLoading, logout } = useAuth()
  const portalHref =
    user?.role === "ADMIN" || user?.role === "STAFF" ? "/admin" : "/dashboard"
  const portalLabel =
    user?.role === "ADMIN" || user?.role === "STAFF" ? "Admin" : "Dashboard"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold">parolegy</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
            Resources
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
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
