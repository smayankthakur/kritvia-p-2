import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  // Enable draft mode
  draftMode().enable()

  // Redirect to the homepage or the requested path
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || '/'
  
  return NextResponse.redirect(new URL(slug, request.url))
}