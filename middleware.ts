import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth/constants";

// Routes that require authentication
const PROTECTED_PREFIXES = [
    "/dashboard",
    "/tenant-cbam",
    "/facilities",
    "/emissions",
    "/energy-dashboard",
    "/activities",
    "/reporting-period",
    "/team-members",
    "/tenant",
    "/user",
    "/audit-logs",
    "/brsr",
    "/scope-3",
    "/initializing",
];

// Auth routes that authenticated users shouldn't access
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const isProtectedRoute = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    // If attempting to visit any internal software route without auth token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If logged in user attempts to visit login or register
    if (AUTH_ROUTES.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public static files / media / images
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|txt|json)$).*)",
    ],
};
