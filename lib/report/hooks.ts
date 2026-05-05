"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getScope1EmissionsOverlayDropdownData,
    getScope1Reports,
    getScope2Reports,
    ingestScope1Emission,
    ingestScope2Emission,
} from "@/lib/report/api";
import type {
    Scope1EmissionsOverlayDropdownData,
    Scope1IngestRequest,
    Scope1ReportRecord,
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
        },
    });
}
