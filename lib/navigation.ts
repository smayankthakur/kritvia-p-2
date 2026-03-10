/**
 * Kritvia Enterprise Navigation System
 * 
 * This file powers all menus across the platform.
 * All UI navigation components must consume this file.
 * 
 * IMPORTANT: When navigation items change, update this file.
 */

export interface NavItem {
  name: string
  href: string
  description?: string
  icon?: string
  badge?: string
  children?: NavItem[]
}

export interface NavigationSection {
  title?: string
  items: NavItem[]
}

export const navigation: Record<string, NavigationSection> = {
  main: {
    title: 'Main Menu',
    items: [
      { name: 'Services', href: '/services', description: 'Our digital services' },
      { name: 'Solutions', href: '/solutions', description: 'Business solutions' },
      { name: 'Products', href: '/products', description: 'Our products' },
      { name: 'Platform', href: '/platform', description: 'Kritvia Platform' },
      { name: 'Industries', href: '/industries', description: 'Industry solutions' },
      { name: 'Case Studies', href: '/case-studies', description: 'Success stories' },
      { name: 'Pricing', href: '/pricing', description: 'Pricing plans' },
    ],
  },
  
  company: {
    title: 'Company',
    items: [
      { name: 'About', href: '/company/about', description: 'Learn about us' },
      { name: 'Team', href: '/company/team', description: 'Meet our team' },
      { name: 'Careers', href: '/company/careers', description: 'Join our team' },
      { name: 'Contact', href: '/contact', description: 'Get in touch' },
    ],
  },
  
  resources: {
    title: 'Resources',
    items: [
      { name: 'Blog', href: '/blog', description: 'Latest insights' },
      { name: 'Research', href: '/research', description: 'Research & innovation' },
      { name: 'Guides', href: '/resources/guides', description: 'How-to guides' },
      { name: 'Whitepapers', href: '/resources/whitepapers', description: 'Research papers' },
    ],
  },
  
  platform: {
    title: 'Platform',
    items: [
      { name: 'Dashboard', href: '/platform/dashboard', description: 'Analytics dashboard' },
      { name: 'AI Tools', href: '/platform/ai-tools', description: 'AI-powered tools' },
      { name: 'Developers', href: '/platform/developers', description: 'Developer resources' },
      { name: 'Projects', href: '/platform/projects', description: 'Project management' },
      { name: 'Invoices', href: '/platform/invoices', description: 'Invoice management' },
      { name: 'Startup Builder', href: '/platform/startup-builder', description: 'Build your startup' },
    ],
  },
  
  legal: {
    title: 'Legal',
    items: [
      { name: 'Privacy', href: '/privacy', description: 'Privacy policy' },
      { name: 'Terms', href: '/terms', description: 'Terms of service' },
    ],
  },
}

// Mega menu configuration for header navigation
export const megaMenu: Record<string, { title: string; sections: NavigationSection[] }> = {
  products: {
    title: 'Products',
    sections: [
      {
        title: 'AI Products',
        items: [
          { name: 'Kritvia AI', href: '/products/kritvia-ai', description: 'AI-powered development', icon: '🤖' },
        ],
      },
      {
        title: 'Cloud Products',
        items: [
          { name: 'Kritvia Cloud', href: '/products/kritvia-cloud', description: 'Cloud infrastructure', icon: '☁️' },
          { name: 'Kritvia CRM', href: '/products/kritvia-crm', description: 'Customer relationship management', icon: '📊' },
        ],
      },
    ],
  },
  solutions: {
    title: 'Solutions',
    sections: [
      {
        title: 'Development',
        items: [
          { name: 'AI Development', href: '/solutions/ai-development', description: 'AI solutions', icon: '🧠' },
          { name: 'Web Development', href: '/solutions/web-development', description: 'Web applications', icon: '🌐' },
          { name: 'SaaS Development', href: '/solutions/saas-development', description: 'SaaS platforms', icon: '📦' },
          { name: 'Cloud Architecture', href: '/solutions/cloud-architecture', description: 'Cloud solutions', icon: '🏗️' },
        ],
      },
    ],
  },
  industries: {
    title: 'Industries',
    sections: [
      {
        title: 'Focus Industries',
        items: [
          { name: 'Fintech', href: '/industries/fintech', description: 'Financial technology', icon: '💳' },
          { name: 'Healthcare', href: '/industries/healthcare', description: 'Health tech', icon: '🏥' },
          { name: 'E-commerce', href: '/industries/ecommerce', description: 'Online retail', icon: '🛒' },
          { name: 'SaaS', href: '/industries/saas', description: 'Software as a service', icon: '☁️' },
        ],
      },
    ],
  },
}

// Helper function to get all navigation items as flat array
export function getAllNavItems(): NavItem[] {
  return [
    ...navigation.main.items,
    ...navigation.company.items,
    ...navigation.resources.items,
    ...navigation.platform.items,
    ...navigation.legal.items,
  ]
}

// Helper function to find navigation item by href
export function findNavItemByHref(href: string): NavItem | undefined {
  const allItems = getAllNavItems()
  return allItems.find(item => item.href === href)
}
