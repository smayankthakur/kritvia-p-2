'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'curl' | 'python' | 'javascript' | 'response';

interface Endpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

const endpoints: Endpoint[] = [
  { name: 'Analyze Data', method: 'POST', path: '/api/v1/ai/analyze', description: 'AI-powered data analysis' },
  { name: 'Predict', method: 'POST', path: '/api/v1/ml/predict', description: 'Machine learning predictions' },
  { name: 'Get Users', method: 'GET', path: '/api/v1/users', description: 'List all users' },
  { name: 'Create Project', method: 'POST', path: '/api/v1/projects', description: 'Create new project' },
];

const codeExamples: Record<Tab, string> = {
  curl: `curl -X POST https://api.kritvia.com/v1/ai/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": [1, 2, 3, 4, 5],
    "analysis_type": "trend",
    "model": "gpt-4"
  }'`,
  
  python: `import kritvia

client = kritvia.Client(api_key="YOUR_API_KEY")

# Analyze data with AI
result = client.ai.analyze(
    data=[1, 2, 3, 4, 5],
    analysis_type="trend",
    model="gpt-4"
)

print(result.predictions)
# [{ "trend": "upward", "confidence": 0.95 }]`,
  
  javascript: `import { Kritvia } from '@kritvia/sdk';

const client = new Kritvia({ apiKey: 'YOUR_API_KEY' });

// Analyze data with AI
const result = await client.ai.analyze({
  data: [1, 2, 3, 4, 5],
  analysisType: 'trend',
  model: 'gpt-4'
});

console.log(result.predictions);
// [{ trend: 'upward', confidence: 0.95 }]`,
  
  response: `{
  "success": true,
  "request_id": "req_abc123xyz",
  "results": {
    "predictions": [
      {
        "trend": "upward",
        "confidence": 0.95,
        "forecast": [6, 7.2, 8.5, 10.1]
      }
    ],
    "insights": [
      "Strong upward trend detected",
      "High confidence level (95%)",
      "Seasonal patterns identified"
    ],
    "metadata": {
      "processing_time": "124ms",
      "model_version": "gpt-4-turbo",
      "tokens_used": 450
    }
  }
}`,
};

export function APIDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('curl');
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleRun = () => {
    setIsLoading(true);
    setShowResponse(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowResponse(true);
    }, 800);
  };

  const tabs: Tab[] = ['curl', 'python', 'javascript', 'response'];
  const methodColors = {
    GET: 'bg-green-500/20 text-green-400',
    POST: 'bg-blue-500/20 text-blue-400',
    PUT: 'bg-yellow-500/20 text-yellow-400',
    DELETE: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
        {/* Endpoint Selector */}
        <div className="flex items-center gap-2 p-4 border-b border-[#1A1A1A] overflow-x-auto">
          {endpoints.map((endpoint, i) => (
            <button
              key={i}
              onClick={() => { setActiveEndpoint(i); setShowResponse(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeEndpoint === i
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#252525]'
              }`}
            >
              <span className={`px-2 py-0.5 text-xs rounded ${methodColors[endpoint.method]}`}>
                {endpoint.method}
              </span>
              {endpoint.name}
            </button>
          ))}
        </div>

        {/* Code Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Code */}
          <div className="border-r border-[#1A1A1A]">
            {/* Tabs */}
            <div className="flex border-b border-[#1A1A1A]">
              {tabs.slice(0, 3).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-[#6366F1]'
                      : 'text-[#6B7280] hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="p-4 bg-[#0A0A0A]">
              <pre className="text-sm text-[#9CA3AF] font-mono overflow-x-auto">
                {codeExamples[activeTab]}
              </pre>
            </div>

            {/* Run Button */}
            <div className="p-4 border-t border-[#1A1A1A]">
              <button
                onClick={handleRun}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Run Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Response */}
          <div>
            <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
              <span className="text-sm text-[#6B7280]">Response</span>
              <span className="text-xs text-green-400">200 OK • 124ms</span>
            </div>

            <div className="p-4 bg-[#0A0A0A] h-[300px] overflow-auto">
              <AnimatePresence mode="wait">
                {showResponse ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <pre className="text-sm text-green-400 font-mono">
                      {codeExamples.response}
                    </pre>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#6B7280]">
                    Click "Run Request" to see the response
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Response Stats */}
            {showResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 border-t border-[#1A1A1A] grid grid-cols-4 gap-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">200</div>
                  <div className="text-xs text-[#6B7280]">Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">124ms</div>
                  <div className="text-xs text-[#6B7280]">Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">450</div>
                  <div className="text-xs text-[#6B7280]">Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-[#6B7280]">Uptime</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
