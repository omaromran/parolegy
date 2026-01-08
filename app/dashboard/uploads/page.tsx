"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, File, X } from "lucide-react"

const documentTypes = [
  { id: "SUPPORT_LETTER", label: "Support Letter", min: 3, max: 10 },
  { id: "PHOTO", label: "Photo", min: 10, max: 20 },
  { id: "CERTIFICATE", label: "Certificate", min: 0, max: 50 },
  { id: "EMPLOYMENT_PLAN", label: "Employment Plan", min: 0, max: 5 },
  { id: "HOUSING_PLAN", label: "Housing Plan", min: 0, max: 5 },
  { id: "OTHER", label: "Other", min: 0, max: 20 },
]

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Record<string, File[]>>({
    SUPPORT_LETTER: [],
    PHOTO: [],
    CERTIFICATE: [],
    EMPLOYMENT_PLAN: [],
    HOUSING_PLAN: [],
    OTHER: [],
  })

  const handleFileSelect = (type: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setUploads({
      ...uploads,
      [type]: [...uploads[type], ...fileArray],
    })
  }

  const handleRemove = (type: string, index: number) => {
    setUploads({
      ...uploads,
      [type]: uploads[type].filter((_, i) => i !== index),
    })
  }

  const handleUpload = async () => {
    // TODO: Implement file upload to S3/storage
    alert("Upload functionality will be implemented with file storage")
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
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground mb-8">
            Upload support letters, photos, certificates, and other documents for your parole campaign.
          </p>

          <div className="space-y-6">
            {documentTypes.map((docType) => {
              const typeUploads = uploads[docType.id]
              const count = typeUploads.length
              const meetsMin = count >= docType.min
              const exceedsMax = count > docType.max

              return (
                <Card key={docType.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{docType.label}</CardTitle>
                        <CardDescription>
                          {docType.min > 0
                            ? `Minimum: ${docType.min}, Maximum: ${docType.max}`
                            : `Maximum: ${docType.max}`}
                          {count > 0 && ` • ${count} uploaded`}
                        </CardDescription>
                      </div>
                      {!meetsMin && docType.min > 0 && (
                        <span className="text-sm text-destructive">Required</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept={docType.id === "PHOTO" ? "image/*" : "application/pdf,image/*"}
                            onChange={(e) => handleFileSelect(docType.id, e.target.files)}
                            className="hidden"
                          />
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose Files
                            </span>
                          </Button>
                        </label>
                      </div>
                      {typeUploads.length > 0 && (
                        <div className="space-y-2">
                          {typeUploads.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(docType.id, index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button onClick={handleUpload}>Upload All Files</Button>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Photo Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Only non-deceptive enhancements allowed: crop, brightness/contrast, denoise, background blur</li>
                <li>Do NOT change identity, add props, uniforms, or alter reality</li>
                <li>Photos should humanize and show positive aspects of life and relationships</li>
                <li>Include captions where helpful to provide context</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
