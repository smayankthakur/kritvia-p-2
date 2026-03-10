'use client'

import Link from 'next/link'
import { Container } from '@/components/ui'

// ==================== LINK DATA ====================
const footerLinks = {
  products: [
    { name: 'Trinity OS', href: '/products/trinity-os' },
    { name: 'AI Cloud', href: '/products/ai-cloud' },
    { name: 'Agents', href: '/products/agents' },
    { name: 'Dev Platform', href: '/products/dev-platform' },
    { name: 'SDK', href: '/developers/sdk' },
    { name: 'CLI', href: '/developers/cli' },
  ],
  platform: [
    { name: 'Architecture', href: '/platform/architecture' },
    { name: 'Security', href: '/platform/security' },
    { name: 'Infrastructure', href: '/platform/infrastructure' },
    { name: 'AI Stack', href: '/platform/ai-stack' },
  ],
  solutions: [
    { name: 'AI Startups', href: '/solutions/ai-startups' },
    { name: 'Enterprise', href: '/solutions/enterprise' },
    { name: 'Developers', href: '/solutions/developers' },
    { name: 'Research', href: '/solutions/research' },
  ],
  developers: [
    { name: 'Documentation', href: '/developers/docs' },
    { name: 'API Reference', href: '/developers/api' },
    { name: 'Tutorials', href: '/developers/tutorials' },
    { name: 'Quickstarts', href: '/developers/quickstarts' },
  ],
  company: [
    { name: 'About', href: '/company/about' },
    { name: 'Founder', href: '/founder' },
    { name: 'Team', href: '/company/team' },
    { name: 'Careers', href: '/company/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Blog', href: '/resources/blog' },
    { name: 'Guides', href: '/resources/guides' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Whitepapers', href: '/resources/whitepapers' },
  ],
  ecosystem: [
    { name: 'Open Source', href: '/developers/open-source' },
    { name: 'GitHub Repositories', href: 'https://github.com/kritvia' },
    { name: 'SDK Downloads', href: '/developers/sdk' },
    { name: 'API Status', href: '/status' },
    { name: 'System Status', href: '/status' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Release Notes', href: '/changelog' },
    { name: 'Developer Community', href: '/community' },
  ],
}

// ==================== NAVIGATION GROUP ====================
function NavigationGroup({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ==================== MAIN FOOTER ====================
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      {/* Glow accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative">
        {/* Layer 1 & 2: Brand + Navigation Grid */}
        <div className="py-16">
          {/* Brand Section - Layer 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold text-white">Kritvia</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                Kritvia is building the foundational infrastructure for the intelligent internet. By combining AI cloud platforms, developer ecosystems, and scalable compute systems, Kritvia empowers innovators to design, deploy, and operate advanced AI applications across industries and global platforms.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-2">Subscribe to our newsletter</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[
                  { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://twitter.com/kritvia' },
                  { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://linkedin.com/company/kritvia' },
                  { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', href: 'https://github.com/kritvia' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Columns - Layer 2 */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8">
              <NavigationGroup title="Products" links={footerLinks.products} />
              <NavigationGroup title="Platform" links={footerLinks.platform} />
              <NavigationGroup title="Solutions" links={footerLinks.solutions} />
              <NavigationGroup title="Developers" links={footerLinks.developers} />
              <NavigationGroup title="Company" links={footerLinks.company} />
              <NavigationGroup title="Resources" links={footerLinks.resources} />
            </div>
          </div>
        </div>

        {/* Layer 3: Developer Ecosystem */}
        <div className="py-8 border-t border-b border-white/10">
          <h4 className="font-semibold text-white mb-4">Developer Ecosystem</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.ecosystem.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Layer 4: Legal + Trust */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Kritvia. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-sm text-slate-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="text-sm text-slate-500 hover:text-white transition-colors">
                Security
              </Link>
              <Link href="/compliance" className="text-sm text-slate-500 hover:text-white transition-colors">
                Compliance
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
