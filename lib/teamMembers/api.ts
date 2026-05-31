import { privateApi } from "@/lib/http/client";
import type { CreateTeamMemberPayload, PaginatedTeamMembersResponse, TeamMember, TeamMemberDto } from "./types";

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
        lastLoginAt: dto.last_login_at,
        createdAt: dto.created_at,
    };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
    const response = await privateApi.get<PaginatedTeamMembersResponse>("/tenant/user");
    const rawItems = response.data.data?.items ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapTeamMember) : [];
}

export async function createTeamMember(payload: CreateTeamMemberPayload): Promise<TeamMember> {
    const response = await privateApi.post("/tenant/user", payload);
    const rawData = response.data.data?.items ?? response.data.data;
    const dto = Array.isArray(rawData) ? rawData[0] : rawData;
    return mapTeamMember(dto as TeamMemberDto);
}
