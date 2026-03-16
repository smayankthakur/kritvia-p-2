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
 * Fetch data with automatic draft mode handling
 * @param query GROQ query string
 * @param params Query parameters
 * @returns Query result
 */
export async function fetch<T = any>(query: string, params: Record<string, any> = {}) {
  const clientInstance = await getClient()
  return clientInstance.fetch<T>(query, params)
}

/**
 * Fetch data with automatic draft mode handling and tags for revalidation
 * @param query GROQ query string
 * @param params Query parameters
 * @param tags Tags for cache revalidation
 * @returns Query result
 */
export async function fetchWithTag<T = any>(
  query: string,
  params: Record<string, any> = {},
  tags: string[] = []
) {
  const clientInstance = await getClient()
  return clientInstance.fetch<T>(query, params, { 
    next: { tags } 
  })
}

/**
 * Fetch data with Sanity-specific caching and revalidation features
 * @param options Query options including query, params, and tags
 * @returns Query result with automatic draft mode handling and tag-based revalidation
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
  return clientInstance.fetch<T>(query, params, { 
    next: { tags } 
  })
}

export default {
  getClient,
  fetch,
  fetchWithTag,
  sanityFetch
}