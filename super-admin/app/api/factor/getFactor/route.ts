import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { api, apiUrl } from "@/lib/api";
import { SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SUPER_ADMIN_AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const url = apiUrl("/factor/getScope1Factor");
        const res = await api.get(url, {
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
                { message: backendMessage ?? "Get factors failed.", details: err.response?.data },
                { status: err.response?.status ?? 500 },
            );
        }

        const message =
            typeof err === "object" && err && "message" in err ? String((err as any).message) : "Get factors failed.";
        return NextResponse.json({ message }, { status: 500 });
    }
}
