"use client";

import { useMutation } from "@tanstack/react-query";
import { initiateLogin, verifyOtp, type LoginInput } from "@/lib/auth/api";
import { setAuthToken } from "@/lib/auth/token";
import { clearAuthUser, setAuthUser } from "@/lib/auth/user";
import type { OtpVerifyInput, LoginInitResult } from "@/types/auth";

/** Step 1: send credentials, get OTP emailed. Returns { email, tenantId }. */
export function useInitiateLoginMutation() {
    return useMutation<LoginInitResult, Error, LoginInput>({
        mutationFn: (input) => initiateLogin(input),
    });
}

/** Step 2: verify OTP, receive token + user. */
export function useVerifyOtpMutation() {
    return useMutation<{ token: string; user: import("@/types/auth").AuthUser | null }, Error, OtpVerifyInput>({
        mutationFn: (input) => verifyOtp(input),
        onSuccess: ({ token, user }) => {
            setAuthToken(token);
            if (user) setAuthUser(user);
            else clearAuthUser();
        },
    });
}

/** @deprecated kept for backward-compat */
export function useLoginMutation() {
    return useMutation({
        mutationFn: (input: LoginInput) => initiateLogin(input),
    });
}
