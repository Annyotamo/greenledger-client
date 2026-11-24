// lib/lwg/hooks.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createLwgAuditResult,
    createLwgDepartment,
    createLwgEvidence,
    createLwgProfile,
    deleteLwgDepartment,
    deleteLwgEnergy,
    deleteLwgEvidence,
    deleteLwgProduction,
    deleteLwgWater,
    getLwgAuditResult,
    getLwgDashboard,
    getLwgDepartments,
    getLwgEnergy,
    getLwgEvidence,
    getLwgProduction,
    getLwgProfile,
    getLwgWater,
    updateLwgDepartment,
    updateLwgProfile,
    uploadLwgExcelFile,
    upsertLwgEnergy,
    upsertLwgProduction,
    upsertLwgWater,
} from "./api";
import type {
    CreateLwgAuditResultPayload,
    CreateLwgDepartmentPayload,
    CreateLwgEvidencePayload,
    CreateLwgProfilePayload,
    LwgAuditResult,
    LwgDashboardData,
    LwgDepartment,
    LwgEnergy,
    LwgEvidence,
    LwgExcelImportSummary,
    LwgProduction,
    LwgTanneryProfile,
    LwgWater,
    UpdateLwgDepartmentPayload,
    UpdateLwgProfilePayload,
    UpsertLwgEnergyPayload,
    UpsertLwgProductionPayload,
    UpsertLwgWaterPayload,
} from "./types";

// ============================================================================
// QUERY KEYS HIERARCHY
// ============================================================================

export const lwgQueryKeys = {
    all: ["lwg"] as const,
    profile: () => [...lwgQueryKeys.all, "profile"] as const,
    departments: (activeOnly = true) =>
        [...lwgQueryKeys.all, "departments", { activeOnly }] as const,
    dashboard: () => [...lwgQueryKeys.all, "dashboard"] as const,
    production: (filters?: { start_date?: string; end_date?: string }) =>
        [...lwgQueryKeys.all, "production", filters] as const,
    energy: (filters?: { start_date?: string; end_date?: string }) =>
        [...lwgQueryKeys.all, "energy", filters] as const,
    water: (filters?: { start_date?: string; end_date?: string }) =>
        [...lwgQueryKeys.all, "water", filters] as const,
    evidence: (sectionNumber?: number) =>
        [...lwgQueryKeys.all, "evidence", { sectionNumber }] as const,
    auditResult: () => [...lwgQueryKeys.all, "audit-result"] as const,
};

// ============================================================================
// 1. TANNERY PROFILE HOOKS
// ============================================================================

export function useLwgProfile() {
    return useQuery<LwgTanneryProfile | null, Error>({
        queryKey: lwgQueryKeys.profile(),
        queryFn: getLwgProfile,
        staleTime: 60 * 1000,
    });
}

export function useCreateLwgProfile() {
    const queryClient = useQueryClient();

    return useMutation<LwgTanneryProfile, Error, CreateLwgProfilePayload>({
        mutationFn: createLwgProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.profile() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.departments() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

export function useUpdateLwgProfile() {
    const queryClient = useQueryClient();

    return useMutation<LwgTanneryProfile, Error, UpdateLwgProfilePayload>({
        mutationFn: updateLwgProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.profile() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 2. FACTORY DEPARTMENTS HOOKS
// ============================================================================

export function useLwgDepartments(activeOnly = true) {
    return useQuery<LwgDepartment[], Error>({
        queryKey: lwgQueryKeys.departments(activeOnly),
        queryFn: () => getLwgDepartments(activeOnly),
    });
}

export function useCreateLwgDepartment() {
    const queryClient = useQueryClient();

    return useMutation<LwgDepartment, Error, CreateLwgDepartmentPayload>({
        mutationFn: createLwgDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.departments() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.profile() });
        },
    });
}

export function useUpdateLwgDepartment() {
    const queryClient = useQueryClient();

    return useMutation<
        LwgDepartment,
        Error,
        { id: string; payload: UpdateLwgDepartmentPayload }
    >({
        mutationFn: ({ id, payload }) => updateLwgDepartment(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.departments() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.profile() });
        },
    });
}

export function useDeleteLwgDepartment() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteLwgDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.departments() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.profile() });
        },
    });
}

// ============================================================================
// 3. MONTHLY PRODUCTION DATA HOOKS (SECTION 5)
// ============================================================================

export function useLwgProduction(filters?: {
    start_date?: string;
    end_date?: string;
}) {
    return useQuery<LwgProduction[], Error>({
        queryKey: lwgQueryKeys.production(filters),
        queryFn: () => getLwgProduction(filters),
    });
}

export function useUpsertLwgProduction() {
    const queryClient = useQueryClient();

    return useMutation<LwgProduction, Error, UpsertLwgProductionPayload>({
        mutationFn: upsertLwgProduction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.production() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

export function useDeleteLwgProduction() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteLwgProduction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.production() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 4. MONTHLY ENERGY CONSUMPTION HOOKS (SECTION 10)
// ============================================================================

export function useLwgEnergy(filters?: {
    start_date?: string;
    end_date?: string;
}) {
    return useQuery<LwgEnergy[], Error>({
        queryKey: lwgQueryKeys.energy(filters),
        queryFn: () => getLwgEnergy(filters),
    });
}

export function useUpsertLwgEnergy() {
    const queryClient = useQueryClient();

    return useMutation<LwgEnergy, Error, UpsertLwgEnergyPayload>({
        mutationFn: upsertLwgEnergy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.energy() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

export function useDeleteLwgEnergy() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteLwgEnergy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.energy() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 5. MONTHLY WATER USAGE HOOKS (SECTION 11)
// ============================================================================

export function useLwgWater(filters?: {
    start_date?: string;
    end_date?: string;
}) {
    return useQuery<LwgWater[], Error>({
        queryKey: lwgQueryKeys.water(filters),
        queryFn: () => getLwgWater(filters),
    });
}

export function useUpsertLwgWater() {
    const queryClient = useQueryClient();

    return useMutation<LwgWater, Error, UpsertLwgWaterPayload>({
        mutationFn: upsertLwgWater,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.water() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

export function useDeleteLwgWater() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteLwgWater,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.water() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 6. EVIDENCE VAULT HOOKS (SECTIONS 1–17)
// ============================================================================

export function useLwgEvidence(sectionNumber?: number) {
    return useQuery<LwgEvidence[], Error>({
        queryKey: lwgQueryKeys.evidence(sectionNumber),
        queryFn: () => getLwgEvidence(sectionNumber),
    });
}

export function useCreateLwgEvidence() {
    const queryClient = useQueryClient();

    return useMutation<LwgEvidence, Error, CreateLwgEvidencePayload>({
        mutationFn: createLwgEvidence,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.evidence() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

export function useDeleteLwgEvidence() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteLwgEvidence,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.evidence() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 7. PREVIOUS AUDIT RESULT & MEDAL HOOKS
// ============================================================================

export function useLwgAuditResult() {
    return useQuery<LwgAuditResult | null, Error>({
        queryKey: lwgQueryKeys.auditResult(),
        queryFn: getLwgAuditResult,
    });
}

export function useCreateLwgAuditResult() {
    const queryClient = useQueryClient();

    return useMutation<LwgAuditResult, Error, CreateLwgAuditResultPayload>({
        mutationFn: createLwgAuditResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.auditResult() });
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.dashboard() });
        },
    });
}

// ============================================================================
// 8. COMPLIANCE & READINESS DASHBOARD HOOK
// ============================================================================

export function useLwgDashboard() {
    return useQuery<LwgDashboardData, Error>({
        queryKey: lwgQueryKeys.dashboard(),
        queryFn: getLwgDashboard,
        staleTime: 30 * 1000,
    });
}

// ============================================================================
// 9. BULK EXCEL INGESTION HOOK
// ============================================================================

export function useUploadLwgExcel() {
    const queryClient = useQueryClient();

    return useMutation<LwgExcelImportSummary, Error, File>({
        mutationFn: uploadLwgExcelFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lwgQueryKeys.all });
        },
    });
}
