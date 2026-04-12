/**
 * FAQ content aligned with https://parolegy.com/faq (copy edited lightly for spelling and consistency).
 */

import { SITE_CONTACT } from '@/lib/site-contact'

export type FaqBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'note'; text: string }

export type FaqEntry = {
  id: string
  question: string
  blocks: FaqBlock[]
}

export const PAROLEGY_FAQ: FaqEntry[] = [
  {
    id: 'initial-assessment-fee',
    question: 'Is there a fee associated with the initial assessment call?',
    blocks: [
      {
        type: 'paragraph',
        text: 'No. There is no fee for the initial assessment call.',
      },
      {
        type: 'paragraph',
        text: 'The call is used to assess the situation and determine how it should be approached. The initial assessment is a focused, strategic conversation. During it, we review:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'The nature of the conviction and sentence',
          'Where the case currently sits in the parole process',
          'Prior parole decisions or outcomes, if any',
          'Key factors that are likely influencing how the case is being evaluated',
          'Areas where risk, misalignment, or misunderstanding may exist',
        ],
      },
      {
        type: 'paragraph',
        text: 'We do not provide legal advice, promises, or predictions. We do provide an honest assessment of:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'How the situation is likely being viewed',
          'Whether there is a viable strategic role for Parolegy',
          'What would need to be addressed before moving forward',
        ],
      },
    ],
  },
  {
    id: 'affordable',
    question: 'Are you affordable?',
    blocks: [
      {
        type: 'paragraph',
        text: 'At Parolegy, affordability is central to our mission of helping those incarcerated secure another chance so they can return to their families and restore their lives.',
      },
      {
        type: 'paragraph',
        text: 'Our pricing is intentionally affordable so you can engage disciplined, high-level professional services while avoiding unnecessary financial strain.',
      },
      {
        type: 'paragraph',
        text: 'Additionally, our flexible payment options allow you to manage costs comfortably, while addressing a process that otherwise continues to drain your time, income, and energy without direction.',
      },
      {
        type: 'paragraph',
        text: 'Incarceration carries frequent ongoing financial costs that families absorb monthly: lost income from the person who is incarcerated, regular deposits for commissary and related fees, phone calls, tablets, messaging, courses, basic necessities, travel for visitation, and other administrative expenses. Those costs are real, recurring, and rarely discussed.',
      },
      {
        type: 'paragraph',
        text: 'Parolegy is structured as an investment in reducing the time spent incarcerated that interrupts that cycle. We focus resources on what directly impacts execution and evaluation, while eliminating overhead that does not serve the work itself.',
      },
      {
        type: 'paragraph',
        text: 'In this context, Parolegy functions as a cost-control mechanism—replacing indefinite, unmanaged expense with a deliberate, time-bound strategy.',
      },
      {
        type: 'note',
        text: 'Parolegy approaches pricing with long-term responsibility in mind. Our team is dedicated to providing as many people as possible access to the help they need to secure approval for an early release. Despite rising costs across many industries and elsewhere in the parole space, our fee structure remains the same. We have accounted for operational pressures so you are not forced to absorb sudden increases while navigating an already demanding situation.',
      },
    ],
  },
  {
    id: 'payment-plans',
    question: 'Do you offer payment plans?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes, payment plans are available upon request. The length and terms of the payment plan depend on each individual situation.',
      },
    ],
  },
  {
    id: 'hidden-fees',
    question: 'Are there any hidden fees?',
    blocks: [
      {
        type: 'paragraph',
        text: 'No. Transparency is a core value at Parolegy. All costs are clearly outlined at the beginning, with no hidden or unexpected fees.',
      },
      {
        type: 'paragraph',
        text: 'The flat fee covers the duration until your loved one is approved for parole.',
      },
    ],
  },
  {
    id: 'reviews',
    question: 'Where can I find your reviews?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Parolegy works in situations where confidentiality matters. For many of our clients, parole is not something they are willing to discuss publicly.',
      },
      {
        type: 'paragraph',
        text: 'Having a loved one who is incarcerated often carries stigma and unspoken bias—socially, professionally, and within extended family and community circles. Sharing details publicly can expose families to judgment, misunderstanding, or consequences they have worked hard to avoid.',
      },
      {
        type: 'paragraph',
        text: 'Parole involves deeply personal history, complex family dynamics, and decisions with lasting impact. For many families, protecting privacy is a matter of responsibility, and for some individuals, guarding future opportunities is more appropriate than public recognition of our service during a difficult time.',
      },
      {
        type: 'paragraph',
        text: 'As a result, many clients express their appreciation through private correspondence—emails, letters, and handwritten notes sent directly to our team. Select redacted copies of this correspondence can be shared upon request.',
      },
      {
        type: 'paragraph',
        text: 'When clients do leave public ratings, it often takes the form of extended, detailed testimonials rather than casual reviews. Those accounts reflect how the process was handled, how uncertainty was reduced, and what it meant to have experienced professionals managing a discretionary system where mistakes can be costly.',
      },
      {
        type: 'paragraph',
        text: 'You can find public reviews and testimonials on Parolegy’s Facebook page, Parolegy’s A+ rated BBB profile, this website, and other standard platforms. Families who trust Parolegy most are often the ones least interested in public exposure.',
      },
    ],
  },
  {
    id: 'bbb',
    question: 'Is Parolegy accredited by the BBB?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Parolegy proudly maintains an A+ rating with the Better Business Bureau, backed by numerous authentic client testimonials publicly available on our BBB profile.',
      },
      {
        type: 'paragraph',
        text: 'Scroll below the “not accredited business” label on our BBB profile to confirm the highest rating and read client feedback.',
      },
      {
        type: 'paragraph',
        text: 'BBB accreditation simply means the business pays to be a member of the BBB. Membership costs are recurring and can range from hundreds to thousands of dollars. To remain affordable and accessible, we intentionally avoid paid memberships—so we can deliver results without passing those costs on to you. Many businesses you use every day are not accredited for the same reason.',
      },
    ],
  },
  {
    id: 'free-consultations',
    question: 'Do you provide free consultations?',
    blocks: [
      {
        type: 'paragraph',
        text: `Yes. Consultations are provided at no cost. Call ${SITE_CONTACT.phoneDisplay} and press 0 to speak with a live representative.`,
      },
    ],
  },
  {
    id: 'get-started',
    question: 'I am ready to get started—now what?',
    blocks: [
      {
        type: 'paragraph',
        text: 'To begin helping your loved one receive the second chance they deserve:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          `Call ${SITE_CONTACT.phoneDisplay} and press 0 to speak with a live representative`,
          'Provide information for both you and your loved one',
          'Have your payment ready',
        ],
      },
      {
        type: 'paragraph',
        text: 'Once you engage Parolegy, we immediately begin gathering and analyzing information to prepare your loved one for the process.',
      },
    ],
  },
  {
    id: 'unknown-case-details',
    question: "What if I don't know the details of my loved one's case?",
    blocks: [
      {
        type: 'paragraph',
        text: 'We will request the information we need directly from your loved one. Once hired, they receive a customized welcome kit including assessments and information requests.',
      },
    ],
  },
  {
    id: 'support-letters',
    question: 'Will you assist us with support letters?',
    blocks: [
      {
        type: 'paragraph',
        text: "Yes. Often family and friends don't know what to say; sometimes those who do inadvertently say the wrong thing.",
      },
      {
        type: 'paragraph',
        text: 'What you say matters. Support letters communicate a lot about you and your loved one and leave an impression directly on decision-makers. Because of their importance, we assist with support letters.',
      },
    ],
  },
  {
    id: 'paperwork-address',
    question: 'What address does my loved one send their completed paperwork?',
    blocks: [
      { type: 'paragraph', text: 'Parolegy' },
      { type: 'paragraph', text: 'PO Box 703' },
      { type: 'paragraph', text: 'Fort Worth, TX 76101' },
    ],
  },
  {
    id: 'mail-or-email',
    question: 'Should I mail or email support letters, photos, and other requested items?',
    blocks: [
      {
        type: 'paragraph',
        text: "It's up to you—you can send materials by mail or email. We prefer to receive requested material by email when possible.",
      },
    ],
  },
  {
    id: 'release-timeline',
    question: 'My loved one was approved for an early release—how long until they come home?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Direct that question to the facility where your loved one resides. Everyone’s situation is different; release timeframes vary and typically are not scheduled until pre-release conditions are satisfied.',
      },
    ],
  },
  {
    id: 'denial-additional-fee',
    question: 'My loved one received a denial—does it cost extra for additional review periods?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Additional review periods are included with the original fee. The exception is cumulative or “stacked” sentences—in those instances, additional fees may apply.',
      },
    ],
  },
  {
    id: 'major-case',
    question: 'My loved one got in trouble and caught a major case—do you automatically drop them as a client?',
    blocks: [
      {
        type: 'paragraph',
        text: 'No. We encourage clients to avoid trouble, but we know things happen. A major case does not automatically mean we drop a client. How we proceed depends on the type of trouble and the frequency of disciplinary issues.',
      },
    ],
  },
  {
    id: 'guarantee-release',
    question: 'Is it a guarantee that my loved one will get an early release?',
    blocks: [
      {
        type: 'paragraph',
        text: 'No one, including Parolegy, can guarantee an outcome in a discretionary decision system—that is the foundational truth of parole.',
      },
      {
        type: 'paragraph',
        text: 'Parolegy develops comprehensive parole campaigns designed to reduce perceived risk and increase confidence in release readiness:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'We position individuals to be evaluated more favorably.',
          'We reduce avoidable denial signals.',
          'We improve how readiness is perceived by decision-makers.',
          'We help the system see what is otherwise missed.',
        ],
      },
      {
        type: 'paragraph',
        text: 'People choose Parolegy because we increase decision-maker confidence by reducing perceived risk and ambiguity. That is not outcome assurance—that is advantage engineering.',
      },
      {
        type: 'paragraph',
        text: 'Your loved one’s success depends on many factors, including their demonstrated progress, the nature of the offense, criminal history, and other considerations. Campaigns help strategically, but your loved one’s conduct and accountability matter too.',
      },
      {
        type: 'paragraph',
        text: 'Decision-makers often do not know what they will decide until they render a decision. For that and other reasons, no one can guarantee the outcome—and it would be unethical to claim otherwise.',
      },
      {
        type: 'paragraph',
        text: 'What we will guarantee is continuation of services without additional cost or fees until your loved one is approved for an early release.',
      },
    ],
  },
  {
    id: 'other-guarantee',
    question: 'Someone else guaranteed that my loved one will get an early release.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No one can guarantee an outcome they do not control. It is dishonest and unethical to say otherwise.',
      },
      {
        type: 'paragraph',
        text: 'If someone has “guaranteed” an early release, before paying, ask them to put in writing that they guaranteed release—and that you receive a full refund if it does not happen.',
      },
    ],
  },
  {
    id: 'previous-denials',
    question: 'My loved one’s previous attempts failed—can Parolegy still help?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Previous denials often result from inadequate or ineffective presentations. We specialize in reframing and improving how your loved one’s risk factors are perceived, which can improve the likelihood of a favorable outcome.',
      },
    ],
  },
]
