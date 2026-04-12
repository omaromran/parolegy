import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'

// Only tier 3 (Premium / Self-Serve) is active for now
const ACTIVE_SERVICE_OPTION = 3

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { tier } = body as { tier?: string }

    // Map tier names to serviceOption: 1=Bronze, 2=Gold, 3=Premium (Self-Serve)
    const tierMap: Record<string, number> = {
      bronze: 1,
      gold: 2,
      premium: 3,
    }
    const serviceOption = tier ? tierMap[tier.toLowerCase()] : undefined

    if (serviceOption === undefined) {
      return NextResponse.json(
        { error: 'Invalid tier. Use bronze, gold, or premium.' },
        { status: 400 }
      )
    }

    if (serviceOption !== ACTIVE_SERVICE_OPTION) {
      return NextResponse.json(
        { error: 'This tier is not available yet. Only Premium (Self-Serve) is active.' },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id: user.id },
      data: { preferredServiceOption: serviceOption },
    })

    return NextResponse.json({ success: true, serviceOption })
  } catch (error) {
    console.error('Choose tier error:', error)
    return NextResponse.json(
      { error: 'Failed to save tier' },
      { status: 500 }
    )
  }
}
