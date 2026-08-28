import { privateApi } from "@/lib/http/client";
import {
    ANNUAL_USD_INR_EXCHANGE_RATES,
    AmendCategory1SpendPayload,
    Category1FilterParams,
    Category1SpendApiResponse,
    Category1SpendEntry,
    Category1SpendItemDto,
    CreateCategory1SpendPayload,
    DEFAULT_EMISSION_FACTOR_SOURCES,
    DEFAULT_USEEIO_SPEND_FACTORS,
    EmissionFactorSource,
    Scope3SpendFactor,
    Scope3SpendFactorDto,
    UpdateCategory1SpendPayload,
} from "./types";

export function mapFactor(dto?: Scope3SpendFactorDto | null, factorId?: string): Scope3SpendFactor | undefined {
    if (dto) {
        const title = dto.naics_title || dto.commodity_title || "USEEIO Commodity Factor";
        const sector = dto.naics_sector_category || dto.category || "General Commodities";

        return {
            id: dto.id,
            naicsCode: dto.naics_code || "000000",
            naicsSectorCategory: sector,
            naicsTitle: title,
            commodityTitle: title,
            category: sector,
            kgCo2ePerUsdWithMargins: Number(dto.kg_co2e_per_usd_with_margins || 0.52),
            kgCo2ePerUsdWithoutMargins: Number(dto.kg_co2e_per_usd_without_margins || 0.42),
            marginKgCo2ePerUsd: Number(dto.margin_kg_co2e_per_usd || 0.10),
            source: dto.source,
        };
    }
    if (factorId) {
        return DEFAULT_USEEIO_SPEND_FACTORS.find((f) => f.id === factorId) ?? DEFAULT_USEEIO_SPEND_FACTORS[0];
    }
    return undefined;
}

export function mapCategory1SpendItem(dto: Category1SpendItemDto): Category1SpendEntry {
    const factor = mapFactor(dto.factor, dto.scope3_spend_emission_factor_id);
    const spendYear = dto.spend_year || (dto.spend_date ? new Date(dto.spend_date).getFullYear() : 2024);
    const exchangeRate = dto.exchange_rate_usd_to_inr || ANNUAL_USD_INR_EXCHANGE_RATES[spendYear] || 83.45;

    const spendInInr = Number(dto.spend_in_inr || 0);
    const spendInUsd = dto.spend_in_usd ? Number(dto.spend_in_usd) : spendInInr / exchangeRate;

    const withMarginFactor = factor ? factor.kgCo2ePerUsdWithMargins : 0.5200;
    const withoutMarginFactor = factor ? factor.kgCo2ePerUsdWithoutMargins : 0.4200;
    const marginFactor = factor ? factor.marginKgCo2ePerUsd : 0.1000;

    const calcKgWith = dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : spendInUsd * withMarginFactor;
    const calcTWith = dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : calcKgWith / 1000;

    const calcKgWithout = dto.calculated_kg_co2e_without_margins != null ? Number(dto.calculated_kg_co2e_without_margins) : spendInUsd * withoutMarginFactor;
    const calcTWithout = dto.calculated_t_co2e_without_margins != null ? Number(dto.calculated_t_co2e_without_margins) : calcKgWithout / 1000;

    const marginKg = dto.margin_kg_co2e != null ? Number(dto.margin_kg_co2e) : spendInUsd * marginFactor;
    const marginT = dto.margin_t_co2e != null ? Number(dto.margin_t_co2e) : marginKg / 1000;

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
        scope3SpendEmissionFactorId: dto.scope3_spend_emission_factor_id,
        spendDate: dto.spend_date,
        spendYear,
        spendInInr,
        spendInUsd,
        exchangeRateUsdToInr: exchangeRate,
        calculatedKgCo2e: calcKgWith,
        calculatedTCo2e: calcTWith,
        calculatedKgCo2eWithoutMargins: calcKgWithout,
        calculatedTCo2eWithoutMargins: calcTWithout,
        marginKgCo2e: marginKg,
        marginTCo2e: marginT,
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,
        factor,
    };
}

export async function getActiveEmissionFactorSources(type = "other"): Promise<EmissionFactorSource[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: EmissionFactorSource[] }>(
            `/user/emission-factor-sources/active?type=${type}`,
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback demo source list
    }
    return DEFAULT_EMISSION_FACTOR_SOURCES;
}

export async function getScope3SpendFactors(sourceId?: string): Promise<Scope3SpendFactor[]> {
    try {
        const url = sourceId
            ? `/tenant/emission-factors/scope3/spend-factors?source_id=${sourceId}`
            : "/tenant/emission-factors/scope3/spend-factors";
        const response = await privateApi.get<{
            success: boolean;
            data: Scope3SpendFactorDto[] | { items: Scope3SpendFactorDto[] };
        }>(url);

        const dataPayload = response.data?.data;
        const rawData = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Scope3SpendFactorDto[] })?.items ?? [];

        if (Array.isArray(rawData) && rawData.length > 0) {
            const mapped = rawData.map((dto) => mapFactor(dto)).filter((f): f is Scope3SpendFactor => Boolean(f));
            if (mapped.length > 0) return mapped;
        }

        // If filtering by sourceId returned 0 items, retry without sourceId filter
        if (sourceId) {
            const fallbackRes = await privateApi.get<{
                success: boolean;
                data: Scope3SpendFactorDto[] | { items: Scope3SpendFactorDto[] };
            }>("/tenant/emission-factors/scope3/spend-factors");
            const fallbackPayload = fallbackRes.data?.data;
            const fallbackData = Array.isArray(fallbackPayload)
                ? fallbackPayload
                : (fallbackPayload as { items?: Scope3SpendFactorDto[] })?.items ?? [];

            if (Array.isArray(fallbackData) && fallbackData.length > 0) {
                const mapped = fallbackData.map((dto) => mapFactor(dto)).filter((f): f is Scope3SpendFactor => Boolean(f));
                if (mapped.length > 0) return mapped;
            }
        }
    } catch {
        // Fallback demo factor list
    }
    return DEFAULT_USEEIO_SPEND_FACTORS;
}

export async function getCategory1SpendEntries(filters?: Category1FilterParams): Promise<Category1SpendEntry[]> {
    const params = new URLSearchParams();
    if (filters?.reporting_period_id) {
        params.append("reporting_period_id", filters.reporting_period_id);
    } else if (filters?.reporting_period) {
        params.append("reporting_period_id", filters.reporting_period);
    }
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.scope3_spend_emission_factor_id) params.append("scope3_spend_emission_factor_id", filters.scope3_spend_emission_factor_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.spend_year) params.append("spend_year", String(filters.spend_year));
    if (filters?.spend_date) params.append("spend_date", filters.spend_date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));
    if (filters?.sort_by) params.append("sort_by", filters.sort_by);
    if (filters?.sort_order) params.append("sort_order", filters.sort_order);

    const qs = params.toString();
    const url = `/tenant/scope3/category1/spend${qs ? `?${qs}` : ""}`;

    try {
        const response = await privateApi.get<Category1SpendApiResponse>(url);
        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Category1SpendItemDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapCategory1SpendItem) : [];
    } catch {
        return getMockCategory1Entries();
    }
}

export async function getCategory1SpendEntry(activityId: string): Promise<Category1SpendEntry> {
    const response = await privateApi.get<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}`,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function createCategory1SpendEntry(payload: CreateCategory1SpendPayload): Promise<Category1SpendEntry> {
    const response = await privateApi.post<Category1SpendApiResponse<Category1SpendItemDto>>(
        "/tenant/scope3/category1/spend",
        payload,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function updateCategory1SpendEntry(
    activityId: string,
    payload: UpdateCategory1SpendPayload,
): Promise<Category1SpendEntry> {
    const response = await privateApi.patch<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}`,
        payload,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function deleteCategory1SpendEntry(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/category1/spend/${activityId}`);
    return response.data.success ?? true;
}

export async function submitCategory1SpendEntry(activityId: string): Promise<Category1SpendEntry> {
    const response = await privateApi.post<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}/submit`,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function verifyCategory1SpendEntry(activityId: string): Promise<Category1SpendEntry> {
    const response = await privateApi.post<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}/verify`,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function rejectCategory1SpendEntry(activityId: string, reason: string): Promise<Category1SpendEntry> {
    const response = await privateApi.post<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}/reject`,
        { reason },
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

export async function amendCategory1SpendEntry(activityId: string, payload: AmendCategory1SpendPayload): Promise<Category1SpendEntry> {
    const response = await privateApi.post<Category1SpendApiResponse<Category1SpendItemDto>>(
        `/tenant/scope3/category1/spend/${activityId}/amend`,
        payload,
    );
    const dto = response.data.data as Category1SpendItemDto;
    return mapCategory1SpendItem(dto);
}

function getMockCategory1Entries(): Category1SpendEntry[] {
    return [
        {
            id: "cat1-mock-1",
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            facilityId: null,
            facilityName: "Main Corporate HQ",
            reportingPeriodId: "091f03f3-2470-4f51-b845-a7b3cba14d33",
            reportingPeriodName: "FY 2024-25",
            reportingPeriod: "FY 2024-25",
            scope3SpendEmissionFactorId: "ca68b110-59ba-4c62-b841-270138cc06dd",
            spendDate: "2024-05-15",
            spendYear: 2024,
            spendInInr: 830000.00,
            spendInUsd: 10000.00,
            exchangeRateUsdToInr: 83.00,
            calculatedKgCo2e: 5200.00,
            calculatedTCo2e: 5.20,
            calculatedKgCo2eWithoutMargins: 4200.00,
            calculatedTCo2eWithoutMargins: 4.20,
            marginKgCo2e: 1000.00,
            marginTCo2e: 1.00,
            status: "verified",
            notes: "Purchased raw organic materials",
            rejectedReason: null,
            amendedFromId: null,
            factor: DEFAULT_USEEIO_SPEND_FACTORS[0],
        },
    ];
}
