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
  megaMenu?: boolean
}

export interface NavigationSection {
  title?: string
  items: NavItem[]
}

export interface MegaMenuConfig {
  title: string
  description?: string
  sections: NavigationSection[]
  featured?: NavItem
}

// Main navigation for header
export const mainNavigation: NavItem[] = [
  { 
    name: 'Products', 
    href: '/products', 
    megaMenu: true,
    description: 'Our product suite' 
  },
  { 
    name: 'Solutions', 
    href: '/solutions', 
    megaMenu: true,
    description: 'Business solutions' 
  },
  { 
    name: 'Industries', 
    href: '/industries', 
    megaMenu: true,
    description: 'Industry solutions' 
  },
  { 
    name: 'Developers', 
    href: '/platform/developers', 
    megaMenu: true,
    description: 'Developer resources' 
  },
  { 
    name: 'Resources', 
    href: '/resources', 
    megaMenu: true,
    description: 'Learning & insights' 
  },
  { 
    name: 'Pricing', 
    href: '/pricing',
    description: 'View pricing' 
  },
]

// Legacy navigation object for backward compatibility
export const navigation: Record<string, NavigationSection> = {
  main: {
    title: 'Main Menu',
    items: mainNavigation,
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

// Mega menu configurations
export const megaMenus: Record<string, MegaMenuConfig> = {
  products: {
    title: 'Products',
    description: 'Build with our comprehensive product suite',
    featured: {
      name: 'Kritvia AI',
      href: '/products/kritvia-ai',
      description: 'AI-powered development platform',
      icon: '🤖',
    },
    sections: [
      {
        title: 'AI & Intelligence',
        items: [
          { name: 'Kritvia AI', href: '/products/kritvia-ai', description: 'AI-powered development', icon: '🤖' },
          { name: 'AI Tools', href: '/platform/ai-tools', description: 'AI development tools', icon: '🧠' },
        ],
      },
      {
        title: 'Cloud & Infrastructure',
        items: [
          { name: 'Kritvia Cloud', href: '/products/kritvia-cloud', description: 'Cloud infrastructure', icon: '☁️' },
          { name: 'Startup Builder', href: '/platform/startup-builder', description: 'Launch faster', icon: '🚀' },
        ],
      },
      {
        title: 'Business Tools',
        items: [
          { name: 'Kritvia CRM', href: '/products/kritvia-crm', description: 'Customer management', icon: '📊' },
          { name: 'Projects', href: '/platform/projects', description: 'Project management', icon: '📁' },
          { name: 'Invoices', href: '/platform/invoices', description: 'Billing & invoices', icon: '💳' },
        ],
      },
    ],
  },
  
  solutions: {
    title: 'Solutions',
    description: 'Tailored solutions for your business',
    featured: {
      name: 'AI Development',
      href: '/solutions/ai-development',
      description: 'End-to-end AI solutions',
      icon: '🧠',
    },
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
      {
        title: 'Services',
        items: [
          { name: 'Services', href: '/services', description: 'All services', icon: '🔧' },
          { name: 'Case Studies', href: '/case-studies', description: 'Success stories', icon: '📖' },
        ],
      },
    ],
  },
  
  industries: {
    title: 'Industries',
    description: 'Domain expertise across sectors',
    featured: {
      name: 'Fintech',
      href: '/industries/fintech',
      description: 'Financial technology solutions',
      icon: '💳',
    },
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
  
  developers: {
    title: 'Developers',
    description: 'Build with Kritvia',
    featured: {
      name: 'API Reference',
      href: '/platform/developers',
      description: 'Comprehensive documentation',
      icon: '📚',
    },
    sections: [
      {
        title: 'Getting Started',
        items: [
          { name: 'Documentation', href: '/platform/developers', description: 'API reference', icon: '📚' },
          { name: 'Quick Start', href: '/platform/developers', description: '5-minute guide', icon: '⚡' },
        ],
      },
      {
        title: 'Tools',
        items: [
          { name: 'Dashboard', href: '/platform/dashboard', description: 'Analytics', icon: '📊' },
          { name: 'AI Tools', href: '/platform/ai-tools', description: 'AI playground', icon: '🤖' },
        ],
      },
    ],
  },
  
  resources: {
    title: 'Resources',
    description: 'Learn and grow',
    featured: {
      name: 'Blog',
      href: '/blog',
      description: 'Latest insights',
      icon: '📰',
    },
    sections: [
      {
        title: 'Content',
        items: [
          { name: 'Blog', href: '/blog', description: 'Latest insights', icon: '📰' },
          { name: 'Research', href: '/research', description: 'Research papers', icon: '🔬' },
        ],
      },
      {
        title: 'Learning',
        items: [
          { name: 'Guides', href: '/resources/guides', description: 'How-to guides', icon: '📖' },
          { name: 'Whitepapers', href: '/resources/whitepapers', description: 'Deep dives', icon: '📄' },
        ],
      },
    ],
  },
}

// Mobile navigation structure
export const mobileNavigation = [
  ...mainNavigation,
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/company/about' },
  { name: 'Team', href: '/company/team' },
  { name: 'Careers', href: '/company/careers' },
  { name: 'Contact', href: '/contact' },
]

// Helper functions
export function getMainNavigation(): NavItem[] {
  return mainNavigation
}

export function getMegaMenu(key: string): MegaMenuConfig | undefined {
  return megaMenus[key.toLowerCase()]
}

export function getAllNavItems(): NavItem[] {
  return [
    ...navigation.main.items,
    ...navigation.company.items,
    ...navigation.resources.items,
    ...navigation.platform.items,
    ...navigation.legal.items,
  ]
}

export function findNavItemByHref(href: string): NavItem | undefined {
  const allItems = getAllNavItems()
  return allItems.find(item => item.href === href)
}

export function hasMegaMenu(href: string): boolean {
  const item = findNavItemByHref(href)
  return item?.megaMenu ?? false
}
