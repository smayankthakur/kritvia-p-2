'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { NavCategory } from '@/lib/docs';
import { cn } from '@/lib/utils/cn';

interface DocLayoutProps {
  children: React.ReactNode;
  navigation: NavCategory[];
  headings?: { id: string; text: string; level: number }[];
  version?: string;
  onVersionChange?: (version: string) => void;
  versions?: string[];
  title: string;
  description?: string;
}

export function DocLayout({
  children,
  navigation,
  headings = [],
  version = 'v1',
  onVersionChange,
  versions = ['v1'],
  title,
  description
}: DocLayoutProps) {
  const pathname = usePathname();
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .replace('/docs', '')
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const path = '/docs/' + arr.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { path, label };
    });

  // Copy code to clipboard
  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Add copy buttons to code blocks
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block, index) => {
      const pre = block.parentElement;
      if (pre && !pre.querySelector('.copy-button')) {
        const button = document.createElement('button');
        button.className = 'copy-button absolute top-2 right-2 p-2 rounded-md bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100';
        button.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
        button.onclick = () => {
          const code = block.textContent || '';
          copyToClipboard(code, `code-${index}`);
        };
        
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(button);
      }
    });
  }, [children]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-lg font-semibold text-zinc-100">Kritvia</span>
            <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">Docs</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <SearchBar />
          </div>

          {/* Right nav */}
          <nav className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Documentation
            </Link>
            <Link href="/api" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              API Reference
            </Link>
            <Link 
              href="https://github.com/smayankthakur/kritvia-p-2" 
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        navigation={navigation}
        version={version}
        onVersionChange={onVersionChange}
        versions={versions}
      />

      {/* Main content */}
      <main className="pt-16 lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">
              Docs
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path} className="flex items-center gap-2">
                <span>/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-zinc-300">{crumb.label}</span>
                ) : (
                  <Link href={crumb.path} className="hover:text-zinc-300 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="flex gap-8">
            {/* Main content area */}
            <article className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-zinc-100 mb-4">{title}</h1>
              {description && (
                <p className="text-xl text-zinc-400 mb-8">{description}</p>
              )}
              <div 
                className="prose prose-invert prose-zinc max-w-none
                  prose-headings:scroll-mt-20
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:text-zinc-100
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-zinc-100 prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:text-zinc-100 prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-zinc-300 prose-p:leading-7 prose-p:mb-4
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:text-cyan-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
                  prose-ul:text-zinc-300 prose-ol:text-zinc-300
                  prose-li:marker:text-zinc-500
                  prose-blockquote:border-l-cyan-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                  prose-img:rounded-lg"
              >
                {children}
              </div>

              {/* Footer navigation */}
              <div className="mt-16 pt-8 border-t border-zinc-800 flex justify-between">
                <Link href="/docs" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  ← Back to Documentation
                </Link>
              </div>
            </article>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <aside className="hidden xl:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <h4 className="text-sm font-semibold text-zinc-100 mb-4">On this page</h4>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={cn(
                          "block text-sm transition-colors hover:text-cyan-400",
                          heading.level === 2 ? "text-zinc-400" : "text-zinc-500 pl-4",
                        )}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Copy feedback toast */}
      {copyFeedback && (
        <div className="fixed bottom-4 right-4 bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
