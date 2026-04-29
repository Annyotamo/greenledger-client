import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { api, apiUrl } from "@/lib/api";
import { SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

type AddScope2EmissionVersionBody = {
    factorSource: string;
    version: string;
    year: number;
    inputUnit: string;
    factor: string;
};

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SUPER_ADMIN_AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const body = (await req.json()) as AddScope2EmissionVersionBody;
        const url = apiUrl("/factor/superAdmin/addScope2factor");

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
                { message: backendMessage ?? "Add Scope 2 version failed.", details: err.response?.data },
                { status: err.response?.status ?? 500 },
            );
        }

        const message =
            typeof err === "object" && err && "message" in err
                ? String((err as any).message)
                : "Add Scope 2 version failed.";
        return NextResponse.json({ message }, { status: 500 });
    }
}
