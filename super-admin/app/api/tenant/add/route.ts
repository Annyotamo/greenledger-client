import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { api, apiUrl } from "@/lib/api";
import { SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SUPER_ADMIN_AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const rawBody = await req.json().catch(() => ({}));
        const body = {
            companyName: String(rawBody.companyName ?? "").trim(),
            location: String(rawBody.location ?? "").trim(),
        };

        if (!body.companyName || !body.location) {
            return NextResponse.json({ message: "companyName and location are required." }, { status: 400 });
        }

        const url = apiUrl("/tenant/add");
        const res = await api.post(url, body, {
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
                { message: backendMessage ?? "Add tenant failed.", details: err.response?.data },
                { status: err.response?.status ?? 500 },
            );
        }

        const message =
            typeof err === "object" && err && "message" in err ? String((err as any).message) : "Add tenant failed.";
        return NextResponse.json({ message }, { status: 500 });
    }
}
