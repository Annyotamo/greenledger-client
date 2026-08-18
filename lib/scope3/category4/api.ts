import { privateApi } from "@/lib/http/client";
import { mapCategory1SpendItem } from "../category1/api";
import {
    AmendCategory4SpendPayload,
    Category4SpendDto,
    Category4SpendEntry,
    Category4SpendFilterParams,
    CreateCategory4SpendPayload,
    Scope3SpendFactor,
    Scope3SpendFactorDto,
    UpdateCategory4SpendPayload,
} from "./types";

// ---------------------------------------------------------------------------
// CATEGORY 4 SPEND ENDPOINTS
// ---------------------------------------------------------------------------

export async function getCategory4SpendEntries(
    filters?: Category4SpendFilterParams,
): Promise<Category4SpendEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period) params.append("reporting_period", filters.reporting_period);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.scope3_spend_emission_factor_id)
        params.append("scope3_spend_emission_factor_id", filters.scope3_spend_emission_factor_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.spend_year) params.append("spend_year", String(filters.spend_year));
    if (filters?.spend_date) params.append("spend_date", filters.spend_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category4/spend${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: Category4SpendDto[] | { items: Category4SpendDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category4SpendDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory1SpendItem) : [];
    } catch {
        return getMockCategory4SpendEntries();
    }
}

export async function getCategory4SpendEntry(activityId: string): Promise<Category4SpendEntry> {
    const response = await privateApi.get<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}`,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function createCategory4SpendEntry(
    payload: CreateCategory4SpendPayload,
): Promise<Category4SpendEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4SpendDto }>(
        "/tenant/scope3/category4/spend",
        payload,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function updateCategory4SpendEntry(
    activityId: string,
    payload: UpdateCategory4SpendPayload,
): Promise<Category4SpendEntry> {
    const response = await privateApi.patch<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}`,
        payload,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function deleteCategory4SpendEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category4/spend/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory4SpendEntry(activityId: string): Promise<Category4SpendEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}/submit`,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function verifyCategory4SpendEntry(activityId: string): Promise<Category4SpendEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}/verify`,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function rejectCategory4SpendEntry(
    activityId: string,
    reason: string,
): Promise<Category4SpendEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}/reject`,
        { reason },
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function amendCategory4SpendEntry(
    activityId: string,
    payload: AmendCategory4SpendPayload,
): Promise<Category4SpendEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4SpendDto }>(
        `/tenant/scope3/category4/spend/${activityId}/amend`,
        payload,
    );
    return mapCategory1SpendItem(response.data.data);
}

export async function getCategory4SpendFactors(sourceId?: string): Promise<Scope3SpendFactor[]> {
    const url = `/tenant/emission-factors/scope3/spend-factors${sourceId ? `?source_id=${sourceId}` : ""}`;
    try {
        const response = await privateApi.get<{ success: boolean; data: Scope3SpendFactorDto[] }>(url);
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data.map((dto) => ({
                id: dto.id,
                naicsCode: dto.naics_code || "484110",
                commodityTitle: dto.commodity_title || "General Freight Trucking, Local",
                naicsTitle: dto.naics_title || dto.commodity_title || "General Freight Trucking, Local",
                naicsSectorCategory: dto.naics_sector_category || "Transportation and Warehousing",
                category: dto.category || dto.naics_sector_category || "Transportation and Warehousing",
                kgCo2ePerUsdWithMargins: Number(dto.kg_co2e_per_usd_with_margins || 0.415),
                kgCo2ePerUsdWithoutMargins: Number(dto.kg_co2e_per_usd_without_margins || 0.320),
                marginKgCo2ePerUsd: Number(dto.margin_kg_co2e_per_usd || 0.095),
            }));
        }
    } catch {
        // Fallback demo freight transport spend factors
    }
    return [
        {
            id: "ca68b110-59ba-4c62-b841-270138cc06dd",
            naicsCode: "484110",
            commodityTitle: "General Freight Trucking, Local",
            naicsTitle: "General Freight Trucking, Local",
            naicsSectorCategory: "Transportation and Warehousing",
            category: "Transportation and Warehousing",
            kgCo2ePerUsdWithMargins: 0.4150,
            kgCo2ePerUsdWithoutMargins: 0.3200,
            marginKgCo2ePerUsd: 0.0950,
        },
        {
            id: "factor-freight-rail",
            naicsCode: "482110",
            commodityTitle: "Rail Transportation, Freight",
            naicsTitle: "Rail Transportation, Freight",
            naicsSectorCategory: "Transportation and Warehousing",
            category: "Transportation and Warehousing",
            kgCo2ePerUsdWithMargins: 0.2850,
            kgCo2ePerUsdWithoutMargins: 0.2300,
            marginKgCo2ePerUsd: 0.0550,
        },
        {
            id: "factor-freight-air",
            naicsCode: "481112",
            commodityTitle: "Scheduled Freight Air Transportation",
            naicsTitle: "Scheduled Freight Air Transportation",
            naicsSectorCategory: "Transportation and Warehousing",
            category: "Transportation and Warehousing",
            kgCo2ePerUsdWithMargins: 1.1200,
            kgCo2ePerUsdWithoutMargins: 0.9400,
            marginKgCo2ePerUsd: 0.1800,
        },
        {
            id: "factor-freight-water",
            naicsCode: "483111",
            commodityTitle: "Deep Sea Freight Transportation",
            naicsTitle: "Deep Sea Freight Transportation",
            naicsSectorCategory: "Transportation and Warehousing",
            category: "Transportation and Warehousing",
            kgCo2ePerUsdWithMargins: 0.1950,
            kgCo2ePerUsdWithoutMargins: 0.1600,
            marginKgCo2ePerUsd: 0.0350,
        },
        {
            id: "factor-warehousing",
            naicsCode: "493110",
            commodityTitle: "General Warehousing and Storage",
            naicsTitle: "General Warehousing and Storage",
            naicsSectorCategory: "Transportation and Warehousing",
            category: "Transportation and Warehousing",
            kgCo2ePerUsdWithMargins: 0.3100,
            kgCo2ePerUsdWithoutMargins: 0.2550,
            marginKgCo2ePerUsd: 0.0550,
        },
    ];
}

function getMockCategory4SpendEntries(): Category4SpendEntry[] {
    return [
        {
            id: "cat4-mock-1",
            createdAt: "2026-08-18T10:00:00.000Z",
            updatedAt: "2026-08-18T10:00:00.000Z",
            facilityId: null,
            facilityName: "Main Logistics Hub",
            reportingPeriod: "FY 2021-22",
            scope3SpendEmissionFactorId: "ca68b110-59ba-4c62-b841-270138cc06dd",
            factor: {
                id: "ca68b110-59ba-4c62-b841-270138cc06dd",
                naicsCode: "484110",
                commodityTitle: "General Freight Trucking, Local",
                naicsTitle: "General Freight Trucking, Local",
                naicsSectorCategory: "Transportation and Warehousing",
                category: "Transportation and Warehousing",
                kgCo2ePerUsdWithMargins: 0.4150,
                kgCo2ePerUsdWithoutMargins: 0.3200,
                marginKgCo2ePerUsd: 0.0950,
            },
            spendDate: "2021-12-09",
            spendInInr: 75000.0,
            spendYear: 2021,
            exchangeRateUsdToInr: 73.92,
            spendInUsd: 1014.61,
            calculatedKgCo2e: 421.06,
            calculatedKgCo2eWithoutMargins: 324.70,
            marginKgCo2e: 96.36,
            calculatedTCo2e: 0.4211,
            calculatedTCo2eWithoutMargins: 0.3247,
            marginTCo2e: 0.0964,
            status: "verified",
            notes: "Upstream freight transportation spend for raw materials delivery",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}
