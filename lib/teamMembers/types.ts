import type { AccessLevel, UserPermissionsPayload, UserRole } from "@/lib/rbac/types";

export type TeamMemberDto = {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    role: UserRole;
    user_status: string;
    is_active: boolean;
    is_verified: boolean;
    phone_number?: string | null;
    job_title?: string | null;
    last_login_at: string | null;
    created_at: string;
    custom_permissions?: Record<string, AccessLevel> | null;
};

export type TeamMember = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: UserRole;
    userStatus: string;
    isActive: boolean;
    isVerified: boolean;
    phoneNumber?: string | null;
    jobTitle?: string | null;
    lastLoginAt: string | null;
    createdAt: string;
    customPermissions?: Record<string, AccessLevel> | null;
};

export type CreateTeamMemberPayload = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
    phone_number?: string;
    job_title?: string;
    custom_permissions?: Record<string, AccessLevel>;
};

export type PaginatedTeamMembersResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        items: TeamMemberDto[];
        pagination: {
            total: number;
            page: number;
            page_size: number;
            total_pages: number;
        };
    };
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};

export type UserPermissionsApiResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: UserPermissionsPayload;
    error: unknown | null;
};
