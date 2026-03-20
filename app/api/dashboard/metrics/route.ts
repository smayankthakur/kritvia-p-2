import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth-context'
import { EventService } from '@/lib/services/event.service'
import { CRMService } from '@/lib/services/crm.service'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's company
    const company = await CRMService.getCompanyByUserId(user.id)
    
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Fetch metrics in parallel
    const [leads, deals, events, tasks] = await Promise.all([
      CRMService.getLeadsByCompanyId(company.id),
      CRMService.getDealsByCompanyId(company.id),
      EventService.getEventsByCompanyId(company.id),
      CRMService.getTasksByUserId(user.id)
    ])

    // Calculate metrics
    const totalLeads = leads.length
    const activeDeals = deals.filter(deal => 
      deal.stage !== 'closed_won' && deal.stage !== 'closed_lost'
    ).length
    
    const wonDeals = deals.filter(deal => deal.stage === 'closed_won')
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    
    const conversionRate = totalLeads > 0 
      ? (wonDeals.length / totalLeads) * 100 
      : 0
    
    const recentEvents = events.slice(0, 5) // Last 5 events
    const pendingTasks = tasks.filter(task => 
      task.status !== 'completed'
    ).length

    const metrics = {
      totalLeads,
      activeDeals,
      totalRevenue,
      conversionRate: Number(conversionRate.toFixed(2)),
      recentEvents,
      pendingTasks,
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        size: company.size
      }
    }

    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    console.error('Dashboard metrics error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}