// Static data for the Kritvia platform
// In production, this would come from Sanity CMS

import type { Solution, Product, Industry, CaseStudy, Stat, TeamMember, JobPosition, PricingPlan, BlogPost } from '@/types';

// Solutions data
export const solutions: Solution[] = [
  {
    id: 'ai-development',
    title: 'AI Development',
    description: 'Intelligent solutions powered by machine learning and advanced AI algorithms.',
    href: '/solutions/ai-development',
    icon: '🤖',
    features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Predictive Analytics'],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern, scalable web applications built with cutting-edge technologies.',
    href: '/solutions/web-development',
    icon: '🌐',
    features: ['React/Next.js', 'Progressive Web Apps', 'E-commerce', 'API Development'],
  },
  {
    id: 'saas-development',
    title: 'SaaS Development',
    description: 'Build scalable software-as-a-service platforms for your business.',
    href: '/solutions/saas-development',
    icon: '📱',
    features: ['Multi-tenant Architecture', 'Subscription Management', 'API First Design', 'Cloud Native'],
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture',
    description: 'Enterprise cloud solutions designed for scale and reliability.',
    href: '/solutions/cloud-architecture',
    icon: '☁️',
    features: ['AWS/Azure/GCP', 'Serverless', 'Kubernetes', 'DevOps'],
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Business process automation to increase efficiency and reduce costs.',
    href: '/solutions/automation',
    icon: '⚙️',
    features: ['Workflow Automation', 'RPA', 'Integration', 'Monitoring'],
  },
];

// Products data
export const products: Product[] = [
  {
    id: 'kritvia-ai',
    name: 'Kritvia AI',
    tagline: 'AI-Powered Analytics',
    description: 'Transform your data into actionable insights with advanced machine learning.',
    href: '/products/kritvia-ai',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Real-time Analytics', 'Predictive Models', 'Custom Dashboards'],
  },
  {
    id: 'kritvia-cloud',
    name: 'Kritvia Cloud',
    tagline: 'Cloud Management',
    description: 'Unified platform for managing your cloud infrastructure at scale.',
    href: '/products/kritvia-cloud',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Multi-cloud Support', 'Cost Optimization', 'Security'],
  },
  {
    id: 'kritvia-crm',
    name: 'Kritvia CRM',
    tagline: 'Customer Intelligence',
    description: 'Next-generation CRM powered by AI for better customer relationships.',
    href: '/products/kritvia-crm',
    gradient: 'from-green-500 to-emerald-500',
    features: ['AI Insights', 'Automation', 'Integration'],
  },
];

// Industries data
export const industries: Industry[] = [
  {
    id: 'startups',
    title: 'Startups',
    description: 'Launch and scale your startup with modern technology.',
    href: '/industries/startups',
    icon: '🚀',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    description: 'Build high-converting online stores with modern commerce.',
    href: '/industries/ecommerce',
    icon: '🛒',
  },
  {
    id: 'fintech',
    title: 'Fintech',
    description: 'Secure, compliant financial technology solutions.',
    href: '/industries/fintech',
    icon: '💰',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'HIPAA-compliant solutions for healthcare providers.',
    href: '/industries/healthcare',
    icon: '🏥',
  },
];

// Case studies
export const caseStudies: CaseStudy[] = [
  {
    id: 'global-fintech',
    client: 'Global Fintech',
    title: 'AI Fraud Detection System',
    result: '95% reduction in fraud',
    emoji: '💰',
    description: 'Implemented ML-powered fraud detection for a leading fintech company.',
  },
  {
    id: 'healthcare-plus',
    client: 'Healthcare Plus',
    title: 'Patient Data Platform',
    result: '3x faster processing',
    emoji: '🏥',
    description: 'Built a secure patient data management system.',
  },
  {
    id: 'retail-giant',
    client: 'Retail Giant',
    title: 'E-commerce Platform',
    result: '200% ROI increase',
    emoji: '🛒',
    description: 'Modernized their e-commerce platform for better conversion.',
  },
];

// Statistics
export const stats: Stat[] = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '98%', label: 'Client Retention' },
  { value: '50M+', label: 'API Requests/Day' },
  { value: '99.99%', label: 'Uptime SLA' },
];

// Team members
export const teamMembers: TeamMember[] = [
  {
    id: 'john-doe',
    name: 'John Doe',
    role: 'CEO & Founder',
    bio: '20+ years in enterprise software development.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    role: 'CTO',
    bio: 'Former Google engineer with expertise in AI/ML.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    role: 'VP of Engineering',
    bio: '15 years building scalable systems.',
    linkedin: 'https://linkedin.com',
  },
];

// Job positions
export const jobPositions: JobPosition[] = [
  {
    id: 'senior-engineer',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable solutions for enterprise clients.',
    requirements: ['5+ years experience', 'TypeScript', 'React/Next.js', 'Cloud platforms'],
  },
  {
    id: 'ai-engineer',
    title: 'AI/ML Engineer',
    department: 'AI Team',
    location: 'Remote',
    type: 'Full-time',
    description: 'Develop AI solutions for our products.',
    requirements: ['3+ years ML experience', 'Python', 'TensorFlow/PyTorch', 'Cloud ML'],
  },
];

// Pricing plans
export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$999',
    description: 'Perfect for small businesses getting started.',
    features: [
      'Up to 5 pages',
      'Basic SEO',
      'Contact form',
      '1 month support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$2,999',
    description: 'For growing businesses needing more features.',
    features: [
      'Up to 15 pages',
      'Advanced SEO',
      'Custom integrations',
      'CMS integration',
      '6 months support',
      'Analytics',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations.',
    features: [
      'Unlimited pages',
      'Custom development',
      'API integration',
      'Dedicated support',
      'SLA guarantee',
      'Training',
    ],
    cta: 'Contact Sales',
  },
];

// Blog posts
export const blogPosts: BlogPost[] = [
  {
    id: 'ai-transforming-business',
    title: 'How AI is Transforming Business Operations',
    excerpt: 'Discover how artificial intelligence is revolutionizing enterprise operations.',
    href: '/resources/blog/ai-transforming-business',
    date: '2024-01-15',
    category: 'AI',
  },
  {
    id: 'cloud-migration-guide',
    title: 'A Complete Guide to Cloud Migration',
    excerpt: 'Best practices for moving your infrastructure to the cloud.',
    href: '/resources/blog/cloud-migration-guide',
    date: '2024-01-10',
    category: 'Cloud',
  },
];

// Trusted companies (for social proof)
export const trustedBy = [
  { name: 'TechCorp', emoji: '🏢' },
  { name: 'DataFlow', emoji: '📊' },
  { name: 'CloudNine', emoji: '☁️' },
  { name: 'InnovateTech', emoji: '💡' },
  { name: 'FutureLabs', emoji: '🔬' },
];

// Helper functions
export function getSolutionById(id: string): Solution | undefined {
  return solutions.find((s) => s.id === id);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getIndustryById(id: string): Industry | undefined {
  return industries.find((i) => i.id === id);
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}
