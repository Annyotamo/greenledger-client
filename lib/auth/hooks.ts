"use client";

import { useMutation } from "@tanstack/react-query";
import { login, type LoginInput } from "@/lib/auth/api";
import { setAuthToken } from "@/lib/auth/token";

export function useLoginMutation() {
    return useMutation({
        mutationFn: (input: LoginInput) => login(input),
        onSuccess: (token) => {
            setAuthToken(token);
        },
    });
}
