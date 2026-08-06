"use client";

import { useQuery } from "@tanstack/react-query";
import { getEnergyDashboard } from "./api";
import type { ParsedEnergyDashboardData } from "./types";

export function useEnergyDashboard() {
    return useQuery<ParsedEnergyDashboardData, Error>({
        queryKey: ["tenant-energy-dashboard"],
        queryFn: getEnergyDashboard,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
