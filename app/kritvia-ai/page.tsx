'use client';

import ChatInterface from '../../modules/kritvia-ai/ui/ai-chat/chat-interface';
import InsightsDashboard from '../../modules/kritvia-ai/ui/ai-dashboard/insights-dashboard';
import CommandConsole from '../../modules/kritvia-ai/ui/ai-command/command-console';
import { ActivityTimeline } from '../../modules/kritvia-ai/ui/ai-activity-timeline';

export default function KritviaAIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kritvia AI</h1>
              <p className="text-sm text-gray-500">AI Business Operating System</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Agent Status */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs" title="CEO Agent">CEO</span>
                  <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs" title="Sales Agent">SA</span>
                  <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs" title="Marketing Agent">MA</span>
                  <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs" title="Operations Agent">OA</span>
                </div>
                <span className="text-sm text-gray-600">4 Active</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ● Active
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Navigation */}
          <div className="col-span-12 lg:col-span-2">
            <nav className="space-y-1">
              <a
                href="#chat"
                className="block px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
              >
                💬 Chat
              </a>
              <a
                href="#dashboard"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                📊 Insights
              </a>
              <a
                href="#commands"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                ⌨️ Commands
              </a>
              <a
                href="#activity"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                📜 Activity
              </a>
              <a
                href="#automations"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                🔄 Automations
              </a>
              <a
                href="#settings"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                ⚙️ Settings
              </a>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Leads Processed</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tasks Completed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insights Generated</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Decisions Made</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Chat Section */}
            <section id="chat" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">Ask about your business</p>
              </div>
              <div className="h-96">
                <ChatInterface />
              </div>
            </section>

            {/* Command Console */}
            <section id="commands" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Command Console</h2>
                <p className="text-sm text-gray-500">Execute AI commands</p>
              </div>
              <div className="p-4">
                <CommandConsole />
              </div>
            </section>

            {/* Automations Section */}
            <section id="automations" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Active Automations</h2>
                <p className="text-sm text-gray-500">AI-powered workflow automation</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[
                    { name: 'Lead Qualification', status: 'active', runs: 45 },
                    { name: 'Follow-up Reminders', status: 'active', runs: 32 },
                    { name: 'Deal Scoring', status: 'active', runs: 28 },
                    { name: 'Churn Detection', status: 'active', runs: 15 },
                    { name: 'Email Optimization', status: 'paused', runs: 0 },
                  ].map((automation) => (
                    <div key={automation.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${automation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm font-medium text-gray-900">{automation.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{automation.runs} runs today</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          {automation.status === 'active' ? 'Pause' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Insights */}
            <section id="dashboard" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
                <p className="text-sm text-gray-500">AI-powered recommendations</p>
              </div>
              <div className="p-4">
                <InsightsDashboard />
              </div>
            </section>

            {/* Activity Timeline */}
            <section id="activity" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
                <p className="text-sm text-gray-500">Recent AI actions</p>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <ActivityTimeline maxItems={15} />
              </div>
            </section>

            {/* System Health */}
            <section className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">AI Engine</span>
                    <span className="text-sm text-green-600">● Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Memory System</span>
                    <span className="text-sm text-green-600">● Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Vector DB</span>
                    <span className="text-sm text-green-600">● Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Learning System</span>
                    <span className="text-sm text-yellow-600">● Training</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Approval Queue</span>
                    <span className="text-sm text-gray-600">2 pending</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
