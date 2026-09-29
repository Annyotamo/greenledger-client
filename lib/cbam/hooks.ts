"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    bulkSaveCbamSourceStreams,
    calculateCbamPreview,
    createCbamInstallation,
    createCbamSourceStream,
    deleteCbamSourceStream,
    downloadCbamExcelExport,
    getActiveCbamInstallation,
    getCbamCategories,
    getCbamCategoryDetail,
    getCbamCnCodeDetail,
    getCbamCnCodes,
    getCbamCountries,
    getCbamInstallationById,
    getCbamIpccFuels,
    getCbamProductNames,
    getCbamProductionRoutes,
    getCbamSourceStreamDetail,
    getCbamSourceStreams,
    getCbamSourceStreamsSummary,
    getCbamSpecifications,
    updateCbamInstallation,
    updateCbamSourceStream,
} from "./api";
import type {
    CBAMCalculatePreviewPayload,
    CBAMCalculatePreviewResponse,
    CBAMCategory,
    CBAMCNDetails,
    CBAMCountry,
    CBAMIPCCFuel,
    CBAMInstallationProfile,
    CBAMSourceStream,
    CBAMSourceStreamsSummary,
    CreateCBAMInstallationPayload,
    CreateCBAMSourceStreamPayload,
} from "./types";

// ==========================================
// CATALOG HOOKS
// ==========================================

export function useCbamCategories(sector?: string) {
    return useQuery<CBAMCategory[], Error>({
        queryKey: ["cbam", "categories", sector || "all"],
        queryFn: () => getCbamCategories(sector),
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });
}

export function useCbamCategoryDetail(categoryId?: string) {
    return useQuery<CBAMCategory | null, Error>({
        queryKey: ["cbam", "category", categoryId],
        queryFn: () => (categoryId ? getCbamCategoryDetail(categoryId) : null),
        enabled: Boolean(categoryId),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamProductionRoutes(categoryId?: string) {
    return useQuery<string[], Error>({
        queryKey: ["cbam", "routes", categoryId],
        queryFn: () => (categoryId ? getCbamProductionRoutes(categoryId) : []),
        enabled: Boolean(categoryId),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamProductNames(categoryId?: string) {
    return useQuery<string[], Error>({
        queryKey: ["cbam", "productNames", categoryId],
        queryFn: () => (categoryId ? getCbamProductNames(categoryId) : []),
        enabled: Boolean(categoryId),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamSpecifications(categoryId?: string, productName?: string) {
    return useQuery<CBAMCNDetails[], Error>({
        queryKey: ["cbam", "specifications", categoryId, productName],
        queryFn: () => (categoryId && productName ? getCbamSpecifications(categoryId, productName) : []),
        enabled: Boolean(categoryId && productName),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamCnCodes(params?: {
    category_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
}) {
    return useQuery<CBAMCNDetails[], Error>({
        queryKey: ["cbam", "cnCodes", params?.category_id, params?.search, params?.limit, params?.offset],
        queryFn: () => getCbamCnCodes(params),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamCnCodeDetail(cnCode?: string) {
    return useQuery<CBAMCNDetails | null, Error>({
        queryKey: ["cbam", "cnCodeDetail", cnCode],
        queryFn: () => (cnCode ? getCbamCnCodeDetail(cnCode) : null),
        enabled: Boolean(cnCode),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCbamCountries(search?: string) {
    return useQuery<CBAMCountry[], Error>({
        queryKey: ["cbam", "countries", search || ""],
        queryFn: () => getCbamCountries(search),
        staleTime: 1000 * 60 * 30, // 30 mins
    });
}

export function useCbamIpccFuels(search?: string) {
    return useQuery<CBAMIPCCFuel[], Error>({
        queryKey: ["cbam", "ipccFuels", search || ""],
        queryFn: () => getCbamIpccFuels(search),
        staleTime: 1000 * 60 * 30,
    });
}

// ==========================================
// INSTALLATION HOOKS
// ==========================================

export function useActiveCbamInstallation() {
    return useQuery<CBAMInstallationProfile | null, Error>({
        queryKey: ["cbam", "installation", "active"],
        queryFn: getActiveCbamInstallation,
    });
}

export function useCbamInstallationById(id?: string) {
    return useQuery<CBAMInstallationProfile | null, Error>({
        queryKey: ["cbam", "installation", id],
        queryFn: () => (id ? getCbamInstallationById(id) : null),
        enabled: Boolean(id),
    });
}

export function useCreateCbamInstallation() {
    const queryClient = useQueryClient();
    return useMutation<CBAMInstallationProfile, Error, CreateCBAMInstallationPayload>({
        mutationFn: createCbamInstallation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "installation"] });
        },
    });
}

export function useUpdateCbamInstallation() {
    const queryClient = useQueryClient();
    return useMutation<CBAMInstallationProfile, Error, { id: string; payload: Partial<CreateCBAMInstallationPayload> }>({
        mutationFn: ({ id, payload }) => updateCbamInstallation(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "installation"] });
        },
    });
}

export function useExportCbamExcel() {
    return useMutation<void, Error, { installationId: string; filename?: string }>({
        mutationFn: ({ installationId, filename }) => downloadCbamExcelExport(installationId, filename),
    });
}

// ==========================================
// SOURCE STREAMS HOOKS
// ==========================================

export function useCbamSourceStreams(installationId?: string) {
    return useQuery<CBAMSourceStream[], Error>({
        queryKey: ["cbam", "sourceStreams", installationId],
        queryFn: () => (installationId ? getCbamSourceStreams(installationId) : []),
        enabled: Boolean(installationId),
    });
}

export function useCbamSourceStreamsSummary(installationId?: string) {
    return useQuery<CBAMSourceStreamsSummary | null, Error>({
        queryKey: ["cbam", "sourceStreamsSummary", installationId],
        queryFn: () => (installationId ? getCbamSourceStreamsSummary(installationId) : null),
        enabled: Boolean(installationId),
    });
}

export function useCbamSourceStreamDetail(installationId?: string, streamId?: string) {
    return useQuery<CBAMSourceStream | null, Error>({
        queryKey: ["cbam", "sourceStream", installationId, streamId],
        queryFn: () => (installationId && streamId ? getCbamSourceStreamDetail(installationId, streamId) : null),
        enabled: Boolean(installationId && streamId),
    });
}

export function useCreateCbamSourceStream() {
    const queryClient = useQueryClient();
    return useMutation<CBAMSourceStream, Error, { installationId: string; payload: CreateCBAMSourceStreamPayload }>({
        mutationFn: ({ installationId, payload }) => createCbamSourceStream(installationId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreams", variables.installationId] });
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreamsSummary", variables.installationId] });
        },
    });
}

export function useBulkSaveCbamSourceStreams() {
    const queryClient = useQueryClient();
    return useMutation<CBAMSourceStream[], Error, { installationId: string; streams: CreateCBAMSourceStreamPayload[] }>({
        mutationFn: ({ installationId, streams }) => bulkSaveCbamSourceStreams(installationId, streams),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreams", variables.installationId] });
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreamsSummary", variables.installationId] });
        },
    });
}

export function useUpdateCbamSourceStream() {
    const queryClient = useQueryClient();
    return useMutation<
        CBAMSourceStream,
        Error,
        { installationId: string; streamId: string; payload: Partial<CreateCBAMSourceStreamPayload> }
    >({
        mutationFn: ({ installationId, streamId, payload }) => updateCbamSourceStream(installationId, streamId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreams", variables.installationId] });
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreamsSummary", variables.installationId] });
        },
    });
}

export function useDeleteCbamSourceStream() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { installationId: string; streamId: string }>({
        mutationFn: ({ installationId, streamId }) => deleteCbamSourceStream(installationId, streamId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreams", variables.installationId] });
            queryClient.invalidateQueries({ queryKey: ["cbam", "sourceStreamsSummary", variables.installationId] });
        },
    });
}

export function useCalculateCbamPreview() {
    return useMutation<
        CBAMCalculatePreviewResponse,
        Error,
        { installationId: string; payload: CBAMCalculatePreviewPayload }
    >({
        mutationFn: ({ installationId, payload }) => calculateCbamPreview(installationId, payload),
    });
}
