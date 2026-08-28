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

type RawWasteTypeItem = Partial<WasteType> & {
    id?: string;
    name?: string;
    title?: string;
    waste_id?: string;
    waste_name?: string;
    category?: string;
    category_title?: string;
    unit?: string;
    treatment_factors?: unknown;
    methods?: unknown;
};

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

    const periodId = dto.reporting_period_id || null;
    const periodName = dto.reporting_period_name || dto.reporting_period || "FY 2024-25";

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriodId: periodId,
        reportingPeriodName: periodName,
        reportingPeriod: periodName,
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
        const response = await privateApi.get<{ success: boolean; data: WasteType[] | { items: WasteType[] } }>(url);
        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? (dataPayload as RawWasteTypeItem[])
            : (dataPayload as { items?: RawWasteTypeItem[] })?.items ?? [];

        if (Array.isArray(rawItems) && rawItems.length > 0) {
            return rawItems.map((item: RawWasteTypeItem) => ({
                waste_type_id: item.waste_type_id || item.id || item.waste_id || "",
                waste_type_name: item.waste_type_name || item.name || item.title || item.waste_name || "Unknown Waste Material",
                category_name: item.category_name || item.category || item.category_title || "General Waste",
                unit_symbol: item.unit_symbol || item.unit || "tonnes",
                treatment_methods: (item.treatment_methods || item.treatment_factors || item.methods || []) as WasteType["treatment_methods"],
            }));
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
        const raw = response.data.data as RawWasteTypeItem | undefined;
        if (raw) {
            return {
                waste_type_id: raw.waste_type_id || raw.id || wasteTypeId,
                waste_type_name: raw.waste_type_name || raw.name || raw.title || "Waste Material",
                category_name: raw.category_name || raw.category || "General Waste",
                unit_symbol: raw.unit_symbol || raw.unit || "tonnes",
                treatment_methods: (raw.treatment_methods || raw.treatment_factors || raw.methods || []) as WasteType["treatment_methods"],
            };
        }
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
    if (filters?.reporting_period_id) {
        params.append("reporting_period_id", filters.reporting_period_id);
    } else if (filters?.reporting_period) {
        params.append("reporting_period_id", filters.reporting_period);
    }
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
            reportingPeriodId: "091f03f3-2470-4f51-b845-a7b3cba14d33",
            reportingPeriodName: "FY 2024-25",
            reportingPeriod: "FY 2024-25",
            wasteTypeId: "faa2ea7e-1fe8-46e4-a349-68562c882cf8",
            wasteTypeName: "Wood & Construction Timber",
            categoryName: "Construction",
            treatmentMethod: "landfill",
            treatmentMethodLabel: "Landfill Disposal",
            activityDate: "2024-11-15",
            wasteGeneratedTonnes: 10.5,
            appliedKgCo2ePerTonne: 925.34348,
            calculatedKgCo2e: 9716.10654,
            calculatedTCo2e: 9.716107,
            status: "draft",
            notes: "10.5 tonnes of construction wood waste sent to landfill",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}
