import { NextResponse, type NextRequest } from "next/server";

/**
 * Defense in depth for /admin: requests with no session cookie go straight to the
 * login page. This only checks that a cookie exists; every admin page, server
 * action and API route still verifies the signed session against the database.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.get("fotb_admin")) {
    if (pathname.startsWith("/api/admin")) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
