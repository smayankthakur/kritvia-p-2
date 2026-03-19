"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productItems = [
    {
      title: "AI Assistant",
      description: "Chat with AI to get business insights",
      href: "/ai",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "CRM Intelligence",
      description: "Smart lead and deal management",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Automation",
      description: "Workflow automation & triggers",
      href: "/#features",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Dashboard",
      description: "Real-time analytics & insights",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  const resourceItems = [
    { title: "Blog", description: "Latest insights & tips", href: "/blog" },
    { title: "Case Studies", description: "Success stories", href: "/blog" },
    { title: "Documentation", description: "API & setup guides", href: "/blog" },
  ];

  return (
    <nav
      ref={dropdownRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-white font-bold text-xl">Kritvia</span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Product Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown("product")}
                onClick={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
                className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Product
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === "product" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {activeDropdown === "product" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/30 p-2"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {productItems.map((item, index) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 flex items-center justify-center text-indigo-400 group-hover:from-indigo-600/30 group-hover:to-cyan-600/30 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{item.title}</p>
                          <p className="text-slate-400 text-xs">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown("resources")}
                onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Resources
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/30 p-2"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {resourceItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="block p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        <p className="text-slate-400 text-xs">{item.description}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right - CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Log in
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Start Free
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-sm font-medium"
              >
                Book Demo
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-slate-800/50">
                {/* Mobile Links */}
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Product
                  </div>
                  {productItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-indigo-400">{item.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="space-y-1 mt-4">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Resources
                  </div>
                  {resourceItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <p className="font-medium text-sm">{item.title}</p>
                    </Link>
                  ))}
                </div>

                {/* Mobile CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-800/50 px-4 space-y-3">
                  <Link
                    href="/dashboard"
                    className="block w-full px-4 py-2.5 text-center text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/pricing"
                    className="block w-full px-4 py-2.5 text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free
                  </Link>
                  <p className="text-center text-xs text-slate-500">
                    No credit card required
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Signal - Desktop */}
      {/* <div className="hidden lg:block absolute -bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-slate-500">Used by 500+ growing businesses • No credit card required</p>
      </div> */}
    </nav>
  );
}
