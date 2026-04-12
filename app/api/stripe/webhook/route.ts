import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { sendPaymentConfirmationEmail } from '@/lib/email'

export const runtime = 'nodejs'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }
    const userId = session.metadata?.userId
    if (userId) {
      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? null

      await db.user.update({
        where: { id: userId },
        data: {
          hasPaidAccess: true,
          ...(customerId ? { stripeCustomerId: customerId } : {}),
        },
      })

      const user = await db.user.findUnique({ where: { id: userId } })
      if (user?.email) {
        sendPaymentConfirmationEmail({
          to: user.email,
          name: user.name,
        }).catch((err) =>
          console.error('Payment confirmation email failed:', err)
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
