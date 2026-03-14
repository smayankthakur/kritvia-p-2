import imageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '@/lib/sanity/client'

// https://www.sanity.io/docs/image-url
export const urlFor = (source: any, options: { width?: number; height?: number; format?: string } = {}): string => {
  if (!source) {
    throw new Error('Source is required for image URL')
  }
  const builder = imageUrlBuilder({ projectId, dataset }).image(source)
  if (options.width) builder.width(options.width)
  if (options.height) builder.height(options.height)
  if (options.format) {
    // @ts-ignore
    builder.format(options.format)
  }
  const url = builder.url()
  if (url === undefined) {
    throw new Error('Failed to generate image URL')
  }
  return url
}