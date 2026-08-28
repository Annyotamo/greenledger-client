"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory4TransportEntry,
    createCategory4TransportEntry,
    deleteCategory4TransportEntry,
    getCategory4TransportEntries,
    getCategory4TransportSummary,
    rejectCategory4TransportEntry,
    submitCategory4TransportEntry,
    updateCategory4TransportEntry,
    verifyCategory4TransportEntry,
} from "./api";
import type {
    AmendCategory4TransportPayload,
    Category4SummaryRollup,
    Category4TransportActivityEntry,
    Category4TransportFilterParams,
    CreateCategory4TransportPayload,
    UpdateCategory4TransportPayload,
} from "./types";

export function useCategory4TransportEntries(filters?: Category4TransportFilterParams) {
    return useQuery<Category4TransportActivityEntry[], Error>({
        queryKey: ["scope3-category4-transport", filters],
        queryFn: () => getCategory4TransportEntries(filters),
    });
}

export function useCategory4TransportSummary(filters?: Category4TransportFilterParams) {
    return useQuery<Category4SummaryRollup, Error>({
        queryKey: ["scope3-category4-transport-summary", filters],
        queryFn: () => getCategory4TransportSummary(filters),
    });
}

export function useCreateCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, CreateCategory4TransportPayload>({
        mutationFn: createCategory4TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useUpdateCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, { activityId: string; payload: UpdateCategory4TransportPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory4TransportEntry(activityId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useDeleteCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory4TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useSubmitCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, string>({
        mutationFn: submitCategory4TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useVerifyCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, string>({
        mutationFn: verifyCategory4TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useRejectCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory4TransportEntry(activityId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}

export function useAmendCategory4Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category4TransportActivityEntry, Error, AmendCategory4TransportPayload>({
        mutationFn: amendCategory4TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category4-transport-summary"] });
        },
    });
}
