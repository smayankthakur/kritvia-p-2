/**
 * Autonomous Status API
 * Returns current autonomous system status
 */

import { NextResponse } from 'next/server'
import { getAutonomousStatus } from '@/lib/ai/autonomousEngine'
import { getSystemMode, getSystemConfig } from '@/lib/ai/rules'
import { getActionHistory, getPendingApprovals } from '@/lib/ai/actionEngine'
import { getLearningMetrics, getRecommendations } from '@/lib/ai/learning'
import { getWorkerStatus } from '@/lib/worker'

export async function GET() {
  try {
    // Get all status components in parallel
    const [status, mode, config, recentActions, pendingApprovals, metrics, recommendations, workerStatus] = await Promise.all([
      getAutonomousStatus(),
      getSystemMode(),
      getSystemConfig(),
      getActionHistory(20),
      getPendingApprovals(),
      getLearningMetrics(7),
      getRecommendations(),
      getWorkerStatus(),
    ])
    
    return NextResponse.json({
      // System mode
      mode,
      systemConfig: config,
      
      // Worker status
      worker: {
        isRunning: workerStatus.isRunning,
        isActive: workerStatus.isActive,
        lastCycle: workerStatus.lastCycle,
      },
      
      // Autonomous status
      autonomous: {
        isRunning: status.isRunning,
        lastCycle: status.lastCycle,
        eventsProcessed: status.eventsProcessed,
        actionsExecuted: status.actionsExecuted,
        successRate: status.successRate,
      },
      
      // Approvals
      pendingApprovals: pendingApprovals.length,
      recentApprovals: pendingApprovals.slice(0, 5),
      
      // Actions
      recentActions: recentActions.map(action => ({
        id: action.id,
        decisionId: action.decision_id,
        actionType: action.action_type,
        actionName: action.action_name,
        status: action.status,
        executedAt: action.executed_at,
        executionTimeMs: action.execution_time_ms,
      })),
      
      // Learning metrics
      metrics: {
        totalActions: metrics.totalActions,
        successRate: metrics.successRate,
        averageConfidence: metrics.averageConfidence,
        userOverrides: metrics.userOverrides,
        topPerformingActions: metrics.topPerformingActions,
        improvementAreas: metrics.improvementAreas,
      },
      
      // Recommendations
      recommendations,
    })
  } catch (error) {
    console.error('[API] Autonomous status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch autonomous status', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Update system mode
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode, config } = body
    
    if (!mode) {
      return NextResponse.json(
        { error: 'Mode is required' },
        { status: 400 }
      )
    }
    
    const validModes = ['manual', 'assistive', 'autonomous']
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be: manual, assistive, or autonomous' },
        { status: 400 }
      )
    }
    
    // Import the setSystemMode function
    const { setSystemMode } = await import('@/lib/ai/rules')
    
    await setSystemMode(mode, config)
    
    // Also update worker based on mode
    const { startWorker, stopWorker } = await import('@/lib/worker')
    
    if (mode === 'manual') {
      stopWorker()
    } else {
      startWorker({ enabled: true, intervalSeconds: 60 })
    }
    
    return NextResponse.json({
      success: true,
      message: `System mode changed to ${mode}`,
      mode,
      config,
    })
  } catch (error) {
    console.error('[API] Mode update error:', error)
    return NextResponse.json(
      { error: 'Failed to update system mode', details: String(error) },
      { status: 500 }
    )
  }
}
