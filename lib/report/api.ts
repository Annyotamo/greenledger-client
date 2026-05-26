import { privateApi } from "@/lib/http/client";
import type {
    Scope1DashboardData,
    Scope1DashboardResponse,
    Scope1EmissionsOverlayDropdownData,
    Scope1EmissionsOverlayResponse,
    Scope1IngestListResponse,
    Scope1IngestRecord,
    Scope1IngestRequest,
    Scope1IngestResponse,
    Scope1ReportRecord,
    Scope1ReportResponse,
    Scope2IngestListResponse,
    Scope2IngestRequest,
    Scope2IngestResponse,
    Scope2ActivityDataIngest,
    Scope2ReportRecord,
    Scope2ReportResponse,
    CompanyDetails,
    CompanyDetailsResponse,
} from "@/types/report";

export async function getScope1Reports(): Promise<Scope1ReportRecord[]> {
    const { data } = await privateApi.get<Scope1ReportResponse>("/report/getAllReport/scope1");
    return data.data ?? [];
}

export async function ingestScope1Emission(payload: Scope1IngestRequest): Promise<void> {
    await privateApi.post<Scope1IngestResponse>("/scope1Ingest/ingestEmission", payload);
}

export async function downloadScope1ReportCsv(startMonth: string, endMonth: string): Promise<Blob> {
    const { data } = await privateApi.get("/report/GenerateReport/scope1", {
        params: { startMonth, endMonth },
        responseType: "blob",
    });

    return data;
}

export async function getScope1EmissionsOverlayDropdownData(): Promise<Scope1EmissionsOverlayDropdownData> {
    const { data } = await privateApi.get<Scope1EmissionsOverlayResponse>("/fuel/getAllFuel");
    return data.data ?? {};
}

export async function getScope1Dashboard(startMonth: string, endMonth: string): Promise<Scope1DashboardData | null> {
    const { data } = await privateApi.get<Scope1DashboardResponse>(
        `/scope1Ingest/dashBoard/${encodeURIComponent(startMonth)}/${encodeURIComponent(endMonth)}`,
    );
    return data.data ?? null;
}

export async function getScope1IngestedRecords(): Promise<Scope1IngestRecord[]> {
    const { data } = await privateApi.get<Scope1IngestListResponse>("/scope1Ingest/getAllIngest");
    return data.data ?? [];
}

export async function getScope2Reports(): Promise<Scope2ReportRecord[]> {
    const { data } = await privateApi.get<Scope2ReportResponse>("/report/getAllReport/scope2");
    return data.data ?? [];
}

export async function ingestScope2Emission(payload: Scope2IngestRequest): Promise<void> {
    await privateApi.post<Scope2IngestResponse>("/scope2Ingest/ingestEmission", payload);
}

export async function getScope2IngestedRecords(): Promise<Scope2ActivityDataIngest[]> {
    const { data } = await privateApi.get<Scope2ActivityDataIngest[] | Scope2IngestListResponse>(
        "/scope2Ingest/getAll",
    );
    if (Array.isArray(data)) {
        return data;
    }
    return data?.data ?? [];
}

export async function downloadScope2ReportCsv(startMonth: string, endMonth: string): Promise<Blob> {
    const { data } = await privateApi.get("/report/GenerateReport/scope2", {
        params: { startMonth, endMonth },
        responseType: "blob",
    });

    return data;
}

export async function getCompanyDetails(): Promise<CompanyDetails | null> {
    const { data } = await privateApi.get<CompanyDetailsResponse>("/company/getDetails");
    return data.data?.[0] ?? null;
}

// Scope 1 Activities API
export interface Scope1Activity {
    id: string;
    facility_id: string;
    emission_type: string;
    quantity: string;
    status: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    meter_id: string | null;
    calculation_type: string;
    data_quality_tier: string;
    calculation_details: string | null;
    estimation_method: string | null;
    notes: string;
    is_verified: boolean;
    created_by: string;
    fuel: {
        id: string;
        name: string;
        slug: string;
        factor_type: string;
        applicable_scopes: string[];
        is_active: boolean;
    };
    quantity_unit: {
        id: string;
        name: string;
        symbol: string;
        unit_type: string;
    };
    emission_factor: Record<string, any>;
    documents: Array<{
        id: string;
        created_at: string;
        updated_at: string;
        title: string;
        doc_purpose: string;
        source_url: string;
        document_date: string;
        issued_by: string;
        notes: string;
        activity_id: string;
        is_deleted: boolean;
        deleted_at: string | null;
    }>;
    activity_period: {
        activity_date: string | null;
        start_date: string;
        end_date: string;
    };
    factor_snapshot: {
        emission_factor_id: string;
        factor_kg_co2e: string;
        factor_t_co2e: string;
    };
    calculated_emissions: {
        kg_co2e: string;
        t_co2e: string;
    };
    review: {
        reviewed_by: string | null;
        reviewed_at: string | null;
        review_notes: string | null;
    };
}

export interface Scope1ActivityResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: Scope1Activity[];
    error: string | null;
    method: string;
    path: string;
    timestamp: string;
}

export interface CreateScope1ActivityRequest {
    facility_id: string;
    emission_type: string;
    fuel_id: string;
    quantity: string;
    quantity_unit_id: string;
    source_id: string;
    calculation_type: string;
    data_quality_tier: string;
    start_date: string;
    end_date: string;
    notes: string;
}

export interface EmissionFactorSource {
    id: string;
    standard: string;
    version: string;
    region: string;
    data_year: number;
    is_active: boolean;
    emission_unit: string;
}

export interface EmissionFactorSourceResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: EmissionFactorSource[];
    error: string | null;
}

export interface FuelCategory {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

export interface FuelCategoryResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: FuelCategory[];
    error: string | null;
}

export interface Fuel {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    slug: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    applicable_scopes: string[];
    factor_type: string;
    description: string;
    is_active: boolean;
}

export interface FuelResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: Fuel[];
    error: string | null;
}

export interface QuantityUnit {
    id: string;
    name: string;
    symbol: string;
    unit_type: string;
}

export interface FuelUnitsResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        id: string;
        name: string;
        slug: string;
        factor_type: string;
        applicable_scopes: string[];
        category: FuelCategory;
        available_units: QuantityUnit[];
    };
    error: string | null;
}

export interface Facility {
    id: string;
    name: string;
    [key: string]: any;
}

export interface FacilityResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: Facility[];
    error: string | null;
}

export async function getScope1Activities(): Promise<Scope1Activity[]> {
    const { data } = await privateApi.get<Scope1ActivityResponse>("/api/v1/tenant/scope1/activities");
    return data.data ?? [];
}

export async function createScope1Activity(payload: CreateScope1ActivityRequest): Promise<Scope1Activity> {
    const { data } = await privateApi.post<Scope1ActivityResponse>("/api/v1/tenant/scope1/activities", payload);
    return data.data?.[0] ?? null;
}

export interface Scope2EnergyActivity {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    fuel_id: string;
    quantity: string;
    unit_id: string;
    source_id: string;
    start_date: string | null;
    end_date: string | null;
    activity_date: string;
    calculated_tonnes: string;
    energy_gj: string;
    fuel?: {
        id: string;
        name: string;
        slug: string;
        factor_type: string;
        applicable_scopes: string[];
        is_active: boolean;
    } | null;
    quantity_unit?: {
        id: string;
        name: string;
        symbol: string;
        unit_type: string;
    } | null;
    source?: {
        id: string;
        standard: string;
        version: string;
        region: string;
        data_year: number;
        is_active: boolean;
        emission_unit: string;
    } | null;
    activity_period?: {
        activity_date: string;
        start_date: string | null;
        end_date: string | null;
    } | null;
    calculated_emissions?: {
        tonnes: string;
        energy_gj: string;
    } | null;
    status?: string | null;
    error_message?: string | null;
}

export interface Scope2EnergyActivityResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: Scope2EnergyActivity[];
    error: string | null;
    method: string;
    path: string;
    timestamp: string;
}

export interface CreateScope2EnergyActivityRequest {
    fuel_id: string;
    quantity: number;
    unit_id: string;
    source_id: string;
    activity_date: string;
}

export async function getScope2EnergyActivities(): Promise<Scope2EnergyActivity[]> {
    const { data } = await privateApi.get<Scope2EnergyActivityResponse>("/api/v1/tenant/energy-activity");
    return data.data ?? [];
}

export async function createScope2EnergyActivity(
    payload: CreateScope2EnergyActivityRequest,
): Promise<Scope2EnergyActivity | null> {
    const { data } = await privateApi.post<Scope2EnergyActivityResponse>("/api/v1/tenant/energy-activity", payload);
    return data.data?.[0] ?? null;
}

export async function getEmissionFactorSources(): Promise<EmissionFactorSource[]> {
    const { data } = await privateApi.get<EmissionFactorSourceResponse>("/api/v1/user/emission-factor-sources/active");
    return data.data ?? [];
}

export async function getFuelCategories(): Promise<FuelCategory[]> {
    const { data } = await privateApi.get<FuelCategoryResponse>("/api/v1/user/fuel-categories");
    return data.data ?? [];
}

export async function getFuels(categoryId?: string): Promise<Fuel[]> {
    const { data } = await privateApi.get<FuelResponse>("/api/v1/user/fuels", {
        params: categoryId ? { category_id: categoryId } : undefined,
    });
    return data.data ?? [];
}

export async function getFuelUnits(fuelId: string): Promise<QuantityUnit[]> {
    const { data } = await privateApi.get<FuelUnitsResponse>(`/api/v1/user/fuels/${fuelId}/units`);
    return data.data?.available_units ?? [];
}

export async function getFacilities(): Promise<Facility[]> {
    const { data } = await privateApi.get<FacilityResponse>("/api/v1/tenant/facility");
    return data.data ?? [];
}
