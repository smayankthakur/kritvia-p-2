import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get all headers
    const headers = Object.fromEntries(request.headers.entries())
    console.log('Headers:', headers)
    
    // Get raw body
    const rawBody = await request.text()
    console.log('Raw body:', rawBody)
    console.log('Raw body length:', rawBody.length)
    console.log('Raw body char codes:', [...rawBody].map(c => c.charCodeAt(0)))
    
    // Try to parse as JSON
    let body
    try {
      body = JSON.parse(rawBody)
      console.log('Successfully parsed JSON:', body)
    } catch (jsonError) {
      console.log('JSON parse error:', jsonError)
      
      // Try to see if it's a JavaScript object
      console.log('Body looks like JS object:', /^{/.test(rawBody.trim()) && /}$/.test(rawBody.trim()))
      
      return NextResponse.json(
        { 
          error: 'Failed to parse JSON', 
          rawBody,
          headers,
          errorDetails: jsonError instanceof Error ? jsonError.message : String(jsonError)
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ 
      received: body,
      headers
    })
  } catch (error) {
    console.log('Server error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}