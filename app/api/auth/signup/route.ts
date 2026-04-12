import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { jwtClaimsForUser, signAuthJwt } from '@/lib/auth-token'
import { paymentConfigured } from '@/lib/payment-configured'
import {
  sendWelcomeEmail,
  sendEmailVerificationEmail,
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const userRole = role === 'FAMILY' ? 'FAMILY' : 'CLIENT'

    const { user, emailVerificationToken } = await createUser(
      email,
      password,
      name,
      userRole
    )

    const origin = request.nextUrl.origin
    sendWelcomeEmail({ to: user.email, name: user.name, origin }).catch((err) =>
      console.error('Welcome email failed:', err)
    )
    if (emailVerificationToken) {
      sendEmailVerificationEmail({
        to: user.email,
        name: user.name,
        token: emailVerificationToken,
        origin,
      }).catch((err) => console.error('Verification email failed:', err))
    }

    const claims = jwtClaimsForUser(user)
    const token = await signAuthJwt(claims)
    const enforcePayment = paymentConfigured()

    const response = NextResponse.json({
      success: true,
      requiresPayment: enforcePayment,
      redirectTo:
        enforcePayment && (userRole === 'CLIENT' || userRole === 'FAMILY')
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
    console.error('Signup error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create account'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
