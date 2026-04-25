import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
        if (!baseUrl) {
            return NextResponse.json({ message: "Missing NEXT_PUBLIC_BASE_URL." }, { status: 500 });
        }

        const res = await axios.get(`${baseUrl}/factor/getFactor`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            timeout: 15000,
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
                { message: backendMessage ?? "Get factors failed.", details: err.response?.data },
                { status: err.response?.status ?? 500 },
            );
        }

        const message =
            typeof err === "object" && err && "message" in err ? String((err as any).message) : "Get factors failed.";
        return NextResponse.json({ message }, { status: 500 });
    }
}

