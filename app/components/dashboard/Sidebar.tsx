"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Leads", href: "/dashboard/leads", icon: "👥" },
  { name: "Deals", href: "/dashboard/deals", icon: "💰" },
  { name: "AI Assistant", href: "/dashboard/ai", icon: "🤖" },
];

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  { name: "Billing", href: "/dashboard/billing", icon: "💳" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-bold text-white">Kritvia</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-slate-800">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Workspace Selector */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">WK</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">My Workspace</p>
            <p className="text-xs text-slate-400">Free Plan</p>
          </div>
          <span className="text-slate-400">▼</span>
        </button>
      </div>
    </aside>
  );
}
