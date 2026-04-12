import { SignJWT } from 'jose'
import { paymentConfigured } from '@/lib/payment-configured'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

export type AuthJwtClaims = {
  userId: string
  email: string
  role: string
  hasPaidAccess: boolean
}

/** Staff always paid. When Stripe is not configured, portal clients are treated as paid (dev / pre-launch). */
export function jwtClaimsForUser(user: {
  id: string
  email: string
  role: string
  hasPaidAccess: boolean | null
}): AuthJwtClaims {
  const staff = user.role === 'ADMIN' || user.role === 'STAFF'
  const paid =
    staff || !paymentConfigured() ? true : Boolean(user.hasPaidAccess)
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    hasPaidAccess: paid,
  }
}

export async function signAuthJwt(claims: AuthJwtClaims): Promise<string> {
  return new SignJWT({
    userId: claims.userId,
    email: claims.email,
    role: claims.role,
    hasPaidAccess: claims.hasPaidAccess,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}
