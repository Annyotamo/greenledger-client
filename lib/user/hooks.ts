"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUserProfile, toggleMfa } from "./api";
import type { UserProfileUpdateRequest, UserMfaToggleRequest, UserMfaStatusResponse } from "./types";
import { USER_PROFILE_QUERY_KEY } from "@/lib/rbac/hooks";
import type { UserProfile } from "@/lib/rbac/types";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation<UserProfile, Error, UserProfileUpdateRequest>({
        mutationFn: updateCurrentUserProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedUser);
            queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        },
    });
}

export function useToggleMfa() {
    const queryClient = useQueryClient();

    return useMutation<UserMfaStatusResponse, Error, UserMfaToggleRequest>({
        mutationFn: toggleMfa,
        onSuccess: (res) => {
            queryClient.setQueryData<UserProfile | undefined>(USER_PROFILE_QUERY_KEY, (old) => {
                if (!old) return old;
                return { ...old, mfa_enabled: res.mfa_enabled };
            });
            queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        },
    });
}
