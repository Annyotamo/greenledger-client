"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory15InvestmentEntry,
    createCategory15InvestmentEntry,
    deleteCategory15InvestmentEntry,
    getAssetClasses,
    getCategory15InvestmentEntries,
    getCategory15InvestmentEntry,
    rejectCategory15InvestmentEntry,
    submitCategory15InvestmentEntry,
    updateCategory15InvestmentEntry,
    verifyCategory15InvestmentEntry,
} from "./api";
import type {
    AmendCategory15InvestmentPayload,
    AssetClassMetadata,
    Category15FilterParams,
    Category15InvestmentEntry,
    CreateCategory15InvestmentPayload,
    UpdateCategory15InvestmentPayload,
} from "./types";

export function useAssetClasses() {
    return useQuery<AssetClassMetadata[], Error>({
        queryKey: ["scope3-category15-asset-classes"],
        queryFn: getAssetClasses,
        staleTime: 1000 * 60 * 60,
    });
}

export function useCategory15InvestmentEntries(filters?: Category15FilterParams) {
    return useQuery<Category15InvestmentEntry[], Error>({
        queryKey: ["scope3-category15-investments", filters],
        queryFn: () => getCategory15InvestmentEntries(filters),
    });
}

export function useCategory15InvestmentEntry(activityId?: string) {
    return useQuery<Category15InvestmentEntry, Error>({
        queryKey: ["scope3-category15-investment-detail", activityId],
        queryFn: () => getCategory15InvestmentEntry(activityId!),
        enabled: Boolean(activityId),
    });
}

export function useCreateCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, CreateCategory15InvestmentPayload>({
        mutationFn: createCategory15InvestmentEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useUpdateCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, { activityId: string; payload: UpdateCategory15InvestmentPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory15InvestmentEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useDeleteCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory15InvestmentEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useSubmitCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, string>({
        mutationFn: submitCategory15InvestmentEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useVerifyCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, string>({
        mutationFn: verifyCategory15InvestmentEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useRejectCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory15InvestmentEntry(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}

export function useAmendCategory15InvestmentEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category15InvestmentEntry, Error, { activityId: string; payload: AmendCategory15InvestmentPayload }>({
        mutationFn: ({ activityId, payload }) => amendCategory15InvestmentEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category15-investments"] }),
    });
}
