import Stripe from 'stripe'

export { paymentConfigured } from '@/lib/payment-configured'

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { typescript: true })
}
