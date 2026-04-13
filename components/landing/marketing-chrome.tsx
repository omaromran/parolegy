import { getLayoutSiteBlocks } from '@/lib/site-content'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'

/** Server wrapper: loads admin-editable header/footer copy once per request (cached). */
export async function MarketingChrome({ children }: { children: React.ReactNode }) {
  const layoutCopy = await getLayoutSiteBlocks()
  return (
    <div className="min-h-screen flex flex-col">
      <Header layoutCopy={layoutCopy} />
      {children}
      <Footer layoutCopy={layoutCopy} />
    </div>
  )
}
