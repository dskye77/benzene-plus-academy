import { NextResponse } from "next/server";

/**
 * Protects /admin routes by checking for a valid session cookie.
 * The actual token verification happens in the AdminAuthGuard client component
 * and the /api/admin/session server action.
 *
 * For true edge-level protection, this checks for the presence of a session
 * cookie set after successful login. Deep token verification is done server-side.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes (not /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/login") {
    const session = request.cookies.get("admin_session");

    if (!session?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
