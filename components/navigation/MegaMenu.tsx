'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { megaMenus, type NavItem } from '@/lib/navigation'

interface MegaMenuProps {
  activeMenu: string | null
  onClose: () => void
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
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
  }, [activeMenu, onClose])

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
  }, [activeMenu, onClose])

  const menuData = activeMenu ? megaMenus[activeMenu.toLowerCase()] : null

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
          aria-label={menuData.title}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {menuData.featured && (
              <div className="mb-6 pb-6 border-b border-white/10">
                <Link
                  href={menuData.featured.href}
                  className="group flex items-center gap-4 p-4 -m-4 rounded-xl hover:bg-white/5 transition-colors"
                  onClick={onClose}
                >
                  {menuData.featured.icon && (
                    <span className="text-3xl" aria-hidden="true">
                      {menuData.featured.icon}
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {menuData.featured.name}
                    </p>
                    {menuData.featured.description && (
                      <p className="text-sm text-slate-400 mt-0.5">
                        {menuData.featured.description}
                      </p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            {menuData.description && (
              <p className="text-sm text-slate-400 mb-6">
                {menuData.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {menuData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item: NavItem, itemIndex: number) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={onClose}
                          role="menuitem"
                        >
                          {item.icon && (
                            <span className="text-lg flex-shrink-0" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
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
                          {item.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
                    Explore our {menuData.title.toLowerCase()} and find what you need.
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
