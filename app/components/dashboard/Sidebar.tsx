"use client";

import { useState } from "react";
import {
  Menu,
  LayoutDashboard,
  Users,
  BarChart3,
  MessageCircle,
  List,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-16 bg-gray-800 dark:bg-gray-900 
                   transition-all duration-300 ${
                     collapsed ? "w-64" : ""
                   } z-50`}
  >
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center px-3 py-4">
        <div className="h-8 w-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
          K
        </div>
        {!collapsed && (
          <span className="ml-3 text-xl font-bold text-white">
            Kritvia
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-1 flex-1 overflow-y-auto">
        <a
          href="#overview"
          className={`flex items-center px-3 py-3 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <Menu className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Overview</span>}
        </a>

        <a
          href="#assistant"
          className={`flex items-center px-3 py-3 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <MessageCircle className="h-5 w-5" />
          {!collapsed && <span className="ml-3">AI Assistant</span>}
        </a>

        <div className="flex items-center px-3 py-2">
          <Menu className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-xs font-semibold text-gray-400">CRM</span>}
        </div>

        <a
          href="#leads"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <Users className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Leads</span>}
        </a>

        <a
          href="#deals"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <BarChart3 className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Deals</span>}
        </a>

        <div className="flex items-center px-3 py-2">
          <List className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-xs font-semibold text-gray-400">Marketing</span>}
        </div>

        <a
          href="#campaigns"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <MessageCircle className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Campaigns</span>}
        </a>

        <div className="flex items-center px-3 py-2">
          <Calendar className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-xs font-semibold text-gray-400">Operations</span>}
        </div>

        <a
          href="#tasks"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <List className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Tasks</span>}
        </a>

        <a
          href="#meetings"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <Calendar className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Meetings</span>}
        </a>

        <a
          href="#insights"
          className={`flex items-center px-3 py-2 text-sm font-medium 
                     transition-colors duration-200 ${
                       collapsed ? "justify-center" : ""
                     }`}
        >
          <BarChart3 className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Insights</span>}
        </a>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-700">
        <div className="flex items-center px-3 py-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>{!collapsed ? "Collapse" : "Expand"}</span>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center px-3 py-4">
          <LogOut className="h-4 w-4 mr-3" />
          {!collapsed && <span className="text-sm text-gray-400 hover:text-white transition-colors">Logout</span>}
        </div>
       </div>
     </div>
   </aside>
   );
}