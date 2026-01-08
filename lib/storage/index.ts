/**
 * Storage abstraction layer
 * Supports S3-compatible storage or local storage for development
 */

export interface StorageProvider {
  upload(file: Buffer | File, key: string): Promise<string>
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
  delete(key: string): Promise<void>
}

// S3 Storage Provider
class S3StorageProvider implements StorageProvider {
  // TODO: Implement S3 upload using AWS SDK
  async upload(file: Buffer | File, key: string): Promise<string> {
    throw new Error('S3 storage not yet implemented')
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    throw new Error('S3 storage not yet implemented')
  }

  async delete(key: string): Promise<void> {
    throw new Error('S3 storage not yet implemented')
  }
}

// Local Storage Provider (for development)
class LocalStorageProvider implements StorageProvider {
  async upload(file: Buffer | File, key: string): Promise<string> {
    // TODO: Implement local file storage
    throw new Error('Local storage not yet implemented')
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // TODO: Generate signed URL for local storage
    throw new Error('Local storage not yet implemented')
  }

  async delete(key: string): Promise<void> {
    // TODO: Delete local file
    throw new Error('Local storage not yet implemented')
  }
}

// Factory function
export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || 'local'
  
  if (provider === 's3') {
    return new S3StorageProvider()
  } else {
    return new LocalStorageProvider()
  }
}
