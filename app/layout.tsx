import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Parolegy - Present your plan, not your past",
  description: "Parole campaign creation that helps demonstrate readiness, rehabilitation, and a safe reentry plan. Founded 2017. Texas-focused.",
  keywords: ["parole", "parole campaign", "Texas parole", "reentry", "parole application"],
  openGraph: {
    title: "Parolegy - Present your plan, not your past",
    description: "Parole campaign creation that helps demonstrate readiness, rehabilitation, and a safe reentry plan.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
