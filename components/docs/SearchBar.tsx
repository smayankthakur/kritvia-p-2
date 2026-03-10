'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MiniSearch from 'minisearch';
import { SearchIndex } from '@/lib/docs';
import { cn } from '@/lib/utils/cn';

interface SearchResult {
  title: string;
  description: string;
  slug: string;
  score: number;
}

// Create search index on client side
let searchIndex: MiniSearch | null = null;

async function getSearchIndex(): Promise<MiniSearch> {
  if (searchIndex) return searchIndex;
  
  const response = await fetch('/api/docs/search');
  const data: SearchIndex = await response.json();
  
  searchIndex = new MiniSearch({
    fields: ['title', 'description', 'content'],
    storeFields: ['title', 'description', 'slug'],
    searchOptions: {
      boost: { title: 2, description: 1.5 },
      fuzzy: 0.2,
      prefix: true
    }
  });
  
  searchIndex.addAll(data.docs);
  return searchIndex;
}

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const index = await getSearchIndex();
      const searchResults = index.search(searchQuery).slice(0, 10);
      
      setResults(searchResults.map(result => ({
        title: result.title,
        description: result.description,
        slug: result.slug,
        score: result.score
      })));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    router.push(`/docs/${result.slug}`);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:border-zinc-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left text-sm">Search documentation...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search dialog */}
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-lg"
              />
              {isLoading && (
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              )}
              <kbd className="px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded">ESC</kbd>
            </div>

            {/* Results */}
            <div ref={resultsRef} className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-2">
                  {results.map((result, index) => (
                    <li key={result.slug}>
                      <button
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full px-4 py-3 text-left transition-colors",
                          index === selectedIndex 
                            ? "bg-cyan-500/10" 
                            : "hover:bg-zinc-800"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "font-medium",
                            index === selectedIndex ? "text-cyan-400" : "text-zinc-100"
                          )}>
                            {result.title}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {Math.round(result.score)}% match
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
                            {result.description}
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <div className="px-4 py-8 text-center text-zinc-500">
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords</p>
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-zinc-500">
                  <p>Start typing to search...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd>
                to select
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
