"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCustomFuels,
    createCustomFuel,
    updateCustomFuel,
    getCustomFuelUnits,
    CreateCustomFuelPayload,
} from "./api";

export function useCustomFuels(sourceId?: string) {
    return useQuery({
        queryKey: ["customFuels", sourceId],
        queryFn: () => getCustomFuels(sourceId),
    });
}

export function useCustomFuelUnits(enabled = true) {
    return useQuery({
        queryKey: ["customFuelUnits"],
        queryFn: () => getCustomFuelUnits(),
        enabled,
    });
}

export function useCreateCustomFuel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCustomFuelPayload) => createCustomFuel(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customFuels"] });
        },
    });
}

export function useUpdateCustomFuel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            customFuelId,
            payload,
        }: {
            customFuelId: string;
            payload: CreateCustomFuelPayload;
        }) => updateCustomFuel(customFuelId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customFuels"] });
        },
    });
}
