import { NextResponse } from 'next/server';
import { buildSearchIndex } from '@/lib/docs';

export async function GET() {
  const searchIndex = buildSearchIndex('v1');
  return NextResponse.json(searchIndex);
}
