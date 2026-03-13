import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'

// Initialize Supabase client
const supabase = createSupabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { query, limit = 5, threshold = 0.7 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query)

    // Search for similar vectors in Supabase
    // Using cosine similarity for vector search
    const { data, error } = await supabase
      .rpc('match_ai_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to search knowledge base', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      results: data,
      query,
      count: data.length
    })
  } catch (error) {
    console.error('AI Knowledge Search Error:', error)
    return NextResponse.json(
      { error: 'Failed to search knowledge base', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}