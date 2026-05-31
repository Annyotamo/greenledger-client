import { privateApi } from "@/lib/http/client";

export type UserProfile = {
    id: string;
    tenant_id?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    phone_number?: string;
    job_title?: string;
    role?: string;
    avatar?: string;
    user_status?: string;
    is_active?: boolean;
    is_verified?: boolean;
    mfa_enabled?: boolean;
    last_login_at?: string | null;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
};

export type ApiResponse<T> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
};

export async function getCurrentUser(): Promise<UserProfile> {
    const response = await privateApi.get<ApiResponse<UserProfile>>("/user/auth/me");
    if (!response?.data?.success || !response.data.data) {
        throw new Error(response.data?.message ?? "Failed to load current user.");
    }
    return response.data.data;
}
