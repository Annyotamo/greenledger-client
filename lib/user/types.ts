import type { AccessLevel, FeatureKey, UINavigationManifest, UserProfile, UserRole } from "@/lib/rbac/types";

export type { UserProfile, UserRole, AccessLevel, FeatureKey, UINavigationManifest };

export interface UserProfileUpdateRequest {
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    job_title?: string | null;
    bio?: string | null;
    background?: string | null;
    logo?: string | null;
}

export interface UserMfaToggleRequest {
    password: string;
    mfa_enabled: boolean;
}

export interface UserMfaStatusResponse {
    mfa_enabled: boolean;
    message: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserAuthResponse {
    access_token: string | null;
    refresh_token: string | null;
    expires_in: number | null;
    refresh_expires_in: number | null;
    mfa_required: boolean;
    session_identifier: string | null;
}

export interface UserMfaVerifyRequest {
    session_identifier: string;
    code: string;
}

export interface UserMfaResendRequest {
    session_identifier: string;
}
