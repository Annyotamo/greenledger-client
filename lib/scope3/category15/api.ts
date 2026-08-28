import { privateApi } from "@/lib/http/client";
import {
    AmendCategory15InvestmentPayload,
    AssetClassMetadata,
    Category15FilterParams,
    Category15InvestmentDto,
    Category15InvestmentEntry,
    CreateCategory15InvestmentPayload,
    DEFAULT_ASSET_CLASSES,
    UpdateCategory15InvestmentPayload,
} from "./types";

// ---------------------------------------------------------------------------
// DTO MAPPER
// ---------------------------------------------------------------------------

export function mapCategory15InvestmentItem(dto: Category15InvestmentDto): Category15InvestmentEntry {
    const outstanding = Number(dto.outstanding_amount || 0);
    const worth = Number(dto.total_company_worth || 0);
    const attrFactor = dto.attribution_factor != null ? Number(dto.attribution_factor) : worth > 0 ? outstanding / worth : 0;
    const attrPct = dto.attribution_factor_percentage != null ? Number(dto.attribution_factor_percentage) : attrFactor * 100;

    const compScope1 = Number(dto.company_scope1_emissions || 0);
    const compScope2 = Number(dto.company_scope2_emissions || 0);
    const compScope3 = Number(dto.company_scope3_emissions || 0);

    const finScope1 = dto.financed_scope1_emissions != null ? Number(dto.financed_scope1_emissions) : attrFactor * compScope1;
    const finScope2 = dto.financed_scope2_emissions != null ? Number(dto.financed_scope2_emissions) : attrFactor * compScope2;
    const finScope3 = dto.financed_scope3_emissions != null ? Number(dto.financed_scope3_emissions) : attrFactor * compScope3;

    const calcT = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : finScope1 + finScope2 + finScope3;
    const calcKg = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : calcT * 1000;

    const matchedAssetClass = DEFAULT_ASSET_CLASSES.find((a) => a.asset_class === dto.asset_class);
    const assetClassName = dto.asset_class_name || matchedAssetClass?.name || "Investment / Financed Asset";
    const assetClassNo = dto.asset_class_no || matchedAssetClass?.asset_class_no || 1;

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        reportingPeriodId: dto.reporting_period_id || null,
        reportingPeriodName: dto.reporting_period_name || "FY 2024-25",
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        activityDate: dto.activity_date || new Date().toISOString().split("T")[0],
        whatYouFinanced: dto.what_you_financed || "Financed Asset",
        assetClassNo,
        assetClass: dto.asset_class || "listed_shares_or_corporate_bonds",
        assetClassName,
        outstandingAmountCrores: outstanding,
        totalCompanyWorthCrores: worth,
        currency: dto.currency || "INR_CRORES",
        companyScope1Emissions: compScope1,
        companyScope2Emissions: compScope2,
        companyScope3Emissions: compScope3,
        attributionFactor: attrFactor,
        attributionFactorPercentage: attrPct,
        financedScope1Emissions: finScope1,
        financedScope2Emissions: finScope2,
        financedScope3Emissions: finScope3,
        calculatedTCo2e: calcT,
        calculatedKgCo2e: calcKg,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,
    };
}

// ---------------------------------------------------------------------------
// 1. ASSET CLASSES METADATA LOOKUP
// ---------------------------------------------------------------------------

export async function getAssetClasses(): Promise<AssetClassMetadata[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: AssetClassMetadata[] }>(
            "/tenant/scope3/category15/asset-classes",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback default PCAF asset classes
    }
    return DEFAULT_ASSET_CLASSES;
}

// ---------------------------------------------------------------------------
// 2. INVESTMENT ACTIVITY CRUD & WORKFLOW ENDPOINTS
// ---------------------------------------------------------------------------

export async function getCategory15InvestmentEntries(
    filters?: Category15FilterParams,
): Promise<Category15InvestmentEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.asset_class) params.append("asset_class", filters.asset_class);
    if (filters?.asset_class_no) params.append("asset_class_no", String(filters.asset_class_no));
    if (filters?.status) params.append("status", filters.status);
    if (filters?.activity_date) params.append("activity_date", filters.activity_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const qs = params.toString();
    const url = `/tenant/scope3/category15/investments${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: Category15InvestmentDto[] | { items: Category15InvestmentDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category15InvestmentDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory15InvestmentItem) : [];
    } catch {
        return getMockCategory15InvestmentEntries();
    }
}

export async function getCategory15InvestmentEntry(activityId: string): Promise<Category15InvestmentEntry> {
    const response = await privateApi.get<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}`,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function createCategory15InvestmentEntry(
    payload: CreateCategory15InvestmentPayload,
): Promise<Category15InvestmentEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category15InvestmentDto }>(
        "/tenant/scope3/category15/investments",
        payload,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function updateCategory15InvestmentEntry(
    activityId: string,
    payload: UpdateCategory15InvestmentPayload,
): Promise<Category15InvestmentEntry> {
    const response = await privateApi.patch<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}`,
        payload,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function deleteCategory15InvestmentEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category15/investments/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory15InvestmentEntry(activityId: string): Promise<Category15InvestmentEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}/submit`,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function verifyCategory15InvestmentEntry(activityId: string): Promise<Category15InvestmentEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}/verify`,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function rejectCategory15InvestmentEntry(
    activityId: string,
    reason: string,
): Promise<Category15InvestmentEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}/reject`,
        { reason },
    );
    return mapCategory15InvestmentItem(response.data.data);
}

export async function amendCategory15InvestmentEntry(
    activityId: string,
    payload: AmendCategory15InvestmentPayload,
): Promise<Category15InvestmentEntry> {
    const response = await privateApi.post<{ success: boolean; data: Category15InvestmentDto }>(
        `/tenant/scope3/category15/investments/${activityId}/amend`,
        payload,
    );
    return mapCategory15InvestmentItem(response.data.data);
}

// ---------------------------------------------------------------------------
// FALLBACK MOCK DATASETS
// ---------------------------------------------------------------------------

function getMockCategory15InvestmentEntries(): Category15InvestmentEntry[] {
    return [
        {
            id: "e963bc97-e883-4a11-b4f0-466a983bca98",
            createdAt: "2026-08-28T12:00:00Z",
            updatedAt: "2026-08-28T12:00:00Z",
            reportingPeriodId: "091f03f3-2470-4f51-b845-a7b3cba14d33",
            reportingPeriodName: "FY 2024-25",
            facilityId: null,
            facilityName: null,
            activityDate: "2024-06-15",
            whatYouFinanced: "Listed cement company shares",
            assetClassNo: 1,
            assetClass: "listed_shares_or_corporate_bonds",
            assetClassName: "Listed shares or corporate bonds",
            outstandingAmountCrores: 250.0,
            totalCompanyWorthCrores: 2500.0,
            currency: "INR_CRORES",
            companyScope1Emissions: 1000.0,
            companyScope2Emissions: 100.0,
            companyScope3Emissions: 2000.0,
            attributionFactor: 0.1,
            attributionFactorPercentage: 10.0,
            financedScope1Emissions: 100.0,
            financedScope2Emissions: 10.0,
            financedScope3Emissions: 200.0,
            calculatedTCo2e: 310.0,
            calculatedKgCo2e: 310000.0,
            status: "verified",
            notes: "Portfolio evaluation Q1 (PCAF Standard)",
            rejectedReason: null,
            amendedFromId: null,
        },
    ];
}
