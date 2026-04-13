import { deleteUploadedDocument } from '@/lib/document-storage'

/** Folder name under `uploads/` for a learning’s files (matches `saveUploadedDocument` caseId). */
export function mlLearningStorageCaseId(learningId: string): string {
  return `ml-${learningId}`
}

export async function deleteStoredMlFiles(
  learningId: string,
  files: { storageKey: string }[]
): Promise<void> {
  const folder = mlLearningStorageCaseId(learningId)
  for (const f of files) {
    await deleteUploadedDocument(folder, f.storageKey)
  }
}
