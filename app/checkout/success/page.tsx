import { MarketingChrome } from "@/components/landing/marketing-chrome"
import { CheckoutSuccessClient } from "./checkout-success-client"

export default async function CheckoutSuccessPage() {
  return (
    <MarketingChrome>
      <CheckoutSuccessClient />
    </MarketingChrome>
  )
}
