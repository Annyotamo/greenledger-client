"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteScope3Document,
    getScope3Documents,
    uploadScope3Document,
} from "./api";
import {
    normalizeScope3Category,
    Scope3Document,
    UploadScope3DocumentMultipartPayload,
} from "./types";

/**
 * Hook to retrieve all documents for a specific Scope 3 entry.
 */
export function useScope3Documents(
    category: string | number,
    activityId?: string | null,
    options?: { enabled?: boolean },
) {
    const normalizedCategory = normalizeScope3Category(category);
    const isEnabled = Boolean(activityId) && (options?.enabled ?? true);

    return useQuery<Scope3Document[]>({
        queryKey: ["scope3-documents", normalizedCategory, activityId],
        queryFn: () => getScope3Documents(normalizedCategory, activityId!),
        enabled: isEnabled,
        staleTime: 1000 * 60 * 3, // Cache documents for 3 minutes
    });
}

/**
 * Mutation hook to upload a document directly to a Scope 3 entry.
 */
export function useUploadScope3Document(
    category: string | number,
    activityId?: string | null,
) {
    const queryClient = useQueryClient();
    const normalizedCategory = normalizeScope3Category(category);

    return useMutation({
        mutationFn: (payload: UploadScope3DocumentMultipartPayload) => {
            if (!activityId) throw new Error("Activity ID is required to upload a document.");
            return uploadScope3Document(normalizedCategory, activityId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["scope3-documents", normalizedCategory, activityId],
            });
        },
    });
}

/**
 * Mutation hook to delete a document from a Scope 3 entry.
 */
export function useDeleteScope3Document(
    category: string | number,
    activityId?: string | null,
) {
    const queryClient = useQueryClient();
    const normalizedCategory = normalizeScope3Category(category);

    return useMutation({
        mutationFn: (documentId: string) => {
            if (!activityId) throw new Error("Activity ID is required to delete a document.");
            return deleteScope3Document(normalizedCategory, activityId, documentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["scope3-documents", normalizedCategory, activityId],
            });
        },
    });
}

