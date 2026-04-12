/**
 * Payment gate env check only — safe to import from Edge middleware (no Stripe SDK).
 */
export function paymentConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY?.trim() && process.env.STRIPE_PRICE_ID?.trim())
}
