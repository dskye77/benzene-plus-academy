import { NextResponse } from "next/server";

/**
 * Protects /admin routes by checking for a valid session cookie.
 * Running on the Next.js 16 Proxy layer.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, bypassing the login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");

    if (!session?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Config matcher rules remain the same
  matcher: ["/admin/:path*"],
};