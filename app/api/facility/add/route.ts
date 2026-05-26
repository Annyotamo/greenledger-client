import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
        const url = `${baseURL}/api/v1/tenant/facility`;
        const res = await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(res.data, { status: res.status });
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

            return NextResponse.json(
                { message: backendMessage ?? "Add facility failed.", details: err.response?.data },
                { status: err.response?.status ?? 500 },
            );
        }

        const message =
            typeof err === "object" && err && "message" in err ? String((err as any).message) : "Add facility failed.";
        return NextResponse.json({ message }, { status: 500 });
    }
}
