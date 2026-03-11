'use client';

import React, { useState, useEffect } from 'react';

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  lastRun?: string;
  actionsCreated: number;
}

interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  title: string;
  status: string;
  createdAt: string;
}

export function AgentDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    setLoading(true);
    
    const mockAgents: AgentStatus[] = [
      { id: 'sales_agent', name: 'Sales Agent', role: 'sales', status: 'active', lastRun: new Date().toISOString(), actionsCreated: 12 },
      { id: 'marketing_agent', name: 'Marketing Agent', role: 'marketing', status: 'active', lastRun: new Date().toISOString(), actionsCreated: 8 },
      { id: 'operations_agent', name: 'Operations Agent', role: 'operations', status: 'idle', lastRun: new Date(Date.now() - 3600000).toISOString(), actionsCreated: 5 },
      { id: 'customer_success_agent', name: 'Customer Success Agent', role: 'customer_success', status: 'active', lastRun: new Date().toISOString(), actionsCreated: 6 },
    ];
    
    const mockActions: AgentAction[] = [
      { id: '1', agentId: 'sales_agent', type: 'CREATE_TASK', title: 'Follow up with Acme Corp', status: 'pending', createdAt: new Date().toISOString() },
      { id: '2', agentId: 'marketing_agent', type: 'GENERATE_REPORT', title: 'Lead trends report', status: 'executed', createdAt: new Date(Date.now() - 1800000).toISOString() },
      { id: '3', agentId: 'customer_success_agent', type: 'SEND_NOTIFICATION', title: 'Churn risk alert', status: 'pending', createdAt: new Date().toISOString() },
    ];
    
    setAgents(mockAgents);
    setActions(mockActions);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'sales': return '💰';
      case 'marketing': return '📢';
      case 'operations': return '⚙️';
      case 'customer_success': return '❤️';
      default: return '🤖';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getRoleIcon(agent.role)}</span>
                <span className="font-medium text-gray-900">{agent.name}</span>
              </div>
              <span className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="capitalize">{agent.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Run</span>
                <span>{agent.lastRun ? formatTime(agent.lastRun) : 'Never'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actions</span>
                <span>{agent.actionsCreated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Pending Agent Actions</h3>
          <p className="text-sm text-gray-500">Actions awaiting approval</p>
        </div>
        <div className="divide-y">
          {actions.filter(a => a.status === 'pending').length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No pending actions
            </div>
          ) : (
            actions.filter(a => a.status === 'pending').map((action) => (
              <div key={action.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">
                    {action.type} • {agents.find(a => a.id === action.agentId)?.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Agent Activity</h3>
        </div>
        <div className="divide-y max-h-64 overflow-y-auto">
          {actions.map((action) => (
            <div key={action.id} className="p-4 flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full ${
                action.status === 'executed' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500">
                  {action.type} • {formatTime(action.createdAt)}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                action.status === 'executed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {action.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
