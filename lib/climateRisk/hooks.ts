"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessment, getRiskAccess, listAssessments, listRulesets, searchThinkHazard } from "./api";
import type { RiskAccess } from "./types";

const ROOT = "climate-risk";
const NO_ACCESS: RiskAccess = { level: "none", canRead: false, canWrite: false, canApprove: false };

/** What the signed-in user may do here. Until it loads, nothing is allowed. */
export function useRiskAccess(): RiskAccess {
    const { data } = useQuery({ queryKey: [ROOT, "access"], queryFn: getRiskAccess, staleTime: 5 * 60_000 });
    return data ?? NO_ACCESS;
}

export function useRiskAssessments() {
    return useQuery({ queryKey: [ROOT, "list"], queryFn: listAssessments });
}

export function useRiskAssessment(id: string) {
    return useQuery({ queryKey: [ROOT, "detail", id], queryFn: () => getAssessment(id), enabled: Boolean(id), retry: false });
}

export function useRulesets() {
    return useQuery({ queryKey: [ROOT, "rulesets"], queryFn: listRulesets });
}

export function useThinkHazardSearch(q: string) {
    return useQuery({
        queryKey: [ROOT, "th-search", q.trim().toLowerCase()],
        queryFn: () => searchThinkHazard(q.trim()),
        enabled: q.trim().length >= 2,
        retry: false,
    });
}

/** Runs any write call from api.ts, then refreshes the Risk Assessment data (access is left alone). */
export function useRiskAction() {
    const qc = useQueryClient();
    return useMutation<unknown, Error, () => Promise<unknown>>({
        mutationFn: (call) => call(),
        onSuccess: () => qc.invalidateQueries({ queryKey: [ROOT], predicate: (q) => q.queryKey[1] !== "access" }),
    });
}
