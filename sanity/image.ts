import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

// Configure the image URL builder
const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => {
  return builder.image(source)
}