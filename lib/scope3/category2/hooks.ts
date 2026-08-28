"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getScope3SpendFactors } from "../category1/api";
import {
    amendCategory2SpendEntry,
    createCategory2SpendEntry,
    deleteCategory2SpendEntry,
    getCategory2SpendEntries,
    rejectCategory2SpendEntry,
    submitCategory2SpendEntry,
    updateCategory2SpendEntry,
    verifyCategory2SpendEntry,
} from "./api";
import type {
    AmendCategory2SpendPayload,
    Category2FilterParams,
    Category2SpendEntry,
    CreateCategory2SpendPayload,
    Scope3SpendFactor,
    UpdateCategory2SpendPayload,
} from "./types";

export function useCategory2SpendEntries(filters?: Category2FilterParams) {
    return useQuery<Category2SpendEntry[], Error>({
        queryKey: ["scope3-category2-spend", filters],
        queryFn: () => getCategory2SpendEntries(filters),
    });
}

export function useCategory2SpendFactors(sourceId?: string) {
    return useQuery<Scope3SpendFactor[], Error>({
        queryKey: ["scope3-spend-factors", sourceId],
        queryFn: () => getScope3SpendFactors(sourceId),
        staleTime: 1000 * 60 * 30,
    });
}

export function useCreateCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, CreateCategory2SpendPayload>({
        mutationFn: createCategory2SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useUpdateCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, { activityId: string; payload: UpdateCategory2SpendPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory2SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useDeleteCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory2SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useSubmitCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, string>({
        mutationFn: submitCategory2SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useVerifyCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, string>({
        mutationFn: verifyCategory2SpendEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useRejectCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory2SpendEntry(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}

export function useAmendCategory2Spend() {
    const queryClient = useQueryClient();
    return useMutation<Category2SpendEntry, Error, { activityId: string; payload: AmendCategory2SpendPayload }>({
        mutationFn: ({ activityId, payload }) => amendCategory2SpendEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category2-spend"] }),
    });
}
