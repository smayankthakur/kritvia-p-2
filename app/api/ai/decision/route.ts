import { NextResponse } from 'next/server';
import { SalesAgent } from '@/modules/kritvia-ai/agents/sales.agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context } = body;
    
    const salesAgent = new SalesAgent();
    const result = await salesAgent.analyze({ query, context });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in AI decision endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}