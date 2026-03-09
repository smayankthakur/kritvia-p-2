import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui';

const stats = [
  { label: 'Active Projects', value: '3', change: '+1 this month', icon: '🚀' },
  { label: 'Total Spend', value: '$45,000', change: '$15K remaining', icon: '💰' },
  { label: 'Pending Invoices', value: '2', change: '$8,500 due', icon: '📄' },
  { label: 'Unread Messages', value: '5', change: 'Last: 2 hours ago', icon: '💬' },
];

const projects = [
  { name: 'AI Fraud Detection', status: 'In Progress', progress: 75, due: 'March 15, 2026', team: ['👨‍💻', '👩‍💻', '🤖'] },
  { name: 'Cloud Migration', status: 'Review', progress: 90, due: 'March 20, 2026', team: ['👨‍💻', '🌐'] },
  { name: 'Mobile App MVP', status: 'Planning', progress: 20, due: 'April 30, 2026', team: ['👩‍💻'] },
];

const recentActivity = [
  { type: 'deliverable', message: 'New deliverable uploaded: API Documentation v2', time: '2 hours ago' },
  { type: 'message', message: 'New message from Project Manager', time: '3 hours ago' },
  { type: 'invoice', message: 'Invoice #INV-003 paid', time: 'Yesterday' },
  { type: 'milestone', message: 'Milestone completed: Design Phase', time: '2 days ago' },
];

const upcomingMilestones = [
  { project: 'AI Fraud Detection', milestone: 'ML Model Delivery', date: 'March 12', type: 'critical' },
  { project: 'Cloud Migration', milestone: 'UAT Sign-off', date: 'March 18', type: 'warning' },
  { project: 'Mobile App MVP', milestone: 'Wireframes Approval', date: 'March 25', type: 'normal' },
];

export default function PlatformDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, John</h1>
            <p className="text-neutral-400">Here's what's happening with your projects.</p>
          </div>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
            + New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs text-neutral-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Active Projects</h2>
                  <a href="/platform/projects" className="text-sm text-primary-400 hover:text-primary-300">View all →</a>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.name} className="p-4 bg-neutral-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                            project.status === 'Review' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-neutral-500/20 text-neutral-400'
                          }`}>{project.status}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {project.team.map((member, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-neutral-900 flex items-center justify-center text-sm">
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Progress</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-neutral-500">Due: {project.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Milestones */}
          <div>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Upcoming Milestones</h2>
                <div className="space-y-3">
                  {upcomingMilestones.map((milestone, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        milestone.type === 'critical' ? 'bg-red-500' :
                        milestone.type === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-white">{milestone.milestone}</div>
                        <div className="text-xs text-neutral-500">{milestone.project}</div>
                        <div className="text-xs text-neutral-600 mt-1">{milestone.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-neutral-900 border-neutral-800 mt-4">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-sm">•</span>
                      <div>
                        <div className="text-sm text-neutral-300">{activity.message}</div>
                        <div className="text-xs text-neutral-600">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
