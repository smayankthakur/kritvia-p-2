'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { mainNavigation, megaMenus } from '@/lib/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
  icon?: string
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        if (!isOpen) {
          // This would need to be handled by parent
        }
      }
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const handleSearch = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) {
          throw new Error('Search failed')
        }
        const data = await res.json()
        
        // Transform API results to match our SearchResult interface
        const transformedResults: SearchResult[] = [
          ...(data.posts || []).map(post => ({
            title: post.title,
            description: post.excerpt || '',
            href: `/blog/${post.slug.current}`,
            category: 'Posts',
            icon: '📝'
          })),
          ...(data.products || []).map(product => ({
            title: product.title,
            description: product.tagline || product.description || '',
            href: `/products/${product.slug.current}`,
            category: 'Products',
            icon: '📦'
          })),
          ...(data.documentation || []).map(doc => ({
            title: doc.title,
            description: doc.excerpt || '',
            href: `/docs/${doc.slug.current}`,
            category: 'Documentation',
            icon: '📚'
          })),
          ...(data.pages || []).map(page => ({
            title: page.title,
            description: page.description || page.subtitle || '',
            href: `/${page.slug.current}`,
            category: 'Pages',
            icon: '📄'
          }))
        ]
        
        setResults(transformedResults.slice(0, 8))
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceHandler = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceHandler)
  }, [query])

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search documentation, products, and more..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-400 bg-white/5 rounded border border-white/10">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query && results.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    <p>No results found for "{query}"</p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="py-2">
                    {results.map((result, index) => (
                      <li key={index}>
                        <Link
                          href={result.href}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {result.icon && (
                            <span className="text-xl">{result.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.title}</p>
                            <p className="text-sm text-slate-500 truncate">{result.description}</p>
                          </div>
                          <span className="text-xs text-slate-500">{result.category}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {!query && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Quick Links
                    </p>
                    <ul className="space-y-1">
                      {[
                        { name: 'Products', href: '/products', icon: '📦' },
                        { name: 'Solutions', href: '/solutions', icon: '💡' },
                        { name: 'Pricing', href: '/pricing', icon: '💰' },
                        { name: 'Contact', href: '/contact', icon: '📧' },
                      ].map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
