"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory4SpendEntry,
    createCategory4SpendEntry,
    deleteCategory4SpendEntry,
    getCategory4SpendEntries,
    getCategory4SpendFactors,
    rejectCategory4SpendEntry,
    submitCategory4SpendEntry,
    updateCategory4SpendEntry,
    verifyCategory4SpendEntry,
} from "./api";
import type {
    AmendCategory4SpendPayload,
    Category4SpendEntry,
    Category4SpendFilterParams,
    CreateCategory4SpendPayload,
    Scope3SpendFactor,
    UpdateCategory4SpendPayload,
} from "./types";

export function useCategory4SpendEntries(filters?: Category4SpendFilterParams) {
    return useQuery<Category4SpendEntry[], Error>({
        queryKey: ["scope3-category4-spend", filters],
        queryFn: () => getCategory4SpendEntries(filters),
    });
}

export function useCategory4SpendFactors(sourceId?: string) {
    return useQuery<Scope3SpendFactor[], Error>({
        queryKey: ["scope3-category4-factors", sourceId],
        queryFn: () => getCategory4SpendFactors(sourceId),
        staleTime: 1000 * 60 * 30,
    });
}

export function useCreateCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, CreateCategory4SpendPayload>({
        mutationFn: createCategory4SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useUpdateCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, { activityId: string; payload: UpdateCategory4SpendPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory4SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useDeleteCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory4SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useSubmitCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, string>({
        mutationFn: submitCategory4SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useVerifyCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, string>({
        mutationFn: verifyCategory4SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useRejectCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory4SpendEntry(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}

export function useAmendCategory4SpendEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category4SpendEntry, Error, { activityId: string; payload: AmendCategory4SpendPayload }>({
        mutationFn: ({ activityId, payload }) => amendCategory4SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category4-spend"] }),
    });
}
