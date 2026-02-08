import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    })
    return user
  } catch {
    return null
  }
}
