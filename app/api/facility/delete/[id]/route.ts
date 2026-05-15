import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const params = await context.params;
        const id = params.id;
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
        const url = `${baseURL}/facility/delete/${id}`;

        const res = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(res.data, { status: res.status });
    } catch (error: any) {
        console.error("Facility Delete error:", error.response?.data || error.message);
        return NextResponse.json(
            { message: error.response?.data?.message || "Failed to delete facility" },
            { status: error.response?.status || 500 },
        );
    }
}
