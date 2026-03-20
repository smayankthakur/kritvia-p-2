/**
 * Payment Security - AES-256-GCM Encryption
 * 
 * Encrypts sensitive payment gateway credentials before DB storage
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16

function getEncryptionKey(): Buffer {
  const key = process.env.PAYMENT_ENCRYPTION_KEY
  
  if (!key) {
    // Fallback to a derived key from other env vars (less secure but functional)
    const secret = process.env.NEXTAUTH_SECRET || process.env.STRIPE_SECRET_KEY || 'fallback-key'
    return scryptSync(secret, 'payment-salt', 32)
  }
  
  return Buffer.from(key, 'hex')
}

/**
 * Encrypt sensitive configuration data
 */
export function encryptConfig(config: Record<string, string>): { encrypted: string; iv: string } {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  
  const cipher = createCipheriv(ALGORITHM, key, iv)
  
  const configString = JSON.stringify(config)
  let encrypted = cipher.update(configString, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  // Combine tag + encrypted data
  const combined = Buffer.concat([tag, Buffer.from(encrypted, 'hex')])
  
  return {
    encrypted: combined.toString('hex'),
    iv: iv.toString('hex')
  }
}

/**
 * Decrypt configuration data
 */
export function decryptConfig(encryptedData: string, iv: string): Record<string, string> {
  const key = getEncryptionKey()
  const ivBuffer = Buffer.from(iv, 'hex')
  
  const combined = Buffer.from(encryptedData, 'hex')
  const tag = combined.slice(0, TAG_LENGTH)
  const encrypted = combined.slice(TAG_LENGTH)
  
  const decipher = createDecipheriv(ALGORITHM, key, ivBuffer)
  decipher.setAuthTag(tag)
  
  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return JSON.parse(decrypted)
}

/**
 * Generate a random API key for gateway authentication
 */
export function generateApiKey(prefix: string = 'kv_pay'): string {
  const random = randomBytes(32).toString('hex')
  return `${prefix}_${random}`
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, string>): Record<string, string> {
  const masked: Record<string, string> = {}
  const sensitiveKeys = ['secret', 'key', 'token', 'password', 'apiKey', 'api_secret']
  
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))
    masked[key] = isSensitive ? '***REDACTED***' : value
  }
  
  return masked
}
