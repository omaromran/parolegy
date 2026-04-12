import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { paymentConfigured } from '@/lib/payment-configured'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        language: true,
        hasPaidAccess: true,
        emailVerified: true,
        consultationBookedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const staff = user.role === 'ADMIN' || user.role === 'STAFF'
    const effectivePaid =
      staff || !paymentConfigured() || user.hasPaidAccess

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        hasPaidAccess: effectivePaid,
        emailVerified: user.emailVerified != null,
        consultationBookedAt: user.consultationBookedAt?.toISOString() ?? null,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
