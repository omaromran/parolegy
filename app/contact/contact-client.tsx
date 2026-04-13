"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Inbox } from "lucide-react"
import { SITE_CONTACT, mapsUrlOffice } from "@/lib/site-contact"
import { SITE_PAGE_DEFAULTS } from "@/lib/site-content-defaults"

const C = SITE_PAGE_DEFAULTS.contact as Record<string, string>

function ct(copy: Record<string, string>, key: string): string {
  return copy[key] ?? C[key] ?? ""
}

export function ContactPageClient({ copy }: { copy: Record<string, string> }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(ct(copy, "form_thanks"))
    setFormData({ name: "", email: "", phone: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40 py-12 md:py-16">
        <div className="container max-w-4xl">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">{ct(copy, "title")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{ct(copy, "intro")}</p>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">{ct(copy, "card_call_title")}</CardTitle>
                <CardDescription>{ct(copy, "card_call_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <a href={`tel:${SITE_CONTACT.phoneTel}`} className="text-lg font-semibold hover:underline">
                      {SITE_CONTACT.phoneDisplay}
                    </a>
                    <p className="text-sm text-muted-foreground">{ct(copy, "card_call_hint")}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <a href={`mailto:${SITE_CONTACT.emailPrimary}`} className="font-medium hover:underline">
                      {SITE_CONTACT.emailPrimary}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <p className="text-sm text-muted-foreground">{SITE_CONTACT.hours}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">{ct(copy, "card_office_title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <address className="not-italic text-sm leading-relaxed">
                    {SITE_CONTACT.office.name}
                    <br />
                    {SITE_CONTACT.office.street}
                    <br />
                    {SITE_CONTACT.office.cityStateZip}
                    <br />
                    {SITE_CONTACT.office.country}
                  </address>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={mapsUrlOffice()} target="_blank" rel="noopener noreferrer">
                    {ct(copy, "card_maps_btn")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">{ct(copy, "card_mail_title")}</CardTitle>
                <CardDescription>{ct(copy, "card_mail_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Inbox className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <address className="not-italic text-sm leading-relaxed">
                    {SITE_CONTACT.mailing.line1}
                    <br />
                    {SITE_CONTACT.mailing.line2}
                    <br />
                    {SITE_CONTACT.mailing.line3}
                  </address>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-serif text-xl">{ct(copy, "form_title")}</CardTitle>
              <CardDescription>{ct(copy, "form_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    {ct(copy, "form_name")}
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    {ct(copy, "form_email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                    {ct(copy, "form_phone")}{" "}
                    <span className="font-normal text-muted-foreground">
                      {ct(copy, "form_phone_optional")}
                    </span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    {ct(copy, "form_message_label")}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    placeholder={ct(copy, "form_message_placeholder")}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? ct(copy, "form_sending") : ct(copy, "form_submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
