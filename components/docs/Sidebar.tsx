'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NavCategory } from '@/lib/docs';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  navigation: NavCategory[];
  version?: string;
  onVersionChange?: (version: string) => void;
  versions?: string[];
}

export function Sidebar({ 
  navigation, 
  version = 'v1', 
  onVersionChange,
  versions = ['v1']
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Auto-expand categories based on current path
    const currentCategory = navigation.find(cat => 
      cat.items.some(item => pathname === `/docs/${item.slug}`)
    );
    if (currentCategory) {
      setExpandedCategories(prev => new Set([...prev, currentCategory.title]));
    }
  }, [pathname, navigation]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const isActive = (slug: string) => {
    const normalizedSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug;
    const normalizedPathname = pathname.endsWith('/') && pathname.length > 1 
      ? pathname.slice(0, -1) 
      : pathname;
    return normalizedPathname === `/docs/${normalizedSlug}`;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 bg-zinc-950 border-r border-zinc-800 overflow-y-auto transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4">
          {/* Version selector */}
          {versions.length > 1 && (
            <div className="mb-6">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
                Version
              </label>
              <select
                value={version}
                onChange={(e) => onVersionChange?.(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {versions.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-6">
            {navigation.map((category) => (
              <div key={category.title}>
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-zinc-100 mb-2 hover:text-cyan-400 transition-colors"
                >
                  {category.title}
                  <svg 
                    className={cn(
                      "w-4 h-4 transition-transform",
                      expandedCategories.has(category.title) && "rotate-90"
                    )} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {expandedCategories.has(category.title) && (
                  <ul className="space-y-1 ml-2">
                    {category.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/docs/${item.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-lg transition-colors",
                            isActive(item.slug)
                              ? "bg-cyan-500/10 text-cyan-400 font-medium"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
