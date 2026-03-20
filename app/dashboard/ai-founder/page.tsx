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
  Shield
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

interface Alert {
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: string
}

export default function AIFounderDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [forecast, setForecast] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading AI founder data
    const loadData = async () => {
      setLoading(true)
      
      // Mock metrics
      setMetrics([
        { title: 'Revenue (MRR)', value: '₹4.2L', change: 12.5, icon: <DollarSign className="h-4 w-4" /> },
        { title: 'Active Users', value: '1,247', change: 8.2, icon: <Users className="h-4 w-4" /> },
        { title: 'AI Tasks Today', value: '3,847', change: 24.1, icon: <Brain className="h-4 w-4" /> },
        { title: 'Conversion Rate', value: '12.4%', change: -2.1, icon: <Target className="h-4 w-4" /> },
      ])

      // Mock agent status
      setAgents([
        { name: 'CEO Agent', status: 'active', tasks: 12, lastRun: '2 min ago' },
        { name: 'SDR Agent', status: 'active', tasks: 45, lastRun: 'Now' },
        { name: 'Marketing Agent', status: 'active', tasks: 8, lastRun: '5 min ago' },
        { name: 'Operations Agent', status: 'idle', tasks: 0, lastRun: '1 hr ago' },
      ])

      // Mock alerts
      setAlerts([
        { type: 'warning', message: 'High API latency detected in US region', timestamp: '10 min ago' },
        { type: 'info', message: 'New competitor launched similar product', timestamp: '2 hrs ago' },
        { type: 'critical', message: 'Churn risk: 3 enterprise accounts inactive', timestamp: '1 hr ago' },
      ])

      // Mock forecast
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