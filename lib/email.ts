/**
 * Transactional email via Resend (https://resend.com).
 * Falls back to console logging when RESEND_API_KEY is unset (local dev).
 */

import { Resend } from 'resend'
import { getAppUrl } from '@/lib/app-url'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const fromEmail =
  process.env.RESEND_FROM_EMAIL?.trim() || 'Parolegy <onboarding@resend.dev>'

function staffInbox(): string {
  return (
    process.env.STAFF_NOTIFY_EMAIL?.trim() ||
    process.env.NOTIFY_EMAIL?.trim() ||
    'team@parolegy.com'
  )
}

export interface SendMailOptions {
  to: string | string[]
  subject: string
  text: string
  html?: string
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const { to, subject, text, html } = options
  const recipients = Array.isArray(to) ? to : [to]

  if (resend) {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject,
      text,
      html: html || `<pre style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    })
    if (error) {
      console.error('[Resend]', error)
      throw new Error(error.message || 'Failed to send email')
    }
    return
  }

  console.log('[Email (no RESEND_API_KEY)]', {
    to: recipients,
    subject,
    preview: text.slice(0, 200) + (text.length > 200 ? '...' : ''),
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendWelcomeEmail(params: {
  to: string
  name: string | null
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const text = [
    `Hi ${params.name || 'there'},`,
    '',
    'Welcome to Parolegy. Next steps:',
    `1. Book a free consultation (optional): ${base}/onboarding`,
    `2. Complete payment: ${base}/pricing`,
    `3. Then complete your assessment and uploads from your dashboard.`,
    '',
    `Sign in anytime: ${base}/login`,
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'Welcome to Parolegy',
    text,
  })
}

export async function sendEmailVerificationEmail(params: {
  to: string
  name: string | null
  token: string
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const link = `${base}/verify-email?token=${encodeURIComponent(params.token)}`
  const text = [
    `Hi ${params.name || 'there'},`,
    '',
    'Please verify your email address by opening this link (valid 48 hours):',
    link,
    '',
    'If you did not create an account, you can ignore this message.',
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'Verify your Parolegy email',
    text,
  })
}

export async function sendPasswordResetEmail(params: {
  to: string
  resetUrl: string
}): Promise<void> {
  const text = [
    'You requested a password reset for your Parolegy account.',
    '',
    `Reset your password (link expires in 1 hour):`,
    params.resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'Reset your Parolegy password',
    text,
  })
}

export async function sendAssessmentSubmittedNotification(params: {
  caseId: string
  clientName: string
  tdcjNumber: string
  userEmail: string
  userName: string | null
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const subject = `Parolegy: New assessment submitted – ${params.clientName} (TDCJ #${params.tdcjNumber})`
  const text = [
    'A client completed their assessment.',
    '',
    `Client: ${params.clientName}`,
    `TDCJ #: ${params.tdcjNumber}`,
    `Submitted by: ${params.userName || params.userEmail} (${params.userEmail})`,
    '',
    `Open case: ${base}/admin/cases/${params.caseId}`,
  ].join('\n')

  await sendMail({ to: staffInbox(), subject, text })
}

export async function sendAssessmentReceivedClientEmail(params: {
  to: string
  name: string | null
  clientName: string
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const text = [
    `Hi ${params.name || 'there'},`,
    '',
    `We received the completed assessment for ${params.clientName}.`,
    'Upload any remaining required documents (support letters, photos) from your dashboard when you can.',
    '',
    `Dashboard: ${base}/dashboard`,
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'We received your Parolegy assessment',
    text,
  })
}

export async function sendCampaignPublishedClientEmail(params: {
  to: string
  name: string | null
  clientName: string
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const text = [
    `Hi ${params.name || 'there'},`,
    '',
    `Good news: your parole campaign narrative for ${params.clientName} is now published to your dashboard.`,
    '',
    `View it here: ${base}/dashboard/campaign`,
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'Your parole campaign is ready on Parolegy',
    text,
  })
}

export async function sendPaymentConfirmationEmail(params: {
  to: string
  name: string | null
  origin?: string
}): Promise<void> {
  const base = getAppUrl(params.origin)
  const text = [
    `Hi ${params.name || 'there'},`,
    '',
    'Thank you — your payment was successful. You now have full access to your Parolegy dashboard.',
    '',
    `Continue here: ${base}/dashboard`,
    '',
    '— Parolegy',
  ].join('\n')

  await sendMail({
    to: params.to,
    subject: 'Payment received — Parolegy',
    text,
  })
}
