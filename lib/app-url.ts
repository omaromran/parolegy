/** Public site URL for links in emails and Stripe redirects. */
export function getAppUrl(requestOrigin?: string): string {
  const fromEnv = process.env.NEXTAUTH_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (requestOrigin) return requestOrigin.replace(/\/$/, '')
  return 'http://localhost:3000'
}
