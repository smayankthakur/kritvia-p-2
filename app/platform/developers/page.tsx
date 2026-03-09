'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const apiEndpoints = [
  {
    id: 'authentication',
    name: 'Authentication',
    description: 'Manage user authentication and API keys',
    methods: [
      { method: 'POST', path: '/api/v1/auth/login', description: 'Authenticate user' },
      { method: 'POST', path: '/api/v1/auth/register', description: 'Register new user' },
      { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh access token' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Create and manage client projects',
    methods: [
      { method: 'GET', path: '/api/v1/projects', description: 'List all projects' },
      { method: 'POST', path: '/api/v1/projects', description: 'Create new project' },
      { method: 'GET', path: '/api/v1/projects/:id', description: 'Get project details' },
      { method: 'PUT', path: '/api/v1/projects/:id', description: 'Update project' },
    ],
  },
  {
    id: 'ai-content',
    name: 'AI Content',
    description: 'Generate content using AI models',
    methods: [
      { method: 'POST', path: '/api/v1/ai/generate', description: 'Generate content' },
      { method: 'POST', path: '/api/v1/ai/analyze', description: 'Analyze text' },
      { method: 'GET', path: '/api/v1/ai/models', description: 'List available models' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Track usage and performance metrics',
    methods: [
      { method: 'GET', path: '/api/v1/analytics/usage', description: 'Get usage stats' },
      { method: 'GET', path: '/api/v1/analytics/events', description: 'Get event logs' },
      { method: 'GET', path: '/api/v1/analytics/reports', description: 'Generate reports' },
    ],
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Configure and manage webhooks',
    methods: [
      { method: 'GET', path: '/api/v1/webhooks', description: 'List webhooks' },
      { method: 'POST', path: '/api/v1/webhooks', description: 'Create webhook' },
      { method: 'PUT', path: '/api/v1/webhooks/:id', description: 'Update webhook' },
      { method: 'DELETE', path: '/api/v1/webhooks/:id', description: 'Delete webhook' },
    ],
  },
];

const codeExamples = {
  authentication: `// Authentication Example
const response = await fetch('https://api.kritvia.com/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'your-password'
  })
});

const { token, refreshToken } = await response.json();`,
  
  projects: `// Projects Example
const response = await fetch('https://api.kritvia.com/v1/projects', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const projects = await response.json();`,
  
  'ai-content': `// AI Content Generation Example
const response = await fetch('https://api.kritvia.com/v1/ai/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    prompt: 'Write a blog post about AI in business',
    max_tokens: 1000,
    temperature: 0.7
  })
});

const { content, usage } = await response.json();`,
};

export default function DevelopersPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(apiEndpoints[0]);
  const [activeTab, setActiveTab] = useState<'docs' | 'playground' | 'sdks'>('docs');

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {(['docs', 'playground', 'sdks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 px-3 text-xs rounded-lg transition-colors',
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {apiEndpoints.map((endpoint) => (
              <button
                key={endpoint.id}
                onClick={() => setActiveEndpoint(endpoint)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl transition-all',
                  activeEndpoint.id === endpoint.id
                    ? 'bg-neutral-800 border border-primary-500/30'
                    : 'hover:bg-neutral-800/50'
                )}
              >
                <div className="font-medium text-white text-sm">{endpoint.name}</div>
                <div className="text-xs text-neutral-500">{endpoint.methods.length} endpoints</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'docs' && (
            <>
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-white">{activeEndpoint.name} API</h1>
                <p className="text-neutral-400 mt-1">{activeEndpoint.description}</p>
              </div>

              {/* Endpoints */}
              <div className="space-y-3">
                {activeEndpoint.methods.map((method, i) => (
                  <Card key={i} className="bg-neutral-900 border-neutral-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'px-2 py-1 text-xs font-bold rounded',
                          method.method === 'GET' && 'bg-blue-500/20 text-blue-400',
                          method.method === 'POST' && 'bg-green-500/20 text-green-400',
                          method.method === 'PUT' && 'bg-yellow-500/20 text-yellow-400',
                          method.method === 'DELETE' && 'bg-red-500/20 text-red-400',
                        )}>{method.method}</span>
                        <code className="text-sm text-white">{method.path}</code>
                      </div>
                      <p className="text-sm text-neutral-400 mt-2">{method.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Code Example */}
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-0">
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <span className="text-sm text-neutral-400">Example Request</span>
                  </div>
                  <pre className="p-4 text-sm text-neutral-300 overflow-x-auto">
                    <code>{codeExamples[activeEndpoint.id as keyof typeof codeExamples] || codeExamples.projects}</code>
                  </pre>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'playground' && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🛝</span>
                  <h2 className="text-xl font-semibold text-white mb-2">API Playground</h2>
                  <p className="text-neutral-400 mb-6">Test API calls directly from your browser</p>
                  <Button className="bg-primary-600 hover:bg-primary-500">
                    Launch Playground →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sdks' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Official SDKs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['JavaScript/TypeScript', 'Python', 'Go', 'Ruby'].map((sdk) => (
                  <Card key={sdk} className="bg-neutral-900 border-neutral-800">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{sdk}</div>
                        <div className="text-sm text-neutral-500">npm install @kritvia/sdk</div>
                      </div>
                      <Button variant="outline" size="sm">Install</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
