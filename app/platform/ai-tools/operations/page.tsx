'use client';

import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  category: string;
}

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export default function OperationsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock operations data
    setTasks([
      {
        id: '1',
        name: 'Q1 Infrastructure Upgrade',
        assignee: 'Alex Chen',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-03-15',
        category: 'Infrastructure'
      },
      {
        id: '2',
        name: 'Vendor Contract Renewal',
        assignee: 'Sarah Miller',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-03-20',
        category: 'Legal'
      },
      {
        id: '3',
        name: 'Security Audit Preparation',
        assignee: 'Mike Johnson',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-03-18',
        category: 'Security'
      },
      {
        id: '4',
        name: 'Team Onboarding - March',
        assignee: 'Emily Davis',
        status: 'completed',
        priority: 'medium',
        dueDate: '2024-03-10',
        category: 'HR'
      },
      {
        id: '5',
        name: 'Backup System Migration',
        assignee: 'Alex Chen',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-03-25',
        category: 'Infrastructure'
      },
      {
        id: '6',
        name: 'Compliance Report Review',
        assignee: 'Sarah Miller',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2024-03-22',
        category: 'Legal'
      },
      {
        id: '7',
        name: 'Office Lease Renewal',
        assignee: 'Jessica Wong',
        status: 'pending',
        priority: 'low',
        dueDate: '2024-04-01',
        category: 'Facilities'
      },
      {
        id: '8',
        name: 'Vendor Payment Processing',
        assignee: 'Mike Johnson',
        status: 'completed',
        priority: 'medium',
        dueDate: '2024-03-08',
        category: 'Finance'
      }
    ]);
    setLoading(false);
  }, []);

  const metrics: Metric[] = [
    { label: 'Active Tasks', value: '24', change: '+3', trend: 'up' },
    { label: 'Completed This Week', value: '18', change: '+5', trend: 'up' },
    { label: 'Avg. Completion Time', value: '2.4 days', change: '-0.3', trend: 'up' },
    { label: 'Overdue Tasks', value: '2', change: '-1', trend: 'up' }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'in_progress') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-400';
    if (priority === 'medium') return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Infrastructure': '🏗️',
      'Legal': '⚖️',
      'Security': '🔒',
      'HR': '👥',
      'Finance': '💰',
      'Facilities': '🏢'
    };
    return icons[category] || '📋';
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/50 border-b border-neutral-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/platform/ai-tools" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div className="text-3xl">⚙️</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Operations Manager</h1>
              <p className="text-sm text-neutral-400">Task automation and workflow optimization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                <p className="text-sm text-neutral-400">{metric.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-semibold text-white">AI Workflow Suggestions</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <span className="text-blue-400">📋</span>
                <div>
                  <p className="font-medium text-white">Automate Vendor Payment Processing</p>
                  <p className="text-sm text-neutral-400">Pattern detected: Set up recurring approval workflow</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="font-medium text-white">Task Prioritization Optimized</p>
                  <p className="text-sm text-neutral-400">High-priority security tasks moved to top</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                <span className="text-purple-400">👥</span>
                <div>
                  <p className="font-medium text-white">Workload Rebalanced</p>
                  <p className="text-sm text-neutral-400">Alex Chen has 2 high-priority tasks - consider reassignment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Task Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Column */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Pending</h3>
                <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-sm rounded-full">
                  {pendingTasks}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'pending').map(task => (
                  <div key={task.id} className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="font-medium text-white text-sm">{task.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-neutral-500">{task.assignee}</span>
                      <span className="text-xs text-neutral-500">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">In Progress</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                  {inProgressTasks}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'in_progress').map(task => (
                  <div key={task.id} className="p-3 bg-neutral-900/50 border border-blue-500/30 rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="font-medium text-white text-sm">{task.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-neutral-500">{task.assignee}</span>
                      <span className="text-xs text-neutral-500">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Completed</h3>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  {completedTasks}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'completed').map(task => (
                  <div key={task.id} className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg opacity-70">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <p className="font-medium text-white text-sm">{task.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-neutral-500">{task.assignee}</span>
                      <span className="text-xs text-neutral-500">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
