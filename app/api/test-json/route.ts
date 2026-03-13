import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Content-Type:', request.headers.get('content-type'))
    const body = await request.json()
    console.log('Parsed body:', body)
    return NextResponse.json({ received: body })
  } catch (error) {
    console.log('Error:', error)
    return NextResponse.json(
      { error: 'Failed to parse JSON', details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    )
  }
}