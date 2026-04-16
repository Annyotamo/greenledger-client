import { publicApi } from "@/lib/http/client";
import type { LoginInput, LoginPayload, LoginResponse } from "@/types/auth";
export type { LoginInput, LoginMode } from "@/types/auth";

function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getLoginPayload(input: LoginInput): LoginPayload {
    const identity = input.identity.trim();

    if (input.mode === "email" || isEmail(identity)) {
        return { email: identity, password: input.password };
    }

    return { username: identity, password: input.password };
}

export async function login(input: LoginInput): Promise<string> {
    const payload = getLoginPayload(input);
    const { data } = await publicApi.post<LoginResponse>("/user/login", payload);

    if (!data?.data) {
        throw new Error("Invalid login response: token missing.");
    }

    return data.data;
}
