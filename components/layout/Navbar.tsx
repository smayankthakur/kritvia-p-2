'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { mainNavigation, type NavItem } from '@/lib/navigation'
import { MegaMenu } from '@/components/navigation/MegaMenu'
import { MobileMenu } from '@/components/navigation/MobileMenu'
import { SearchModal } from '@/components/navigation/SearchModal'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveMenu(null)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleMouseEnter = (item: NavItem) => {
    if (item.megaMenu) {
      setActiveMenu(item.name)
    }
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/10'
            : 'bg-transparent'
        )}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-lg font-bold text-white">Kritvia</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              {mainNavigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5',
                      activeMenu === item.name && 'text-white bg-white/5'
                    )}
                  >
                    {item.name}
                    {item.megaMenu && (
                      <svg className={cn('w-4 h-4 transition-transform', activeMenu === item.name && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden xl:inline">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/10">
                  ⌘K
                </kbd>
              </button>

              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/platform/dashboard"
                  className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  Start Project
                </Link>
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <MegaMenu
          activeMenu={activeMenu}
          onClose={() => setActiveMenu(null)}
        />
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}
