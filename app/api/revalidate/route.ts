import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

if (!SANITY_WEBHOOK_SECRET) {
  throw new Error('SANITY_WEBHOOK_SECRET is not defined')
}

export async function POST(request: Request) {
  // Get the header for webhook signature verification
  const headerPayload = headers().get('x-sanity-webhook-signature') || ''
  const [algo, hash] = headerPayload.split('=')

  // Get the request body
  const body = await request.text()

  // Verify the signature if the algorithm is sha256
  if (algo === 'sha256') {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', SANITY_WEBHOOK_SECRET)
    const digest = `sha256=${hmac.update(body).digest('hex')}`
    if (digest !== headerPayload) {
      return new NextResponse('Invalid signature', { status: 401 })
    }
  } else {
    // If the algorithm is not sha256, we reject for security
    return new NextResponse('Unsupported algorithm', { status: 400 })
  }

  // Parse the JSON payload
  let payload
  try {
    payload = JSON.parse(body)
  } catch (error) {
    return new NextResponse('Invalid JSON', { status: 400 })
  }

  // Extract the document type from the payload
  const documentType = payload?.result?._type

  // Define mapping from Sanity document types to our revalidation tags
  const typeToTag: Record<string, string> = {
    post: 'posts',
    product: 'products',
    page: 'pages',
    documentation: 'docs',
    category: 'posts', // Categories affect posts
    tag: 'posts', // Tags affect posts
  }

  const tag = typeToTag[documentType]

  // If we have a tag, revalidate it
  if (tag) {
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true })
  }

  // If the document type is not one we care about, still return success
  return NextResponse.json({ revalidated: false })
}