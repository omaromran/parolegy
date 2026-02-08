/**
 * Email sending. Uses SMTP when configured (e.g. SMTP_HOST, SMTP_USER, SMTP_PASS).
 * When not configured, logs the email to console (development).
 */

const NOTIFY_EMAIL = 'omranomar1@gmail.com'

export interface SendMailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const { to, subject, text, html } = options

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (host && user && pass) {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    })
    return
  }

  // No SMTP config: log (development)
  console.log('[Email (no SMTP)]', { to, subject, text: text.slice(0, 200) + (text.length > 200 ? '...' : '') })
}

export async function sendAssessmentSubmittedNotification(params: {
  caseId: string
  clientName: string
  tdcjNumber: string
  userEmail: string
  userName: string | null
}): Promise<void> {
  const { caseId, clientName, tdcjNumber, userEmail, userName } = params
  const subject = `Parolegy: New assessment submitted – ${clientName} (TDCJ #${tdcjNumber})`
  const text = [
    'A new assessment has been submitted.',
    '',
    `Client: ${clientName}`,
    `TDCJ #: ${tdcjNumber}`,
    `Submitted by: ${userName || userEmail} (${userEmail})`,
    '',
    `View in admin: ${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/admin/cases/${caseId}`,
  ].join('\n')

  await sendMail({
    to: NOTIFY_EMAIL,
    subject,
    text,
  })
}
