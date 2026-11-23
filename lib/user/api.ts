import { privateApi } from "@/lib/http/client";
import type { UserPermissionsPayload, UserProfile } from "@/lib/rbac/types";
import { buildUINavigationManifest, resolveEffectivePermissions } from "@/lib/rbac/utils";

export type { UserProfile, UserPermissionsPayload };

export type ApiResponse<T> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: null | unknown;
    method?: string;
    path?: string;
    timestamp?: string;
};

/**
 * Fetch authenticated user's profile and permissions (GET /api/v1/user/auth/me)
 */
export async function getCurrentUser(): Promise<UserProfile> {
    const response = await privateApi.get<ApiResponse<UserProfile>>("/user/auth/me");
    if (!response?.data?.success || !response.data.data) {
        throw new Error(response.data?.message ?? "Failed to load current user.");
    }

    const raw = response.data.data;
    const role = raw.role || "CUSTOM";
    const effective = raw.permissions || resolveEffectivePermissions(role, raw.custom_permissions);
    const nav = raw.ui_navigation || buildUINavigationManifest(effective, role);

    return {
        ...raw,
        role,
        permissions: effective,
        ui_navigation: nav,
    };
}

/**
 * Fetch lightweight authenticated user permissions (GET /api/v1/user/auth/permissions)
 */
export async function getUserAuthPermissions(): Promise<UserPermissionsPayload> {
    const response = await privateApi.get<ApiResponse<UserPermissionsPayload>>("/user/auth/permissions");
    if (!response?.data?.success || !response.data.data) {
        throw new Error(response.data?.message ?? "Failed to load user permissions.");
    }
    return response.data.data;
}
