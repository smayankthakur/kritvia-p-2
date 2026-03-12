import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

// Configure the image URL builder
export const urlFor = (source: any) => {
  return createImageUrlBuilder(client).image(source)
}