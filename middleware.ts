import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Password protection for the entire site
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'angel123@'
const PASSWORD_COOKIE = 'site-access-granted'

export function middleware(request: NextRequest) {
  // Check if user has already entered the password
  const hasAccess = request.cookies.get(PASSWORD_COOKIE)?.value === 'true'

  // Allow access to password page and password check endpoint
  if (
    request.nextUrl.pathname === '/password' ||
    request.nextUrl.pathname === '/api/check-password'
  ) {
    return NextResponse.next()
  }

  // Allow access to static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // If no access, redirect to password page
  if (!hasAccess) {
    const url = request.nextUrl.clone()
    url.pathname = '/password'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
