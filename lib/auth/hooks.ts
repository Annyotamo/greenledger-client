"use client";

import { useMutation } from "@tanstack/react-query";
import { loginWithUser, type LoginInput } from "@/lib/auth/api";
import { setAuthToken } from "@/lib/auth/token";
import { clearAuthUser, setAuthUser } from "@/lib/auth/user";

export function useLoginMutation() {
    return useMutation({
        mutationFn: (input: LoginInput) => loginWithUser(input),
        onSuccess: ({ token, user }) => {
            setAuthToken(token);
            if (user) setAuthUser(user);
            else clearAuthUser();
        },
    });
}
