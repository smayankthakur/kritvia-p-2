import { MetadataRoute } from 'next'
import { staticRoutes, dynamicRoutes } from '@/lib/routes'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'

// Priority mapping based on route importance
const priorityMap: Record<string, number> = {
  '/': 1,
  '/founder': 0.9,
  '/services': 0.9,
  '/solutions': 0.9,
  '/products': 0.8,
  '/platform': 0.8,
  '/case-studies': 0.9,
  '/blog': 0.8,
  '/research': 0.8,
  '/pricing': 0.8,
  '/contact': 0.9,
  '/company/about': 0.7,
  '/company/team': 0.6,
  '/company/careers': 0.7,
  '/platform/dashboard': 0.7,
  '/platform/ai-tools': 0.8,
  '/platform/developers': 0.8,
  '/platform/projects': 0.7,
  '/platform/invoices': 0.7,
  '/platform/startup-builder': 0.8,
  '/developers': 0.9,
  '/developers/docs': 0.8,
  '/developers/api': 0.8,
  '/developers/tutorials': 0.8,
  '/developers/quickstarts': 0.8,
  '/developers/sdk': 0.8,
  '/developers/cli': 0.8,
  '/industries': 0.7,
  '/resources': 0.7,
  '/resources/blog': 0.7,
  '/resources/guides': 0.6,
  '/resources/whitepapers': 0.6,
  '/privacy': 0.3,
  '/terms': 0.3,
  '/status': 0.5,
  '/changelog': 0.6,
}

// Change frequency mapping
const changeFrequencyMap: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  '/': 'weekly',
  '/blog': 'daily',
  '/research': 'weekly',
  '/resources/blog': 'daily',
  '/company/careers': 'weekly',
  '/resources': 'weekly',
  '/resources/guides': 'weekly',
  '/changelog': 'weekly',
}

function getPriority(route: string): number {
  return priorityMap[route] ?? 0.7
}

function getChangeFrequency(route: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  return changeFrequencyMap[route] ?? 'monthly'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  // Add static routes
  staticRoutes.forEach(route => {
    routes.push({
      url: BASE_URL + route,
      lastModified: new Date(),
      changeFrequency: getChangeFrequency(route),
      priority: getPriority(route),
    })
  })

  // Add dynamic routes
  dynamicRoutes.forEach(dynamic => {
    const generatedRoutes = dynamic.generator()
    generatedRoutes.forEach(route => {
      routes.push({
        url: BASE_URL + route,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })

  return routes
}
