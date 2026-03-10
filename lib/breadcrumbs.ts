/**
 * Kritvia Smart Breadcrumbs System
 * 
 * Automatically generates breadcrumb navigation from route paths.
 * 
 * Example:
 * /products/kritvia-ai → Home → Products → Kritvia AI
 */

export interface BreadcrumbItem {
  name: string
  href: string
}

export interface BreadcrumbPath {
  path: string
  items: BreadcrumbItem[]
}

// Route to breadcrumb name mapping
const routeNames: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/services': 'Services',
  '/solutions': 'Solutions',
  '/products': 'Products',
  '/case-studies': 'Case Studies',
  '/blog': 'Blog',
  '/research': 'Research',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/platform': 'Platform',
  '/industries': 'Industries',
  '/resources': 'Resources',
  '/company/about': 'About Us',
  '/company/team': 'Team',
  '/company/careers': 'Careers',
  '/platform/dashboard': 'Dashboard',
  '/platform/ai-tools': 'AI Tools',
  '/platform/developers': 'Developers',
  '/platform/projects': 'Projects',
  '/platform/invoices': 'Invoices',
  '/platform/startup-builder': 'Startup Builder',
  '/resources/blog': 'Blog',
  '/resources/guides': 'Guides',
  '/resources/whitepapers': 'Whitepapers',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  // Dynamic route labels
  'products': 'Products',
  'solutions': 'Solutions',
  'industries': 'Industries',
}

// Generate breadcrumbs from a URL path
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = []
  
  // Always start with Home
  items.push({ name: 'Home', href: '/' })
  
  // Handle root path
  if (pathname === '/') {
    return items
  }
  
  // Split path into segments
  const segments = pathname.split('/').filter(Boolean)
  
  let currentPath = ''
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`
    
    // Skip if it's a dynamic route parameter
    if (segment.startsWith('[') && segment.endsWith(']')) {
      continue
    }
    
    // Check for exact match first
    let name = routeNames[currentPath]
    
    // If no exact match, try to find by parent key
    if (!name) {
      // Check if this segment matches any key in routeNames
      const matchingKey = Object.keys(routeNames).find(
        key => key === segment || key.endsWith(`/${segment}`)
      )
      if (matchingKey) {
        name = routeNames[matchingKey]
      }
    }
    
    // If still no name, format the segment as a title
    if (!name) {
      name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    items.push({
      name,
      href: currentPath,
    })
  }
  
  return items
}

// Generate breadcrumb schema for JSON-LD
export function generateBreadcrumbSchema(pathname: string, siteUrl: string = 'https://kritvia.com'): object {
  const breadcrumbs = generateBreadcrumbs(pathname)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href === '/' ? siteUrl : siteUrl + item.href,
    })),
  }
}

// Check if a path has breadcrumbs
export function hasBreadcrumbs(pathname: string): boolean {
  return pathname !== '/'
}
