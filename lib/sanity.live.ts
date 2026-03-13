import { client } from './client'
import { previewClient } from './preview'
import { draftMode } from 'next/headers'

export async function getLiveClient() {
  const { isEnabled } = await draftMode()
  return isEnabled ? previewClient : client
}

export async function fetchLive<T>(query: string, params = {}) {
  const liveClient = await getLiveClient()
  return liveClient.fetch<T>(query, params)
}

export async function fetchLiveQuery<T>(query: string, params = {}) {
  const liveClient = await getLiveClient()
  return liveClient.fetch(query, params)
}