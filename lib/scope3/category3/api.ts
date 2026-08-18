import { privateApi } from "@/lib/http/client";
import {
    AmendElectricityTdPayload,
    AmendWttFuelPayload,
    Category3FilterParams,
    CreateElectricityTdPayload,
    CreateWttFuelPayload,
    DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH,
    DEFAULT_TD_LOSS_RATE,
    DEFAULT_WTT_FUELS,
    ElectricityTdActivityDto,
    ElectricityTdActivityEntry,
    UpdateElectricityTdPayload,
    UpdateWttFuelPayload,
    WttFuel,
    WttFuelActivityDto,
    WttFuelActivityEntry,
    WttFuelUnit,
} from "./types";

// ---------------------------------------------------------------------------
// DTO MAPPERS
// ---------------------------------------------------------------------------

export function mapWttFuelActivityItem(dto: WttFuelActivityDto): WttFuelActivityEntry {
    const fuelQuantity = Number(dto.fuel_quantity || 0);
    const calcKg = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : 0;
    const calcT = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : calcKg / 1000;

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriod: dto.reporting_period || "FY 2021-22",
        wttFuelEmissionFactorId: dto.wtt_fuel_emission_factor_id,
        fuelId: dto.fuel_id,
        fuelName: dto.fuel_name || "Coal (industrial)",
        unitId: dto.unit_id,
        unitSymbol: dto.unit_symbol || "tonnes",
        activityDate: dto.activity_date,
        fuelQuantity,
        calculatedKgCo2e: calcKg,
        calculatedTCo2e: calcT,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,
    };
}

export function mapElectricityTdActivityItem(dto: ElectricityTdActivityDto): ElectricityTdActivityEntry {
    const kwh = Number(dto.electricity_consumed_kwh || 0);
    const tdLossRate = dto.td_loss_rate != null ? Number(dto.td_loss_rate) : DEFAULT_TD_LOSS_RATE;
    const gridFactor = dto.grid_kg_co2e_per_kwh != null ? Number(dto.grid_kg_co2e_per_kwh) : DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH;

    const calcKg = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : kwh * gridFactor * tdLossRate;
    const calcT = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : calcKg / 1000;

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriod: dto.reporting_period || "FY 2021-22",
        electricityEmissionFactorId: dto.electricity_emission_factor_id || null,
        activityDate: dto.activity_date,
        electricityConsumedKwh: kwh,
        tdLossRate,
        gridKgCo2ePerKwh: gridFactor,
        calculatedKgCo2e: calcKg,
        calculatedTCo2e: calcT,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,
    };
}

// ---------------------------------------------------------------------------
// 4.1 LOOKUPS
// ---------------------------------------------------------------------------

export async function getWttFuels(): Promise<WttFuel[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: WttFuel[] }>(
            "/tenant/scope3/category3/wtt-fuels",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback demo WTT fuels list
    }
    return DEFAULT_WTT_FUELS;
}

export async function getWttFuelUnits(fuelId: string): Promise<WttFuelUnit[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: WttFuelUnit[] }>(
            `/tenant/scope3/category3/wtt-fuels/${fuelId}/units`,
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback search in default seed list
    }
    const matchedFuel = DEFAULT_WTT_FUELS.find((f) => f.fuel_id === fuelId);
    return matchedFuel ? matchedFuel.units : DEFAULT_WTT_FUELS[0].units;
}

// ---------------------------------------------------------------------------
// 4.2 UPSTREAM WTT FUEL ACTIVITIES
// ---------------------------------------------------------------------------

export async function getWttFuelActivities(filters?: Category3FilterParams): Promise<WttFuelActivityEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period) params.append("reporting_period", filters.reporting_period);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.activity_date) params.append("activity_date", filters.activity_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category3/fuel${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{ success: boolean; data: WttFuelActivityDto[] | { items: WttFuelActivityDto[] } }>(url);
        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: WttFuelActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapWttFuelActivityItem) : [];
    } catch {
        return getMockWttFuelEntries();
    }
}

export async function createWttFuelActivity(payload: CreateWttFuelPayload): Promise<WttFuelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: WttFuelActivityDto }>(
        "/tenant/scope3/category3/fuel",
        payload,
    );
    return mapWttFuelActivityItem(response.data.data);
}

export async function updateWttFuelActivity(activityId: string, payload: UpdateWttFuelPayload): Promise<WttFuelActivityEntry> {
    const response = await privateApi.patch<{ success: boolean; data: WttFuelActivityDto }>(
        `/tenant/scope3/category3/fuel/${activityId}`,
        payload,
    );
    return mapWttFuelActivityItem(response.data.data);
}

export async function deleteWttFuelActivity(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category3/fuel/${activityId}`);
    return response.data.success ?? true;
}

export async function submitWttFuelActivity(activityId: string): Promise<WttFuelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: WttFuelActivityDto }>(
        `/tenant/scope3/category3/fuel/${activityId}/submit`,
    );
    return mapWttFuelActivityItem(response.data.data);
}

export async function verifyWttFuelActivity(activityId: string): Promise<WttFuelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: WttFuelActivityDto }>(
        `/tenant/scope3/category3/fuel/${activityId}/verify`,
    );
    return mapWttFuelActivityItem(response.data.data);
}

export async function rejectWttFuelActivity(activityId: string, reason: string): Promise<WttFuelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: WttFuelActivityDto }>(
        `/tenant/scope3/category3/fuel/${activityId}/reject`,
        { reason },
    );
    return mapWttFuelActivityItem(response.data.data);
}

export async function amendWttFuelActivity(activityId: string, payload: AmendWttFuelPayload): Promise<WttFuelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: WttFuelActivityDto }>(
        `/tenant/scope3/category3/fuel/${activityId}/amend`,
        payload,
    );
    return mapWttFuelActivityItem(response.data.data);
}

// ---------------------------------------------------------------------------
// 4.3 ELECTRICITY T&D LOSSES ACTIVITIES
// ---------------------------------------------------------------------------

export async function getElectricityTdActivities(filters?: Category3FilterParams): Promise<ElectricityTdActivityEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period) params.append("reporting_period", filters.reporting_period);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.activity_date) params.append("activity_date", filters.activity_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category3/electricity${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{ success: boolean; data: ElectricityTdActivityDto[] | { items: ElectricityTdActivityDto[] } }>(url);
        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: ElectricityTdActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapElectricityTdActivityItem) : [];
    } catch {
        return getMockElectricityTdEntries();
    }
}

export async function createElectricityTdActivity(payload: CreateElectricityTdPayload): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: ElectricityTdActivityDto }>(
        "/tenant/scope3/category3/electricity",
        payload,
    );
    return mapElectricityTdActivityItem(response.data.data);
}

export async function updateElectricityTdActivity(activityId: string, payload: UpdateElectricityTdPayload): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.patch<{ success: boolean; data: ElectricityTdActivityDto }>(
        `/tenant/scope3/category3/electricity/${activityId}`,
        payload,
    );
    return mapElectricityTdActivityItem(response.data.data);
}

export async function deleteElectricityTdActivity(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category3/electricity/${activityId}`);
    return response.data.success ?? true;
}

export async function submitElectricityTdActivity(activityId: string): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: ElectricityTdActivityDto }>(
        `/tenant/scope3/category3/electricity/${activityId}/submit`,
    );
    return mapElectricityTdActivityItem(response.data.data);
}

export async function verifyElectricityTdActivity(activityId: string): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: ElectricityTdActivityDto }>(
        `/tenant/scope3/category3/electricity/${activityId}/verify`,
    );
    return mapElectricityTdActivityItem(response.data.data);
}

export async function rejectElectricityTdActivity(activityId: string, reason: string): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: ElectricityTdActivityDto }>(
        `/tenant/scope3/category3/electricity/${activityId}/reject`,
        { reason },
    );
    return mapElectricityTdActivityItem(response.data.data);
}

export async function amendElectricityTdActivity(activityId: string, payload: AmendElectricityTdPayload): Promise<ElectricityTdActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: ElectricityTdActivityDto }>(
        `/tenant/scope3/category3/electricity/${activityId}/amend`,
        payload,
    );
    return mapElectricityTdActivityItem(response.data.data);
}

// ---------------------------------------------------------------------------
// FALLBACK MOCK DATASETS
// ---------------------------------------------------------------------------

function getMockWttFuelEntries(): WttFuelActivityEntry[] {
    return [
        {
            id: "cat3-wtt-mock-1",
            createdAt: "2026-08-12T12:00:00.000Z",
            updatedAt: "2026-08-12T12:00:00.000Z",
            facilityId: null,
            facilityName: "Main Plant Boilers",
            reportingPeriod: "FY 2021-22",
            wttFuelEmissionFactorId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
            fuelId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            fuelName: "Coal (industrial)",
            unitId: "unit-tonne-coal",
            unitSymbol: "tonnes",
            activityDate: "2021-12-09",
            fuelQuantity: 100.50,
            calculatedKgCo2e: 42024.04,
            calculatedTCo2e: 42.0240,
            status: "verified",
            notes: "Upstream WTT coal consumption for plant boilers",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}

function getMockElectricityTdEntries(): ElectricityTdActivityEntry[] {
    return [
        {
            id: "cat3-elec-mock-1",
            createdAt: "2026-08-14T14:00:00.000Z",
            updatedAt: "2026-08-14T14:00:00.000Z",
            facilityId: null,
            facilityName: "Corporate HQ Grid Meter",
            reportingPeriod: "FY 2021-22",
            electricityEmissionFactorId: null,
            activityDate: "2021-12-09",
            electricityConsumedKwh: 10000.00,
            tdLossRate: 0.1700,
            gridKgCo2ePerKwh: 0.7160,
            calculatedKgCo2e: 1217.20,
            calculatedTCo2e: 1.2172,
            status: "verified",
            notes: "Facility Scope 3 Category 3 electricity grid T&D losses",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}
