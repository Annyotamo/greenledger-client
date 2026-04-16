import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/scope-1/:path*"],
};
