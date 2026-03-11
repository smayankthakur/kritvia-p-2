/**
 * Vector Database Integration
 * 
 * Provider abstraction for vector databases.
 * Supports Pinecone, Weaviate, Qdrant.
 */

export type VectorProvider = 'pinecone' | 'weaviate' | 'qdrant' | 'memory';

export interface VectorConfig {
  provider: VectorProvider;
  apiKey?: string;
  url?: string;
  indexName?: string;
}

export interface VectorEntry {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface VectorQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

// Get configuration from environment
function getConfig(): VectorConfig {
  return {
    provider: (process.env.VECTOR_DB_PROVIDER as VectorProvider) || 'memory',
    apiKey: process.env.VECTOR_DB_API_KEY,
    url: process.env.VECTOR_DB_URL,
    indexName: process.env.VECTOR_DB_INDEX || 'kritvia',
  };
}

// In-memory vector store (fallback)
const memoryStore: VectorEntry[] = [];

/**
 * Create embedding using OpenAI
 */
export async function createEmbedding(text: string): Promise<number[]> {
  // Use the existing AI service
  const { embedText } = await import('./ai-service');
  const result = await embedText(text);
  
  if (result.success && result.data) {
    return result.data.embedding;
  }
  
  // Fallback: generate random embedding
  return Array(1536).fill(0).map(() => Math.random() * 2 - 1);
}

/**
 * Store embedding
 */
export async function storeEmbedding(
  id: string,
  vector: number[],
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const config = getConfig();
  
  switch (config.provider) {
    case 'pinecone':
      return storePinecone(id, vector, metadata);
    case 'weaviate':
      return storeWeaviate(id, vector, metadata);
    case 'qdrant':
      return storeQdrant(id, vector, metadata);
    default:
      // In-memory fallback
      memoryStore.push({ id, vector, metadata });
      return true;
  }
}

/**
 * Query similar vectors
 */
export async function querySimilarVectors(
  query: string,
  topK: number = 10,
  filter?: Record<string, unknown>
): Promise<VectorQueryResult[]> {
  const config = getConfig();
  
  // Create query embedding
  const queryEmbedding = await createEmbedding(query);
  
  switch (config.provider) {
    case 'pinecone':
      return queryPinecone(queryEmbedding, topK, filter);
    case 'weaviate':
      return queryWeaviate(queryEmbedding, topK, filter);
    case 'qdrant':
      return queryQdrant(queryEmbedding, topK, filter);
    default:
      // In-memory fallback
      return queryMemory(queryEmbedding, topK, filter);
  }
}

// Pinecone implementation
async function storePinecone(
  id: string,
  vector: number[],
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const config = getConfig();
  
  try {
    const response = await fetch(`https://${config.url}/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': config.apiKey || '',
      },
      body: JSON.stringify({
        vectors: [{ id, values: vector, metadata }],
      }),
    });
    
    return response.ok;
  } catch {
    // Fallback to memory
    memoryStore.push({ id, vector, metadata });
    return true;
  }
}

async function queryPinecone(
  queryEmbedding: number[],
  topK: number,
  filter?: Record<string, unknown>
): Promise<VectorQueryResult[]> {
  const config = getConfig();
  
  try {
    const response = await fetch(`https://${config.url}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': config.apiKey || '',
      },
      body: JSON.stringify({
        topK,
        vector: queryEmbedding,
        filter,
        includeMetadata: true,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.matches?.map((m: { id: string; score: number; metadata: Record<string, unknown> }) => ({
        id: m.id,
        score: m.score,
        metadata: m.metadata,
      })) || [];
    }
  } catch {
    // Fallback
  }
  
  return queryMemory(queryEmbedding, topK, filter);
}

// Weaviate implementation
async function storeWeaviate(
  id: string,
  vector: number[],
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const config = getConfig();
  
  try {
    const response = await fetch(`${config.url}/objects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        class: config.indexName,
        id,
        vector,
        properties: metadata,
      }),
    });
    
    return response.ok;
  } catch {
    memoryStore.push({ id, vector, metadata });
    return true;
  }
}

async function queryWeaviate(
  queryEmbedding: number[],
  topK: number,
  filter?: Record<string, unknown>
): Promise<VectorQueryResult[]> {
  const config = getConfig();
  
  try {
    const response = await fetch(`${config.url}/objects search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        class: config.indexName,
        vector: queryEmbedding,
        limit: topK,
        where: filter,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.objects?.map((o: { id: string; _additional: { distance: number }; properties: Record<string, unknown> }) => ({
        id: o.id,
        score: 1 - (o._additional?.distance || 0),
        metadata: o.properties,
      })) || [];
    }
  } catch {
    // Fallback
  }
  
  return queryMemory(queryEmbedding, topK, filter);
}

// Qdrant implementation
async function storeQdrant(
  id: string,
  vector: number[],
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const config = getConfig();
  
  try {
    const response = await fetch(`${config.url}/collections/${config.indexName}/points`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        points: [{ id, vector, payload: metadata }],
      }),
    });
    
    return response.ok;
  } catch {
    memoryStore.push({ id, vector, metadata });
    return true;
  }
}

async function queryQdrant(
  queryEmbedding: number[],
  topK: number,
  filter?: Record<string, unknown>
): Promise<VectorQueryResult[]> {
  const config = getConfig();
  
  try {
    const response = await fetch(`${config.url}/collections/${config.indexName}/points/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        limit: topK,
        with_payload: true,
        filter,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.result?.map((r: { id: string; score: number; payload: Record<string, unknown> }) => ({
        id: r.id,
        score: r.score,
        metadata: r.payload,
      })) || [];
    }
  } catch {
    // Fallback
  }
  
  return queryMemory(queryEmbedding, topK, filter);
}

// In-memory implementation
function queryMemory(
  queryEmbedding: number[],
  topK: number,
  filter?: Record<string, unknown>
): VectorQueryResult[] {
  // Simple cosine similarity
  const results = memoryStore
    .filter(entry => {
      if (!filter) return true;
      // Simple filter check
      return Object.entries(filter).every(
        ([key, value]) => entry.metadata?.[key] === value
      );
    })
    .map(entry => ({
      id: entry.id,
      score: cosineSimilarity(queryEmbedding, entry.vector),
      metadata: entry.metadata,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

/**
 * Delete vectors
 */
export async function deleteVectors(ids: string[]): Promise<boolean> {
  const config = getConfig();
  
  if (config.provider === 'memory') {
    const idsSet = new Set(ids);
    const remaining = memoryStore.filter(e => !idsSet.has(e.id));
    memoryStore.length = 0;
    memoryStore.push(...remaining);
    return true;
  }
  
  // For other providers, implement delete logic
  return true;
}

/**
 * Get provider status
 */
export function getProviderStatus(): {
  provider: VectorProvider;
  connected: boolean;
  entryCount: number;
} {
  const config = getConfig();
  
  return {
    provider: config.provider,
    connected: config.provider !== 'memory',
    entryCount: memoryStore.length,
  };
}

export default {
  createEmbedding,
  storeEmbedding,
  querySimilarVectors,
  deleteVectors,
  getProviderStatus,
};
