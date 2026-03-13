import { createPreviewSubscriptionHook } from 'next-sanity'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './client'

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export const usePreviewSubscription = createPreviewSubscriptionHook(previewClient)