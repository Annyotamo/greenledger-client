import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiUrl } from "@/lib/api";
import { SUPER_ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SUPER_ADMIN_AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const incoming = await req.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Missing CSV file (form field: file)." }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.set("file", file, file.name);

    const url = apiUrl("/factor/superAdmin/uploadFactor");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: outgoing,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text();

    return NextResponse.json(body, { status: res.status });
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err && "message" in err ? String((err as any).message) : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

