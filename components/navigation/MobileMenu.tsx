'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@/sanity/types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: Array<{
    name: string
    href: string
    megaMenu?: boolean
    description?: string
  }>
}

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-white font-semibold text-lg">
                  {/* Title will be passed from settings in the future */}
                  Kritvia
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  // For now, we'll treat all items as having no submenu since we don't have the full structure from settings
                  const hasSubMenu = false // item.megaMenu || false
                  const isExpanded = expandedItem === item.name

                  return (
                    <li key={item.name}>
                      {hasSubMenu ? (
                        <div>
                          <button
                            onClick={() => toggleExpand(item.name)}
                            className="w-full flex items-center justify-between p-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <span className="font-medium">{item.name}</span>
                            <svg 
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-1">
                                  {/* We would map through submenu items here if we had them from settings */}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block p-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* CTA Buttons */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="block w-full p-3 text-center text-white font-medium bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  Start Project
                </Link>
                <Link
                  href="/platform/dashboard"
                  onClick={onClose}
                  className="block w-full p-3 text-center text-slate-300 font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
