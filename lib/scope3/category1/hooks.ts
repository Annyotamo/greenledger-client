"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory1SpendEntry,
    createCategory1SpendEntry,
    deleteCategory1SpendEntry,
    getActiveEmissionFactorSources,
    getCategory1SpendEntries,
    getScope3SpendFactors,
    rejectCategory1SpendEntry,
    submitCategory1SpendEntry,
    updateCategory1SpendEntry,
    verifyCategory1SpendEntry,
} from "./api";
import type {
    AmendCategory1SpendPayload,
    Category1FilterParams,
    Category1SpendEntry,
    CreateCategory1SpendPayload,
    EmissionFactorSource,
    Scope3SpendFactor,
    UpdateCategory1SpendPayload,
} from "./types";

export function useActiveEmissionFactorSources(type = "other") {
    return useQuery<EmissionFactorSource[], Error>({
        queryKey: ["emission-factor-sources-active", type],
        queryFn: () => getActiveEmissionFactorSources(type),
        staleTime: 1000 * 60 * 30, // 30 minutes cache
    });
}

export function useScope3SpendFactors(sourceId?: string) {
    return useQuery<Scope3SpendFactor[], Error>({
        queryKey: ["scope3-spend-factors", sourceId],
        queryFn: () => getScope3SpendFactors(sourceId),
        staleTime: 1000 * 60 * 30, // 30 minutes cache
    });
}

export function useCategory1SpendEntries(filters?: Category1FilterParams) {
    return useQuery<Category1SpendEntry[], Error>({
        queryKey: ["scope3-category1-spend", filters],
        queryFn: () => getCategory1SpendEntries(filters),
    });
}

export function useCreateCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, CreateCategory1SpendPayload>({
        mutationFn: createCategory1SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useUpdateCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, { activityId: string; payload: UpdateCategory1SpendPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory1SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useDeleteCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory1SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useSubmitCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, string>({
        mutationFn: submitCategory1SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useVerifyCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, string>({
        mutationFn: verifyCategory1SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useRejectCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory1SpendEntry(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}

export function useAmendCategory1Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category1SpendEntry, Error, { activityId: string; payload: AmendCategory1SpendPayload }>({
        mutationFn: ({ activityId, payload }) => amendCategory1SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category1-spend"] }),
    });
}
