/**
 * Kritvia SEO Schema System
 * 
 * Generates structured data using JSON-LD for SEO optimization.
 * Include these schemas in page metadata for rich search results.
 */

import { routes } from './routes'

const SITE_URL = 'https://kritvia.com'
const SITE_NAME = 'Kritvia'
const SITE_DESCRIPTION = 'Premium Digital Transformation Platform - AI-powered development, cloud architecture, and SaaS solutions.'
const LOGO_URL = `${SITE_URL}/logo.png`
const TWITTER_HANDLE = '@kritvia'

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  description: SITE_DESCRIPTION,
  sameAs: [
    'https://twitter.com/kritvia',
    'https://linkedin.com/company/kritvia',
    'https://github.com/smayankthakur/kritvia-p-2',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
}

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// Product Schema Generator
export function generateProductSchema(product: {
  name: string
  description: string
  slug: string
  price?: string
  rating?: number
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${SITE_URL}/products/${product.slug}/og-image.png`,
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 100,
      },
    }),
  }
}

// Service Schema Generator
export function generateServiceSchema(service: {
  name: string
  description: string
  slug: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: 'Worldwide',
    serviceType: 'Digital Transformation',
  }
}

// Article/Blog Post Schema Generator
export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  image?: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_URL}/og-default.png`,
    url: `${SITE_URL}/blog/${article.slug}`,
    ...(article.author && {
      author: {
        '@type': 'Person',
        name: article.author,
      },
    }),
    ...(article.publishedTime && {
      datePublished: article.publishedTime,
    }),
    ...(article.modifiedTime && {
      dateModified: article.modifiedTime,
    }),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
  }
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Software Application Schema
export const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kritvia Platform',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  url: SITE_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
}

// Course Schema Generator
export function generateCourseSchema(course: {
  name: string
  description: string
  provider?: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || SITE_NAME,
    },
  }
}

// Local Business Schema (for office locations)
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: LOGO_URL,
  url: SITE_URL,
  telephone: '+1-555-123-4567',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
}

// HowTo Schema Generator
export function generateHowToSchema(howTo: {
  name: string
  description: string
  steps: Array<{ name: string; text: string }>
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

// Convert schema to JSON-LD string
export function toJsonLd(schema: object): string {
  return JSON.stringify(schema)
}

// Generate all common schemas as metadata
export function generatePageSchema(
  pagePath: string,
  pageData?: {
    title: string
    description: string
    type?: 'article' | 'product' | 'service' | 'course'
  }
): unknown[] {
  const schemas: unknown[] = [
    organizationSchema,
    websiteSchema,
  ]
  
  // Add specific page schemas
  if (pageData) {
    switch (pageData.type) {
      case 'article':
        schemas.push(generateArticleSchema({
          title: pageData.title,
          description: pageData.description,
          slug: pagePath.replace('/blog/', ''),
        }))
        break
      case 'product':
        schemas.push(generateProductSchema({
          name: pageData.title,
          description: pageData.description,
          slug: pagePath.replace('/products/', ''),
        }))
        break
      case 'service':
        schemas.push(generateServiceSchema({
          name: pageData.title,
          description: pageData.description,
          slug: pagePath.replace('/services/', ''),
        }))
        break
      case 'course':
        schemas.push(generateCourseSchema({
          name: pageData.title,
          description: pageData.description,
        }))
        break
    }
  }
  
  return schemas
}
