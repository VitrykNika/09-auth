import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isPrivate(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuth = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session.data.success) {
        isAuth = true;
      }
    } catch {
      isAuth = false;
    }
  }

  if (!isAuth && isPrivate(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuth && isPublic(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up", "/"],
};