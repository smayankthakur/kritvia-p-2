import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  ShieldAlert, 
  Clock,
  MessageCircle,
  Zap
} from "lucide-react";

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$24,850</p>
              <p className="text-sm text-green-600">+12.5% this month</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
              <p className="text-sm text-green-600">+8 this week</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
              <p className="text-sm text-green-600">+0.8% this month</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">System Health</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Optimal</p>
              <p className="text-sm text-green-600">All systems operational</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Monthly Revenue Trend
            </h3>
            {/* In a real app, this would be an actual chart */}
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {/* Chart placeholder */}
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Revenue Chart Placeholder
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Lead Sources
            </h3>
            {/* In a real app, this would be an actual chart */}
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {/* Chart placeholder */}
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Lead Sources Chart Placeholder
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                View All
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New lead acquired: TechCorp Inc.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Deal closed: Enterprise Solutions ($15K)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-green-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Campaign launched: Q1 Product Launch
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-yellow-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Meeting scheduled: Strategy Review
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    3 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Insights & Actions
              </h3>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                View All
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    AI Insight: Lead response time decreasing conversion
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Suggested action: Automate follow-up sequences
                  </p>
                  <button className="mt-2 px-3 py-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs rounded hover:from-violet-600 hover:to-blue-600">
                    Execute
                  </button>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    AI Insight: Email open rates down on Tuesdays
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Suggested action: A/B test subject lines
                  </p>
                  <button className="mt-2 px-3 py-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs rounded hover:from-violet-600 hover:to-blue-600">
                    Execute
                  </button>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-3 w-3 bg-green-500 rounded-full mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    AI Insight: High-value leads from webinar attendees
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Suggested action: Increase webinar frequency
                  </p>
                  <button className="mt-2 px-3 py-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs rounded hover:from-violet-600 hover:to-blue-600">
                    Execute
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}