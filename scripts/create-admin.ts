/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('Create Admin User')
  console.log('================\n')

  const email = await question('Email: ')
  const name = await question('Name: ')
  const password = await question('Password: ')

  if (!email || !name || !password) {
    console.error('All fields are required')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.error('User already exists')
      process.exit(1)
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

    console.log('\n✅ Admin user created successfully!')
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

main()
