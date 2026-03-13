import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    console.log('Raw body:', rawBody)
    console.log('Content-Type:', request.headers.get('content-type'))
    
    let body
    try {
      body = JSON.parse(rawBody)
    } catch (e) {
      console.log('JSON parse error:', e)
      return NextResponse.json(
        { error: 'Invalid JSON', rawBody },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ received: body })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}