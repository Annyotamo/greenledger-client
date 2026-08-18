"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendElectricityTdActivity,
    amendWttFuelActivity,
    createElectricityTdActivity,
    createWttFuelActivity,
    deleteElectricityTdActivity,
    deleteWttFuelActivity,
    getElectricityTdActivities,
    getWttFuelActivities,
    getWttFuels,
    getWttFuelUnits,
    rejectElectricityTdActivity,
    rejectWttFuelActivity,
    submitElectricityTdActivity,
    submitWttFuelActivity,
    updateElectricityTdActivity,
    updateWttFuelActivity,
    verifyElectricityTdActivity,
    verifyWttFuelActivity,
} from "./api";
import type {
    AmendElectricityTdPayload,
    AmendWttFuelPayload,
    Category3FilterParams,
    CreateElectricityTdPayload,
    CreateWttFuelPayload,
    ElectricityTdActivityEntry,
    UpdateElectricityTdPayload,
    UpdateWttFuelPayload,
    WttFuel,
    WttFuelActivityEntry,
    WttFuelUnit,
} from "./types";

// ---------------------------------------------------------------------------
// 4.1 WTT LOOKUPS HOOKS
// ---------------------------------------------------------------------------

export function useWttFuels() {
    return useQuery<WttFuel[], Error>({
        queryKey: ["scope3-wtt-fuels"],
        queryFn: getWttFuels,
        staleTime: 1000 * 60 * 30,
    });
}

export function useWttFuelUnits(fuelId?: string) {
    return useQuery<WttFuelUnit[], Error>({
        queryKey: ["scope3-wtt-fuel-units", fuelId],
        queryFn: () => getWttFuelUnits(fuelId!),
        enabled: Boolean(fuelId),
        staleTime: 1000 * 60 * 30,
    });
}

// ---------------------------------------------------------------------------
// 4.2 WTT FUELS ACTIVITIES HOOKS
// ---------------------------------------------------------------------------

export function useWttFuelActivities(filters?: Category3FilterParams) {
    return useQuery<WttFuelActivityEntry[], Error>({
        queryKey: ["scope3-category3-wtt-fuel", filters],
        queryFn: () => getWttFuelActivities(filters),
    });
}

export function useCreateWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, CreateWttFuelPayload>({
        mutationFn: createWttFuelActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useUpdateWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, { activityId: string; payload: UpdateWttFuelPayload }>({
        mutationFn: ({ activityId, payload }) => updateWttFuelActivity(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useDeleteWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteWttFuelActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useSubmitWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, string>({
        mutationFn: submitWttFuelActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useVerifyWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, string>({
        mutationFn: verifyWttFuelActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useRejectWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectWttFuelActivity(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

export function useAmendWttFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<WttFuelActivityEntry, Error, { activityId: string; payload: AmendWttFuelPayload }>({
        mutationFn: ({ activityId, payload }) => amendWttFuelActivity(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-wtt-fuel"] }),
    });
}

// ---------------------------------------------------------------------------
// 4.3 ELECTRICITY T&D LOSSES ACTIVITIES HOOKS
// ---------------------------------------------------------------------------

export function useElectricityTdActivities(filters?: Category3FilterParams) {
    return useQuery<ElectricityTdActivityEntry[], Error>({
        queryKey: ["scope3-category3-electricity-td", filters],
        queryFn: () => getElectricityTdActivities(filters),
    });
}

export function useCreateElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, CreateElectricityTdPayload>({
        mutationFn: createElectricityTdActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useUpdateElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, { activityId: string; payload: UpdateElectricityTdPayload }>({
        mutationFn: ({ activityId, payload }) => updateElectricityTdActivity(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useDeleteElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteElectricityTdActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useSubmitElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, string>({
        mutationFn: submitElectricityTdActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useVerifyElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, string>({
        mutationFn: verifyElectricityTdActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useRejectElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectElectricityTdActivity(activityId, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}

export function useAmendElectricityTdActivity() {
    const queryClient = useQueryClient();
    return useMutation<ElectricityTdActivityEntry, Error, { activityId: string; payload: AmendElectricityTdPayload }>({
        mutationFn: ({ activityId, payload }) => amendElectricityTdActivity(activityId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scope3-category3-electricity-td"] }),
    });
}
