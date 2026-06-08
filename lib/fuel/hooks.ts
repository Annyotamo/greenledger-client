"use client";

import { useQuery } from "@tanstack/react-query";
import { getFuelCategories, getFuels, getUnitsForFuel, FuelQueryType } from "./api";

export function useFuelCategories(type: FuelQueryType = "FUEL") {
    return useQuery({ queryKey: ["fuelCategories", type], queryFn: () => getFuelCategories(type) });
}

export function useFuels(type: FuelQueryType = "FUEL", categoryId?: string) {
    return useQuery({
        queryKey: ["fuels", type, categoryId],
        queryFn: () => getFuels(type, categoryId),
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
