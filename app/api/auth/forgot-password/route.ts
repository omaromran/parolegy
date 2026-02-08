import { NextRequest, NextResponse } from 'next/server'
import { setPasswordResetToken } from '@/lib/auth'

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

    const token = await setPasswordResetToken(email.trim().toLowerCase())

    // Always return success to avoid leaking whether the email exists
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    // In development, include the link so you can test without email (optional)
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link.',
      ...(isDev && token && { resetUrl }),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
