'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
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
      className="block px-4 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
    >
      <div className="font-medium text-neutral-900 dark:text-white">{item.name}</div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400">{item.description}</div>
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
        // Add delay to prevent accidental close
        setTimeout(() => {
          onMouseLeave();
        }, 150);
      }}
    >
      <button
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-lg',
          isActive
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
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
          'absolute top-full left-0 mt-2 w-72 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 py-2 z-50',
          'opacity-0 invisible transition-all duration-200',
          isActive && 'opacity-100 visible'
        )}
      >
        <div className="px-2">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="font-medium text-neutral-900 dark:text-white text-sm">{item.name}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Sun Icon - Light Mode */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-0 rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
      {/* Moon Icon - Dark Mode */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      >
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </span>
    </button>
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
          ? 'bg-white/90 dark:bg-[rgb(var(--background-primary))]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-white/60 dark:bg-[rgb(var(--background-primary))]/60 backdrop-blur-xl'
      )}
      style={{
        backgroundColor: isScrolled 
          ? 'rgba(var(--card-background), 0.9)' 
          : 'rgba(var(--background-primary), 0.6)',
      }}
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
            <span className="text-xl font-bold bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">Kritvia</span>
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
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
              )}
            >
              Industries
            </Link>
            <Link
              href="/case-studies"
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                pathname === '/case-studies'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
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
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
              )}
            >
              Pricing
            </Link>
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-semibold rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 dark:hover:shadow-sky-500/40 hover:scale-105 active:scale-95"
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
            className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300"
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
          <div className="lg:hidden py-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col space-y-2">
              <div className="py-2">
                <div className="font-medium text-neutral-900 dark:text-white px-2 mb-2">Platform</div>
                {navigation.platform.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-neutral-900 dark:text-white px-2 mb-2">Solutions</div>
                {navigation.solutions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-neutral-900 dark:text-white px-2 mb-2">Products</div>
                {navigation.products.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="/industries" className="px-2 py-2 text-neutral-900 dark:text-white font-medium">Industries</Link>
              <Link href="/case-studies" className="px-2 py-2 text-neutral-900 dark:text-white font-medium">Case Studies</Link>
              <div className="py-2">
                <div className="font-medium text-neutral-900 dark:text-white px-2 mb-2">Resources</div>
                {navigation.resources.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="font-medium text-neutral-900 dark:text-white px-2 mb-2">Company</div>
                {navigation.company.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="/pricing" className="px-2 py-2 text-neutral-900 dark:text-white font-medium">Pricing</Link>
              <div className="flex items-center gap-2 px-2 pt-2">
                <ThemeToggle />
                <Link href="/contact" className="flex-1">
                  <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold rounded-lg text-sm">
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
