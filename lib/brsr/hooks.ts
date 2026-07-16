"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrsrEnergyConsumption, postBrsrWaterDisclosure, postBrsrWasteDisclosure } from "./api";
import type { BrsrEnergyConsumptionData, BrsrWaterDisclosurePayload, BrsrWaterDisclosureData, BrsrWasteDisclosurePayload, BrsrWasteDisclosureData } from "./types";

export function useBrsrEnergyConsumption(payload: {
    start_date: string | null;
    end_date: string | null;
    turnover_inr: number | null;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
}) {
    return useQuery<BrsrEnergyConsumptionData, Error>({
        queryKey: ["brsr-energy-consumption", payload],
        queryFn: () => getBrsrEnergyConsumption({
            start_date: payload.start_date!,
            end_date: payload.end_date!,
            turnover_inr: payload.turnover_inr!,
            ppp_conversion_factor: payload.ppp_conversion_factor,
            physical_output: payload.physical_output,
            physical_output_unit: payload.physical_output_unit,
        }),
        enabled: !!payload.start_date && !!payload.end_date && !!payload.turnover_inr,
    });
}

export function useBrsrWaterDisclosure(payload: BrsrWaterDisclosurePayload) {
    return useQuery<BrsrWaterDisclosureData, Error>({
        queryKey: ["brsr-water-disclosure", payload],
        queryFn: () => postBrsrWaterDisclosure(payload),
        enabled: !!payload.financial_year_label && payload.turnover_inr > 0,
    });
}

export function useBrsrWasteDisclosure(payload: BrsrWasteDisclosurePayload) {
    return useQuery<BrsrWasteDisclosureData, Error>({
        queryKey: ["brsr-waste-disclosure", payload],
        queryFn: () => postBrsrWasteDisclosure(payload),
        enabled: !!payload.financial_year_label && payload.turnover_inr > 0,
    });
}
