import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-api'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const caseId = formData.get('caseId') as string
    const type = formData.get('type') as string

    if (!file || !caseId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: file, caseId, type' },
        { status: 400 }
      )
    }

    const allowedTypes = ['SUPPORT_LETTER', 'PHOTO', 'CERTIFICATE', 'EMPLOYMENT_PLAN', 'HOUSING_PLAN', 'OTHER']
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Verify case belongs to user
    const caseRecord = await db.case.findFirst({
      where: { id: caseId, userId: user.id },
    })
    if (!caseRecord) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name) || '.bin'
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const caseDir = path.join(UPLOADS_DIR, caseId)
    await mkdir(caseDir, { recursive: true })
    const filePath = path.join(caseDir, safeName)
    await writeFile(filePath, bytes)

    const storageKey = `uploads/${caseId}/${safeName}`

    const document = await db.document.create({
      data: {
        caseId,
        type,
        fileName: file.name,
        storageKey,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        uploadedBy: user.id,
      },
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
