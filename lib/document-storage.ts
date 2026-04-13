/**
 * Document bytes: local `uploads/` dir, or S3-compatible object storage when S3_* env is set.
 * On Railway/Vercel etc., local disk is ephemeral—configure S3 (or R2/MinIO) for production.
 */

import path from 'path'
import { mkdir, writeFile, readFile, unlink } from 'fs/promises'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

/** Local disk root for case folders. Override with UPLOADS_DIR (e.g. /app/uploads when a Railway volume is mounted there). */
export function getLocalUploadsRoot(): string {
  const env = process.env.UPLOADS_DIR?.trim()
  if (env) {
    return path.isAbsolute(env) ? env : path.resolve(process.cwd(), env)
  }
  return path.join(process.cwd(), 'uploads')
}

export function usesObjectStorage(): boolean {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
      process.env.AWS_ACCESS_KEY_ID?.trim() &&
      process.env.AWS_SECRET_ACCESS_KEY?.trim()
  )
}

function s3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT?.trim()
  return new S3Client({
    region: process.env.AWS_REGION?.trim() || 'us-east-1',
    endpoint: endpoint || undefined,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  })
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body) throw new Error('Empty response body')
  if (Buffer.isBuffer(body)) return body
  if (body instanceof Uint8Array) return Buffer.from(body)
  const chunks: Buffer[] = []
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

/** DB storageKey format: uploads/{caseId}/{safeName} */
export async function saveUploadedDocument(
  caseId: string,
  safeName: string,
  buffer: Buffer,
  contentType: string
): Promise<{ storageKey: string }> {
  const storageKey = `uploads/${caseId}/${safeName}`

  if (usesObjectStorage()) {
    await s3Client().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!.trim(),
        Key: storageKey,
        Body: buffer,
        ContentType: contentType || 'application/octet-stream',
      })
    )
    return { storageKey }
  }

  const root = getLocalUploadsRoot()
  const caseDir = path.join(root, caseId)
  await mkdir(caseDir, { recursive: true })
  await writeFile(path.join(caseDir, safeName), buffer)
  return { storageKey }
}

export async function readUploadedDocument(caseId: string, storageKey: string): Promise<Buffer> {
  if (usesObjectStorage()) {
    const out = await s3Client().send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!.trim(),
        Key: storageKey,
      })
    )
    return bodyToBuffer(out.Body)
  }

  const filePath = path.join(getLocalUploadsRoot(), caseId, path.basename(storageKey))
  return readFile(filePath)
}

/** Remove stored bytes for a document. Local: ignores missing file (ENOENT). */
export async function deleteUploadedDocument(caseId: string, storageKey: string): Promise<void> {
  if (usesObjectStorage()) {
    await s3Client().send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!.trim(),
        Key: storageKey,
      })
    )
    return
  }

  const filePath = path.join(getLocalUploadsRoot(), caseId, path.basename(storageKey))
  try {
    await unlink(filePath)
  } catch (e: unknown) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') throw e
  }
}
