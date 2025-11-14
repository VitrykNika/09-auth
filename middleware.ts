import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isPrivate(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isAuth = !!accessToken || !!refreshToken;

  if (!isAuth && isPrivate(pathname)) {
    const url = new URL("/sign-in", req.url); 
    return NextResponse.redirect(url);
  }

  if (isAuth && isPublic(pathname)) {
    const url = new URL("/profile", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};