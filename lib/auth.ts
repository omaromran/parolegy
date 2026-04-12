import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from './db'

const RESET_TOKEN_EXPIRY_HOURS = 1
const EMAIL_VERIFY_EXPIRY_HOURS = 48

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: string = 'CLIENT'
) {
  const em = normalizeEmail(email)

  const existingUser = await db.user.findUnique({
    where: { email: em },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const passwordHash = await hashPassword(password)
  const isPortalClient = role === 'CLIENT' || role === 'FAMILY'
  const verifyExpires = new Date()
  verifyExpires.setHours(verifyExpires.getHours() + EMAIL_VERIFY_EXPIRY_HOURS)
  const emailVerificationToken = isPortalClient ? createPasswordResetToken() : null

  const user = await db.user.create({
    data: {
      email: em,
      passwordHash,
      name,
      role,
      hasPaidAccess: !isPortalClient,
      emailVerified: isPortalClient ? null : new Date(),
      emailVerificationToken,
      emailVerificationExpires: isPortalClient ? verifyExpires : null,
    },
  })

  return { user, emailVerificationToken }
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email: normalizeEmail(email) },
  })

  if (!user || !user.passwordHash) {
    throw new Error('Invalid credentials')
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  // Return user without password hash
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}

export function createPasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function setPasswordResetToken(email: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { email: normalizeEmail(email) },
  })
  if (!user) return null

  const token = createPasswordResetToken()
  const expires = new Date()
  expires.setHours(expires.getHours() + RESET_TOKEN_EXPIRY_HOURS)

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  })
  return token
}

export async function validatePasswordResetToken(token: string) {
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  })
  return user
}

export async function updatePasswordWithToken(token: string, newPassword: string) {
  const user = await validatePasswordResetToken(token)
  if (!user) throw new Error('Invalid or expired reset link')

  const passwordHash = await hashPassword(newPassword)
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  })
  return user
}

export async function verifyEmailWithToken(token: string): Promise<boolean> {
  if (!token || token.length < 10) return false
  const user = await db.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { gt: new Date() },
    },
  })
  if (!user) return false

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  })
  return true
}
