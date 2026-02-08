import { NextRequest, NextResponse } from 'next/server'
import { updatePasswordWithToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    await updatePasswordWithToken(token, password)

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset. You can now log in.',
    })
  } catch (error: any) {
    if (error.message?.includes('Invalid or expired')) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      )
    }
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
