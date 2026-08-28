import { privateApi } from "@/lib/http/client";
import { mapCategory4TransportActivity } from "../category4/api";
import {
    AmendCategory9TransportPayload,
    Category9SummaryRollup,
    Category9TransportActivityDto,
    Category9TransportActivityEntry,
    Category9TransportFilterParams,
    CreateCategory9TransportPayload,
    UpdateCategory9TransportPayload,
} from "./types";

export async function getCategory9TransportEntries(
    filters?: Category9TransportFilterParams,
): Promise<Category9TransportActivityEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.activity_category) params.append("activity_category", filters.activity_category);
    if (filters?.vehicle_type) params.append("vehicle_type", filters.vehicle_type);
    if (filters?.factor_group) params.append("factor_group", filters.factor_group);
    if (filters?.activity_date) params.append("activity_date", filters.activity_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category9/transport-activities${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: Category9TransportActivityDto[] | { items: Category9TransportActivityDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category9TransportActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory4TransportActivity) : [];
    } catch {
        return getMockCategory9TransportEntries();
    }
}

export async function getCategory9TransportSummary(
    filters?: Category9TransportFilterParams,
): Promise<Category9SummaryRollup> {
    const params = new URLSearchParams();
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);

    const qs = params.toString();
    const url = `/tenant/scope3/category9/transport-activities/summary${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{ success: boolean; data: Category9SummaryRollup }>(url);
        if (response.data.data) return response.data.data;
    } catch {
        // Fallback summary
    }
    return {
        total_records: 2,
        total_calculated_kg_co2e: 2650.0,
        total_calculated_t_co2e: 2.65,
        category_breakdown: [
            {
                activity_category: "Vans",
                total_records: 2,
                total_activity_value: 3200,
                total_kg_co2e: 2650.0,
                total_t_co2e: 2.65,
            },
        ],
    };
}

export async function getCategory9TransportEntry(activityId: string): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.get<{ success: boolean; data: Category9TransportActivityDto }>(
        `/tenant/scope3/category9/transport-activities/${activityId}`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function createCategory9TransportEntry(
    payload: CreateCategory9TransportPayload,
): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category9TransportActivityDto }>(
        "/tenant/scope3/category9/transport-activities",
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function updateCategory9TransportEntry(
    activityId: string,
    payload: UpdateCategory9TransportPayload,
): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.put<{ success: boolean; data: Category9TransportActivityDto }>(
        `/tenant/scope3/category9/transport-activities/${activityId}`,
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function deleteCategory9TransportEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category9/transport-activities/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory9TransportEntry(activityId: string): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category9TransportActivityDto }>(
        `/tenant/scope3/category9/transport-activities/${activityId}/submit`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function verifyCategory9TransportEntry(activityId: string): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category9TransportActivityDto }>(
        `/tenant/scope3/category9/transport-activities/${activityId}/verify`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function rejectCategory9TransportEntry(
    activityId: string,
    reason: string,
): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category9TransportActivityDto }>(
        `/tenant/scope3/category9/transport-activities/${activityId}/reject`,
        { reason },
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function amendCategory9TransportEntry(
    payload: AmendCategory9TransportPayload,
): Promise<Category9TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category9TransportActivityDto }>(
        "/tenant/scope3/category9/transport-activities/amend",
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

function getMockCategory9TransportEntries(): Category9TransportActivityEntry[] {
    return [
        {
            id: "cat9-mock-1",
            createdAt: "2026-08-28T17:23:14Z",
            updatedAt: "2026-08-28T17:23:14Z",
            facilityId: null,
            facilityName: "Distribution Warehouse B",
            reportingPeriodId: "015ab9bf-a162-42f0-8b8f-9f9286de5dab",
            reportingPeriodName: "FY 2025-26",
            freightingGoodsEmissionFactorId: "18f8e02d-05e8-4a94-916c-03d36b801a61",
            factorGroup: "diesel",
            activityDate: "2025-07-10",
            activityValue: 3200,
            description: "Outbound last-mile product delivery to retail outlets",
            appliedFactorKgCo2e: 0.60155,
            appliedFactorTCo2e: 0.00060155,
            calculatedKgCo2e: 1924.96,
            calculatedTCo2e: 1.92496,
            calculationDetails: "3200.0000 tonne.km of 'Class I (up to 1.305 tonnes)' [diesel] * 0.60155 kg CO2e/tonne.km = 1924.96 kg CO2e (1.92496 t CO2e)",
            status: "draft",
            notes: "Verified by dispatch invoice #99201",
            rejectedReason: null,
            isAmendment: false,
            amendedFromId: null,
            activityCategory: "Vans",
            vehicleType: "Class I (up to 1.305 tonnes)",
            unitSymbol: "tonne.km",
            sourceStandard: "UK DEFRA",
        },
    ];
}
