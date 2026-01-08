"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

// Mock data - replace with real data fetching
const mockCase = {
  id: "1",
  clientName: "John Doe",
  tdcjNumber: "1234567",
  status: "ASSESSMENT_IN_PROGRESS",
  nextReviewDate: new Date("2025-12-01"),
  serviceOption: 3,
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  INTAKE: "Intake",
  ASSESSMENT_IN_PROGRESS: "Assessment in Progress",
  DOCUMENTS_PENDING: "Documents Pending",
  AI_DRAFT_READY: "AI Draft Ready",
  TEAM_REVIEW: "Team Review",
  CLIENT_REVIEW: "Client Review",
  APPROVED: "Approved",
  SUBMITTED: "Submitted",
  ARCHIVED: "Archived",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <span className="text-sm text-muted-foreground">
              {user.name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{mockCase.clientName}</CardTitle>
                  <CardDescription>TDCJ #{mockCase.tdcjNumber}</CardDescription>
                </div>
                <Badge>{statusLabels[mockCase.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Next Review Date</p>
                  <p className="font-medium">{formatDateShort(mockCase.nextReviewDate)}</p>
                </div>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/dashboard/assessment">Continue Assessment</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/uploads">Upload Documents</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Account Created</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Case Created</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">○</span>
                  <span className="text-sm">Assessment (In Progress)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  <span className="text-sm">Documents Uploaded</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  <span className="text-sm">Campaign Generated</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/assessment">Complete Assessment</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/uploads">Upload Documents</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/campaign">View Campaign</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/messages">Messages</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Option</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {mockCase.serviceOption === 1 && "White-Glove \"Done For You\""}
                {mockCase.serviceOption === 2 && "Hybrid \"Self-Serve + Consultation\""}
                {mockCase.serviceOption === 3 && "Self-Serve \"AI Campaign Generator\""}
              </p>
              <Button variant="outline" size="sm">
                Change Option
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
