'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui';

const navigation = {
  platform: [
    { name: 'Client Dashboard', href: '/platform/dashboard', description: 'Track projects & deliverables' },
    { name: 'AI Tools', href: '/platform/ai-tools', description: 'Content generation & analysis' },
    { name: 'Startup Builder', href: '/platform/startup-builder', description: 'AI-powered business planning' },
    { name: 'Developer Portal', href: '/platform/developers', description: 'API documentation & SDKs' },
  ],
  solutions: [
    { name: 'AI Development', href: '/solutions/ai-development', description: 'Intelligent AI solutions' },
    { name: 'Web Development', href: '/solutions/web-development', description: 'Modern web applications' },
    { name: 'SaaS Development', href: '/solutions/saas-development', description: 'Scalable SaaS platforms' },
    { name: 'Cloud Architecture', href: '/solutions/cloud-architecture', description: 'Enterprise cloud solutions' },
    { name: 'Automation', href: '/solutions/automation', description: 'Business process automation' },
  ],
  products: [
    { name: 'Kritvia AI', href: '/products/kritvia-ai', description: 'AI-powered analytics' },
    { name: 'Kritvia Cloud', href: '/products/kritvia-cloud', description: 'Cloud management platform' },
    { name: 'Kritvia CRM', href: '/products/kritvia-crm', description: 'Customer relationship management' },
  ],
  resources: [
    { name: 'Blog', href: '/blog', description: 'Engineering insights' },
    { name: 'Research', href: '/research', description: 'Original research & whitepapers' },
    { name: 'Case Studies', href: '/case-studies', description: 'Client success stories' },
    { name: 'Guides', href: '/resources/guides', description: 'Technical guides' },
  ],
  company: [
    { name: 'About Us', href: '/company/about', description: 'Our story and mission' },
    { name: 'Team', href: '/company/team', description: 'Meet the experts' },
    { name: 'Careers', href: '/company/careers', description: 'Join our team' },
    { name: 'Pricing', href: '/pricing', description: 'Transparent pricing' },
  ],
};

function DropdownItem({ item }: { item: { name: string; href: string; description: string } }) {
  return (
    <Link
      href={item.href}
      className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
    >
      <div className="font-medium text-white">{item.name}</div>
      <div className="text-sm text-gray-400">{item.description}</div>
    </Link>
  );
}

function Dropdown({ 
  label, 
  items, 
  isActive, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  label: string; 
  items: { name: string; href: string; description: string }[]; 
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          onMouseLeave();
        }, 150);
      }}
    >
      <button
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-lg',
          isActive
            ? 'text-blue-400 bg-blue-500/10'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        )}
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        {label}
        <svg 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isActive && 'rotate-180'
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Mega Menu Dropdown */}
      <div 
        className={cn(
          'absolute top-full left-0 mt-2 w-72 bg-[rgb(var(--surface-2))] rounded-xl shadow-2xl border border-[rgb(var(--border-primary))] py-2 z-50',
          'opacity-0 invisible transition-all duration-200',
          isActive && 'opacity-100 visible'
        )}
      >
        <div className="px-2">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="font-medium text-white text-sm">{item.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleDropdownHover = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[rgb(var(--background-primary))]/90 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-[rgb(var(--background-primary))]/60 backdrop-blur-xl'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo - Premium Style */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Kritvia"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">Kritvia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Dropdown 
              label="Platform" 
              items={navigation.platform} 
              isActive={activeDropdown === 'platform'}
              onMouseEnter={() => handleDropdownHover('platform')}
              onMouseLeave={handleDropdownLeave}
            />
            <Dropdown 
              label="Solutions" 
              items={navigation.solutions} 
              isActive={activeDropdown === 'solutions'}
              onMouseEnter={() => handleDropdownHover('solutions')}
              onMouseLeave={handleDropdownLeave}
            />
            <Dropdown 
              label="Products" 
              items={navigation.products} 
              isActive={activeDropdown === 'products'}
              onMouseEnter={() => handleDropdownHover('products')}
              onMouseLeave={handleDropdownLeave}
            />
            <Link
              href="/industries"
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                pathname === '/industries'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              Industries
            </Link>
            <Link
              href="/case-studies"
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                pathname === '/case-studies'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              Case Studies
            </Link>
            <Dropdown 
              label="Resources" 
              items={navigation.resources} 
              isActive={activeDropdown === 'resources'}
              onMouseEnter={() => handleDropdownHover('resources')}
              onMouseLeave={handleDropdownLeave}
            />
            <Dropdown 
              label="Company" 
              items={navigation.company} 
              isActive={activeDropdown === 'company'}
              onMouseEnter={() => handleDropdownHover('company')}
              onMouseLeave={handleDropdownLeave}
            />
            <Link
              href="/pricing"
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                pathname === '/pricing'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              Pricing
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-semibold rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:shadow-violet-500/25 hover:scale-105 active:scale-95"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[rgb(var(--border-primary))]">
            <div className="flex flex-col space-y-2">
              <div className="py-2">
                <div className="font-medium text-white px-2 mb-2">Platform</div>
                {navigation.platform.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-400 hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-white px-2 mb-2">Solutions</div>
                {navigation.solutions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-400 hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-white px-2 mb-2">Products</div>
                {navigation.products.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-400 hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="/industries" className="px-2 py-2 text-white font-medium">Industries</Link>
              <Link href="/case-studies" className="px-2 py-2 text-white font-medium">Case Studies</Link>
              <div className="py-2">
                <div className="font-medium text-white px-2 mb-2">Resources</div>
                {navigation.resources.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-400 hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-white px-2 mb-2">Company</div>
                {navigation.company.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-400 hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="/pricing" className="px-2 py-2 text-white font-medium">Pricing</Link>
              <div className="flex items-center gap-2 px-2 pt-2">
                <Link href="/contact" className="flex-1">
                  <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-lg text-sm">
                    Get Started
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
