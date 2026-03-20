'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Badge } from '@/app/components/ui/Badge'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  BarChart3,
  Globe,
  Shield,
  Cpu,
  Network,
  Mail
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

interface AgentStatus {
  name: string
  status: 'active' | 'idle' | 'error'
  tasks: number
  lastRun: string
}

interface ForecastItem {
  month: string
  predicted: number
  confidence: number
}

interface Alert {
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: string
}

export default function AIFounderDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [forecast, setForecast] = useState<{ revenue: ForecastItem[]; growth: number; churn: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      setMetrics([
        { title: 'Revenue (MRR)', value: '₹4.2L', change: 12.5, icon: <DollarSign className="h-4 w-4" /> },
        { title: 'Active Users', value: '1,247', change: 8.2, icon: <Users className="h-4 w-4" /> },
        { title: 'AI Tasks Today', value: '3,847', change: 24.1, icon: <Brain className="h-4 w-4" /> },
        { title: 'Conversion Rate', value: '12.4%', change: -2.1, icon: <Target className="h-4 w-4" /> },
      ])

      setAgents([
        { name: 'CEO Agent', status: 'active', tasks: 12, lastRun: '2 min ago' },
        { name: 'SDR Agent', status: 'active', tasks: 45, lastRun: 'Now' },
        { name: 'Marketing Agent', status: 'active', tasks: 8, lastRun: '5 min ago' },
        { name: 'Operations Agent', status: 'idle', tasks: 0, lastRun: '1 hr ago' },
      ])

      setAlerts([
        { type: 'warning', message: 'High API latency detected in US region', timestamp: '10 min ago' },
        { type: 'info', message: 'New competitor launched similar product', timestamp: '2 hrs ago' },
        { type: 'critical', message: 'Churn risk: 3 enterprise accounts inactive', timestamp: '1 hr ago' },
      ])

      setForecast({
        revenue: [
          { month: 'Mar', predicted: 420000, confidence: 0.9 },
          { month: 'Apr', predicted: 485000, confidence: 0.85 },
          { month: 'May', predicted: 550000, confidence: 0.8 },
          { month: 'Jun', predicted: 620000, confidence: 0.75 },
          { month: 'Jul', predicted: 710000, confidence: 0.7 },
          { month: 'Aug', predicted: 820000, confidence: 0.65 },
        ],
        growth: 28.5,
        churn: 2.1,
      })

      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading AI Founder Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Founder Mode
            </h1>
            <p className="text-slate-400 mt-1">Autonomous business insights for your company</p>
          </div>
          <div className="space-x-4">
            <Button variant="outline">Export Report</Button>
            <Button>Settings</Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{metric.title}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.change >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {metric.icon}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {metric.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-slate-500 text-sm ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Forecast */}
          <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast?.revenue.map((item: ForecastItem, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="font-medium">{item.month}</p>
                      <p className="text-sm text-slate-400">₹{(item.predicted / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.confidence > 0.8 ? 'success' : item.confidence > 0.6 ? 'warning' : 'secondary'}>
                        {Math.round(item.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                <div>
                  <p className="text-sm text-slate-400">Projected Growth</p>
                  <p className="text-2xl font-bold text-green-400">+{forecast?.growth}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Churn Risk</p>
                  <p className="text-2xl font-bold text-red-400">{forecast?.churn}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Agents */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                AI Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        agent.status === 'active' ? 'bg-green-500/10' : 
                        agent.status === 'error' ? 'bg-red-500/10' : 'bg-slate-700'
                      }`}>
                        <Cpu className={`h-4 w-4 ${
                          agent.status === 'active' ? 'text-green-400' : 
                          agent.status === 'error' ? 'text-red-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.lastRun}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'error' ? 'destructive' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                AI Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alert.type === 'critical' ? (
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      ) : (
                        <Activity className="h-5 w-5 text-blue-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-400" />
                  <span className="text-sm">Ask AI</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  <span className="text-sm">Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Network className="h-6 w-6 text-green-400" />
                  <span className="text-sm">Campaigns</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Mail className="h-6 w-6 text-pink-400" />
                  <span className="text-sm">Email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">API</p>
                  <p className="font-medium">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Database</p>
                  <p className="font-medium">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">AI Models</p>
                  <p className="font-medium">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Storage</p>
                  <p className="font-medium">75% Used</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
