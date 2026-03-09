'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const projects = [
  {
    id: 1,
    name: 'Enterprise CRM Platform',
    client: 'TechCorp Inc.',
    status: 'In Progress',
    progress: 68,
    budget: { spent: 85000, total: 125000 },
    dueDate: '2026-04-15',
    team: ['JD', 'AS', 'MK'],
    description: 'Full-stack CRM with AI-powered lead scoring',
  },
  {
    id: 2,
    name: 'Mobile Banking App',
    client: 'FinanceFirst',
    status: 'In Progress',
    progress: 45,
    budget: { spent: 42000, total: 95000 },
    dueDate: '2026-05-30',
    team: ['RB', 'LP'],
    description: 'iOS and Android banking application',
  },
  {
    id: 3,
    name: 'Healthcare Analytics Dashboard',
    client: 'MedTech Solutions',
    status: 'Review',
    progress: 92,
    budget: { spent: 78000, total: 85000 },
    dueDate: '2026-03-20',
    team: ['JD', 'AS', 'CH', 'NK'],
    description: 'Real-time patient data analytics platform',
  },
  {
    id: 4,
    name: 'E-commerce Platform',
    client: 'RetailHub',
    status: 'Planning',
    progress: 15,
    budget: { spent: 8000, total: 150000 },
    dueDate: '2026-08-01',
    team: ['MK'],
    description: 'Multi-vendor marketplace with AI recommendations',
  },
];

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Review': 'bg-yellow-500/20 text-yellow-400',
  'Planning': 'bg-purple-500/20 text-purple-400',
  'Completed': 'bg-green-500/20 text-green-400',
  'On Hold': 'bg-red-500/20 text-red-400',
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status !== 'Completed';
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-neutral-400">Manage your active client engagements</p>
          </div>
          <Button className="bg-primary-600 hover:bg-primary-500">
            + New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-colors',
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-neutral-500">{project.client}</p>
                  </div>
                  <span className={cn('px-2 py-1 text-xs rounded-full', statusColors[project.status])}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-neutral-400 mb-4">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full',
                        project.progress >= 80 ? 'bg-green-500' :
                        project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Budget</div>
                    <div className="text-sm text-white">
                      ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Due Date</div>
                    <div className="text-sm text-white">{new Date(project.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <div className="flex -space-x-2">
                    {project.team.map((member, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xs font-medium text-white border-2 border-neutral-900"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
