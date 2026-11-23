"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AccessLevel } from "@/lib/rbac/types";
import {
    activateUser,
    createTeamMember,
    deactivateUser,
    deleteUser,
    getTeamMembers,
    getUserPermissions,
    updateUserPermissions,
} from "./api";
import type { CreateTeamMemberPayload, TeamMember } from "./types";

export function useTeamMembers() {
    return useQuery<TeamMember[], Error>({
        queryKey: ["team-members"],
        queryFn: getTeamMembers,
    });
}

export function useCreateTeamMember() {
    const qc = useQueryClient();
    return useMutation<TeamMember, Error, CreateTeamMemberPayload>({
        mutationFn: createTeamMember,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
    });
}

export function useUserPermissions(userId: string | null) {
    return useQuery({
        queryKey: ["user-permissions", userId],
        queryFn: () => (userId ? getUserPermissions(userId) : null),
        enabled: !!userId,
        staleTime: 10 * 1000,
    });
}

export function useUpdateUserPermissions() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            customPermissions,
        }: {
            userId: string;
            customPermissions: Record<string, AccessLevel>;
        }) => updateUserPermissions(userId, customPermissions),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["team-members"] });
            qc.invalidateQueries({ queryKey: ["user-permissions", variables.userId] });
        },
    });
}

export function useDeactivateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => deactivateUser(userId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
    });
}

export function useActivateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => activateUser(userId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
    });
}

export function useDeleteUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
    });
}
