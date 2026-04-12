import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/** When unset, matches previous behavior (dev default). Set SITE_PASSWORD="" in env to disable the gate. */
const SITE_PASSWORD_RAW = process.env.SITE_PASSWORD
const SITE_PASSWORD =
  SITE_PASSWORD_RAW === '' ? '' : SITE_PASSWORD_RAW || 'angel123@'
const PASSWORD_COOKIE = 'site-access-granted'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

function paymentGateActive(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY?.trim() && process.env.STRIPE_PRICE_ID?.trim())
}

function sitePasswordExempt(pathname: string): boolean {
  return (
    pathname === '/password' ||
    pathname === '/api/check-password' ||
    pathname === '/api/stripe/webhook'
  )
}

function isPaymentExemptPath(pathname: string): boolean {
  if (pathname.startsWith('/api/auth')) return true
  if (pathname === '/api/check-password') return true
  if (pathname === '/api/stripe/webhook') return true
  if (pathname === '/api/stripe/checkout') return true
  const marketing = new Set([
    '/',
    '/password',
    '/login',
    '/signup',
    '/pricing',
    '/onboarding',
    '/verify-email',
    '/checkout/success',
    '/checkout/cancel',
    '/reset-password',
    '/about',
    '/testimonials',
    '/resources',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
  ])
  if (marketing.has(pathname)) return true
  if (pathname.startsWith('/choose-tier')) return true
  return false
}

function requiresPaidPortalAccess(pathname: string): boolean {
  if (pathname.startsWith('/dashboard')) return true
  if (pathname.startsWith('/api/')) {
    return !isPaymentExemptPath(pathname)
  }
  return false
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/samples') ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp|pdf|txt|webmanifest)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  const siteGateEnabled = SITE_PASSWORD.length > 0
  if (siteGateEnabled) {
    const hasAccess = request.cookies.get(PASSWORD_COOKIE)?.value === 'true'
    if (sitePasswordExempt(pathname)) {
      // allow webhook + password flow
    } else if (!hasAccess) {
      const url = request.nextUrl.clone()
      url.pathname = '/password'
      return NextResponse.redirect(url)
    }
  }

  if (!paymentGateActive() || !requiresPaidPortalAccess(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role as string
    const hasPaidAccess = Boolean(payload.hasPaidAccess)
    const staff = role === 'ADMIN' || role === 'STAFF'

    if (!staff && !hasPaidAccess) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Payment required', code: 'PAYMENT_REQUIRED' },
          { status: 402 }
        )
      }
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
