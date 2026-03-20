/**
 * Autonomous Execution Loop API
 * Runs the AI orchestration cycle
 */

import { NextRequest, NextResponse } from 'next/server'
import { runAutonomousLoop, runOrchestrationCycle } from '@/lib/agents/orchestrator'

export async function POST(request: NextRequest) {
  try {
    const { workspace_id, action } = await request.json()

    if (action === 'full_loop') {
      // Run full autonomous loop for all workspaces
      await runAutonomousLoop()
      return NextResponse.json({
        success: true,
        message: 'Full autonomous loop completed',
      })
    }

    if (workspace_id) {
      // Run for specific workspace
      const result = await runOrchestrationCycle(workspace_id)
      return NextResponse.json({
        success: true,
        result,
      })
    }

    return NextResponse.json({
      error: 'workspace_id or action required',
    }, { status: 400 })
  } catch (error) {
    console.error('Autonomous loop error:', error)
    return NextResponse.json({
      error: 'Internal server error',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Autonomous loop endpoint',
    methods: ['POST'],
    usage: {
      action: 'full_loop - Run for all workspaces',
      workspace_id: 'string - Run for specific workspace',
    },
  })
}
