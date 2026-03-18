"use client";

import { useState } from "react";
import {
  Sun,
  Moon,
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

export default function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex space-x-4">
                {/* Active link styling would go here in a real app */}
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Overview
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  AI Assistant
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  CRM
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Marketing
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Operations
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Search className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" />
              </button>
              {searchOpen && (
                <div className="absolute left-0 mt-2 w-56">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" />
                {/* Badge for notifications */}
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </div>
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" />
              )}
            </button>

            {/* User avatar */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <UserCircle className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" />
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-100">Admin</span>
                  <svg className="ml-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {/* Dropdown menu would go here in a real app */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}