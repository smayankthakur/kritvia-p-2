'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { name: 'Dashboard', href: '/platform/dashboard', icon: '📊' },
  { name: 'Projects', href: '/platform/projects', icon: '🚀' },
  { name: 'AI Tools', href: '/platform/ai-tools', icon: '🤖' },
  { name: 'Invoices', href: '/platform/invoices', icon: '💳' },
  { name: 'Files', href: '/platform/files', icon: '📁' },
  { name: 'Messages', href: '/platform/messages', icon: '💬' },
  { name: 'Deliverables', href: '/platform/deliverables', icon: '📦' },
];

const bottomNav = [
  { name: 'Settings', href: '/platform/settings', icon: '⚙️' },
  { name: 'Help', href: '/platform/help', icon: '❓' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/platform/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Kritvia</span>
              <span className="px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded-full">Platform</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors relative">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full" />
              <span className="text-sm text-white">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-neutral-900 border-r border-neutral-800 transition-transform z-40',
          !sidebarOpen && '-translate-x-full',
        )}
      >
        <nav className="flex flex-col h-full p-4">
          <div className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.name === 'Messages' && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">3</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-neutral-800 pt-4 mt-4 space-y-1">
            {bottomNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn('pt-16 min-h-screen transition-all', sidebarOpen ? 'ml-64' : 'ml-0')}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
