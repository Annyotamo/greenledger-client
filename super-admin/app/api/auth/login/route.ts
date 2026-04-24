import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api, apiUrl } from "@/lib/api";
import { extractToken, SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body?.email?.trim();
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const url = apiUrl("/user/superAdmin/login");
    console.log("[super-admin] login request", {
      base: process.env.NEXT_PUBLIC_BASE_URL,
      url,
      email,
    });

    const res = await api.post(url, { email, password });
    console.log("[super-admin] login response", { status: res.status, data: res.data });

    const token = extractToken(res.data);

    if (!token) {
      return NextResponse.json(
        { message: "Login succeeded but no token was returned by the API." },
        { status: 502 },
      );
    }

    const isSecure = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set(SUPER_ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const backendData = err.response?.data as any;
      const backendMessage =
        typeof backendData === "string"
          ? backendData
          : typeof backendData?.message === "string"
            ? backendData.message
            : typeof backendData?.response === "string"
              ? backendData.response
              : undefined;

      console.log("[super-admin] login error", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      return NextResponse.json(
        { message: backendMessage ?? "Login failed.", details: err.response?.data },
        { status: err.response?.status ?? 401 },
      );
    }

    const message =
      typeof err === "object" && err && "message" in err ? String((err as any).message) : "Login failed.";
    console.log("[super-admin] login error", { message });
    return NextResponse.json({ message }, { status: 401 });
  }
}

