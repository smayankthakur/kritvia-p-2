'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Platform', href: '/platform' },
  { name: 'Services', href: '/services' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Products', href: '/products' },
  { name: 'Industries', href: '/industries' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
];

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors relative py-2',
        isActive
          ? 'text-white'
          : 'text-gray-400 hover:text-white'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
      )}
    </Link>
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

          {/* Desktop Navigation - Simplified */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <NavLink 
                key={item.name} 
                href={item.href} 
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
              >
                {item.name}
              </NavLink>
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
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
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
              ))}
              <div className="pt-2">
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
