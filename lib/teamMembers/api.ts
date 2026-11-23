import { privateApi } from "@/lib/http/client";
import type { AccessLevel, UserPermissionsPayload } from "@/lib/rbac/types";
import type {
    CreateTeamMemberPayload,
    PaginatedTeamMembersResponse,
    TeamMember,
    TeamMemberDto,
    UserPermissionsApiResponse,
} from "./types";

function mapTeamMember(dto: TeamMemberDto): TeamMember {
    return {
        id: dto.id,
        firstName: dto.first_name,
        lastName: dto.last_name,
        fullName: dto.full_name,
        email: dto.email,
        role: dto.role,
        userStatus: dto.user_status,
        isActive: dto.is_active,
        isVerified: dto.is_verified,
        phoneNumber: dto.phone_number,
        jobTitle: dto.job_title,
        lastLoginAt: dto.last_login_at,
        createdAt: dto.created_at,
        customPermissions: dto.custom_permissions,
    };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
    const response = await privateApi.get<PaginatedTeamMembersResponse>("/tenant/user?page=1&page_size=200");
    const rawItems = response.data.data?.items ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapTeamMember) : [];
}

export async function createTeamMember(payload: CreateTeamMemberPayload): Promise<TeamMember> {
    const response = await privateApi.post("/tenant/user/invite", payload);
    const rawData = response.data.data?.items ?? response.data.data;
    const dto = Array.isArray(rawData) ? rawData[0] : rawData;
    return mapTeamMember(dto as TeamMemberDto);
}

export async function getUserPermissions(userId: string): Promise<UserPermissionsPayload> {
    const response = await privateApi.get<UserPermissionsApiResponse>(`/tenant/user/${userId}/permissions`);
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch user permissions.");
    }
    return response.data.data;
}

export async function updateUserPermissions(
    userId: string,
    customPermissions: Record<string, AccessLevel>,
): Promise<UserPermissionsPayload> {
    const response = await privateApi.patch<UserPermissionsApiResponse>(`/tenant/user/${userId}/permissions`, {
        custom_permissions: customPermissions,
    });
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to update user permissions.");
    }
    return response.data.data;
}

export async function deactivateUser(userId: string): Promise<void> {
    const response = await privateApi.post(`/tenant/user/${userId}/deactivate`);
    if (!response.data?.success) {
        throw new Error(response.data?.message ?? "Failed to deactivate user.");
    }
}

export async function activateUser(userId: string): Promise<void> {
    const response = await privateApi.post(`/tenant/user/${userId}/activate`);
    if (!response.data?.success) {
        throw new Error(response.data?.message ?? "Failed to activate user.");
    }
}

export async function deleteUser(userId: string): Promise<void> {
    const response = await privateApi.delete(`/tenant/user/${userId}`);
    if (!response.data?.success) {
        throw new Error(response.data?.message ?? "Failed to delete user.");
    }
}
