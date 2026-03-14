import { client } from './client'
import { previewClient } from './preview'
import { draftMode } from 'next/headers'

/**
 * Get the appropriate Sanity client based on draft mode
 * @returns Sanity client instance (preview client in draft mode, production client otherwise)
 */
export const getClient = async () => {
  const isDraftMode = await draftMode()
  return isDraftMode ? previewClient : client
}

/**
 * Fetch data with automatic draft mode handling and tags for revalidation
 * @param options - Fetch options
 * @param options.query GROQ query string
 * @param options.params Query parameters
 * @param options.tags Tags for cache revalidation
 * @returns Query result
 */
export async function sanityFetch<T = any>({
  query,
  params = {},
  tags = []
}: {
  query: string
  params?: Record<string, any>
  tags?: string[]
}) {
  const clientInstance = await getClient()
  
  // Use fetch with tags for revalidation in production
  if (process.env.NODE_ENV === 'production' && tags.length > 0) {
    return clientInstance.fetch<T>(query, params, {
      next: { tags }
    })
  }
  
  // In development or without tags, use regular fetch
  return clientInstance.fetch<T>(query, params)
}

export default {
  getClient,
  sanityFetch
}