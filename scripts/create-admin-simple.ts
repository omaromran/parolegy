/**
 * Simple script to create an admin user with default credentials
 * Run with: npx tsx scripts/create-admin-simple.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@parolegy.com'
  const name = 'Admin User'
  const password = 'admin123' // CHANGE THIS IN PRODUCTION!

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('Admin user already exists')
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'ADMIN',
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\n⚠️  IMPORTANT: Change the password in production!')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
