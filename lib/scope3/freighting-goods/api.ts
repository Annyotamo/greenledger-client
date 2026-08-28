import { privateApi } from "@/lib/http/client";
import {
    DEFAULT_FREIGHTING_CATEGORIES,
    DEFAULT_FREIGHTING_FACTORS,
    DEFAULT_FREIGHTING_TYPES,
    FreightingGoodsFactor,
    FreightingGoodsType,
} from "./types";

export async function getFreightingGoodsCategories(): Promise<string[]> {
    try {
        const response = await privateApi.get<{
            success: boolean;
            data: string[];
        }>("/tenant/emission-factors/freighting-goods/categories");

        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback demo categories
    }
    return DEFAULT_FREIGHTING_CATEGORIES;
}

export async function getFreightingGoodsTypes(activityCategory?: string): Promise<FreightingGoodsType[]> {
    const url = `/tenant/emission-factors/freighting-goods/types${
        activityCategory ? `?activity_category=${encodeURIComponent(activityCategory)}` : ""
    }`;
    try {
        const response = await privateApi.get<{
            success: boolean;
            data: FreightingGoodsType[] | { items: FreightingGoodsType[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: FreightingGoodsType[] })?.items ?? [];

        if (Array.isArray(rawItems) && rawItems.length > 0) {
            return rawItems;
        }
    } catch {
        // Fallback demo types
    }
    if (activityCategory) {
        const filtered = DEFAULT_FREIGHTING_TYPES.filter((t) => t.activity_category === activityCategory);
        if (filtered.length > 0) return filtered;
    }
    return DEFAULT_FREIGHTING_TYPES;
}

export async function getFreightingGoodsFactors(
    freightingGoodsTypeId?: string,
    activityType?: string,
    vehicleType?: string,
    unitId?: string,
): Promise<FreightingGoodsFactor[]> {
    const params = new URLSearchParams();
    if (freightingGoodsTypeId) params.append("freighting_goods_type_id", freightingGoodsTypeId);
    if (activityType) params.append("activity_type", activityType);
    if (vehicleType) params.append("vehicle_type", vehicleType);
    if (unitId) params.append("unit_id", unitId);

    const qs = params.toString();
    const url = `/tenant/emission-factors/freighting-goods${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: FreightingGoodsFactor[] | { items: FreightingGoodsFactor[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: FreightingGoodsFactor[] })?.items ?? [];

        if (Array.isArray(rawItems) && rawItems.length > 0) {
            return rawItems;
        }
    } catch {
        // Fallback demo factors
    }

    if (freightingGoodsTypeId) {
        const matches = DEFAULT_FREIGHTING_FACTORS.filter((f) => f.freighting_goods_type_id === freightingGoodsTypeId);
        if (matches.length > 0) return matches;

        // If no direct factor matches the type ID, construct a safe fallback factor
        const typeItem = DEFAULT_FREIGHTING_TYPES.find((t) => t.id === freightingGoodsTypeId);
        if (typeItem) {
            return [
                {
                    id: `fallback-${typeItem.id}`,
                    freighting_goods_type_id: typeItem.id,
                    vehicle_type: typeItem.name,
                    unit_symbol: "tonne.km",
                    source_standard: "UK DEFRA",
                    factors: {
                        general: {
                            kg_co2e: "0.15000",
                            t_co2e: "0.00015000",
                            kg_co2: "0.14800",
                            t_co2: "0.00014800",
                        },
                    },
                },
            ];
        }
    }

    return DEFAULT_FREIGHTING_FACTORS;
}
