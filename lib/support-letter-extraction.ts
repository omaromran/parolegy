import { openai, DEFAULT_MODEL } from '@/lib/ai/openai'
import { readUploadedDocument } from '@/lib/document-storage'

const MAX_CHARS_PER_LETTER = 18_000
const MAX_TOTAL_LETTER_CHARS = 96_000
const MAX_IMAGE_BYTES = 20 * 1024 * 1024

export type SupportLetterExcerpt = {
  id: string
  fileName: string
  text: string
  extractionNote?: string
}

type DocFields = {
  id: string
  caseId: string
  fileName: string
  storageKey: string
  mimeType: string
  type: string
}

function clampLetter(text: string): string {
  if (text.length <= MAX_CHARS_PER_LETTER) return text
  return `${text.slice(0, MAX_CHARS_PER_LETTER)}\n\n[... letter excerpt truncated for length ...]`
}

async function extractPdfText(buf: Buffer): Promise<string> {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buf) })
  try {
    const result = await parser.getText()
    return (result.text || '').trim()
  } finally {
    await parser.destroy()
  }
}

function isPdfMagic(buf: Buffer): boolean {
  return buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46
}

async function extractImageWithVision(buf: Buffer, mimeType: string): Promise<string> {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not set; cannot transcribe scanned letters')
  }
  if (buf.length > MAX_IMAGE_BYTES) {
    return ''
  }
  const safeMime = mimeType.startsWith('image/') ? mimeType : 'image/jpeg'
  const dataUrl = `data:${safeMime};base64,${buf.toString('base64')}`

  const res = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe every readable word from this document (support letter). Preserve paragraph breaks. If there is no readable text, reply exactly: No text extracted.',
          },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    max_tokens: 4096,
    temperature: 0.2,
  })

  return (res.choices[0]?.message?.content || '').trim()
}

function extractUtf8Text(buf: Buffer): string {
  return buf.toString('utf8').replace(/\0/g, '').trim()
}

/**
 * Reads uploaded SUPPORT_LETTER files from local disk (same layout as document file API).
 */
export async function extractSupportLetterTexts(
  documents: DocFields[]
): Promise<SupportLetterExcerpt[]> {
  const letters = documents.filter((d) => d.type === 'SUPPORT_LETTER')
  const excerpts: SupportLetterExcerpt[] = []

  for (const doc of letters) {
    let text = ''
    let note: string | undefined

    try {
      const buf = await readUploadedDocument(doc.caseId, doc.storageKey)
      const mime = (doc.mimeType || '').toLowerCase()
      const lowerName = doc.fileName.toLowerCase()

      if (mime.includes('pdf') || lowerName.endsWith('.pdf') || isPdfMagic(buf)) {
        try {
          text = await extractPdfText(buf)
        } catch (pdfErr) {
          note = pdfErr instanceof Error ? pdfErr.message : 'PDF parse failed'
          text = ''
        }
        if (!text) {
          note =
            (note ? `${note} ` : '') +
            'No text layer in PDF (likely scanned). Upload letter as PNG/JPEG or a searchable PDF for full content.'
        }
      } else if (mime.startsWith('image/')) {
        try {
          text = await extractImageWithVision(buf, doc.mimeType || 'image/jpeg')
        } catch (imgErr) {
          note = imgErr instanceof Error ? imgErr.message : 'Image transcription failed'
        }
        if (!text || /^no text extracted\.?$/i.test(text)) {
          text = ''
          note = note || 'No text extracted from image.'
        }
      } else if (
        mime.includes('text/plain') ||
        mime.includes('text/markdown') ||
        lowerName.endsWith('.txt') ||
        lowerName.endsWith('.md')
      ) {
        text = extractUtf8Text(buf)
      } else if (
        /\.(docx?|xlsx?|csv)$/i.test(lowerName) ||
        mime.includes('wordprocessing') ||
        mime.includes('msword') ||
        mime.includes('spreadsheetml') ||
        mime.includes('ms-excel') ||
        mime.includes('excel') ||
        mime.includes('csv')
      ) {
        text = ''
        note =
          'Word, Excel, or CSV file is stored. For automatic letter text in generated campaigns, upload a searchable PDF, image scan, or .txt copy when possible.'
      } else {
        text = extractUtf8Text(buf)
        if (text.length < 30 && buf.length > 200) {
          text = ''
          note = `Unsupported format (${mime || 'unknown'}). Use PDF, PNG/JPEG, Word/Excel (stored), or .txt for best results.`
        }
      }
    } catch (e) {
      note = e instanceof Error ? e.message : 'Failed to read file'
      text = ''
    }

    excerpts.push({
      id: doc.id,
      fileName: doc.fileName,
      text: clampLetter(text),
      extractionNote: text ? note : note || 'No text extracted.',
    })
  }

  // Enforce total budget across letters (keep order, trim tail)
  let used = 0
  const trimmed: SupportLetterExcerpt[] = []
  for (const ex of excerpts) {
    const piece = ex.text
    if (!piece) {
      trimmed.push(ex)
      continue
    }
    if (used + piece.length <= MAX_TOTAL_LETTER_CHARS) {
      trimmed.push(ex)
      used += piece.length
      continue
    }
    const room = MAX_TOTAL_LETTER_CHARS - used
    if (room > 400) {
      trimmed.push({
        ...ex,
        text: `${piece.slice(0, room)}\n\n[... total letter corpus truncated ...]`,
        extractionNote: [ex.extractionNote, 'Corpus truncated for model context limit.']
          .filter(Boolean)
          .join(' '),
      })
    }
    break
  }

  return trimmed
}
