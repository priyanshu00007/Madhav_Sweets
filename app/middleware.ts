import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = Boolean(request.cookies.get("auth_session")); 

  if (
    (request.nextUrl.pathname.startsWith("/cart") ||
      request.nextUrl.pathname.startsWith("/checkout") ||
      request.nextUrl.pathname.startsWith("/admin")) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*"],
};