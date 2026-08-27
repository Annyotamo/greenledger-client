"use client";

import { useQuery } from "@tanstack/react-query";
import { getFuelCategories, getFuels, getUnitsForFuel, FuelQueryType } from "./api";

export function useFuelCategories(type: FuelQueryType = "FUEL", sourceId?: string, wtt: boolean = false) {
    return useQuery({
        queryKey: ["fuelCategories", type, sourceId, wtt],
        queryFn: () => getFuelCategories(type, sourceId, wtt),
    });
}

export function useFuels(type: FuelQueryType = "FUEL", categoryId?: string, sourceId?: string) {
    return useQuery({
        queryKey: ["fuels", type, categoryId, sourceId],
        queryFn: () => getFuels(type, categoryId, sourceId),
        enabled: Boolean(categoryId),
    });
}

export function useFuelUnits(fuelId?: string, customFuel?: boolean) {
    return useQuery({
        queryKey: ["fuelUnits", fuelId, customFuel],
        queryFn: () => getUnitsForFuel(fuelId ?? "", customFuel),
        enabled: Boolean(fuelId),
    });
}
