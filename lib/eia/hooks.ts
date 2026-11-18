"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getEiaAirPresets,
    computeEiaAirMetrics,
    getEiaAirDisclosure,
    saveEiaAirDisclosure,
    exportEiaAirExcel,
} from "./api";
import type {
    EIAStackPresetsData,
    EIAAirEmissionsPayload,
    EIAAirEmissionsComputedData,
} from "./types";

// ==========================================
// EIA PRESETS HOOK
// ==========================================

export function useEiaAirPresets() {
    return useQuery<EIAStackPresetsData, Error>({
        queryKey: ["eia-air-presets"],
        queryFn: getEiaAirPresets,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

// ==========================================
// EIA AIR DISCLOSURE HOOK
// ==========================================

export function useEiaAirDisclosure(
    reportingPeriodId: string | null | undefined,
    facilityId?: string | null,
) {
    return useQuery<EIAAirEmissionsComputedData | null, Error>({
        queryKey: ["eia-air-disclosure", reportingPeriodId, facilityId],
        queryFn: () => getEiaAirDisclosure(reportingPeriodId!, facilityId),
        enabled: !!reportingPeriodId,
        staleTime: 30 * 1000,
    });
}

// ==========================================
// COMPUTE METRICS MUTATION HOOK (ON-THE-FLY MATH)
// ==========================================

export function useComputeEiaAir() {
    return useMutation<EIAAirEmissionsComputedData, Error, EIAAirEmissionsPayload>({
        mutationFn: (payload) => computeEiaAirMetrics(payload),
    });
}

// ==========================================
// SAVE DISCLOSURE MUTATION HOOK
// ==========================================

export function useSaveEiaAirDisclosure() {
    const queryClient = useQueryClient();

    return useMutation<EIAAirEmissionsComputedData, Error, EIAAirEmissionsPayload>({
        mutationFn: (payload) => saveEiaAirDisclosure(payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["eia-air-disclosure", variables.reporting_period_id, variables.facility_id],
            });
        },
    });
}

// ==========================================
// EXCEL EXPORT MUTATION HOOK
// ==========================================

export function useExportEiaAirExcel() {
    return useMutation<Blob, Error, EIAAirEmissionsPayload>({
        mutationFn: (payload) => exportEiaAirExcel(payload),
    });
}
