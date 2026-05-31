export type TeamMemberDto = {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    role: string;
    user_status: string;
    is_active: boolean;
    is_verified: boolean;
    last_login_at: string | null;
    created_at: string;
};

export type TeamMember = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: string;
    userStatus: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
};

export type CreateTeamMemberPayload = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    phone_number?: string;
    job_title?: string;
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
