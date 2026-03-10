'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui';
import { Button } from '@/components/ui/Button';

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string; description?: string }[];
}

const navigation: NavItem[] = [
  {
    name: 'Products',
    href: '/products',
    children: [
      { name: 'Kritvia AI', href: '/products/kritvia-ai', description: 'AI-powered analytics' },
      { name: 'Kritvia Cloud', href: '/products/kritvia-cloud', description: 'Cloud management' },
      { name: 'Kritvia CRM', href: '/products/kritvia-crm', description: 'Next-gen CRM' },
    ],
  },
  {
    name: 'Solutions',
    href: '/solutions',
    children: [
      { name: 'AI Development', href: '/solutions/ai-development' },
      { name: 'Web Development', href: '/solutions/web-development' },
      { name: 'SaaS Development', href: '/solutions/saas-development' },
      { name: 'Cloud Architecture', href: '/solutions/cloud-architecture' },
      { name: 'Automation', href: '/solutions/automation' },
    ],
  },
  {
    name: 'Industries',
    href: '/industries',
    children: [
      { name: 'Financial Services', href: '/industries/financial-services' },
      { name: 'Healthcare', href: '/industries/healthcare' },
      { name: 'E-Commerce', href: '/industries/ecommerce' },
      { name: 'Manufacturing', href: '/industries/manufacturing' },
    ],
  },
  {
    name: 'Resources',
    href: '/resources',
    children: [
      { name: 'Blog', href: '/resources/blog' },
      { name: 'Guides', href: '/resources/guides' },
      { name: 'Whitepapers', href: '/resources/whitepapers' },
      { name: 'Research', href: '/research' },
    ],
  },
  {
    name: 'Company',
    href: '/company',
    children: [
      { name: 'About Us', href: '/company/about' },
      { name: 'Careers', href: '/company/careers' },
      { name: 'Team', href: '/company/team' },
    ],
  },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

function NavLink({ href, children, isActive, hasDropdown }: { href: string; children: React.ReactNode; isActive: boolean; hasDropdown?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors relative py-2 flex items-center gap-1',
        isActive
          ? 'text-white'
          : 'text-gray-400 hover:text-white'
      )}
    >
      {children}
      {hasDropdown && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
      )}
    </Link>
  );
}

function Dropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'text-sm font-medium transition-colors relative py-2 flex items-center gap-1',
          'text-gray-400 hover:text-white'
        )}
      >
        {item.name}
        <svg className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl animate-fade-in">
          {item.children?.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <div className="font-medium">{child.name}</div>
              {child.description && (
                <div className="text-xs text-neutral-500 mt-0.5">{child.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[rgb(var(--background-primary))]/95 backdrop-blur-xl shadow-lg shadow-black/10'
          : 'bg-transparent'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="Kritvia"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold text-white">Kritvia</span>
          </Link>

          {/* Desktop Navigation - with dropdowns */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              item.children ? (
                <Dropdown key={item.name} item={item} />
              ) : (
                <NavLink 
                  key={item.name} 
                  href={item.href} 
                  isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                >
                  {item.name}
                </NavLink>
              )
            ))}
          </div>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden lg:block">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-400 hover:text-white"
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
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[rgb(var(--border-primary))]">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name}>
                    <div className="px-2 py-2 text-base font-medium text-neutral-400">
                      {item.name}
                    </div>
                    <div className="ml-4 space-y-1 border-l border-neutral-800 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-2 py-2 text-sm text-neutral-500 hover:text-white transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-2 py-2 text-base font-medium transition-colors',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-4">
                <Link href="/contact" className="block">
                  <Button variant="primary" className="w-full justify-center">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
