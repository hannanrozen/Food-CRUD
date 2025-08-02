import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login"];

  const apiPaths = ["/api/", "/_next/", "/favicon.ico"];

  if (apiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname);

  const token = request.cookies.get("auth-token")?.value || "";

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if ((!isPublicPath && !token) || (pathname === "/" && !token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
