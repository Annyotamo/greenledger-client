import { privateApi, publicApi } from "@/lib/http/client";
import type {
    AuthUser,
    LoginInput,
    LoginPayload,
    LoginResponse,
    OtpVerifyInput,
    OtpVerifyResponse,
} from "@/types/auth";
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

function extractEmail(input: LoginInput): string {
    return input.identity.trim();
}

/**
 * Step 1 of 2FA: send credentials, server sends OTP to email.
 * Returns the email used (needed for step 2).
 */
export async function initiateLogin(input: LoginInput): Promise<string> {
    const payload = getLoginPayload(input);
    await publicApi.post<LoginResponse>("/user/login", payload);
    return extractEmail(input);
}

/**
 * Step 2 of 2FA: verify OTP, server returns token + user.
 */
export async function verifyOtp(
    input: OtpVerifyInput
): Promise<{ token: string; user: AuthUser | null }> {
    const { data } = await publicApi.post<OtpVerifyResponse>("/user/verifyOtp", {
        email: input.email,
        otp: input.otp,
    });

    const token = typeof (data as any)?.token === "string" ? String((data as any).token) : null;
    if (!token) throw new Error("OTP verification failed: no token returned.");

    const user =
        data?.data && typeof data.data === "object" ? (data.data as AuthUser) : null;

    return { token, user };
}

export async function logout(): Promise<void> {
    await privateApi.post("/user/logout");
}

/** @deprecated Use initiateLogin + verifyOtp instead */
export async function loginWithUser(
    input: LoginInput
): Promise<{ token: string; user: AuthUser | null }> {
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
        data &&
        typeof data === "object" &&
        "data" in data &&
        (data as any).data &&
        typeof (data as any).data === "object"
            ? ((data as any).data as AuthUser)
            : null;

    return { token, user };
}
