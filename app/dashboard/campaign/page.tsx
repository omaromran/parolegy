"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      version: 1,
      language: "en",
      status: "DRAFT",
      createdAt: new Date(),
    },
  ])

  const handleGenerate = async () => {
    // TODO: Implement campaign generation
    alert("Campaign generation will trigger AI blueprint creation and PDF rendering")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="font-serif text-2xl font-bold">
            parolegy
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Campaign Builder</h1>
              <p className="text-muted-foreground">
                Generate and manage your parole campaign booklets
              </p>
            </div>
            <Button onClick={handleGenerate}>Generate Campaign</Button>
          </div>

          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Campaign Version {campaign.version}</CardTitle>
                      <CardDescription>
                        Created {campaign.createdAt.toLocaleDateString()} • Language: {campaign.language.toUpperCase()}
                      </CardDescription>
                    </div>
                    <Badge>{campaign.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/campaign/${campaign.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline">Download PDF</Button>
                    <Button variant="outline">Request Team Review</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {campaigns.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No campaigns generated yet. Complete your assessment and upload documents, then generate your first campaign.
                </p>
                <Button onClick={handleGenerate}>Generate Your First Campaign</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
