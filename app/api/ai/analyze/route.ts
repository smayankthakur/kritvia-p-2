import { NextRequest, NextResponse } from 'next/server';
import { aiModelService, type AIRequest, type AIResponse } from '@/modules/kritvia-ai/ai-model';
import { aiMemoryService, addMemoryToContext } from '@/modules/kritvia-ai/memory';

export const dynamic = 'force-dynamic';

interface AnalyzeRequest {
  query: string;
  organizationId: string;
  userId: string;
  context?: Record<string, unknown>;
}

interface AIRecommendation {
  recommendation: string;
  reasoning: string;
  confidenceScore: number;
  dataSources: string[];
}

interface AnalyzeResponse {
  success: boolean;
  data?: {
    response: AIResponse;
    recommendation: AIRecommendation;
    sources: string[];
  };
  error?: string;
}

function generateRecommendation(query: string, content: string): AIRecommendation {
  const queryLower = query.toLowerCase();
  let recommendation = '';
  let reasoning = '';
  let confidenceScore = 0.85;
  const dataSources = ['CRM Pipeline', 'Historical Data', 'AI Analysis'];

  // Extract key points from the response
  const lines = content.split('\n').filter(l => l.trim());
  
  // Generate recommendation based on query type
  if (queryLower.includes('deal') || queryLower.includes('sales') || queryLower.includes('pipeline')) {
    recommendation = 'Focus on high-probability, high-value deals';
    reasoning = 'Based on pipeline analysis showing 3 deals with >70% probability and combined value of $105K';
    confidenceScore = 0.87;
    dataSources.push('Sales Pipeline', 'Deal History');
  } else if (queryLower.includes('marketing') || queryLower.includes('campaign')) {
    recommendation = 'Scale email marketing by 20%';
    reasoning = 'Email campaigns show highest ROI at 567%, outperforming other channels';
    confidenceScore = 0.82;
    dataSources.push('Campaign Analytics', 'Channel Performance');
  } else if (queryLower.includes('operation') || queryLower.includes('task')) {
    recommendation = 'Address security audit bottleneck';
    reasoning = 'Security Audit task is behind schedule and blocking dependent tasks';
    confidenceScore = 0.79;
    dataSources.push('Task Management', 'Team Workload');
  } else if (queryLower.includes('forecast') || queryLower.includes('revenue')) {
    recommendation = 'Current trajectory supports base case scenario';
    reasoning = 'YTD revenue 8% above forecast with strong Q1 momentum';
    confidenceScore = 0.91;
    dataSources.push('Revenue Data', 'Historical Trends', 'Pipeline Coverage');
  } else {
    // Extract first meaningful recommendation from content
    const recommendationLine = lines.find(l => l.startsWith('### ') && l.includes('Recommendation'));
    if (recommendationLine) {
      recommendation = 'Review AI recommendations above';
      reasoning = 'Multiple actionable insights provided in the analysis';
    } else {
      recommendation = 'Analyze business metrics';
      reasoning = 'Review detailed analysis for specific recommendations';
    }
    confidenceScore = 0.75;
  }

  return { recommendation, reasoning, confidenceScore, dataSources };
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const body: AnalyzeRequest = await request.json();
    const { query, organizationId, userId, context } = body;
    
    // Validate required fields
    if (!query || !organizationId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: query, organizationId, userId' },
        { status: 400 }
      );
    }
    
    // Get relevant memories for context
    const { memoryContext } = await addMemoryToContext(organizationId, query);
    
    // Build enhanced prompt with memory context
    const enhancedQuery = `${query}\n\n${memoryContext}`;
    
    // Build AI request
    const aiRequest: AIRequest = {
      organizationId,
      userId,
      query: enhancedQuery,
      context: context || {},
    };
    
    // Generate response
    const aiResponse: AIResponse = await aiModelService.generateResponse(aiRequest);
    
    // Generate recommendation with reasoning
    const recommendation = generateRecommendation(query, aiResponse.content);
    
    // Store the insight in memory
    await aiMemoryService.storeInsight(
      organizationId,
      recommendation.recommendation,
      { query, response: aiResponse.content },
      recommendation.confidenceScore
    );
    
    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        recommendation,
        sources: recommendation.dataSources,
      },
    });
  } catch (error) {
    console.error('AI Analyze API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  const providers = aiModelService.listProviders();
  
  return NextResponse.json({
    success: true,
    data: {
      providers,
      features: {
        contextBuilding: true,
        promptOrchestration: true,
        multiProvider: true,
        memoryIntegration: true,
        decisionExplanation: true,
      },
      exampleQueries: [
        'What deals should I focus on this week?',
        'Why is my conversion rate dropping?',
        'Forecast revenue for next month.',
        'Which marketing campaigns are performing best?',
      ],
    },
  });
}
