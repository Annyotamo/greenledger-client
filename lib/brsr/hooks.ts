"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrsrEnergyConsumption } from "./api";
import type { BrsrEnergyConsumptionData } from "./types";

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
