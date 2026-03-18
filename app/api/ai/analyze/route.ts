import { NextResponse } from 'next/server';
import { CEOAgent } from '@/modules/kritvia-ai/agents/ceo.agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context } = body;
    
    const ceoAgent = new CEOAgent();
    const result = await ceoAgent.analyze({ query, context });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in AI analyze endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}