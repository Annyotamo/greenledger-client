"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreightingGoodsCategories, getFreightingGoodsFactors, getFreightingGoodsTypes } from "./api";
import { FreightingGoodsFactor, FreightingGoodsType } from "./types";

export function useFreightingGoodsCategories() {
    return useQuery<string[], Error>({
        queryKey: ["freighting-goods-categories"],
        queryFn: getFreightingGoodsCategories,
        staleTime: 1000 * 60 * 30,
    });
}

export function useFreightingGoodsTypes(activityCategory?: string) {
    return useQuery<FreightingGoodsType[], Error>({
        queryKey: ["freighting-goods-types", activityCategory],
        queryFn: () => getFreightingGoodsTypes(activityCategory),
        staleTime: 1000 * 60 * 30,
    });
}

export function useFreightingGoodsFactors(
    freightingGoodsTypeId?: string,
    activityType?: string,
    vehicleType?: string,
    unitId?: string,
) {
    return useQuery<FreightingGoodsFactor[], Error>({
        queryKey: ["freighting-goods-factors", freightingGoodsTypeId, activityType, vehicleType, unitId],
        queryFn: () => getFreightingGoodsFactors(freightingGoodsTypeId, activityType, vehicleType, unitId),
        staleTime: 1000 * 60 * 30,
    });
}
