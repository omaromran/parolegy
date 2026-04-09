"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "What is a Parole Campaign?",
    answer: "A Parole Campaign is a premium, visually engaging booklet (not a messy packet) that presents your case for parole. It addresses public safety concerns, demonstrates remorse and accountability, shows rehabilitation, outlines a concrete reentry plan, and highlights supporter credibility. It's structured, coherent, and designed to make an impact in the 7–10 minutes panel members spend reviewing each case.",
  },
  {
    question: "How is this different from what an attorney would submit?",
    answer: "Many attorneys submit unedited materials with a generic cover letter, producing low-quality and low-impact packets. Parolegy uses narrative engineering, psychology, behavior analytics, and premium design to create campaigns that are structured, coherent, and address what panels need to see.",
  },
  {
    question: "What languages are supported?",
    answer: "The platform UI and guidance content are available in English, Spanish, French, Hindi, Urdu, Arabic, Vietnamese, Chinese, Portuguese, Tagalog, Korean, Igbo, Twi, and Yoruba. Campaign booklets can be generated in English and your selected language (two PDFs).",
  },
  {
    question: "What if my case is denied?",
    answer:
      "You can work with Parolegy staff on revisions for a future review cycle. Scope depends on your agreement with the team.",
  },
  {
    question: "Is Parolegy a law firm?",
    answer: "No. Parolegy is not a law firm and does not provide legal advice. We help create compelling parole campaign materials. Parole is discretionary, and results are not guaranteed.",
  },
  {
    question: "How long does it take to create a campaign?",
    answer:
      "After you submit your assessment and documents, Parolegy staff build the campaign narrative. Timing depends on review and edits; the campaign appears in your dashboard only after staff publish it to you.",
  },
]

export function FAQ() {
  return (
    <section className="container py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
