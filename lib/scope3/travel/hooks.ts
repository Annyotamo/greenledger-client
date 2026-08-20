"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    amendTravelActivity,
    createTravelActivity,
    deleteTravelActivity,
    getAirCabinClasses,
    getAirHaulTypes,
    getCarTypeCategories,
    getCarTypes,
    getSeaPassengerTypes,
    getTravelActivities,
    getTravelActivityDetail,
    getTravelSummary,
    rejectTravelActivity,
    submitTravelActivity,
    updateTravelActivity,
    verifyTravelActivity,
} from "./api";
import type {
    AirCabinClass,
    AirHaulType,
    AmendTravelActivityPayload,
    CarType,
    CarTypeCategory,
    CreateTravelActivityPayload,
    SeaPassengerType,
    TravelActivityEntry,
    TravelCategory,
    TravelFilterParams,
    TravelSummaryData,
    UpdateTravelActivityPayload,
} from "./types";

// ---------------------------------------------------------------------------
// TRAVEL ACTIVITY HOOKS
// ---------------------------------------------------------------------------

export function useTravelActivities(category: TravelCategory, filters?: TravelFilterParams) {
    return useQuery<TravelActivityEntry[], Error>({
        queryKey: ["scope3-travel-activities", category, filters],
        queryFn: () => getTravelActivities(category, filters),
    });
}

export function useTravelActivityDetail(activityId?: string) {
    return useQuery<TravelActivityEntry, Error>({
        queryKey: ["scope3-travel-detail", activityId],
        queryFn: () => getTravelActivityDetail(activityId!),
        enabled: Boolean(activityId),
    });
}

export function useTravelSummary(category: TravelCategory, reportingPeriodId?: string) {
    return useQuery<TravelSummaryData, Error>({
        queryKey: ["scope3-travel-summary", category, reportingPeriodId],
        queryFn: () => getTravelSummary(category, reportingPeriodId),
    });
}

export function useCreateTravelActivity() {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, CreateTravelActivityPayload>({
        mutationFn: createTravelActivity,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", variables.category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", variables.category] });
        },
    });
}

export function useUpdateTravelActivity() {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, { activityId: string; payload: UpdateTravelActivityPayload }>({
        mutationFn: ({ activityId, payload }) => updateTravelActivity(activityId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", data.category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", data.category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-detail", data.id] });
        },
    });
}

export function useDeleteTravelActivity(category: TravelCategory) {
    const queryClient = useQueryClient();
    return useMutation<boolean, Error, string>({
        mutationFn: deleteTravelActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", category] });
        },
    });
}

export function useSubmitTravelActivity(category: TravelCategory) {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, string>({
        mutationFn: submitTravelActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", category] });
        },
    });
}

export function useVerifyTravelActivity(category: TravelCategory) {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, string>({
        mutationFn: verifyTravelActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", category] });
        },
    });
}

export function useRejectTravelActivity(category: TravelCategory) {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, { activityId: string; reason: string }>({
        mutationFn: ({ activityId, reason }) => rejectTravelActivity(activityId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", category] });
        },
    });
}

export function useAmendTravelActivity() {
    const queryClient = useQueryClient();
    return useMutation<TravelActivityEntry, Error, { activityId: string; payload: AmendTravelActivityPayload }>({
        mutationFn: ({ activityId, payload }) => amendTravelActivity(activityId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-activities", data.category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-summary", data.category] });
            queryClient.invalidateQueries({ queryKey: ["scope3-travel-detail", data.id] });
        },
    });
}

// ---------------------------------------------------------------------------
// EMISSION FACTOR LOOKUP HOOKS
// ---------------------------------------------------------------------------

export function useCarTypeCategories() {
    return useQuery<CarTypeCategory[], Error>({
        queryKey: ["scope3-car-type-categories"],
        queryFn: getCarTypeCategories,
        staleTime: 1000 * 60 * 60,
    });
}

export function useCarTypes(activityCategory?: string) {
    return useQuery<CarType[], Error>({
        queryKey: ["scope3-car-types", activityCategory],
        queryFn: () => getCarTypes(activityCategory),
        staleTime: 1000 * 60 * 60,
    });
}

export function useAirHaulTypes() {
    return useQuery<AirHaulType[], Error>({
        queryKey: ["scope3-air-haul-types"],
        queryFn: getAirHaulTypes,
        staleTime: 1000 * 60 * 60,
    });
}

export function useAirCabinClasses() {
    return useQuery<AirCabinClass[], Error>({
        queryKey: ["scope3-air-cabin-classes"],
        queryFn: getAirCabinClasses,
        staleTime: 1000 * 60 * 60,
    });
}

export function useSeaPassengerTypes() {
    return useQuery<SeaPassengerType[], Error>({
        queryKey: ["scope3-sea-passenger-types"],
        queryFn: getSeaPassengerTypes,
        staleTime: 1000 * 60 * 60,
    });
}
