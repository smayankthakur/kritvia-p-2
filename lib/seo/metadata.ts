import { Metadata } from 'next'

/**
 * Generate SEO metadata for a page
 * @param title - Page title
 * @param description - Page description
 * @param imageUrl - Optional image URL for Open Graph
 * @param path - Optional path for canonical URL
 * @returns Metadata object
 */
export function generateSeoMetadata({
  title,
  description,
  imageUrl,
  path = '',
}: {
  title: string
  description: string
  imageUrl?: string
  path?: string
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = `${baseUrl}${path}`

  return {
    title: `${title} — Kritvia`,
    description,
    openGraph: {
      title: `${title} — Kritvia`,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Kritvia`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    // Alternate URLs for internationalization (if needed)
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate SEO metadata for blog posts
 * @param post - Blog post data
 * @returns Metadata object
 */
export function generateBlogPostMetadata(post: {
  title: string
  excerpt: string
  image: {
    asset: {
      url: string
    }
    alt: string
  }
  slug: { current: string }
}): Metadata {
  return generateSeoMetadata({
    title: post.title,
    description: post.excerpt,
    imageUrl: post.image.asset.url,
    path: `/blog/${post.slug.current}`,
  })
}

/**
 * Generate SEO metadata for products
 * @param product - Product data
 * @returns Metadata object
 */
export function generateProductMetadata(product: {
  title: string
  tagline: string
  description: string
  image: {
    asset: {
      url: string
    }
    alt: string
  }
  slug: { current: string }
}): Metadata {
  return generateSeoMetadata({
    title: product.title,
    description: product.tagline || product.description,
    imageUrl: product.image.asset.url,
    path: `/products/${product.slug.current}`,
  })
}

/**
 * Generate SEO metadata for documentation pages
 * @param doc - Documentation data
 * @returns Metadata object
 */
export function generateDocumentationMetadata(doc: {
  title: string
  description: string
  seo?: {
    seoTitle?: string
    seoDescription?: string
    ogImage?: {
      asset: {
        url: string
      }
      alt: string
    }
  }
  slug: string
}): Metadata {
  return generateSeoMetadata({
    title: doc.seo?.seoTitle || doc.title,
    description: doc.seo?.seoDescription || doc.description,
    imageUrl: doc.seo?.ogImage?.asset?.url,
    path: `/docs/${doc.slug}`,
  })
}

/**
 * Generate SEO metadata for generic pages
 * @param page - Page data
 * @returns Metadata object
 */
export function generatePageMetadata(page: {
  title: string
  description: string
  heroImage?: {
    asset: {
      url: string
    }
    alt: string
  }
  slug: { current: string }
}): Metadata {
  return generateSeoMetadata({
    title: page.title,
    description: page.description,
    imageUrl: page.heroImage?.asset?.url,
    path: `/${page.slug.current}`,
  })
}