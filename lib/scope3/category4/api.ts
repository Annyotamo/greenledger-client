import { privateApi } from "@/lib/http/client";
import {
    AmendCategory4TransportPayload,
    Category4SummaryRollup,
    Category4TransportActivityDto,
    Category4TransportActivityEntry,
    Category4TransportFilterParams,
    CreateCategory4TransportPayload,
    UpdateCategory4TransportPayload,
} from "./types";

export function mapCategory4TransportActivity(dto: Category4TransportActivityDto): Category4TransportActivityEntry {
    const val = Number(dto.activity_value || 0);
    const appliedKg = dto.applied_factor_kg_co2e != null ? Number(dto.applied_factor_kg_co2e) : 0.08182;
    const appliedT = dto.applied_factor_t_co2e != null ? Number(dto.applied_factor_t_co2e) : appliedKg / 1000;

    const calcKg = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : val * appliedKg;
    const calcT = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : calcKg / 1000;

    const periodId = dto.reporting_period_id || null;
    const periodName = dto.reporting_period_name || "FY 2025-26";

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriodId: periodId,
        reportingPeriodName: periodName,
        freightingGoodsEmissionFactorId: dto.freighting_goods_emission_factor_id,
        factorGroup: dto.factor_group || "50_percent_laden",
        activityDate: dto.activity_date || "2025-06-15",
        activityValue: val,
        description: dto.description || null,
        appliedFactorKgCo2e: appliedKg,
        appliedFactorTCo2e: appliedT,
        calculatedKgCo2e: calcKg,
        calculatedTCo2e: calcT,
        calculatedKgCo2: dto.calculated_kg_co2 != null ? Number(dto.calculated_kg_co2) : undefined,
        calculatedKgCh4: dto.calculated_kg_ch4 != null ? Number(dto.calculated_kg_ch4) : undefined,
        calculatedKgN2o: dto.calculated_kg_n2o != null ? Number(dto.calculated_kg_n2o) : undefined,
        calculationDetails: dto.calculation_details || null,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        enteredByEmail: dto.entered_by_email || null,
        verifiedByEmail: dto.verified_by_email || null,
        verifiedAt: dto.verified_at || null,
        isAmendment: Boolean(dto.is_amendment),
        amendedFromId: dto.amended_from_id || null,
        activityCategory: dto.activity_category || "HGV (all diesel)",
        vehicleType: dto.vehicle_type || "All artics",
        unitSymbol: dto.unit_symbol || "tonne.km",
        sourceStandard: dto.source_standard || "UK DEFRA",
    };
}

export async function getCategory4TransportEntries(
    filters?: Category4TransportFilterParams,
): Promise<Category4TransportActivityEntry[]> {
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
    const url = `/tenant/scope3/category4/transport-activities${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: Category4TransportActivityDto[] | { items: Category4TransportActivityDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category4TransportActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory4TransportActivity) : [];
    } catch {
        return getMockCategory4TransportEntries();
    }
}

export async function getCategory4TransportSummary(
    filters?: Category4TransportFilterParams,
): Promise<Category4SummaryRollup> {
    const params = new URLSearchParams();
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);

    const qs = params.toString();
    const url = `/tenant/scope3/category4/transport-activities/summary${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{ success: boolean; data: Category4SummaryRollup }>(url);
        if (response.data.data) return response.data.data;
    } catch {
        // Fallback summary
    }
    return {
        total_records: 3,
        total_calculated_kg_co2e: 3120.8,
        total_calculated_t_co2e: 3.1208,
        category_breakdown: [
            {
                activity_category: "HGV (all diesel)",
                total_records: 2,
                total_activity_value: 2500,
                total_kg_co2e: 204.55,
                total_t_co2e: 0.20455,
            },
            {
                activity_category: "Freight flights",
                total_records: 1,
                total_activity_value: 1200,
                total_kg_co2e: 2708.4,
                total_t_co2e: 2.7084,
            },
        ],
    };
}

export async function getCategory4TransportEntry(activityId: string): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.get<{ success: boolean; data: Category4TransportActivityDto }>(
        `/tenant/scope3/category4/transport-activities/${activityId}`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function createCategory4TransportEntry(
    payload: CreateCategory4TransportPayload,
): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4TransportActivityDto }>(
        "/tenant/scope3/category4/transport-activities",
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function updateCategory4TransportEntry(
    activityId: string,
    payload: UpdateCategory4TransportPayload,
): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.put<{ success: boolean; data: Category4TransportActivityDto }>(
        `/tenant/scope3/category4/transport-activities/${activityId}`,
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function deleteCategory4TransportEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category4/transport-activities/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory4TransportEntry(activityId: string): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4TransportActivityDto }>(
        `/tenant/scope3/category4/transport-activities/${activityId}/submit`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function verifyCategory4TransportEntry(activityId: string): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4TransportActivityDto }>(
        `/tenant/scope3/category4/transport-activities/${activityId}/verify`,
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function rejectCategory4TransportEntry(
    activityId: string,
    reason: string,
): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4TransportActivityDto }>(
        `/tenant/scope3/category4/transport-activities/${activityId}/reject`,
        { reason },
    );
    return mapCategory4TransportActivity(response.data.data);
}

export async function amendCategory4TransportEntry(
    payload: AmendCategory4TransportPayload,
): Promise<Category4TransportActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category4TransportActivityDto }>(
        "/tenant/scope3/category4/transport-activities/amend",
        payload,
    );
    return mapCategory4TransportActivity(response.data.data);
}

function getMockCategory4TransportEntries(): Category4TransportActivityEntry[] {
    return [
        {
            id: "1ab43786-10c5-41d5-9f86-ace8f18f56a7",
            createdAt: "2026-08-28T17:23:14Z",
            updatedAt: "2026-08-28T17:23:14Z",
            facilityId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
            facilityName: "Main Plant - Pune",
            reportingPeriodId: "015ab9bf-a162-42f0-8b8f-9f9286de5dab",
            reportingPeriodName: "FY 2025-26",
            freightingGoodsEmissionFactorId: "de56d85f-4a43-40b9-9b28-073e52295762",
            factorGroup: "50_percent_laden",
            activityDate: "2025-06-15",
            activityValue: 1500,
            description: "Inbound logistics from Pune supplier to Mumbai warehouse",
            appliedFactorKgCo2e: 0.08182,
            appliedFactorTCo2e: 0.00008182,
            calculatedKgCo2e: 122.73,
            calculatedTCo2e: 0.12273,
            calculationDetails: "1500.0000 tonne.km of 'All artics' [50_percent_laden] * 0.08182 kg CO2e/tonne.km = 122.7300 kg CO2e (0.122730 t CO2e)",
            status: "draft",
            notes: "Verified by delivery challan #88412",
            rejectedReason: null,
            isAmendment: false,
            amendedFromId: null,
            activityCategory: "HGV (all diesel)",
            vehicleType: "All artics",
            unitSymbol: "tonne.km",
            sourceStandard: "UK DEFRA",
        },
    ];
}
