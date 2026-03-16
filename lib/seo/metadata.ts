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
 * Generate JSON-LD structured data for a WebPage
 * @param title - Page title
 * @param description - Page description
 * @param path - Path for the URL
 * @returns JSON-LD object
 */
export function generateWebPageJsonLd({
  title,
  description,
  path = '',
}: {
  title: string
  description: string
  path?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = `${baseUrl}${path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for an Article
 * @param article - Article data
 * @returns JSON-LD object
 */
export function generateArticleJsonLd(article: {
  title: string
  description: string
  image?: {
    asset: {
      url: string
    }
    alt: string
  }
  author?: {
    name: string
  }
  publishedAt?: string
  slug?: { current: string }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = article.slug ? `${baseUrl}/article/${article.slug.current}` : `${baseUrl}/article`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image?.asset?.url,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
        }
      : undefined,
    datePublished: article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Kritvia',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for a BlogPosting
 * @param post - Blog post data
 * @returns JSON-LD object
 */
export function generateBlogPostJsonLd(post: {
  title: string
  excerpt: string
  image: {
    asset: {
      url: string
    }
    alt: string
  }
  slug: { current: string }
  author: {
    name: string
  }
  publishedAt: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = `${baseUrl}/blog/${post.slug.current}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image.asset.url,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kritvia',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for a Product
 * @param product - Product data
 * @returns JSON-LD object
 */
export function generateProductJsonLd(product: {
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
  offers: {
    price: number
    priceCurrency: string
    availability: string
  }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = `${baseUrl}/products/${product.slug.current}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image.asset.url,
    offers: {
      '@type': 'Offer',
      url: url,
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency || 'USD',
      availability: product.offers.availability || 'https://schema.org/InStock',
    },
    brand: {
      '@type': 'Organization',
      name: 'Kritvia',
    },
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for a BreadcrumbList
 * @param breadcrumbs - Array of breadcrumb items { name, href }
 * @returns JSON-LD object
 */
export function generateBreadcrumbJsonLd(breadcrumbs: {
  items: Array<{
    name: string
    href: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for an Organization
 * @param organization - Organization data
 * @returns JSON-LD object
 */
export function generateOrganizationJsonLd(organization: {
  name: string
  description?: string
  url?: string
  logo?: string
  sameAs?: Array<string>
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    description: organization.description,
    url: organization.url || baseUrl,
    logo: organization.logo || `${baseUrl}/logo.png`,
    sameAs: organization.sameAs,
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for a WebSite
 * @param website - Website data
 * @returns JSON-LD object
 */
export function generateWebSiteJsonLd(website: {
  name: string
  description?: string
  url?: string
  potentialAction?: {
    target: string
    'query-input': string
  }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: website.name,
    description: website.description,
    url: website.url || baseUrl,
    potentialAction: website.potentialAction || {
      '@type': 'SearchAction',
      target: `${website.url || baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } as Record<string, any>
}

/**
 * Generate JSON-LD structured data for a Documentation page
 * @param doc - Documentation data
 * @returns JSON-LD object
 */
export function generateDocumentationJsonLd(doc: {
  title: string
  description: string
  slug: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
  const url = `${baseUrl}/docs/${doc.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    url: url,
    author: {
      '@type': 'Organization',
      name: 'Kritvia',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kritvia',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: new Date().toISOString(), // We don't have a published date for docs, so use now
  } as Record<string, any>
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
 * * @returns Metadata object
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