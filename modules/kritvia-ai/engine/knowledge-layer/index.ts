/**
 * Knowledge Layer
 * 
 * Provides long-term memory for the AI using:
 * - Vector database
 * - RAG retrieval
 * - LangChain integration
 */

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
}

export interface KnowledgeQuery {
  query: string;
  filters?: Record<string, unknown>;
  limit?: number;
}

export interface KnowledgeResult {
  documents: Document[];
  scores: number[];
}

// In-memory document store (replace with vector DB in production)
const documentStore: Map<string, Document> = new Map();

/**
 * Add document to knowledge base
 */
export async function addDocument(doc: Document): Promise<{ id: string }> {
  // Generate embedding if not provided
  if (!doc.embedding) {
    const { embedText } = await import('../ai-service');
    const result = await embedText(doc.content);
    if (result.success && result.data) {
      doc.embedding = result.data.embedding;
    }
  }
  
  const id = doc.id || crypto.randomUUID();
  documentStore.set(id, { ...doc, id });
  
  return { id };
}

/**
 * Search knowledge base using semantic search
 */
export async function searchKnowledge(
  query: KnowledgeQuery
): Promise<KnowledgeResult> {
  const { embedText } = await import('../ai-service');
  
  // Generate embedding for query
  const embeddingResult = await embedText(query.query);
  if (!embeddingResult.success || !embeddingResult.data) {
    return { documents: [], scores: [] };
  }
  
  const queryEmbedding = embeddingResult.data.embedding;
  const results: { doc: Document; score: number }[] = [];
  const limit = query.limit || 5;
  
  // Simple cosine similarity (replace with vector DB in production)
  for (const doc of documentStore.values()) {
    if (doc.embedding && doc.embedding.length === queryEmbedding.length) {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      if (score > 0.5) { // Threshold
        results.push({ doc, score });
      }
    }
  }
  
  // Sort by score and return top results
  results.sort((a, b) => b.score - a.score);
  
  return {
    documents: results.slice(0, limit).map(r => r.doc),
    scores: results.slice(0, limit).map(r => r.score),
  };
}

/**
 * Simple cosine similarity calculation
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Create document embedding
 */
export async function createEmbedding(
  text: string
): Promise<number[]> {
  const { embedText } = await import('../ai-service');
  
  const result = await embedText(text);
  if (result.success && result.data) {
    return result.data.embedding;
  }
  
  return [];
}

/**
 * Chunk document for processing
 */
export function chunkDocument(
  content: string,
  chunkSize: number = 1000
): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Ingest documents - batch process and store
 */
export async function ingestDocuments(
  documents: { content: string; metadata?: Record<string, unknown> }[]
): Promise<{ ingested: number; failed: number }> {
  let ingested = 0;
  let failed = 0;
  
  for (const doc of documents) {
    try {
      const chunks = chunkDocument(doc.content);
      
      for (const chunk of chunks) {
        await addDocument({
          id: crypto.randomUUID(),
          content: chunk,
          metadata: { ...doc.metadata, source: doc.content.substring(0, 50) },
        });
      }
      
      ingested++;
    } catch {
      failed++;
    }
  }
  
  return { ingested, failed };
}

/**
 * Embed documents for vector storage
 */
export async function embedDocuments(
  documents: Document[]
): Promise<Document[]> {
  const embedded: Document[] = [];
  
  for (const doc of documents) {
    const embedding = await createEmbedding(doc.content);
    embedded.push({ ...doc, embedding });
  }
  
  return embedded;
}

/**
 * Retrieve context for LLM
 */
export async function retrieveContext(
  query: string,
  maxTokens: number = 4000
): Promise<{ context: string; sources: string[] }> {
  const result = await searchKnowledge({ query, limit: 5 });
  
  if (result.documents.length === 0) {
    return { context: '', sources: [] };
  }
  
  let context = '';
  const sources: string[] = [];
  
  for (const doc of result.documents) {
    const docContext = `Source: ${doc.metadata?.source || 'Unknown'}\n${doc.content}\n\n`;
    
    // Check token limit (rough estimate: 1 token ≈ 4 characters)
    if ((context.length + docContext.length) / 4 > maxTokens) {
      break;
    }
    
    context += docContext;
    
    if (doc.metadata?.source) {
      sources.push(String(doc.metadata.source));
    }
  }
  
  return { context, sources: [...new Set(sources)] };
}

export default {
  addDocument,
  searchKnowledge,
  createEmbedding,
  chunkDocument,
  ingestDocuments,
  embedDocuments,
  retrieveContext,
};
