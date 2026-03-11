/**
 * Organization Knowledge Graph
 * 
 * Maps relationships between entities in the organization.
 */

import { randomUUID } from 'crypto';

// Types
export interface KGNode {
  id: string;
  type: 'person' | 'company' | 'deal' | 'customer' | 'product' | 'team' | 'project';
  name: string;
  properties: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface KGEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: string;
  properties?: Record<string, unknown>;
  weight: number;
  createdAt: number;
}

export interface KGQuery {
  nodeTypes?: string[];
  relationship?: string;
  depth?: number;
  limit?: number;
}

export interface KGPath {
  nodes: KGNode[];
  edges: KGEdge[];
  totalWeight: number;
}

// In-memory storage
const nodesStore: Map<string, KGNode> = new Map();
const edgesStore: Map<string, KGEdge[]> = new Map();

/**
 * Create a node in the knowledge graph
 */
export async function createKGNode(
  type: KGNode['type'],
  name: string,
  properties: Record<string, unknown> = {}
): Promise<KGNode> {
  const node: KGNode = {
    id: randomUUID(),
    type,
    name,
    properties,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  nodesStore.set(node.id, node);
  edgesStore.set(node.id, []);
  
  return node;
}

/**
 * Get a node by ID
 */
export async function getKGNode(nodeId: string): Promise<KGNode | null> {
  return nodesStore.get(nodeId) || null;
}

/**
 * Update a node
 */
export async function updateKGNode(
  nodeId: string,
  updates: Partial<Pick<KGNode, 'name' | 'properties'>>
): Promise<KGNode | null> {
  const node = nodesStore.get(nodeId);
  if (!node) return null;
  
  const updated: KGNode = {
    ...node,
    ...updates,
    updatedAt: Date.now(),
  };
  
  nodesStore.set(nodeId, updated);
  return updated;
}

/**
 * Delete a node and its edges
 */
export async function deleteKGNode(nodeId: string): Promise<boolean> {
  if (!nodesStore.has(nodeId)) return false;
  
  // Delete all edges connected to this node
  edgesStore.forEach((edges, key) => {
    const filtered = edges.filter(e => e.sourceId !== nodeId && e.targetId !== nodeId);
    edgesStore.set(key, filtered);
  });
  
  nodesStore.delete(nodeId);
  edgesStore.delete(nodeId);
  
  return true;
}

/**
 * Create an edge between nodes
 */
export async function createKGEdge(
  sourceId: string,
  targetId: string,
  relationship: string,
  properties?: Record<string, unknown>,
  weight: number = 1
): Promise<KGEdge | null> {
  const source = nodesStore.get(sourceId);
  const target = nodesStore.get(targetId);
  
  if (!source || !target) return null;
  
  const edge: KGEdge = {
    id: randomUUID(),
    sourceId,
    targetId,
    relationship,
    properties,
    weight,
    createdAt: Date.now(),
  };
  
  const sourceEdges = edgesStore.get(sourceId) || [];
  sourceEdges.push(edge);
  edgesStore.set(sourceId, sourceEdges);
  
  return edge;
}

/**
 * Get edges from a node
 */
export async function getKGEdges(nodeId: string): Promise<KGEdge[]> {
  return edgesStore.get(nodeId) || [];
}

/**
 * Query the knowledge graph
 */
export async function queryKG(
  organizationId: string,
  query: KGQuery
): Promise<KGNode[]> {
  const results: KGNode[] = [];
  
  nodesStore.forEach(node => {
    // Filter by node type
    if (query.nodeTypes && query.nodeTypes.length > 0) {
      if (!query.nodeTypes.includes(node.type)) return;
    }
    
    results.push(node);
  });
  
  // Limit results
  if (query.limit) {
    return results.slice(0, query.limit);
  }
  
  return results;
}

/**
 * Find connected nodes
 */
export async function findConnectedNodes(
  nodeId: string,
  relationship?: string,
  depth: number = 1
): Promise<KGNode[]> {
  const visited = new Set<string>();
  const queue: Array<{ id: string; currentDepth: number }> = [{ id: nodeId, currentDepth: 0 }];
  const results: KGNode[] = [];
  
  while (queue.length > 0) {
    const { id, currentDepth } = queue.shift()!;
    
    if (visited.has(id) || currentDepth > depth) continue;
    visited.add(id);
    
    const node = nodesStore.get(id);
    if (node && currentDepth > 0) {
      results.push(node);
    }
    
    // Get connected nodes
    const edges = edgesStore.get(id) || [];
    for (const edge of edges) {
      if (relationship && edge.relationship !== relationship) continue;
      
      const targetId = edge.targetId;
      if (!visited.has(targetId)) {
        queue.push({ id: targetId, currentDepth: currentDepth + 1 });
      }
    }
  }
  
  return results;
}

/**
 * Find paths between two nodes
 */
export async function findPaths(
  sourceId: string,
  targetId: string,
  maxDepth: number = 3
): Promise<KGPath[]> {
  const paths: KGPath[] = [];
  
  const dfs = (currentId: string, targetId: string, path: KGPath, visited: Set<string>, depth: number) => {
    if (depth > maxDepth) return;
    if (currentId === targetId) {
      paths.push({ ...path });
      return;
    }
    
    const edges = edgesStore.get(currentId) || [];
    for (const edge of edges) {
      if (visited.has(edge.targetId)) continue;
      
      const targetNode = nodesStore.get(edge.targetId);
      if (!targetNode) continue;
      
      visited.add(edge.targetId);
      const newPath: KGPath = {
        nodes: [...path.nodes, targetNode],
        edges: [...path.edges, edge],
        totalWeight: path.totalWeight + edge.weight,
      };
      
      dfs(edge.targetId, targetId, newPath, visited, depth + 1);
      visited.delete(edge.targetId);
    }
  };
  
  const sourceNode = nodesStore.get(sourceId);
  if (!sourceNode) return paths;
  
  dfs(sourceId, targetId, { nodes: [sourceNode], edges: [], totalWeight: 0 }, new Set([sourceId]), 0);
  
  return paths;
}

/**
 * Get node statistics
 */
export async function getKGStatistics(organizationId: string): Promise<{
  totalNodes: number;
  nodesByType: Record<string, number>;
  totalEdges: number;
  avgConnections: number;
}> {
  const nodesByType: Record<string, number> = {};
  let totalEdges = 0;
  
  nodesStore.forEach(node => {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
  });
  
  edgesStore.forEach(edges => {
    totalEdges += edges.length;
  });
  
  const totalNodes = nodesStore.size;
  const avgConnections = totalNodes > 0 ? totalEdges / totalNodes : 0;
  
  return {
    totalNodes,
    nodesByType,
    totalEdges,
    avgConnections: Math.round(avgConnections * 10) / 10,
  };
}

/**
 * Clear knowledge graph (for testing)
 */
export async function clearKG(): Promise<void> {
  nodesStore.clear();
  edgesStore.clear();
}

// Helper functions for common operations
export async function createPersonNode(name: string, role: string, email?: string) {
  return createKGNode('person', name, { role, email });
}

export async function createCustomerNode(name: string, industry?: string, size?: string) {
  return createKGNode('customer', name, { industry, size });
}

export async function createDealNode(name: string, value: number, stage: string) {
  return createKGNode('deal', name, { value, stage });
}

export async function connectPersonToDeal(personId: string, dealId: string, role: string) {
  return createKGEdge(personId, dealId, 'works_on', { role });
}

export async function connectCustomerToDeal(customerId: string, dealId: string) {
  return createKGEdge(customerId, dealId, 'interested_in');
}
