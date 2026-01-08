"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Assessment sections based on the 16-page assessment
const sections = [
  {
    id: "status",
    title: "Status & Eligibility",
    questions: [
      { id: "tdcj_number", label: "TDCJ Number", type: "text", required: true },
      { id: "unit", label: "Current Unit", type: "text", required: true },
      { id: "parole_eligibility_date", label: "Parole Eligibility Date", type: "date", required: true },
      { id: "next_review_date", label: "Next Review Date", type: "date", required: false },
      { id: "district", label: "Parole District", type: "text", required: false },
    ],
  },
  {
    id: "disciplinary",
    title: "Disciplinary Record",
    questions: [
      { id: "disciplinary_history", label: "Describe your disciplinary record", type: "textarea", required: true },
      { id: "last_disciplinary", label: "Date of last disciplinary action", type: "date", required: false },
    ],
  },
  {
    id: "gang",
    title: "Gang Affiliation",
    questions: [
      { id: "gang_affiliation", label: "Have you been involved with any gangs?", type: "select", options: ["Yes", "No", "N/A"], required: true },
      { id: "gang_details", label: "If yes, provide details", type: "textarea", required: false },
    ],
  },
  {
    id: "education",
    title: "Education",
    questions: [
      { id: "education_level", label: "Highest Education Level", type: "select", options: ["Less than High School", "High School/GED", "Some College", "Associate's", "Bachelor's", "Graduate"], required: true },
      { id: "certificates", label: "List any certificates or training programs completed", type: "textarea", required: false },
    ],
  },
  {
    id: "employment",
    title: "Employment History & Plans",
    questions: [
      { id: "employment_history", label: "Describe your employment history", type: "textarea", required: true },
      { id: "employment_plan", label: "Describe your employment plan upon release", type: "textarea", required: true },
      { id: "employer_contact", label: "Potential employer contact information (if available)", type: "textarea", required: false },
    ],
  },
  {
    id: "medical",
    title: "Medical & Mental Health",
    questions: [
      { id: "medical_conditions", label: "Medical conditions requiring treatment", type: "textarea", required: false },
      { id: "mental_health", label: "Mental health treatment history", type: "textarea", required: false },
      { id: "treatment_plan", label: "Post-release treatment plan", type: "textarea", required: false },
    ],
  },
  {
    id: "family",
    title: "Family & Support Network",
    questions: [
      { id: "family_support", label: "Describe your family support network", type: "textarea", required: true },
      { id: "children", label: "Information about children", type: "textarea", required: false },
      { id: "support_letters_count", label: "How many support letters do you have?", type: "number", required: false },
    ],
  },
  {
    id: "juvenile",
    title: "Juvenile History",
    questions: [
      { id: "juvenile_history", label: "Juvenile criminal history (if applicable)", type: "textarea", required: false },
    ],
  },
  {
    id: "adult",
    title: "Adult Criminal History",
    questions: [
      { id: "offense_details", label: "Details of current offense", type: "textarea", required: true },
      { id: "prior_offenses", label: "Prior offenses", type: "textarea", required: true },
      { id: "remorse", label: "Your reflection on your actions and their impact", type: "textarea", required: true },
    ],
  },
  {
    id: "substance",
    title: "Substance Use",
    questions: [
      { id: "substance_history", label: "Substance use history", type: "textarea", required: false },
      { id: "treatment_history", label: "Treatment history", type: "textarea", required: false },
      { id: "sobriety_plan", label: "Sobriety maintenance plan", type: "textarea", required: false },
    ],
  },
  {
    id: "housing",
    title: "Housing Plan",
    questions: [
      { id: "housing_address", label: "Release address (if available)", type: "text", required: false },
      { id: "housing_stability", label: "Describe housing stability factors", type: "textarea", required: true },
    ],
  },
  {
    id: "transportation",
    title: "Transportation Plan",
    questions: [
      { id: "transportation_plan", label: "Describe your transportation plan", type: "textarea", required: true },
    ],
  },
  {
    id: "why",
    title: "Why Factors",
    questions: [
      { id: "why_parole", label: "Why do you believe you should be granted parole?", type: "textarea", required: true },
      { id: "why_now", label: "Why now?", type: "textarea", required: true },
      { id: "public_safety", label: "How will you ensure public safety?", type: "textarea", required: true },
    ],
  },
  {
    id: "additional",
    title: "Additional Notes",
    questions: [
      { id: "additional_info", label: "Any additional information you'd like to include", type: "textarea", required: false },
    ],
  },
]

export default function AssessmentPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save to database
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
    alert("Progress saved!")
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const currentSectionData = sections[currentSection]

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
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Assessment</h1>
            <p className="text-muted-foreground">
              Section {currentSection + 1} of {sections.length}: {currentSectionData.title}
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{currentSectionData.title}</CardTitle>
              <CardDescription>
                Please answer all required questions. You can save your progress and return later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSectionData.questions.map((question) => (
                <div key={question.id}>
                  <label className="text-sm font-medium mb-2 block">
                    {question.label}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {question.type === "textarea" ? (
                    <Textarea
                      value={responses[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required={question.required}
                      rows={4}
                    />
                  ) : question.type === "select" ? (
                    <select
                      value={responses[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required={question.required}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select...</option>
                      {question.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={question.type}
                      value={responses[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required={question.required}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentSection === 0}>
              Previous
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Progress"}
              </Button>
              <Button onClick={handleNext} disabled={currentSection === sections.length - 1}>
                {currentSection === sections.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
