"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getBrsrSectionA,
    saveBrsrSectionA,
    getBrsrSectionB,
    saveBrsrSectionB,
    getBrsrSectionC,
    saveBrsrSectionC,
    getBrsrStatutoryDisclosure,
    saveBrsrStatutoryDisclosure,
    getBrsrWaterDisclosure,
    saveBrsrWaterDisclosure,
    getBrsrWasteDisclosure,
    saveBrsrWasteDisclosure,
    getBrsrAirDisclosure,
    saveBrsrAirDisclosure,
    getBrsrEnergyConsumption,
    getBrsrAirStackPresets,
    getBrsrConsolidatedDashboard,
} from "./api";
import type {
    BRSRSectionAData,
    BRSRSectionBData,
    BRSRSectionCData,
    BRSRStatutoryDisclosureData,
    BRSRWaterDisclosureSaveInput,
    BRSRWaterDisclosureData,
    BRSRWasteDisclosureSaveInput,
    BRSRWasteDisclosureData,
    BRSRAirDisclosureSaveInput,
    BRSRAirDisclosureData,
    BRSRConsolidatedDashboardData,
    BrsrEnergyConsumptionData,
    BrsrAirStackPresetsData,
} from "./types";

// ==========================================
// CONSOLIDATED DASHBOARD HOOK
// ==========================================

export function useBrsrConsolidatedDashboard(reportingPeriodId: string | null | undefined) {
    return useQuery<BRSRConsolidatedDashboardData | null, Error>({
        queryKey: ["brsr-consolidated-dashboard", reportingPeriodId],
        queryFn: () => getBrsrConsolidatedDashboard(reportingPeriodId!),
        enabled: !!reportingPeriodId,
        staleTime: 30 * 1000,
    });
}

// ==========================================
// SECTION A HOOKS
// ==========================================

export function useBrsrSectionA(reportingPeriodId: string | null | undefined) {
    return useQuery<BRSRSectionAData | null, Error>({
        queryKey: ["brsr-section-a", reportingPeriodId],
        queryFn: () => getBrsrSectionA(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrSectionA() {
    const queryClient = useQueryClient();
    return useMutation<BRSRSectionAData, Error, BRSRSectionAData>({
        mutationFn: saveBrsrSectionA,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-section-a", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// SECTION B HOOKS
// ==========================================

export function useBrsrSectionB(reportingPeriodId: string | null | undefined) {
    return useQuery<BRSRSectionBData | null, Error>({
        queryKey: ["brsr-section-b", reportingPeriodId],
        queryFn: () => getBrsrSectionB(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrSectionB() {
    const queryClient = useQueryClient();
    return useMutation<BRSRSectionBData, Error, BRSRSectionBData>({
        mutationFn: saveBrsrSectionB,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-section-b", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// SECTION C (P1-P5, P7-P9) HOOKS
// ==========================================

export function useBrsrSectionC(reportingPeriodId: string | null | undefined) {
    return useQuery<BRSRSectionCData | null, Error>({
        queryKey: ["brsr-section-c", reportingPeriodId],
        queryFn: () => getBrsrSectionC(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrSectionC() {
    const queryClient = useQueryClient();
    return useMutation<BRSRSectionCData, Error, BRSRSectionCData>({
        mutationFn: saveBrsrSectionC,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-section-c", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// PRINCIPLE 6 STATUTORY DISCLOSURES HOOKS
// ==========================================

export function useBrsrStatutoryDisclosure(reportingPeriodId: string | null | undefined) {
    return useQuery<BRSRStatutoryDisclosureData | null, Error>({
        queryKey: ["brsr-statutory-disclosure", reportingPeriodId],
        queryFn: () => getBrsrStatutoryDisclosure(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrStatutoryDisclosure() {
    const queryClient = useQueryClient();
    return useMutation<BRSRStatutoryDisclosureData, Error, BRSRStatutoryDisclosureData>({
        mutationFn: saveBrsrStatutoryDisclosure,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-statutory-disclosure", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// PRINCIPLE 6 WATER HOOKS
// ==========================================

export function useBrsrWaterDisclosure(reportingPeriodIdOrPayload: string | BRSRWaterDisclosureSaveInput) {
    const reportingPeriodId = typeof reportingPeriodIdOrPayload === "string"
        ? reportingPeriodIdOrPayload
        : reportingPeriodIdOrPayload?.reporting_period_id;

    return useQuery<BRSRWaterDisclosureData | null, Error>({
        queryKey: ["brsr-water-disclosure", reportingPeriodId],
        queryFn: () => getBrsrWaterDisclosure(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrWaterDisclosure() {
    const queryClient = useQueryClient();
    return useMutation<BRSRWaterDisclosureData, Error, BRSRWaterDisclosureSaveInput>({
        mutationFn: saveBrsrWaterDisclosure,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-water-disclosure", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// PRINCIPLE 6 WASTE HOOKS
// ==========================================

export function useBrsrWasteDisclosure(reportingPeriodIdOrPayload: string | BRSRWasteDisclosureSaveInput) {
    const reportingPeriodId = typeof reportingPeriodIdOrPayload === "string"
        ? reportingPeriodIdOrPayload
        : reportingPeriodIdOrPayload?.reporting_period_id;

    return useQuery<BRSRWasteDisclosureData | null, Error>({
        queryKey: ["brsr-waste-disclosure", reportingPeriodId],
        queryFn: () => getBrsrWasteDisclosure(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrWasteDisclosure() {
    const queryClient = useQueryClient();
    return useMutation<BRSRWasteDisclosureData, Error, BRSRWasteDisclosureSaveInput>({
        mutationFn: saveBrsrWasteDisclosure,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-waste-disclosure", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

// ==========================================
// PRINCIPLE 6 AIR HOOKS
// ==========================================

export function useBrsrAirDisclosure(reportingPeriodIdOrPayload: string | BRSRAirDisclosureSaveInput) {
    const reportingPeriodId = typeof reportingPeriodIdOrPayload === "string"
        ? reportingPeriodIdOrPayload
        : reportingPeriodIdOrPayload?.reporting_period_id;

    return useQuery<BRSRAirDisclosureData | null, Error>({
        queryKey: ["brsr-air-disclosure", reportingPeriodId],
        queryFn: () => getBrsrAirDisclosure(reportingPeriodId!),
        enabled: !!reportingPeriodId,
    });
}

export function useSaveBrsrAirDisclosure() {
    const queryClient = useQueryClient();
    return useMutation<BRSRAirDisclosureData, Error, BRSRAirDisclosureSaveInput>({
        mutationFn: saveBrsrAirDisclosure,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["brsr-air-disclosure", data.reporting_period_id] });
            queryClient.invalidateQueries({ queryKey: ["brsr-consolidated-dashboard", data.reporting_period_id] });
        },
    });
}

export function useBrsrAirStackPresets() {
    return useQuery<BrsrAirStackPresetsData, Error>({
        queryKey: ["brsr-air-stack-presets"],
        queryFn: getBrsrAirStackPresets,
        staleTime: 5 * 60 * 1000,
    });
}

// ==========================================
// PRINCIPLE 6 ENERGY HOOK
// ==========================================

export function useBrsrEnergyConsumption(payload: {
    start_date: string | null;
    end_date: string | null;
    turnover_inr: number | null;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_tonnes?: number | null;
    physical_output_unit?: string | null;
}) {
    return useQuery<BrsrEnergyConsumptionData, Error>({
        queryKey: ["brsr-energy-consumption", payload],
        queryFn: () =>
            getBrsrEnergyConsumption({
                start_date: payload.start_date!,
                end_date: payload.end_date!,
                turnover_inr: payload.turnover_inr!,
                ppp_conversion_factor: payload.ppp_conversion_factor,
                physical_output: payload.physical_output,
                physical_output_tonnes: payload.physical_output_tonnes,
                physical_output_unit: payload.physical_output_unit,
            }),
        enabled: !!payload.start_date && !!payload.end_date && !!payload.turnover_inr,
    });
}
