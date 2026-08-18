import { privateApi } from "@/lib/http/client";
import {
    AmendCategory5WastePayload,
    Category5FilterParams,
    Category5WasteActivityDto,
    Category5WasteActivityEntry,
    CreateCategory5WastePayload,
    DEFAULT_WASTE_TYPES,
    TREATMENT_METHOD_LABELS,
    UpdateCategory5WastePayload,
    WasteType,
} from "./types";

// ---------------------------------------------------------------------------
// DTO MAPPER
// ---------------------------------------------------------------------------

export function mapCategory5WasteItem(dto: Category5WasteActivityDto): Category5WasteActivityEntry {
    const tonnes = Number(dto.waste_generated_tonnes || 0);
    const appliedKg = dto.applied_kg_co2e_per_tonne != null ? Number(dto.applied_kg_co2e_per_tonne) : 925.34348;

    const calcKg = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : tonnes * appliedKg;
    const calcT = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : calcKg / 1000;

    const method = dto.treatment_method || "landfill";
    const methodLabel = dto.treatment_method_label || TREATMENT_METHOD_LABELS[method] || "Landfill Disposal";

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriod: dto.reporting_period || "FY 2021-22",
        wasteTypeId: dto.waste_type_id,
        wasteTypeName: dto.waste_type_name || "Wood & Construction Timber",
        categoryName: dto.category_name || "Construction",
        treatmentMethod: method,
        treatmentMethodLabel: methodLabel,
        activityDate: dto.activity_date,
        wasteGeneratedTonnes: tonnes,
        appliedKgCo2ePerTonne: appliedKg,
        calculatedKgCo2e: calcKg,
        calculatedTCo2e: calcT,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,
    };
}

// ---------------------------------------------------------------------------
// 6.1 LOOKUPS
// ---------------------------------------------------------------------------

export async function getWasteTypes(category?: string): Promise<WasteType[]> {
    const url = `/tenant/scope3/category5/waste-types${category ? `?category=${encodeURIComponent(category)}` : ""}`;
    try {
        const response = await privateApi.get<{ success: boolean; data: WasteType[] }>(url);
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback demo waste types
    }
    if (category) {
        return DEFAULT_WASTE_TYPES.filter((w) => w.category_name === category);
    }
    return DEFAULT_WASTE_TYPES;
}

export async function getWasteTypeDetail(wasteTypeId: string): Promise<WasteType> {
    try {
        const response = await privateApi.get<{ success: boolean; data: WasteType }>(
            `/tenant/scope3/category5/waste-types/${wasteTypeId}`,
        );
        if (response.data.data) return response.data.data;
    } catch {
        // Fallback search
    }
    return DEFAULT_WASTE_TYPES.find((w) => w.waste_type_id === wasteTypeId) ?? DEFAULT_WASTE_TYPES[0];
}

// ---------------------------------------------------------------------------
// 6.2 WASTE ACTIVITY CRUD & LIFECYCLE ENDPOINTS
// ---------------------------------------------------------------------------

export async function getCategory5WasteEntries(
    filters?: Category5FilterParams,
): Promise<Category5WasteActivityEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period) params.append("reporting_period", filters.reporting_period);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.activity_date) params.append("activity_date", filters.activity_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category5/waste${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: Category5WasteActivityDto[] | { items: Category5WasteActivityDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category5WasteActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory5WasteItem) : [];
    } catch {
        return getMockCategory5WasteEntries();
    }
}

export async function createCategory5WasteEntry(
    payload: CreateCategory5WastePayload,
): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category5WasteActivityDto }>(
        "/tenant/scope3/category5/waste",
        payload,
    );
    return mapCategory5WasteItem(response.data.data);
}

export async function updateCategory5WasteEntry(
    activityId: string,
    payload: UpdateCategory5WastePayload,
): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.patch<{ success: boolean; data: Category5WasteActivityDto }>(
        `/tenant/scope3/category5/waste/${activityId}`,
        payload,
    );
    return mapCategory5WasteItem(response.data.data);
}

export async function deleteCategory5WasteEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category5/waste/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory5WasteEntry(activityId: string): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category5WasteActivityDto }>(
        `/tenant/scope3/category5/waste/${activityId}/submit`,
    );
    return mapCategory5WasteItem(response.data.data);
}

export async function verifyCategory5WasteEntry(activityId: string): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category5WasteActivityDto }>(
        `/tenant/scope3/category5/waste/${activityId}/verify`,
    );
    return mapCategory5WasteItem(response.data.data);
}

export async function rejectCategory5WasteEntry(
    activityId: string,
    reason: string,
): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category5WasteActivityDto }>(
        `/tenant/scope3/category5/waste/${activityId}/reject`,
        { reason },
    );
    return mapCategory5WasteItem(response.data.data);
}

export async function amendCategory5WasteEntry(
    activityId: string,
    payload: AmendCategory5WastePayload,
): Promise<Category5WasteActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category5WasteActivityDto }>(
        `/tenant/scope3/category5/waste/${activityId}/amend`,
        payload,
    );
    return mapCategory5WasteItem(response.data.data);
}

// ---------------------------------------------------------------------------
// FALLBACK MOCK DATASETS
// ---------------------------------------------------------------------------

function getMockCategory5WasteEntries(): Category5WasteActivityEntry[] {
    return [
        {
            id: "cat5-mock-1",
            createdAt: "2026-08-18T10:00:00.000Z",
            updatedAt: "2026-08-18T10:00:00.000Z",
            facilityId: null,
            facilityName: "Plant Site A Construction Yard",
            reportingPeriod: "FY 2021-22",
            wasteTypeId: "faa2ea7e-1fe8-46e4-a349-68562c882cf8",
            wasteTypeName: "Wood & Construction Timber",
            categoryName: "Construction",
            treatmentMethod: "landfill",
            treatmentMethodLabel: "Landfill Disposal",
            activityDate: "2021-12-09",
            wasteGeneratedTonnes: 10.5,
            appliedKgCo2ePerTonne: 925.34348,
            calculatedKgCo2e: 9716.10654,
            calculatedTCo2e: 9.716107,
            status: "verified",
            notes: "10.5 tonnes of construction wood waste sent to landfill",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}
