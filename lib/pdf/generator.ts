import { renderToBuffer } from '@react-pdf/renderer'
import { CampaignPDF } from './campaign-pdf'
import type { CampaignBlueprint } from '@/lib/ai/openai'

export async function generateCampaignPDF(
  blueprint: CampaignBlueprint,
  clientName: string,
  tdcjNumber: string
): Promise<Buffer> {
  const doc = CampaignPDF({ blueprint, clientName, tdcjNumber })
  const buffer = await renderToBuffer(doc)
  return buffer
}

export async function generateReentryGuidePDF(
  language: string = 'en'
): Promise<Buffer> {
  // TODO: Implement reentry guide PDF generation
  // This would be a templated guide with personalized sections
  throw new Error('Reentry guide PDF generation not yet implemented')
}
