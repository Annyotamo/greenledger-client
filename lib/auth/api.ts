import { privateApi, publicApi } from "@/lib/http/client";
import type { AuthUser, LoginInput, LoginPayload, LoginResponse } from "@/types/auth";
export type { LoginInput } from "@/types/auth";

function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getLoginPayload(input: LoginInput): LoginPayload {
    const identity = input.identity.trim();

    if (isEmail(identity)) {
        return { email: identity, password: input.password };
    }

    return { userName: identity, password: input.password };
}

export async function login(input: LoginInput): Promise<string> {
    const payload = getLoginPayload(input);
    const { data } = await publicApi.post<LoginResponse>("/user/login", payload);

    const token =
        typeof (data as any)?.token === "string"
            ? String((data as any).token)
            : typeof (data as any)?.data === "string"
              ? String((data as any).data)
              : null;

    if (!token) throw new Error("Invalid login response: token missing.");
    return token;
}

export async function logout(): Promise<void> {
    await privateApi.post("/user/logout");
}

export async function loginWithUser(input: LoginInput): Promise<{ token: string; user: AuthUser | null }> {
    const payload = getLoginPayload(input);
    const { data } = await publicApi.post<LoginResponse>("/user/login", payload);

    const token =
        typeof (data as any)?.token === "string"
            ? String((data as any).token)
            : typeof (data as any)?.data === "string"
              ? String((data as any).data)
              : null;

    if (!token) throw new Error("Invalid login response: token missing.");

    const user =
        data && typeof data === "object" && "data" in data && (data as any).data && typeof (data as any).data === "object"
            ? ((data as any).data as AuthUser)
            : null;

    return { token, user };
}
