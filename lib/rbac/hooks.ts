"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/user/api";
import type { AccessLevel, FeatureKey, UserProfile } from "./types";
import { checkPermission, hasAccess } from "./utils";

export const USER_PROFILE_QUERY_KEY = ["user", "me"] as const;

export function useCurrentUser() {
    return useQuery<UserProfile, Error>({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: getCurrentUser,
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
    });
}

export function usePermission(feature: FeatureKey, requiredLevel: AccessLevel = "read") {
    const { data: user, isLoading, isError } = useCurrentUser();

    const allowed = checkPermission(user, feature, requiredLevel);
    const currentLevel: AccessLevel = user?.permissions?.[feature] ?? "none";

    return {
        user,
        isLoading,
        isError,
        allowed,
        currentLevel,
        canRead: checkPermission(user, feature, "read"),
        canWrite: checkPermission(user, feature, "write"),
        canAdmin: checkPermission(user, feature, "admin"),
        hasAccess: (level: AccessLevel) => hasAccess(currentLevel, level),
    };
}
