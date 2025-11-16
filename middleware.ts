import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isPrivate(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string) {
  return pathname === "/sign-in" || pathname === "/sign-up";
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

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuth = !!accessToken;
  let refreshedCookies: string[] | null = null;

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session.data.success) {
        isAuth = true;

        const setCookieHeader = session.headers["set-cookie"];
        if (setCookieHeader) {
          refreshedCookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      } else {
        isAuth = false;
      }
    } catch {
      isAuth = false;
    }
  }

  let response: NextResponse;

  if (!isAuth && isPrivate(pathname)) {
    response = NextResponse.redirect(new URL("/sign-in", req.url));
  }

  else if (isAuth && isAuthRoute(pathname)) {
    response = NextResponse.redirect(new URL("/", req.url));
  }

  else {
    response = NextResponse.next();
  }

  if (refreshedCookies) {
    refreshedCookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up", "/"],
};