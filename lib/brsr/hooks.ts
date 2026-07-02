"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrsrEnergyConsumption, postBrsrWaterDisclosure, postBrsrWasteDisclosure } from "./api";
import type { BrsrEnergyConsumptionData, BrsrWaterDisclosurePayload, BrsrWaterDisclosureData, BrsrWasteDisclosurePayload, BrsrWasteDisclosureData } from "./types";

export function useBrsrEnergyConsumption(
    startDate?: string | null,
    endDate?: string | null,
    turnoverInr?: number | null,
) {
    return useQuery<BrsrEnergyConsumptionData, Error>({
        queryKey: ["brsr-energy-consumption", { startDate, endDate, turnoverInr }],
        queryFn: () => getBrsrEnergyConsumption(startDate, endDate, turnoverInr),
    });
}

export function useBrsrWaterDisclosure(payload: BrsrWaterDisclosurePayload) {
    return useQuery<BrsrWaterDisclosureData, Error>({
        queryKey: ["brsr-water-disclosure", payload],
        queryFn: () => postBrsrWaterDisclosure(payload),
    });
}

export function useBrsrWasteDisclosure(payload: BrsrWasteDisclosurePayload) {
    return useQuery<BrsrWasteDisclosureData, Error>({
        queryKey: ["brsr-waste-disclosure", payload],
        queryFn: () => postBrsrWasteDisclosure(payload),
    });
}
