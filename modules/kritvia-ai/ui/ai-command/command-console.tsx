'use client';

import { useState } from 'react';

interface CommandResult {
  success: boolean;
  message: string;
  actionId?: string;
}

const commandSuggestions = [
  { command: '/assign lead', description: 'Assign a lead to a sales rep' },
  { command: '/generate proposal', description: 'Generate a proposal for a client' },
  { command: '/show deals', description: 'Show high priority deals' },
  { command: '/create workflow', description: 'Create an automation workflow' },
  { command: '/send followup', description: 'Send follow-up email to lead' },
  { command: '/score lead', description: 'Score a lead based on criteria' },
];

export default function CommandConsole() {
  const [command, setCommand] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    setLoading(true);
    setResults(prev => [...prev, { success: true, message: `Executing: ${command}` }]);

    try {
      const response = await fetch('/api/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: command.split(' ')[0].replace('/', ''),
          parameters: { rawCommand: command },
          target: 'crm',
        }),
      });

      const result = await response.json();

      setResults(prev => [
        ...prev,
        {
          success: result.success,
          message: result.data?.status || result.error || 'Command executed',
          actionId: result.data?.actionId,
        },
      ]);
    } catch (error) {
      setResults(prev => [
        ...prev,
        { success: false, message: 'Failed to execute command' },
      ]);
    } finally {
      setLoading(false);
      setCommand('');
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    setCommand(cmd + ' ');
  };

  return (
    <div className="space-y-4">
      {/* Command Input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={e => setCommand(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !command.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Run
          </button>
        </div>
      </form>

      {/* Command Suggestions */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {commandSuggestions.map(suggestion => (
            <button
              key={suggestion.command}
              onClick={() => handleSuggestionClick(suggestion.command)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <span className="font-mono text-blue-600">{suggestion.command}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Results:</p>
          <div className="space-y-1">
            {results.slice(-5).map((result, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded text-sm ${
                  result.success
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {result.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
