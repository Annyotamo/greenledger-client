"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendCategory5WasteEntry,
    createCategory5WasteEntry,
    deleteCategory5WasteEntry,
    getCategory5WasteEntries,
    getWasteTypeDetail,
    getWasteTypes,
    rejectCategory5WasteEntry,
    submitCategory5WasteEntry,
    updateCategory5WasteEntry,
    verifyCategory5WasteEntry,
} from "./api";
import type {
    AmendCategory5WastePayload,
    Category5FilterParams,
    Category5WasteActivityEntry,
    CreateCategory5WastePayload,
    UpdateCategory5WastePayload,
    WasteType,
} from "./types";

// ---------------------------------------------------------------------------
// 6.1 LOOKUPS HOOKS
// ---------------------------------------------------------------------------

export function useWasteTypes(category?: string) {
    return useQuery<WasteType[], Error>({
        queryKey: ["scope3-category5-waste-types", category],
        queryFn: () => getWasteTypes(category),
        staleTime: 1000 * 60 * 30,
    });
}

export function useWasteTypeDetail(wasteTypeId?: string) {
    return useQuery<WasteType, Error>({
        queryKey: ["scope3-category5-waste-type-detail", wasteTypeId],
        queryFn: () => getWasteTypeDetail(wasteTypeId!),
        enabled: Boolean(wasteTypeId),
        staleTime: 1000 * 60 * 30,
    });
}

// ---------------------------------------------------------------------------
// 6.2 WASTE ACTIVITY CRUD HOOKS
// ---------------------------------------------------------------------------

export function useCategory5WasteEntries(filters?: Category5FilterParams) {
    return useQuery<Category5WasteActivityEntry[], Error>({
        queryKey: ["scope3-category5-waste", filters],
        queryFn: () => getCategory5WasteEntries(filters),
    });
}

export function useCreateCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, CreateCategory5WastePayload>({
        mutationFn: createCategory5WasteEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useUpdateCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, { activityId: string; payload: UpdateCategory5WastePayload }>({
        mutationFn: ({ activityId, payload }) => updateCategory5WasteEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useDeleteCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteCategory5WasteEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useSubmitCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, string>({
        mutationFn: submitCategory5WasteEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useVerifyCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, string>({
        mutationFn: verifyCategory5WasteEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useRejectCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectCategory5WasteEntry(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}

export function useAmendCategory5WasteEntry() {
    const queryClient = useQueryClient();
    return useMutation<Category5WasteActivityEntry, Error, { activityId: string; payload: AmendCategory5WastePayload }>({
        mutationFn: ({ activityId, payload }) => amendCategory5WasteEntry(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category5-waste"] }),
    });
}
