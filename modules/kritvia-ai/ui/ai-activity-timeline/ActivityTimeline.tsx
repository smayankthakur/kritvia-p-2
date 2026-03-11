'use client';

import React, { useState, useEffect } from 'react';

export interface ActivityItem {
  id: string;
  type: 'agent_action' | 'ai_decision' | 'insight' | 'approval_request' | 'approval_response' | 'automation' | 'prediction';
  agent?: string;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  status?: 'success' | 'pending' | 'failed';
  icon?: string;
}

interface ActivityTimelineProps {
  maxItems?: number;
  filter?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function ActivityTimeline({
  maxItems = 20,
  filter,
  autoRefresh = true,
  refreshInterval = 5000,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial activities
    loadActivities();
    
    // Set up auto-refresh
    if (autoRefresh) {
      const interval = setInterval(loadActivities, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadActivities = async () => {
    // Simulate loading activities
    const mockActivities: ActivityItem[] = generateMockActivities(maxItems);
    
    if (filter && filter.length > 0) {
      setActivities(mockActivities.filter(a => filter.includes(a.type)));
    } else {
      setActivities(mockActivities);
    }
    
    setLoading(false);
  };

  const generateMockActivities = (count: number): ActivityItem[] => {
    const types: ActivityItem['type'][] = [
      'agent_action',
      'ai_decision',
      'insight',
      'approval_request',
      'approval_response',
      'automation',
      'prediction',
    ];
    
    const agents = ['CEO Agent', 'Sales Agent', 'Marketing Agent', 'Operations Agent'];
    const titles = [
      'Analyzed lead data',
      'Generated sales forecast',
      'Sent follow-up email',
      'Created task for team',
      'Detected churn risk',
      'Optimized campaign',
      'Approved deal discount',
    ];
    
    const items: ActivityItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      items.push({
        id: `act_${Date.now()}_${i}`,
        type,
        agent,
        title,
        description: `${agent} ${title.toLowerCase()}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        status: Math.random() > 0.1 ? 'success' : 'failed',
      });
    }
    
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getTypeColor = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'agent_action':
        return 'bg-blue-500';
      case 'ai_decision':
        return 'bg-purple-500';
      case 'insight':
        return 'bg-yellow-500';
      case 'approval_request':
        return 'bg-orange-500';
      case 'approval_response':
        return 'bg-green-500';
      case 'automation':
        return 'bg-cyan-500';
      case 'prediction':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'agent_action':
        return '🤖';
      case 'ai_decision':
        return '🧠';
      case 'insight':
        return '💡';
      case 'approval_request':
        return '📋';
      case 'approval_response':
        return '✅';
      case 'automation':
        return '⚡';
      case 'prediction':
        return '📊';
      default:
        return '•';
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent activities
        </div>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${getTypeColor(activity.type)}`}
            >
              {getTypeIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 truncate">
                {activity.agent && <span className="font-medium">{activity.agent}</span>}
                {activity.description}
              </p>
              
              {activity.status && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                    activity.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ActivityTimeline;
