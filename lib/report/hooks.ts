"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getScope1Dashboard,
    getScope1EmissionsOverlayDropdownData,
    getScope1IngestedRecords,
    getScope1Reports,
    getScope2IngestedRecords,
    getScope2Reports,
    ingestScope1Emission,
    ingestScope2Emission,
    getScope1Activities,
    createScope1Activity,
    getScope2EnergyActivities,
    createScope2EnergyActivity,
    getEmissionFactorSources,
    getFuelCategories,
    getFuels,
    getFuelUnits,
    getFacilities,
    type Scope1Activity,
    type CreateScope1ActivityRequest,
    type Scope2EnergyActivity,
    type CreateScope2EnergyActivityRequest,
    type EmissionFactorSource,
    type FuelCategory,
    type Fuel,
    type QuantityUnit,
    type Facility,
} from "@/lib/report/api";
import type {
    Scope1DashboardData,
    Scope1EmissionsOverlayDropdownData,
    Scope1IngestRecord,
    Scope1IngestRequest,
    Scope1ReportRecord,
    Scope2ActivityDataIngest,
    Scope2IngestRequest,
    Scope2ReportRecord,
} from "@/types/report";

export function useScope1ReportsQuery() {
    return useQuery<Scope1ReportRecord[], unknown, Scope1ReportRecord[]>({
        queryKey: ["reports", "scope1"],
        queryFn: getScope1Reports,
        staleTime: 60_000,
    });
}

export function useIngestScope1EmissionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Scope1IngestRequest) => ingestScope1Emission(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", "scope1"] });
            queryClient.invalidateQueries({ queryKey: ["scope1", "ingested-records"] });
        },
    });
}

export function useScope1EmissionsOverlayDropdownQuery(enabled = true) {
    return useQuery<Scope1EmissionsOverlayDropdownData, unknown, Scope1EmissionsOverlayDropdownData>({
        queryKey: ["scope1", "emissions-overlay", "dropdown"],
        queryFn: getScope1EmissionsOverlayDropdownData,
        staleTime: 5 * 60_000,
        enabled,
    });
}

export function useScope1DashboardQuery(startMonth: string, endMonth: string, enabled = true) {
    return useQuery<Scope1DashboardData | null, unknown, Scope1DashboardData | null>({
        queryKey: ["scope1", "dashboard", startMonth, endMonth],
        queryFn: () => getScope1Dashboard(startMonth, endMonth),
        staleTime: 60_000,
        enabled,
    });
}

export function useScope1IngestedRecordsQuery() {
    return useQuery<Scope1IngestRecord[], unknown, Scope1IngestRecord[]>({
        queryKey: ["scope1", "ingested-records"],
        queryFn: getScope1IngestedRecords,
        staleTime: 60_000,
    });
}

export function useScope2ReportsQuery() {
    return useQuery<Scope2ReportRecord[], unknown, Scope2ReportRecord[]>({
        queryKey: ["reports", "scope2"],
        queryFn: getScope2Reports,
        staleTime: 60_000,
    });
}

export function useIngestScope2EmissionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Scope2IngestRequest) => ingestScope2Emission(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", "scope2"] });
            queryClient.invalidateQueries({ queryKey: ["scope2", "ingested-records"] });
        },
    });
}

export function useScope2IngestedRecordsQuery() {
    return useQuery<Scope2ActivityDataIngest[], unknown, Scope2ActivityDataIngest[]>({
        queryKey: ["scope2", "ingested-records"],
        queryFn: getScope2IngestedRecords,
        staleTime: 60_000,
    });
}

// Scope 1 Activities Hooks
export function useScope1ActivitiesQuery() {
    return useQuery<Scope1Activity[], unknown, Scope1Activity[]>({
        queryKey: ["scope1", "activities"],
        queryFn: getScope1Activities,
        staleTime: 60_000,
    });
}

export function useCreateScope1ActivityMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateScope1ActivityRequest) => createScope1Activity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope1", "activities"] });
        },
    });
}

export function useScope2EnergyActivitiesQuery() {
    return useQuery<Scope2EnergyActivity[], unknown, Scope2EnergyActivity[]>({
        queryKey: ["scope2", "energy-activities"],
        queryFn: getScope2EnergyActivities,
        staleTime: 60_000,
    });
}

export function useCreateScope2EnergyActivityMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateScope2EnergyActivityRequest) => createScope2EnergyActivity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scope2", "energy-activities"] });
        },
    });
}

export function useEmissionFactorSourcesQuery(enabled = true) {
    return useQuery<EmissionFactorSource[], unknown, EmissionFactorSource[]>({
        queryKey: ["emission-factor-sources"],
        queryFn: getEmissionFactorSources,
        staleTime: 5 * 60_000,
        enabled,
    });
}

export function useFuelCategoriesQuery(enabled = true) {
    return useQuery<FuelCategory[], unknown, FuelCategory[]>({
        queryKey: ["fuel-categories"],
        queryFn: getFuelCategories,
        staleTime: 5 * 60_000,
        enabled,
    });
}

export function useFuelsQuery(categoryId?: string, enabled = true) {
    return useQuery<Fuel[], unknown, Fuel[]>({
        queryKey: ["fuels", categoryId],
        queryFn: () => getFuels(categoryId),
        staleTime: 5 * 60_000,
        enabled: enabled && !!categoryId,
    });
}

export function useFuelUnitsQuery(fuelId?: string, enabled = true) {
    return useQuery<QuantityUnit[], unknown, QuantityUnit[]>({
        queryKey: ["fuel-units", fuelId],
        queryFn: () => getFuelUnits(fuelId!),
        staleTime: 5 * 60_000,
        enabled: enabled && !!fuelId,
    });
}

export function useFacilitiesQuery(enabled = true) {
    return useQuery<Facility[], unknown, Facility[]>({
        queryKey: ["facilities"],
        queryFn: getFacilities,
        staleTime: 5 * 60_000,
        enabled,
    });
}
