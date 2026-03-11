'use client';

import { useState, useEffect } from 'react';

// Types
interface AIEvent {
  id: string;
  eventType: string;
  organizationId: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: number;
}

interface AgentTask {
  id: string;
  agentType: string;
  organizationId: string;
  task: string;
  priority: number;
  status: string;
  createdAt: number;
  completedAt?: number;
}

interface AIInsight {
  id: string;
  insightType: string;
  severity: string;
  title: string;
  description: string;
  confidenceScore: number;
  createdAt: number;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: string;
  actions: { action: string; status: string }[];
  createdAt: number;
}

export default function AIControlCenter() {
  const [activeTab, setActiveTab] = useState<'events' | 'agents' | 'insights' | 'workflows'>('events');
  const [events, setEvents] = useState<AIEvent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, tasksRes, insightsRes, workflowsRes] = await Promise.all([
          fetch('/api/ai/events?limit=20'),
          fetch('/api/ai/agents/tasks'),
          fetch('/api/ai/insights?limit=10'),
          fetch('/api/ai/workflows/executions'),
        ]);

        const [eventsData, tasksData, insightsData, workflowsData] = await Promise.all([
          eventsRes.json(),
          tasksRes.json(),
          insightsRes.json(),
          workflowsRes.json(),
        ]);

        setEvents(eventsData.events || eventsData);
        setTasks(tasksData.tasks || []);
        setInsights(insightsData.insights || []);
        setWorkflows(workflowsData.executions || []);
      } catch (error) {
        console.error('Error fetching AI control center data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Event type colors
  const getEventColor = (type: string) => {
    if (type.includes('deal')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (type.includes('customer')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (type.includes('campaign')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                AI Control Center
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Monitor and manage autonomous AI operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-neutral-400">AI Active</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 pb-0">
            {[
              { id: 'events', label: 'Events', icon: '📡' },
              { id: 'agents', label: 'Agents', icon: '🤖' },
              { id: 'insights', label: 'Insights', icon: '💡' },
              { id: 'workflows', label: 'Workflows', icon: '⚡' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-neutral-800 text-white border-t border-x border-neutral-700' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-neutral-800 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{events.length}</div>
                    <div className="text-sm text-neutral-400">Total Events</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {events.filter(e => e.eventType.includes('deal')).length}
                    </div>
                    <div className="text-sm text-neutral-400">Deal Events</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">
                      {events.filter(e => e.eventType.includes('customer')).length}
                    </div>
                    <div className="text-sm text-neutral-400">Customer Events</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {events.filter(e => e.eventType.includes('campaign')).length}
                    </div>
                    <div className="text-sm text-neutral-400">Campaign Events</div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-neutral-800">
                    <h3 className="font-semibold">Recent Events</h3>
                  </div>
                  <div className="divide-y divide-neutral-800">
                    {events.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400">
                        No events recorded yet
                      </div>
                    ) : (
                      events.slice(0, 10).map(event => (
                        <div key={event.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs border ${getEventColor(event.eventType)}`}>
                              {event.eventType}
                            </span>
                            <span className="text-sm text-neutral-300">
                              Entity: {event.entityId}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {formatTime(event.createdAt)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === 'agents' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{tasks.length}</div>
                    <div className="text-sm text-neutral-400">Total Tasks</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {tasks.filter(t => t.status === 'running').length}
                    </div>
                    <div className="text-sm text-neutral-400">Running</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="text-sm text-neutral-400">Completed</div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-neutral-800">
                    <h3 className="font-semibold">Agent Tasks</h3>
                  </div>
                  <div className="divide-y divide-neutral-800">
                    {tasks.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400">
                        No agent tasks yet
                      </div>
                    ) : (
                      tasks.slice(0, 10).map(task => (
                        <div key={task.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {task.agentType}
                              </span>
                              <span className={`text-sm ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <span className="text-xs text-neutral-500">
                              Priority: {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-300">{task.task}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{insights.length}</div>
                    <div className="text-sm text-neutral-400">Total Insights</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-400">
                      {insights.filter(i => i.severity === 'critical').length}
                    </div>
                    <div className="text-sm text-neutral-400">Critical</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">
                      {insights.filter(i => i.severity === 'high').length}
                    </div>
                    <div className="text-sm text-neutral-400">High Priority</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {insights.filter(i => i.severity === 'medium').length}
                    </div>
                    <div className="text-sm text-neutral-400">Medium</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {insights.length === 0 ? (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center text-neutral-400">
                      No AI insights generated yet
                    </div>
                  ) : (
                    insights.map(insight => (
                      <div
                        key={insight.id}
                        className={`
                          p-4 rounded-lg border
                          ${insight.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : ''}
                          ${insight.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' : ''}
                          ${insight.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' : ''}
                          ${insight.severity === 'low' ? 'bg-blue-500/10 border-blue-500/30' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{insight.title}</h4>
                          <span className="text-xs text-neutral-400">
                            {insight.confidenceScore.toFixed(0)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300">{insight.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Workflows Tab */}
            {activeTab === 'workflows' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{workflows.length}</div>
                    <div className="text-sm text-neutral-400">Total Executions</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {workflows.filter(w => w.status === 'running').length}
                    </div>
                    <div className="text-sm text-neutral-400">Running</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {workflows.filter(w => w.status === 'completed').length}
                    </div>
                    <div className="text-sm text-neutral-400">Completed</div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-neutral-800">
                    <h3 className="font-semibold">Workflow Executions</h3>
                  </div>
                  <div className="divide-y divide-neutral-800">
                    {workflows.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400">
                        No workflow executions yet
                      </div>
                    ) : (
                      workflows.slice(0, 10).map(workflow => (
                        <div key={workflow.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              {workflow.workflowId}
                            </span>
                            <span className={`text-sm ${getStatusColor(workflow.status)}`}>
                              {workflow.status}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500">
                            {workflow.actions?.length || 0} actions • {formatTime(workflow.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
