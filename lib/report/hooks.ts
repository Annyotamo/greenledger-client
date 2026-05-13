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
