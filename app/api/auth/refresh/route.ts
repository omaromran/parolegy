import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { jwtClaimsForUser, signAuthJwt } from '@/lib/auth-token'
import { paymentConfigured } from '@/lib/payment-configured'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    const user = await db.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const claims = jwtClaimsForUser(user)
    const newToken = await signAuthJwt(claims)
    const staff = user.role === 'ADMIN' || user.role === 'STAFF'
    const effectivePaid =
      staff || !paymentConfigured() || user.hasPaidAccess

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPaidAccess: effectivePaid,
        emailVerified: user.emailVerified != null,
      },
    })

    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
