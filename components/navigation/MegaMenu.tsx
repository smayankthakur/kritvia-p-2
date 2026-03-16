'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@/sanity/types'

interface MegaMenuProps {
  activeMenu: string | null
  onClose: () => void
  navigationItems: Array<{
    name: string
    href: string
    megaMenu?: boolean
    description?: string
  }>
}

export function MegaMenu({ activeMenu, onClose, navigationItems }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeMenu, onClose, navigationItems])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (activeMenu) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeMenu, onClose, navigationItems])

  // Find the mega menu data for the active menu
  const menuData = navigationItems.find(item => item.name === activeMenu)

  return (
    <AnimatePresence>
      {activeMenu && menuData && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          role="menu"
          aria-label={menuData.name}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* For now, we'll show a simple list of items since we don't have the full mega menu structure from settings */}
            <div className="space-y-6">
              {navigationItems.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={onClose}
                    role="menuitem"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white">
                    Ready to get started?
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Explore our {activeMenu?.toLowerCase() || 'products'} and find what you need.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Contact Sales
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
