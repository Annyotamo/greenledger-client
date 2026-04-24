import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(SUPER_ADMIN_AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return NextResponse.json({ ok: true });
}

