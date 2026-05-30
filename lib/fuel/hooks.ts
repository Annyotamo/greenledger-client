"use client";

import { useQuery } from "@tanstack/react-query";
import { getFuelCategories, getFuelsByCategory, getUnitsForFuel } from "./api";

export function useFuelCategories() {
    return useQuery({ queryKey: ["fuelCategories"], queryFn: getFuelCategories });
}

export function useFuels(categoryId?: string) {
    return useQuery({
        queryKey: ["fuels", categoryId],
        queryFn: () => getFuelsByCategory(categoryId ?? ""),
        enabled: Boolean(categoryId),
    });
}

export function useFuelUnits(fuelId?: string) {
    return useQuery({
        queryKey: ["fuelUnits", fuelId],
        queryFn: () => getUnitsForFuel(fuelId ?? ""),
        enabled: Boolean(fuelId),
    });
}
