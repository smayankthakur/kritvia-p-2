'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { megaMenu, type NavItem, type NavigationSection } from '@/lib/navigation'

interface MegaMenuProps {
  activeMenu: string | null
  onClose: () => void
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
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

  // Close on escape
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

  const menuData = activeMenu ? megaMenu[activeMenu] : null

  return (
    <AnimatePresence>
      {activeMenu && menuData && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 z-50 bg-[#0A0A0A] border border-slate-800 shadow-2xl"
          role="menu"
          aria-label={menuData.title}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <NavItemComponent 
                        key={itemIndex} 
                        item={item} 
                        onClick={onClose}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    Ready to get started?
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Explore our {menuData.title.toLowerCase()} and find what you need.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
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

// Individual Nav Item Component
function NavItemComponent({ item, onClick }: { item: NavItem; onClick: () => void }) {
  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-800/50 transition-colors"
        onClick={onClick}
        role="menuitem"
      >
        {item.icon && (
          <span className="text-xl flex-shrink-0" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
            {item.name}
          </p>
          {item.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
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
  )
}

// Simple Dropdown for smaller screens
interface SimpleDropdownProps {
  title: string
  items: NavItem[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export function SimpleDropdown({ title, items, isOpen, onToggle, onClose }: SimpleDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-[#0A0A0A] border border-slate-800 rounded-lg shadow-xl z-50"
            role="menu"
          >
            <ul className="py-2">
              {items.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    onClick={onClose}
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
