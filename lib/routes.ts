/**
 * Kritvia Route Registry
 * 
 * This file acts as the canonical registry of every route in the platform.
 * All systems must reference this registry for route information.
 * 
 * IMPORTANT: When a new page is added, removed, or renamed in the `/app` directory,
 * this file must be updated immediately.
 * 
 * Run `npm run generate-routes` to auto-update this file.
 */

export interface Route {
  path: string
  name: string
  category: 'core' | 'company' | 'products' | 'solutions' | 'industries' | 'platform' | 'resources' | 'legal' | 'developers'
  description?: string
}

export const routes: Route[] = [
  // Core Pages
  { path: '/', name: 'Home', category: 'core', description: 'Kritvia - AI Infrastructure Platform' },
  { path: '/about', name: 'About', category: 'core', description: 'Learn about Kritvia' },
  { path: '/services', name: 'Services', category: 'core', description: 'Our digital services' },
  { path: '/solutions', name: 'Solutions', category: 'core', description: 'Business solutions' },
  { path: '/products', name: 'Products', category: 'core', description: 'Our products' },
  { path: '/case-studies', name: 'Case Studies', category: 'core', description: 'Success stories' },
  { path: '/blog', name: 'Blog', category: 'core', description: 'Latest insights' },
  { path: '/research', name: 'Research', category: 'core', description: 'Research & innovation' },
  { path: '/pricing', name: 'Pricing', category: 'core', description: 'Pricing plans' },
  { path: '/contact', name: 'Contact', category: 'core', description: 'Get in touch' },
  
  // Company
  { path: '/company/about', name: 'About Us', category: 'company', description: 'About Kritvia' },
  { path: '/company/team', name: 'Team', category: 'company', description: 'Meet our team' },
  { path: '/company/careers', name: 'Careers', category: 'company', description: 'Join our team' },
  
  // Founder (New)
  { path: '/founder', name: 'Founder', category: 'company', description: 'About our founder' },
  
  // Platform (SaaS Features)
  { path: '/platform', name: 'Platform', category: 'platform', description: 'Kritvia Platform Overview' },
  { path: '/platform/ai-tools', name: 'AI Tools', category: 'platform', description: 'AI-powered development tools' },
  { path: '/platform/dashboard', name: 'Dashboard', category: 'platform', description: 'Analytics dashboard' },
  { path: '/platform/developers', name: 'Developers', category: 'platform', description: 'Developer resources' },
  { path: '/platform/invoices', name: 'Invoices', category: 'platform', description: 'Invoice management' },
  { path: '/platform/projects', name: 'Projects', category: 'platform', description: 'Project management' },
  { path: '/platform/startup-builder', name: 'Startup Builder', category: 'platform', description: 'Build your startup' },
  
  // Products (with dynamic slugs)
  { path: '/products', name: 'Products', category: 'products', description: 'All products' },
  
  // Industries (with dynamic slugs)
  { path: '/industries', name: 'Industries', category: 'industries', description: 'Industry solutions' },
  
  // Solutions (with dynamic slugs)
  { path: '/solutions', name: 'Solutions', category: 'solutions', description: 'All solutions' },
  
  // Resources
  { path: '/resources', name: 'Resources', category: 'resources', description: 'All resources' },
  { path: '/resources/blog', name: 'Blog', category: 'resources', description: 'Blog articles' },
  { path: '/resources/guides', name: 'Guides', category: 'resources', description: 'How-to guides' },
  { path: '/resources/whitepapers', name: 'Whitepapers', category: 'resources', description: 'Research papers' },
  
  // Developers (New)
  { path: '/developers', name: 'Developers', category: 'developers', description: 'Developer documentation' },
  { path: '/developers/docs', name: 'Documentation', category: 'developers', description: 'API documentation' },
  { path: '/developers/api', name: 'API Reference', category: 'developers', description: 'API reference' },
  { path: '/developers/tutorials', name: 'Tutorials', category: 'developers', description: 'Tutorials' },
  { path: '/developers/quickstarts', name: 'Quickstarts', category: 'developers', description: 'Quick start guides' },
  { path: '/developers/sdk', name: 'SDK', category: 'developers', description: 'SDK downloads' },
  { path: '/developers/cli', name: 'CLI', category: 'developers', description: 'Command line tools' },
  
  // Legal
  { path: '/privacy', name: 'Privacy Policy', category: 'legal', description: 'Privacy policy' },
  { path: '/terms', name: 'Terms of Service', category: 'legal', description: 'Terms of service' },
  
  // Status & Changelog
  { path: '/status', name: 'Status', category: 'developers', description: 'System status' },
  { path: '/changelog', name: 'Changelog', category: 'developers', description: 'Release notes' },
]

// Static routes for sitemap (excluding dynamic routes)
export const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/solutions',
  '/products',
  '/case-studies',
  '/blog',
  '/research',
  '/pricing',
  '/contact',
  '/founder',
  '/company/about',
  '/company/team',
  '/company/careers',
  '/platform',
  '/platform/ai-tools',
  '/platform/dashboard',
  '/platform/developers',
  '/platform/invoices',
  '/platform/projects',
  '/platform/startup-builder',
  '/industries',
  '/resources',
  '/resources/blog',
  '/resources/guides',
  '/resources/whitepapers',
  '/developers',
  '/developers/docs',
  '/developers/api',
  '/developers/tutorials',
  '/developers/quickstarts',
  '/developers/sdk',
  '/developers/cli',
  '/privacy',
  '/terms',
  '/status',
  '/changelog',
]

// Dynamic route patterns
export const dynamicRoutes = [
  { pattern: '/products/[slug]', generator: () => ['/products/trinity-os', '/products/ai-cloud', '/products/agents', '/products/dev-platform'] },
  { pattern: '/solutions/[slug]', generator: () => ['/solutions/ai-startups', '/solutions/enterprise', '/solutions/developers', '/solutions/research'] },
  { pattern: '/industries/[slug]', generator: () => ['/industries/fintech', '/industries/healthcare', '/industries/ecommerce', '/industries/saas'] },
]

// Helper function to get all routes including generated dynamic routes
export function getAllRoutes(): string[] {
  const allRoutes = [...staticRoutes]
  
  dynamicRoutes.forEach(dynamic => {
    allRoutes.push(...dynamic.generator())
  })
  
  return allRoutes
}

// Helper function to get routes by category
export function getRoutesByCategory(category: Route['category']): Route[] {
  return routes.filter(route => route.category === category)
}

// Helper function to find route by path
export function findRouteByPath(path: string): Route | undefined {
  return routes.find(route => route.path === path)
}
