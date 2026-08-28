"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory9TransportEntry,
    createCategory9TransportEntry,
    deleteCategory9TransportEntry,
    getCategory9TransportEntries,
    getCategory9TransportSummary,
    rejectCategory9TransportEntry,
    submitCategory9TransportEntry,
    updateCategory9TransportEntry,
    verifyCategory9TransportEntry,
} from "./api";
import type {
    AmendCategory9TransportPayload,
    Category9SummaryRollup,
    Category9TransportActivityEntry,
    Category9TransportFilterParams,
    CreateCategory9TransportPayload,
    UpdateCategory9TransportPayload,
} from "./types";

export function useCategory9TransportEntries(filters?: Category9TransportFilterParams) {
    return useQuery<Category9TransportActivityEntry[], Error>({
        queryKey: ["scope3-category9-transport", filters],
        queryFn: () => getCategory9TransportEntries(filters),
    });
}

export function useCategory9TransportSummary(filters?: Category9TransportFilterParams) {
    return useQuery<Category9SummaryRollup, Error>({
        queryKey: ["scope3-category9-transport-summary", filters],
        queryFn: () => getCategory9TransportSummary(filters),
    });
}

export function useCreateCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, CreateCategory9TransportPayload>({
        mutationFn: createCategory9TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useUpdateCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, { activityId: string; payload: UpdateCategory9TransportPayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory9TransportEntry(activityId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useDeleteCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory9TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useSubmitCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, string>({
        mutationFn: submitCategory9TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useVerifyCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, string>({
        mutationFn: verifyCategory9TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useRejectCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory9TransportEntry(activityId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}

export function useAmendCategory9Transport() {
    const queryClient = useQueryClient();
    return useMutation<Category9TransportActivityEntry, Error, AmendCategory9TransportPayload>({
        mutationFn: amendCategory9TransportEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport"] });
            queryClient.invalidateQueries({ queryKey: ["scope3-category9-transport-summary"] });
        },
    });
}
