"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

// Test data to prefill the entire assessment for quick testing
const TEST_DATA: Record<string, string | number> = {
  tdcj_number: "12345678",
  unit: "Clemens Unit",
  parole_eligibility_date: "2026-06-15",
  next_review_date: "2026-03-01",
  district: "District 3",
  disciplinary_history: "No major disciplinary infractions. One minor write-up in 2023 for being out of place, resolved with counseling.",
  last_disciplinary: "2023-08-12",
  gang_affiliation: "No",
  gang_details: "",
  education_level: "High School/GED",
  certificates: "HVAC certification (in progress), GED completed 2022.",
  employment_history: "Worked in construction and warehouse roles before incarceration. Completed vocational training in facility.",
  employment_plan: "Plan to re-enter construction or warehouse work. Have applied to re-entry program with local employer.",
  employer_contact: "John Smith, ABC Construction, (555) 123-4567",
  medical_conditions: "None requiring ongoing treatment.",
  mental_health: "Participated in counseling programs. No current diagnosis requiring medication.",
  treatment_plan: "Will continue counseling through community program if recommended.",
  family_support: "Strong support from mother and two siblings. Weekly phone calls and visits when possible.",
  children: "Two children, ages 8 and 12. Maintain contact through letters and scheduled calls.",
  support_letters_count: "5",
  juvenile_history: "None.",
  offense_details: "Non-violent offense. Full details provided in court records. Have taken responsibility.",
  prior_offenses: "One prior conviction from 2015, completed sentence and parole successfully.",
  remorse: "I deeply regret my actions and the harm caused. I have used my time to change and prepare for a productive return to society.",
  substance_history: "Past substance use. Completed treatment program in 2024.",
  treatment_history: "Completed 6-month in-facility substance abuse program.",
  sobriety_plan: "AA/NA meetings upon release, sponsor contact, avoid high-risk situations.",
  housing_address: "123 Main St, Houston, TX (mother's residence)",
  housing_stability: "Stable housing with family. Written agreement for 6 months post-release.",
  transportation_plan: "Family will provide rides initially. Plan to save for vehicle or use bus pass program.",
  why_parole: "I have completed programs, maintained good conduct, and have a solid release plan. I am committed to being a productive citizen.",
  why_now: "I have met all program requirements and have strong community and family support in place.",
  public_safety: "Stable housing, employment plan, no gang ties, ongoing support network and willingness to comply with all conditions.",
  additional_info: "Test data – filled for assessment testing.",
}

function AssessmentPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get("caseId")

  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(!!caseId)

  useEffect(() => {
    if (!caseId) {
      setIsLoadingAssessment(false)
      return
    }
    let cancelled = false
    fetch(`/api/assessment?caseId=${encodeURIComponent(caseId)}`)
      .then((res) => (res.ok ? res.json() : { responses: {} }))
      .then((data) => {
        if (!cancelled && data.responses && typeof data.responses === "object") {
          setResponses(data.responses)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingAssessment(false)
      })
    return () => { cancelled = true }
  }, [caseId])

  const handleInputChange = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value })
  }

  const handlePrefillTestData = () => {
    setResponses({ ...TEST_DATA } as Record<string, any>)
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

  const allRequiredFilled = () => {
    for (const section of sections) {
      for (const q of section.questions) {
        if (q.required) {
          const val = responses[q.id]
          if (val === undefined || val === null || String(val).trim() === "") return false
        }
      }
    }
    return true
  }

  const isLastSection = currentSection === sections.length - 1
  const canComplete = isLastSection && allRequiredFilled()

  const handleComplete = async () => {
    if (!isLastSection) {
      handleNext()
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(caseId ? { caseId } : {}),
          responses,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")
      router.push("/dashboard")
      return
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save assessment.")
    } finally {
      setIsSaving(false)
    }
  }

  const currentSectionData = sections[currentSection]

  if (isLoadingAssessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    )
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
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrefillTestData}
                className="text-muted-foreground"
              >
                Fill with test data
              </Button>
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
              <Button
                onClick={handleComplete}
                disabled={isLastSection ? !canComplete : false}
              >
                {isLastSection ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <AssessmentPageInner />
    </Suspense>
  )
}
