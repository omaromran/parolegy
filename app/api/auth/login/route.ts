import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { jwtClaimsForUser, signAuthJwt } from '@/lib/auth-token'
import { paymentConfigured } from '@/lib/payment-configured'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)
    const claims = jwtClaimsForUser(user)
    const token = await signAuthJwt(claims)
    const enforcePayment = paymentConfigured()
    const isPortal = user.role === 'CLIENT' || user.role === 'FAMILY'
    const needsOnboarding =
      enforcePayment && isPortal && !claims.hasPaidAccess

    const response = NextResponse.json({
      success: true,
      requiresPayment: enforcePayment,
      redirectTo:
        user.role === 'ADMIN' || user.role === 'STAFF'
          ? '/admin'
          : needsOnboarding
            ? '/onboarding'
            : '/dashboard',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPaidAccess: claims.hasPaidAccess,
        emailVerified: user.emailVerified != null,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: unknown) {
    console.error('Login error:', error)
    const message = error instanceof Error ? error.message : 'Invalid credentials'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
