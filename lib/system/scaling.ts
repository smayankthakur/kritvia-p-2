/**
 * Self-Scaling Infrastructure Engine
 * Auto-scaling logic for infrastructure
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface ScalingRule {
  metric: string
  threshold: number
  action: 'scale_up' | 'scale_down' | 'alert'
  scaleFactor?: number
}

// Track system metrics
export async function trackSystemMetric(
  metricType: string,
  value: number,
  unit?: string
): Promise<void> {
  const thresholds = {
    api_latency: { warning: 500, critical: 1000 },
    db_connections: { warning: 80, critical: 95 },
    memory_usage: { warning: 80, critical: 90 },
    cpu_usage: { warning: 70, critical: 85 },
    error_rate: { warning: 1, critical: 5 },
    active_users: { warning: 1000, critical: 5000 },
  }

  const threshold = thresholds[metricType as keyof typeof thresholds]
  const triggered = threshold ? value >= threshold.warning : false

  await supabase.from('system_metrics').insert({
    metric_type: metricType,
    value,
    unit,
    threshold_triggered: triggered,
  })
}

// Check if scaling is needed
export async function checkScalingNeeds(): Promise<{
  shouldScale: boolean
  action: 'scale_up' | 'scale_down' | 'none'
  reason: string
  recommendations: string[]
}> {
  const { data: recent } = await supabase
    .from('system_metrics')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(100)

  if (!recent || recent.length === 0) {
    return { shouldScale: false, action: 'none', reason: 'No data', recommendations: [] }
  }

  const recommendations: string[] = []
  let shouldScale = false
  let action: 'scale_up' | 'scale_down' | 'none' = 'none'

  // Check API latency
  const latency = recent.filter(m => m.metric_type === 'api_latency')
  if (latency.length > 0) {
    const avgLatency = latency.reduce((s, m) => s + m.value, 0) / latency.length
    if (avgLatency > 500) {
      shouldScale = true
      action = 'scale_up'
      recommendations.push('API latency is high - consider scaling up')
    }
  }

  // Check error rate
  const errors = recent.filter(m => m.metric_type === 'error_rate')
  if (errors.length > 0) {
    const avgError = errors.reduce((s, m) => s + m.value, 0) / errors.length
    if (avgError > 2) {
      shouldScale = true
      recommendations.push('High error rate detected - investigate immediately')
    }
  }

  // Check active users trend
  const users = recent.filter(m => m.metric_type === 'active_users')
  if (users.length >= 10) {
    const recentUsers = users.slice(0, 5).reduce((s, m) => s + m.value, 0) / 5
    const olderUsers = users.slice(5, 10).reduce((s, m) => s + m.value, 0) / 5
    
    if (recentUsers > olderUsers * 1.5) {
      shouldScale = true
      action = 'scale_up'
      recommendations.push('User growth detected - scale up capacity')
    }
  }

  // Check for scale down opportunity
  const memory = recent.filter(m => m.metric_type === 'memory_usage')
  if (memory.length > 0) {
    const avgMemory = memory.reduce((s, m) => s + m.value, 0) / memory.length
    if (avgMemory < 30 && action !== 'scale_up') {
      recommendations.push('Low resource usage - consider scaling down to save costs')
    }
  }

  return {
    shouldScale,
    action,
    reason: shouldScale ? 'Metrics exceeded thresholds' : 'All metrics normal',
    recommendations,
  }
}

// Get current system health
export async function getSystemHealth(): Promise<{
  health: 'healthy' | 'warning' | 'critical'
  metrics: Record<string, number>
  issues: string[]
}> {
  const { data: recent } = await supabase
    .from('system_metrics')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(50)

  const issues: string[] = []
  const metrics: Record<string, number> = {}

  for (const m of recent || []) {
    if (!metrics[m.metric_type]) {
      metrics[m.metric_type] = m.value
    }
  }

  // Check health
  let health: 'healthy' | 'warning' | 'critical' = 'healthy'

  if (metrics.api_latency > 1000 || metrics.error_rate > 5) {
    health = 'critical'
    issues.push('Critical performance issues detected')
  } else if (metrics.api_latency > 500 || metrics.error_rate > 1 || metrics.memory_usage > 80) {
    health = 'warning'
    issues.push('Performance warning - monitor closely')
  }

  return { health, metrics, issues }
}

export default {
  trackSystemMetric,
  checkScalingNeeds,
  getSystemHealth,
}
