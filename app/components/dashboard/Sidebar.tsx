"use client";

import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Leads", href: "/leads", icon: "👥" },
  { name: "Deals", href: "/deals", icon: "💰" },
  { name: "AI Assistant", href: "/ai", icon: "🤖" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">Kritvia</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
