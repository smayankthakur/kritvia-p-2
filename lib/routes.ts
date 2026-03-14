/**
 * Kritvia Route Registry
 * 
 * This file acts as the canonical registry of every route in the platform.
 * All systems must reference this registry for route information.
 */

import { getAllPostSlugs, getAllProductSlugs, getAllDocumentationSlugs } from '@/lib/sanity/queries'

export interface Route {
  slug: string
  title: string
  description?: string
  category: 'core' | 'products' | 'platform' | 'solutions' | 'developers' | 'resources' | 'company' | 'legal'
  hasCustomPage?: boolean
  keywords?: string[]
}

// Define the type for dynamic route generators
export type DynamicRouteGenerator = () => Promise<string[]>

// Complete route map for the platform
export const routes: Route[] = [
  // Core Pages
  { slug: '', title: 'Home', description: 'Kritvia - AI Infrastructure Platform', category: 'core', hasCustomPage: true },
  { slug: 'about', title: 'About', description: 'Learn about Kritvia - leading AI infrastructure company', category: 'core', hasCustomPage: true },
  { slug: 'services', title: 'Services', description: 'Our digital services', category: 'core', hasCustomPage: true },
  { slug: 'solutions', title: 'Solutions', description: 'Business solutions for AI transformation', category: 'core', hasCustomPage: true },
  { slug: 'products', title: 'Products', description: 'Explore Kritvia AI products', category: 'core', hasCustomPage: true },
  { slug: 'case-studies', title: 'Case Studies', description: 'Client success stories', category: 'core', hasCustomPage: true },
  { slug: 'blog', title: 'Blog', description: 'Latest insights and news', category: 'core', hasCustomPage: true },
  { slug: 'research', title: 'Research', description: 'Research and innovation', category: 'core', hasCustomPage: true },
  { slug: 'pricing', title: 'Pricing', description: 'Pricing plans for AI infrastructure', category: 'core', hasCustomPage: true },
  { slug: 'contact', title: 'Contact', description: 'Get in touch with us', category: 'core', hasCustomPage: true },
  
  // Company
  { slug: 'company/about', title: 'About Us', description: 'About Kritvia', category: 'company', hasCustomPage: true },
  { slug: 'company/team', title: 'Team', description: 'Meet our team', category: 'company', hasCustomPage: true },
  { slug: 'company/careers', title: 'Careers', description: 'Join our team', category: 'company', hasCustomPage: true },
  { slug: 'founder', title: 'Founder', description: 'About our founder', category: 'company', hasCustomPage: true },
  
  // Platform
  { slug: 'platform', title: 'Platform', description: 'Kritvia Platform Overview', category: 'platform', hasCustomPage: true },
  { slug: 'platform/ai-tools', title: 'AI Tools', description: 'AI-powered development tools', category: 'platform', hasCustomPage: true },
  { slug: 'platform/dashboard', title: 'Dashboard', description: 'Analytics dashboard', category: 'platform', hasCustomPage: true },
  { slug: 'platform/developers', title: 'Developers', description: 'Developer resources', category: 'platform', hasCustomPage: true },
  { slug: 'platform/invoices', title: 'Invoices', description: 'Invoice management', category: 'platform', hasCustomPage: true },
  { slug: 'platform/projects', title: 'Projects', description: 'Project management', category: 'platform', hasCustomPage: true },
  { slug: 'platform/startup-builder', title: 'Startup Builder', description: 'Build your startup', category: 'platform', hasCustomPage: true },
  { slug: 'platform/architecture', title: 'Architecture', description: 'Platform architecture', category: 'platform' },
  { slug: 'platform/security', title: 'Security', description: 'Platform security', category: 'platform' },
  { slug: 'platform/infrastructure', title: 'Infrastructure', description: 'Platform infrastructure', category: 'platform' },
  { slug: 'platform/ai-stack', title: 'AI Stack', description: 'AI technology stack', category: 'platform' },
  
  // Products
  { slug: 'products/trinity-os', title: 'Trinity OS', description: 'AI Operating System', category: 'products' },
  { slug: 'products/ai-cloud', title: 'AI Cloud', description: 'Cloud Infrastructure', category: 'products' },
  { slug: 'products/agents', title: 'Kritvia Agents', description: 'Autonomous AI Agents', category: 'products' },
  { slug: 'products/dev-platform', title: 'Dev Platform', description: 'Developer Tools', category: 'products' },
  { slug: 'products/kritvia-ai', title: 'Kritvia AI', description: 'AI-Powered Analytics', category: 'products' },
  { slug: 'products/kritvia-cloud', title: 'Kritvia Cloud', description: 'Cloud Management', category: 'products' },
  { slug: 'products/kritvia-crm', title: 'Kritvia CRM', description: 'Intelligent CRM', category: 'products' },
  
  // Solutions
  { slug: 'solutions/ai-startups', title: 'AI Startups', description: 'For AI startups', category: 'solutions' },
  { slug: 'solutions/enterprise', title: 'Enterprise', description: 'Enterprise solutions', category: 'solutions' },
  { slug: 'solutions/developers', title: 'Developers', description: 'For developers', category: 'solutions' },
  { slug: 'solutions/research', title: 'Research', description: 'Research solutions', category: 'solutions' },
  { slug: 'solutions/ai-development', title: 'AI Development', description: 'AI development services', category: 'solutions' },
  { slug: 'solutions/web-development', title: 'Web Development', description: 'Web development services', category: 'solutions' },
  { slug: 'solutions/saas-development', title: 'SaaS Development', description: 'SaaS development services', category: 'solutions' },
  { slug: 'solutions/cloud-architecture', title: 'Cloud Architecture', description: 'Cloud architecture services', category: 'solutions' },
  { slug: 'solutions/automation', title: 'Automation', description: 'Automation solutions', category: 'solutions' },
  
  // Developers
  { slug: 'developers', title: 'Developers', description: 'Developer portal', category: 'developers', hasCustomPage: true },
  { slug: 'developers/docs', title: 'Documentation', description: 'API documentation', category: 'developers' },
  { slug: 'developers/api', title: 'API Reference', description: 'API reference', category: 'developers' },
  { slug: 'developers/tutorials', title: 'Tutorials', description: 'Tutorials', category: 'developers' },
  { slug: 'developers/quickstarts', title: 'Quickstarts', description: 'Quick start guides', category: 'developers' },
  { slug: 'developers/sdk', title: 'SDK', description: 'SDK downloads', category: 'developers' },
  { slug: 'developers/cli', title: 'CLI', description: 'Command line tools', category: 'developers' },
  { slug: 'developers/open-source', title: 'Open Source', description: 'Open source projects', category: 'developers' },
  
  // Industries
  { slug: 'industries', title: 'Industries', description: 'Industry solutions', category: 'core', hasCustomPage: true },
  { slug: 'industries/fintech', title: 'Fintech', description: 'Financial technology', category: 'solutions' },
  { slug: 'industries/healthcare', title: 'Healthcare', description: 'Healthcare tech', category: 'solutions' },
  { slug: 'industries/ecommerce', title: 'E-commerce', description: 'E-commerce solutions', category: 'solutions' },
  { slug: 'industries/saas', title: 'SaaS', description: 'SaaS industry', category: 'solutions' },
  
  // Resources
  { slug: 'resources', title: 'Resources', description: 'All resources', category: 'resources', hasCustomPage: true },
  { slug: 'resources/blog', title: 'Blog', description: 'Blog articles', category: 'resources', hasCustomPage: true },
  { slug: 'resources/guides', title: 'Guides', description: 'How-to guides', category: 'resources', hasCustomPage: true },
  { slug: 'resources/whitepapers', title: 'Whitepapers', description: 'Research papers', category: 'resources', hasCustomPage: true },
  
  // Legal & Status
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy', category: 'legal', hasCustomPage: true },
  { slug: 'terms', title: 'Terms of Service', description: 'Terms of service', category: 'legal', hasCustomPage: true },
  { slug: 'status', title: 'Status', description: 'System status', category: 'developers' },
  { slug: 'changelog', title: 'Changelog', description: 'Release notes', category: 'developers' },
  { slug: 'community', title: 'Developer Community', description: 'Developer community', category: 'developers' },
  { slug: 'security', title: 'Security', description: 'Security information', category: 'legal' },
  { slug: 'compliance', title: 'Compliance', description: 'Compliance information', category: 'legal' },
  
  // Legal subroutes
  { slug: 'legal/privacy', title: 'Privacy Policy', description: 'Privacy policy', category: 'legal' },
  { slug: 'legal/terms', title: 'Terms of Service', description: 'Terms of service', category: 'legal' },
  
  // Case Studies subroutes
  { slug: 'case-studies/fintech-fraud-detection', title: 'Fintech Fraud Detection', description: 'How we helped a fintech company detect fraud with AI', category: 'core' },
  { slug: 'case-studies/healthtech-clinical-ai', title: 'HealthTech Clinical AI', description: 'AI-powered clinical decision support system', category: 'core' },
  { slug: 'case-studies/retail-personalization', title: 'Retail Personalization', description: 'Personalized shopping experience with AI', category: 'core' },
  { slug: 'case-studies/cloudscale-migration', title: 'CloudScale Migration', description: 'Seamless cloud migration for enterprise', category: 'core' },
  { slug: 'case-studies/legal-document-automation', title: 'Legal Document Automation', description: 'AI-powered legal document processing', category: 'core' },
  { slug: 'case-studies/logistics-analytics', title: 'Logistics Analytics', description: 'Real-time logistics optimization with AI', category: 'core' },
]

// Helper to get route by slug
export function getRouteBySlug(slug: string): Route | undefined {
  return routes.find(route => route.slug === slug)
}

// Helper to get all routes for static generation
export function getAllRouteSlugs(): string[] {
  return routes.map(route => route.slug)
}

// Helper to get routes by category
export function getRoutesByCategory(category: Route['category']): Route[] {
  return routes.filter(route => route.category === category)
}

// Get navigation links (for header/footer)
export function getNavigationRoutes() {
  return {
    products: routes.filter(r => r.category === 'products'),
    platform: routes.filter(r => r.category === 'platform'),
    solutions: routes.filter(r => r.category === 'solutions' && r.slug.startsWith('solutions/')),
    developers: routes.filter(r => r.category === 'developers'),
    company: routes.filter(r => r.category === 'company'),
    resources: routes.filter(r => r.category === 'resources'),
  }
}

// Legacy exports for backward compatibility with sitemap.ts
export const staticRoutes = routes.map(r => r.slug === '' ? '/' : '/' + r.slug)
export const dynamicRoutes: { pattern: string; generator: DynamicRouteGenerator }[] = [
  {
    pattern: '/blog/[slug]',
    generator: async () => {
      const slugs = await getAllPostSlugs();
      return slugs.map((slug: { slug: { current: string } }) => `/blog/${slug.slug.current}`);
    }
  },
  {
    pattern: '/products/[slug]',
    generator: async () => {
      const slugs = await getAllProductSlugs();
      return slugs.map((slug: { slug: { current: string } }) => `/products/${slug.slug.current}`);
    }
  },
  {
    pattern: '/docs/[...slug]',
    generator: async () => {
      const slugs = await getAllDocumentationSlugs();
      return slugs.map((slug: { slug: string }) => `/docs/${slug.slug}`);
    }
  }
]
