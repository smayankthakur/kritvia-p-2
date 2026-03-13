import { createClient } from '@sanity/client'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from '@project-lakechain/recursive-character-text-splitter'

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false for freshest data
})

// Initialize Supabase client
const supabase = createSupabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
})

// Text splitter for chunking content
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})

interface KnowledgeItem {
  id: string
  content: string
  embedding: number[]
  sourceType: string
  sourceId: string
  createdAt: string
}

/**
 * Fetch all content from Sanity CMS
 */
async function fetchSanityContent() {
  // Query to get all document types with content
  const query = `
    *[_type in ['post', 'page', 'product', 'caseStudy', 'documentation', 'landingPage', 'blog', 'founder', 'service', 'industry', 'solution', 'feature', 'pricingPlan', 'faq', 'testimonial', 'settings']] {
      _id,
      _type,
      title,
      slug,
      body,
      excerpt,
      mainImage,
      publishedAt,
      updatedAt,
      author->{
        name,
        _id
      },
      categories[]->{
        title,
        _id
      }
    }
  `

  return sanityClient.fetch(query)
}

/**
 * Extract text content from Sanity document
 */
function extractTextContent(doc: any): string {
  const textParts = []

  // Add title
  if (doc.title) {
    textParts.push(`Title: ${doc.title}`)
  }

  // Add excerpt
  if (doc.excerpt) {
    textParts.push(`Excerpt: ${doc.excerpt}`)
  }

  // Add body content (assuming it's portable text)
  if (doc.body) {
    // For portable text, we need to extract plain text
    // This is a simplified version - in production you'd use @sanity/block-content-to-html
    const extractPlainText = (blocks: any[]): string => {
      return blocks
        .map(block => {
          if (block._type === 'block') {
            return block.children
              .map((child: any) => child.text)
              .join(' ')
          }
          return ''
        })
        .join('\n\n')
    }

    if (Array.isArray(doc.body)) {
      textParts.push(`Content: ${extractPlainText(doc.body)}`)
    } else if (typeof doc.body === 'string') {
      textParts.push(`Content: ${doc.body}`)
    }
  }

  // Add metadata
  if (doc.author?.[0]?.name) {
    textParts.push(`Author: ${doc.author[0].name}`)
  }

  if (doc.publishedAt) {
    textParts.push(`Published: ${doc.publishedAt}`)
  }

  return textParts.join('\n\n')
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  return await embeddings.embedQuery(text)
}

/**
 * Store knowledge item in Supabase
 */
async function storeKnowledgeItem(item: KnowledgeItem) {
  const { data, error } = await supabase
    .from('ai_knowledge')
    .insert([
      {
        id: item.id,
        content: item.content,
        embedding: item.embedding,
        source_type: item.sourceType,
        source_id: item.sourceId,
        created_at: item.createdAt,
      }
    ])

  if (error) {
    console.error('Error storing knowledge item:', error)
    throw error
  }

  return data
}

/**
 * Main sync function
 */
async function syncCMSToAI() {
  try {
    console.log('Starting CMS to AI knowledge sync...')

    // Fetch all content from Sanity
    const documents = await fetchSanityContent()
    console.log(`Fetched ${documents.length} documents from Sanity CMS`)

    let processedCount = 0
    let errorCount = 0

    // Process each document
    for (const doc of documents) {
      try {
        // Extract text content
        const textContent = extractTextContent(doc)

        if (!textContent.trim()) {
          console.log(`Skipping document ${doc._id} - no content`)
          continue
        }

        // Split text into chunks
        const chunks = await textSplitter.splitText(textContent)
        console.log(`Document ${doc._id} split into ${chunks.length} chunks`)

        // Process each chunk
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i]
          
          // Generate embedding
          const embedding = await generateEmbedding(chunk)
          
          // Create knowledge item
          const knowledgeItem: KnowledgeItem = {
            id: `${doc._id}-chunk-${i}`,
            content: chunk,
            embedding: embedding,
            sourceType: doc._type,
            sourceId: doc._id,
            createdAt: new Date().toISOString(),
          }

          // Store in Supabase
          await storeKnowledgeItem(knowledgeItem)
          processedCount++
        }
      } catch (error) {
        console.error(`Error processing document ${doc._id}:`, error)
        errorCount++
      }
    }

    console.log(`Sync completed! Processed: ${processedCount}, Errors: ${errorCount}`)
  } catch (error) {
    console.error('Sync failed:', error)
    throw error
  }
}

// Execute if called directly
if (require.main === module) {
  syncCMSToAI()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export default syncCMSToAI