import type { Metadata } from 'next';
import ChatInterface from '../../modules/kritvia-ai/ui/ai-chat/chat-interface';
import InsightsDashboard from '../../modules/kritvia-ai/ui/ai-dashboard/insights-dashboard';
import CommandConsole from '../../modules/kritvia-ai/ui/ai-command/command-console';

export const metadata: Metadata = {
  title: 'Kritvia AI - AI Business Operating System',
  description: 'AI-powered business decision-making and automation',
};

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
            <div className="flex items-center gap-2">
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
                href="#workflows"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                🔄 Workflows
              </a>
              <a
                href="#settings"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                ⚙️ Settings
              </a>
            </nav>
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
          </div>

          {/* Right Panel - Insights */}
          <div className="col-span-12 lg:col-span-3">
            <section id="dashboard" className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
                <p className="text-sm text-gray-500">AI-powered recommendations</p>
              </div>
              <div className="p-4">
                <InsightsDashboard />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
