import { NextRequest, NextResponse } from 'next/server';
import {
  createKGNode,
  getKGNode,
  updateKGNode,
  deleteKGNode,
  createKGEdge,
  getKGEdges,
  queryKG,
  findConnectedNodes,
  findPaths,
  getKGStatistics,
} from '@/modules/kritvia-ai/knowledge-graph';

export const dynamic = 'force-dynamic';

// POST - Create node or edge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'node') {
      const { type, name, properties } = data;
      if (!type || !name) {
        return NextResponse.json(
          { error: 'Node type and name are required' },
          { status: 400 }
        );
      }
      const node = await createKGNode(type, name, properties);
      return NextResponse.json({ success: true, node });
    }

    if (action === 'edge') {
      const { sourceId, targetId, relationship, properties, weight } = data;
      if (!sourceId || !targetId || !relationship) {
        return NextResponse.json(
          { error: 'Source ID, target ID, and relationship are required' },
          { status: 400 }
        );
      }
      const edge = await createKGEdge(sourceId, targetId, relationship, properties, weight);
      if (!edge) {
        return NextResponse.json(
          { error: 'Failed to create edge - nodes may not exist' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, edge });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Knowledge graph error:', error);
    return NextResponse.json(
      { error: 'Failed to process knowledge graph request' },
      { status: 500 }
    );
  }
}

// GET - Query nodes/edges
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nodeId = searchParams.get('nodeId');
    const action = searchParams.get('action');
    const type = searchParams.get('type');
    const targetId = searchParams.get('targetId');
    const depth = parseInt(searchParams.get('depth') || '1');

    // Get connected nodes
    if (action === 'connected' && nodeId) {
      const relationship = searchParams.get('relationship');
      const nodes = await findConnectedNodes(nodeId, relationship || undefined, depth);
      return NextResponse.json({ success: true, nodes, count: nodes.length });
    }

    // Find paths between nodes
    if (action === 'paths' && nodeId && targetId) {
      const paths = await findPaths(nodeId, targetId, depth);
      return NextResponse.json({ success: true, paths, count: paths.length });
    }

    // Get statistics
    if (action === 'stats') {
      const stats = await getKGStatistics('default');
      return NextResponse.json({ success: true, ...stats });
    }

    // Get edges for node
    if (nodeId && action === 'edges') {
      const edges = await getKGEdges(nodeId);
      return NextResponse.json({ success: true, edges, count: edges.length });
    }

    // Get single node
    if (nodeId) {
      const node = await getKGNode(nodeId);
      if (!node) {
        return NextResponse.json({ error: 'Node not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, node });
    }

    // Query nodes
    const nodeTypes = type ? type.split(',') : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const nodes = await queryKG('default', { nodeTypes, limit });

    return NextResponse.json({ success: true, nodes, count: nodes.length });
  } catch (error) {
    console.error('Knowledge graph query error:', error);
    return NextResponse.json(
      { error: 'Failed to query knowledge graph' },
      { status: 500 }
    );
  }
}

// PUT - Update node
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeId, updates } = body;

    if (!nodeId || !updates) {
      return NextResponse.json(
        { error: 'Node ID and updates are required' },
        { status: 400 }
      );
    }

    const node = await updateKGNode(nodeId, updates);
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, node });
  } catch (error) {
    console.error('Knowledge graph update error:', error);
    return NextResponse.json(
      { error: 'Failed to update node' },
      { status: 500 }
    );
  }
}

// DELETE - Delete node
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nodeId = searchParams.get('nodeId');

    if (!nodeId) {
      return NextResponse.json(
        { error: 'Node ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteKGNode(nodeId);
    if (!deleted) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge graph delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete node' },
      { status: 500 }
    );
  }
}
