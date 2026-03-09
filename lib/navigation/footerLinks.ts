export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Products',
    links: [
      { label: 'Trinity OS', href: '/products/trinity-os' },
      { label: 'AI Automation Systems', href: '/products/ai-automation' },
      { label: 'Digital Infrastructure', href: '/products/digital-infrastructure' },
      { label: 'Enterprise Software', href: '/products/enterprise-software' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Finance', href: '/solutions/finance' },
      { label: 'Healthcare', href: '/solutions/healthcare' },
      { label: 'Government', href: '/solutions/government' },
      { label: 'Logistics', href: '/solutions/logistics' },
      { label: 'Enterprise SaaS', href: '/solutions/enterprise-saas' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Research', href: '/research' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Technology Insights', href: '/insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Kritvia', href: '/company/about' },
      { label: 'Leadership', href: '/company/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
];

export const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/kritvia',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/kritvia',
    icon: 'twitter',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kritvia',
    icon: 'github',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/kritvia',
    icon: 'youtube',
  },
];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kritvia',
  url: 'https://kritvia.com',
  logo: '/logo.png',
  sameAs: [
    'https://linkedin.com/company/kritvia',
    'https://twitter.com/kritvia',
    'https://github.com/kritvia',
    'https://youtube.com/kritvia',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'contact@kritvia.com',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '100 Enterprise Way, Suite 500',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
  },
};
