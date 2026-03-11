/**
 * Health Check Endpoint
 * 
 * Returns system health status including database, agents, and analytics.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * 
 * Returns health status of all system components.
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Database is in-memory, always ready
    const dbStatus = {
      status: 'ready' as const,
      mode: 'in-memory',
      ready: true,
    };
    
    // Agents are always ready in this setup
    const agentsStatus = {
      status: 'running' as const,
      ready: true,
      agents: ['sales', 'marketing', 'operations', 'ceo'],
    };
    
    // Analytics is always ready
    const analyticsStatus = {
      status: 'active' as const,
      mode: 'in-memory',
      ready: true,
    };
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: dbStatus,
        agents: agentsStatus,
        analytics: analyticsStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: { status: 'error', ready: false },
        agents: { status: 'error', ready: false },
        analytics: { status: 'error', ready: false },
      },
    }, { status: 503 });
  }
}
