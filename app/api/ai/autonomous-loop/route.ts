/**
 * Autonomous Execution Loop API
 * Runs the AI orchestration cycle
 */

import { NextRequest, NextResponse } from 'next/server'
import { runAutonomousCycle, processLeads, processDeals, getAutonomousStatus } from '@/lib/ai/autonomousEngine'
import { triggerManualCycle, processPendingApprovals } from '@/lib/worker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { action, target } = body

    switch (action) {
      case 'full_loop': {
        // Run full autonomous cycle
        const result = await runAutonomousCycle()
        return NextResponse.json({
          success: true,
          message: 'Full autonomous loop completed',
          result: {
            eventsProcessed: result.eventsProcessed,
            decisions: result.decisions.length,
            actionsExecuted: result.actionsExecuted,
            actionsFailed: result.actionsFailed,
            approvalsRequired: result.approvalsRequired,
            errors: result.errors,
          },
        })
      }

      case 'process_leads': {
        // Process leads only
        const result = await processLeads()
        return NextResponse.json({
          success: true,
          message: 'Lead processing completed',
          result: {
            eventsProcessed: result.eventsProcessed,
            decisions: result.decisions.length,
            actionsExecuted: result.actionsExecuted,
            actionsFailed: result.actionsFailed,
            approvalsRequired: result.approvalsRequired,
          },
        })
      }

      case 'process_deals': {
        // Process deals only
        const result = await processDeals()
        return NextResponse.json({
          success: true,
          message: 'Deal processing completed',
          result: {
            eventsProcessed: result.eventsProcessed,
            decisions: result.decisions.length,
            actionsExecuted: result.actionsExecuted,
            actionsFailed: result.actionsFailed,
            approvalsRequired: result.approvalsRequired,
          },
        })
      }

      case 'trigger_manual': {
        // Trigger manual worker cycle
        const result = await triggerManualCycle()
        return NextResponse.json(result)
      }

      case 'process_approvals': {
        // Process pending approvals
        const result = await processPendingApprovals()
        return NextResponse.json({
          success: true,
          message: 'Pending approvals processed',
          result,
        })
      }

      case 'process': {
        // Process specific target (leads or deals)
        if (target === 'leads') {
          const result = await processLeads()
          return NextResponse.json({ success: true, result })
        } else if (target === 'deals') {
          const result = await processDeals()
          return NextResponse.json({ success: true, result })
        }
        return NextResponse.json(
          { error: 'Invalid target. Use "leads" or "deals"' },
          { status: 400 }
        )
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: full_loop, process_leads, process_deals, trigger_manual, process_approvals, or process' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('[API] Autonomous loop error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = await getAutonomousStatus()
    
    return NextResponse.json({
      message: 'Autonomous loop endpoint',
      methods: ['POST'],
      status,
      usage: {
        actions: {
          full_loop: 'Run full autonomous cycle (events, leads, deals)',
          process_leads: 'Process leads only',
          process_deals: 'Process deals only',
          trigger_manual: 'Trigger manual worker cycle',
          process_approvals: 'Process pending approvals',
          process: 'Process specific target (requires target: "leads" or "deals")',
        },
      },
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Autonomous loop endpoint',
      methods: ['POST'],
      usage: {
        action: 'full_loop | process_leads | process_deals | trigger_manual | process_approvals | process',
        target: 'leads | deals (for process action)',
      },
    })
  }
}
