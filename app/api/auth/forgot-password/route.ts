import { NextRequest, NextResponse } from 'next/server'
import { normalizeEmail, setPasswordResetToken } from '@/lib/auth'
import { getAppUrl } from '@/lib/app-url'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const token = await setPasswordResetToken(email)
    const base = getAppUrl(request.nextUrl.origin)

    if (token) {
      const em = normalizeEmail(email)
      const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`
      sendPasswordResetEmail({ to: em, resetUrl }).catch((err) =>
        console.error('Password reset email failed:', err)
      )
    }

    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json({
      success: true,
      message:
        'If an account exists with that email, you will receive a password reset link.',
      ...(isDev && token && { resetUrl: `${base}/reset-password?token=${encodeURIComponent(token)}` }),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    console.error('Forgot password error:', error)
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? message
            : 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}
