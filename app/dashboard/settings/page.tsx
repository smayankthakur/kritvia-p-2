"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "workspace", label: "Workspace", icon: "🏢" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "api", label: "API Keys", icon: "🔑" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your profile, workspace, and team settings
        </p>
      </motion.div>

      <div className="flex gap-8">
        {/* Tabs */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "workspace" && <WorkspaceSettings />}
            {activeTab === "team" && <TeamSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "api" && <ApiSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            JD
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Upload New
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function WorkspaceSettings() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Workspace Settings
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workspace Name
        </label>
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workspace URL
        </label>
        <div className="flex">
          <span className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
            kritvia.app/
          </span>
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="my-workspace"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option>Asia/Kolkata (IST)</option>
          <option>UTC</option>
          <option>America/New_York (EST)</option>
          <option>Europe/London (GMT)</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function TeamSettings() {
  const teamMembers = [
    { name: "John Doe", email: "john@example.com", role: "Owner", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    { name: "Bob Johnson", email: "bob@example.com", role: "Member", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          + Invite Member
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Member
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teamMembers.map((member, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.role === "Owner"
                        ? "bg-purple-100 text-purple-700"
                        : member.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leads: true,
    deals: true,
    ai: false,
    weekly: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <button
            onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.email ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                notifications.email ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">New Leads</p>
            <p className="text-sm text-gray-500">Notify when new leads are captured</p>
          </div>
          <button
            onClick={() => setNotifications({ ...notifications, leads: !notifications.leads })}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.leads ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                notifications.leads ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Deal Updates</p>
            <p className="text-sm text-gray-500">Notify on deal stage changes</p>
          </div>
          <button
            onClick={() => setNotifications({ ...notifications, deals: !notifications.deals })}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.deals ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                notifications.deals ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Weekly Report</p>
            <p className="text-sm text-gray-500">Receive weekly performance summary</p>
          </div>
          <button
            onClick={() => setNotifications({ ...notifications, weekly: !notifications.weekly })}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.weekly ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                notifications.weekly ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function ApiSettings() {
  const [apiKey, setApiKey] = useState("sk-live-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h2>
        <p className="text-sm text-gray-500 mb-6">
          Use API keys to integrate Kritvia with your applications
        </p>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ API access is available on Pro and Enterprise plans. Upgrade to use this feature.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your API Key
        </label>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Copy
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
            Regenerate
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">API Usage</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Requests this month</span>
              <span className="font-medium">0 / 10,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          View Documentation
        </button>
      </div>
    </div>
  );
}
