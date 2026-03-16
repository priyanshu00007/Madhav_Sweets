import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protocol: Sliding Window Rate Limiter (In-Memory)
// Note: In serverless environments, this will reset per-instance unless tied to Redis.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const LIMIT = 60 // 60 requests
const WINDOW = 60 * 1000 // 1 minute window

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) || { count: 0, lastReset: now }

  if (now - entry.lastReset > WINDOW) {
    entry.count = 1
    entry.lastReset = now
    rateLimitMap.set(ip, entry)
    return false
  }

  entry.count++
  rateLimitMap.set(ip, entry)
  return entry.count > LIMIT
}

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(',')[0] : "127.0.0.1"
    const pathname = req.nextUrl.pathname

    // 1. Rate Limiting Protection (DDoS mitigation)
    if (pathname.startsWith("/api") && isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "SHIELD PROTOCOL: RATE LIMIT EXCEEDED" }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")
    const isAdminPage = pathname.startsWith("/admin")
    const isRiderPage = pathname.startsWith("/rider")

    const res = NextResponse.next()

    // 2. Security Headers (Sanitization)
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-XSS-Protection', '1; mode=block')
    res.headers.set('Access-Control-Allow-Origin', req.nextUrl.origin)

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url))
      }
      return res
    }

    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (isRiderPage && token?.role !== "rider" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return res
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Publicly accessible paths should return true to avoid recursive login redirect
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/api")
        ) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/rider/:path*", "/profile/:path*", "/checkout/:path*", "/login", "/signup", "/api/:path*"]
}
