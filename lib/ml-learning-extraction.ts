import { openai, DEFAULT_MODEL } from '@/lib/ai/openai'
import { readUploadedDocument } from '@/lib/document-storage'
import { mlLearningStorageCaseId } from '@/lib/ml-learning-storage'

const MAX_CHARS_PER_FILE = 16_000
const MAX_TOTAL_ML_CHARS = 80_000
const MAX_IMAGE_BYTES = 20 * 1024 * 1024

type MlFileRow = {
  learningId: string
  fileName: string
  storageKey: string
  mimeType: string
  side: string
  createdAt?: Date
}

function clamp(text: string): string {
  if (text.length <= MAX_CHARS_PER_FILE) return text
  return `${text.slice(0, MAX_CHARS_PER_FILE)}\n\n[... excerpt truncated for length ...]`
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
    throw new Error('OPENAI_API_KEY is not set; cannot transcribe scanned documents')
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
            text: 'Transcribe every readable word from this document. Preserve paragraph breaks. If there is no readable text, reply exactly: No text extracted.',
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

async function extractOneFile(row: MlFileRow): Promise<{ label: string; text: string; note?: string }> {
  const label = `${row.side}: ${row.fileName}`
  let text = ''
  let note: string | undefined

  try {
    const buf = await readUploadedDocument(mlLearningStorageCaseId(row.learningId), row.storageKey)
    const mime = (row.mimeType || '').toLowerCase()
    const lowerName = row.fileName.toLowerCase()

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
          'No text layer in PDF (likely scanned). Upload PNG/JPEG or a searchable PDF when possible.'
      }
    } else if (mime.startsWith('image/')) {
      try {
        text = await extractImageWithVision(buf, row.mimeType || 'image/jpeg')
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
        'Word, Excel, or CSV stored; automatic text extraction skipped. Upload PDF or images for full use in generation.'
    } else {
      text = extractUtf8Text(buf)
      if (text.length < 30 && buf.length > 200) {
        text = ''
        note = `Unsupported format (${mime || 'unknown'}). Prefer PDF, PNG/JPEG, or .txt.`
      }
    }
  } catch (e) {
    note = e instanceof Error ? e.message : 'Failed to read file'
    text = ''
  }

  return {
    label,
    text: clamp(text),
    note: text ? note : note || 'No text extracted.',
  }
}

type LearningWithFiles = {
  id: string
  files: MlFileRow[]
}

/**
 * Plain-text block for the parole narrative prompt: grouped before/after excerpts per learning.
 */
export async function buildMachineLearningExamplesForPrompt(
  learnings: LearningWithFiles[]
): Promise<string> {
  if (learnings.length === 0) return ''

  const parts: string[] = []
  let used = 0

  for (let i = 0; i < learnings.length; i++) {
    const L = learnings[i]
    const byTime = (a: MlFileRow, b: MlFileRow) =>
      (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)
    const before = L.files.filter((f) => f.side === 'BEFORE').sort(byTime)
    const after = L.files.filter((f) => f.side === 'AFTER').sort(byTime)

    const beforeBits: string[] = []
    for (const f of before) {
      const ex = await extractOneFile(f)
      const block = `[${ex.label}]${ex.note && !ex.text ? ` (${ex.note})` : ''}\n${ex.text || '(no extractable text)'}`
      beforeBits.push(block)
    }
    const afterBits: string[] = []
    for (const f of after) {
      const ex = await extractOneFile(f)
      const block = `[${ex.label}]${ex.note && !ex.text ? ` (${ex.note})` : ''}\n${ex.text || '(no extractable text)'}`
      afterBits.push(block)
    }

    let chunk = `--- Example ${i + 1} (stored learning pair) ---\n`
    chunk += `BEFORE — materials the client/family submitted:\n${beforeBits.join('\n\n---\n') || '(no files uploaded)'}\n\n`
    chunk += `AFTER — Parolegy parole campaign produced for that matter:\n${afterBits.join('\n\n---\n') || '(no files uploaded)'}\n`

    if (used + chunk.length > MAX_TOTAL_ML_CHARS) {
      const room = MAX_TOTAL_ML_CHARS - used
      if (room > 500) {
        parts.push(`${chunk.slice(0, room)}\n\n[... further examples omitted for length ...]`)
      }
      break
    }
    parts.push(chunk)
    used += chunk.length
  }

  return parts.join('\n')
}
