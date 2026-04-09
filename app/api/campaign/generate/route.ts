import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'

/**
 * Campaign generation is performed by Parolegy staff (admin) using the Knowledge hub + LLM.
 * Clients submit assessments and documents only.
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json(
    {
      error:
        'Campaign generation is prepared by Parolegy staff. Complete your assessment and uploads; your parole campaign will appear here when it is ready.',
    },
    { status: 403 }
  )
}
