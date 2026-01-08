"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDateShort } from "@/lib/utils"

interface Case {
  id: string
  clientName: string
  tdcjNumber: string
  status: string
  nextReviewDate: string | null
  serviceOption: number
  createdAt: string
  user: {
    name: string | null
    email: string
  }
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

export default function AdminPage() {
  const router = useRouter()
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchCases()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      if (data.user.role !== 'ADMIN' && data.user.role !== 'STAFF') {
        router.push('/dashboard')
        return
      }
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/admin/cases')
      if (response.ok) {
        const data = await response.json()
        setCases(data.cases || [])
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage cases and review submissions
          </p>
        </div>

        <div className="grid gap-6">
          {cases.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No cases found</p>
              </CardContent>
            </Card>
          ) : (
            cases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{caseItem.clientName}</CardTitle>
                      <CardDescription>
                        TDCJ #{caseItem.tdcjNumber} • {caseItem.user.email}
                      </CardDescription>
                    </div>
                    <Badge>{statusLabels[caseItem.status] || caseItem.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{statusLabels[caseItem.status] || caseItem.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Review</p>
                      <p className="font-medium">
                        {caseItem.nextReviewDate
                          ? formatDateShort(caseItem.nextReviewDate)
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service Option</p>
                      <p className="font-medium">
                        {caseItem.serviceOption === 1 && "White-Glove"}
                        {caseItem.serviceOption === 2 && "Hybrid"}
                        {caseItem.serviceOption === 3 && "Self-Serve"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" asChild>
                      <Link href={`/admin/cases/${caseItem.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/admin/cases/${caseItem.id}/review`}>Review</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
