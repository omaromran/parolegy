import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { getStripe } from '@/lib/stripe'
import { paymentConfigured } from '@/lib/payment-configured'
import { getAppUrl } from '@/lib/app-url'

const priceId = process.env.STRIPE_PRICE_ID?.trim()

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.role !== 'CLIENT' && user.role !== 'FAMILY') {
    return NextResponse.json(
      { error: 'Checkout is only for client accounts' },
      { status: 403 }
    )
  }

  if (!paymentConfigured()) {
    return NextResponse.json(
      { error: 'Payments are not enabled' },
      { status: 503 }
    )
  }

  if (user.hasPaidAccess) {
    return NextResponse.json(
      { error: 'You already have access' },
      { status: 400 }
    )
  }

  const stripe = getStripe()
  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: 'Payments are not configured' },
      { status: 503 }
    )
  }

  const base = getAppUrl(request.nextUrl.origin)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
      metadata: { userId: user.id },
      customer_email: user.email,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Could not start checkout' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe checkout error:', e)
    return NextResponse.json(
      { error: 'Could not start checkout' },
      { status: 500 }
    )
  }
}
