"use client";

import { useQuery } from "@tanstack/react-query";
import { getEnergyDashboard, getGhgDashboard } from "./api";
import type { ParsedEnergyDashboardData, ParsedGhgDashboardData, GhgDashboardQueryParams } from "./types";

export function useEnergyDashboard() {
    return useQuery<ParsedEnergyDashboardData, Error>({
        queryKey: ["tenant-energy-dashboard"],
        queryFn: getEnergyDashboard,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useGhgDashboard(params?: GhgDashboardQueryParams) {
    return useQuery<ParsedGhgDashboardData, Error>({
        queryKey: ["tenant-ghg-dashboard", params],
        queryFn: () => getGhgDashboard(params),
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

