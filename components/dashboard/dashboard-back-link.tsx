"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  href?: string
  children?: React.ReactNode
}

/** Visible way to return to the main dashboard (not only the header “Dashboard” link). */
export function DashboardBackLink({ href = "/dashboard", children = "Back to dashboard" }: Props) {
  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-9 px-2 text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href={href}>
          <ArrowLeft className="mr-1.5 h-4 w-4 shrink-0" aria-hidden />
          {children}
        </Link>
      </Button>
    </div>
  )
}
