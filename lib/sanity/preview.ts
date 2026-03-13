import { createClient } from 'next-sanity'
import { client } from './client'

export const previewClient = createClient({
  projectId: client.projectId,
  dataset: client.dataset,
  apiVersion: client.apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})