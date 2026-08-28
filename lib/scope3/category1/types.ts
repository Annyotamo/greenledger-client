export type Scope3SpendStatus = "draft" | "submitted" | "verified" | "rejected";

export type EmissionFactorSource = {
    id: string;
    standard: string;
    version: string;
    region: string;
    type: string;
    data_year: number;
    is_active: boolean;
    emission_unit: string;
    tablename?: string;
};

export type Scope3SpendFactorDto = {
    id: string;
    created_at?: string;
    updated_at?: string;
    source?: EmissionFactorSource;
    naics_code: string;
    naics_sector_category?: string;
    naics_title?: string;
    commodity_title?: string;
    category?: string;
    useeio_reference_code?: string;
    reference_year?: number;
    currency?: string;
    kg_co2e_per_usd_without_margins: string | number;
    margin_kg_co2e_per_usd: string | number;
    kg_co2e_per_usd_with_margins: string | number;
    t_co2e_per_usd_with_margins?: string | number;
    is_active?: boolean;
    is_deprecated?: boolean;
};

export type Scope3SpendFactor = {
    id: string;
    naicsCode: string;
    naicsSectorCategory: string;
    naicsTitle: string;
    commodityTitle: string;
    category: string;
    kgCo2ePerUsdWithMargins: number;
    kgCo2ePerUsdWithoutMargins: number;
    marginKgCo2ePerUsd: number;
    source?: EmissionFactorSource;
};

export type Category1SpendItemDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    reporting_period_id?: string | null;
    reporting_period_name?: string | null;
    reporting_period?: string;
    facility_id: string | null;
    scope3_spend_emission_factor_id: string;
    spend_date: string;
    spend_year: number;
    spend_in_inr: number;
    spend_in_usd: number;
    exchange_rate_usd_to_inr: number;
    calculated_kg_co2e: number;
    calculated_t_co2e: number;
    calculated_kg_co2e_without_margins: number;
    calculated_t_co2e_without_margins: number;
    margin_kg_co2e: number;
    margin_t_co2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejected_reason?: string | null;
    amended_from_id?: string | null;
    factor?: Scope3SpendFactorDto;
    facility_name?: string | null;
};

export type Category1SpendEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    reportingPeriodId: string | null;
    reportingPeriodName: string;
    reportingPeriod: string;
    facilityId: string | null;
    facilityName: string | null;
    scope3SpendEmissionFactorId: string;
    spendDate: string;
    spendYear: number;
    spendInInr: number;
    spendInUsd: number;
    exchangeRateUsdToInr: number;
    calculatedKgCo2e: number;
    calculatedTCo2e: number;
    calculatedKgCo2eWithoutMargins: number;
    calculatedTCo2eWithoutMargins: number;
    marginKgCo2e: number;
    marginTCo2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;
    factor?: Scope3SpendFactor;
};

export type Category1SpendApiResponse<T = Category1SpendItemDto[]> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T | { items: T; total?: number; page?: number; page_size?: number };
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};

export type CreateCategory1SpendPayload = {
    reporting_period_id?: string | null;
    facility_id?: string | null;
    scope3_spend_emission_factor_id: string;
    spend_date: string;
    spend_in_inr: number;
    spend_year: number;
    status?: Scope3SpendStatus;
    notes?: string | null;
};

export type UpdateCategory1SpendPayload = Partial<CreateCategory1SpendPayload>;

export type AmendCategory1SpendPayload = CreateCategory1SpendPayload & {
    amended_from_id: string;
};

export type Category1FilterParams = {
    reporting_period_id?: string;
    reporting_period?: string;
    facility_id?: string;
    scope3_spend_emission_factor_id?: string;
    status?: string;
    spend_year?: number;
    spend_date?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

// Annual USD to INR exchange rates (Average annual benchmark)
export const ANNUAL_USD_INR_EXCHANGE_RATES: Record<number, number> = {
    2020: 74.13,
    2021: 73.92,
    2022: 78.60,
    2023: 82.58,
    2024: 83.45,
    2025: 84.20,
};

export const DEFAULT_EMISSION_FACTOR_SOURCES: EmissionFactorSource[] = [
    {
        id: "ce689b2d-6882-4c9b-9cc5-45d65f21d42e",
        standard: "US EPA - USEEIO",
        version: "6.0",
        region: "US",
        type: "other",
        data_year: 2022,
        is_active: true,
        emission_unit: "kg",
        tablename: "",
    },
];

// Seeded US EPA USEEIO Spend Factors reference dictionary matching backend API
export const DEFAULT_USEEIO_SPEND_FACTORS: Scope3SpendFactor[] = [
    {
        id: "ca68b110-59ba-4c62-b841-270138cc06dd",
        naicsCode: "111110",
        naicsSectorCategory: "Agriculture, Forestry, Fishing and Hunting",
        naicsTitle: "Soybean Farming",
        commodityTitle: "Soybean Farming",
        category: "Purchased Commodities",
        kgCo2ePerUsdWithMargins: 0.5320,
        kgCo2ePerUsdWithoutMargins: 0.4880,
        marginKgCo2ePerUsd: 0.0440,
    },
    {
        id: "7146325b-3421-4f89-9c1b-1613c713b037",
        naicsCode: "111120",
        naicsSectorCategory: "Agriculture, Forestry, Fishing and Hunting",
        naicsTitle: "Oilseed (except Soybean) Farming",
        commodityTitle: "Oilseed Farming",
        category: "Purchased Commodities",
        kgCo2ePerUsdWithMargins: 0.5320,
        kgCo2ePerUsdWithoutMargins: 0.4880,
        marginKgCo2ePerUsd: 0.0440,
    },
    {
        id: "4766fc1d-ed54-47e7-81cc-594e9a9ff9de",
        naicsCode: "111310",
        naicsSectorCategory: "Agriculture, Forestry, Fishing and Hunting",
        naicsTitle: "Orange Groves",
        commodityTitle: "Orange Groves",
        category: "Purchased Commodities",
        kgCo2ePerUsdWithMargins: 0.4880,
        kgCo2ePerUsdWithoutMargins: 0.4290,
        marginKgCo2ePerUsd: 0.0590,
    },
    {
        id: "b7786392-4980-41a9-9818-175c4639e1b3",
        naicsCode: "111320",
        naicsSectorCategory: "Agriculture, Forestry, Fishing and Hunting",
        naicsTitle: "Citrus (except Orange) Groves",
        commodityTitle: "Citrus Groves",
        category: "Purchased Commodities",
        kgCo2ePerUsdWithMargins: 0.4880,
        kgCo2ePerUsdWithoutMargins: 0.4290,
        marginKgCo2ePerUsd: 0.0590,
    },
    {
        id: "factor-5",
        naicsCode: "325199",
        naicsSectorCategory: "Manufacturing",
        naicsTitle: "All Other Basic Organic Chemical Manufacturing",
        commodityTitle: "Basic Organic Chemical Manufacturing",
        category: "Chemical Products",
        kgCo2ePerUsdWithMargins: 0.7240,
        kgCo2ePerUsdWithoutMargins: 0.6540,
        marginKgCo2ePerUsd: 0.0700,
    },
    {
        id: "factor-6",
        naicsCode: "331110",
        naicsSectorCategory: "Manufacturing",
        naicsTitle: "Iron and Steel Mills and Ferroalloy Manufacturing",
        commodityTitle: "Iron and Steel Mills",
        category: "Primary Metals",
        kgCo2ePerUsdWithMargins: 0.8450,
        kgCo2ePerUsdWithoutMargins: 0.7600,
        marginKgCo2ePerUsd: 0.0850,
    },
    {
        id: "factor-7",
        naicsCode: "541512",
        naicsSectorCategory: "Professional, Scientific, and Technical Services",
        naicsTitle: "Computer Systems Design Services",
        commodityTitle: "Computer Systems Design Services",
        category: "Professional Services",
        kgCo2ePerUsdWithMargins: 0.1850,
        kgCo2ePerUsdWithoutMargins: 0.1650,
        marginKgCo2ePerUsd: 0.0200,
    },
];
