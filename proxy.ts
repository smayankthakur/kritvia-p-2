import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseServer } from './lib/supabase/supabase-server'
import { rateLimiter } from './lib/redis/rateLimiter'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/vercel.svg')
  ) {
    return NextResponse.next()
  }

  // Apply rate limiting to specific API routes
  if (pathname.startsWith('/api/ai/')) {
    const ip = request.ip ?? '127.0.0.1'
    const limit = await rateLimiter(ip, '/api/ai', 20, 60) // 20 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Auth middleware for protected routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api/users') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/payments') ||
    pathname.startsWith('/api/webhooks') // Webhooks are public, but we might want to verify signatures separately
  ) {
    // For webhooks, we don't validate the user, we validate the signature in the route handler
    if (pathname.startsWith('/api/webhooks')) {
      return NextResponse.next()
    }

    const token = request.cookies.get('sb-access-token')?.value || request.cookies.get('sb-refresh-token')?.value

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    try {
      // Verify the token with Supabase
      const { data: { user }, error } = await supabaseServer.auth.getUser(token)
      if (error || !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      // Optionally, you can attach the user to the request for use in route handlers
      // request.headers.set('x-user-id', user.id)
    } catch (error) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|vercel.svg).*)',
  ],
}
