"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeamMember, getTeamMembers } from "./api";
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
