import { Scope3SpendStatus, Scope3SpendFactor, Scope3SpendFactorDto } from "../category1/types";

export type { Scope3SpendStatus, Scope3SpendFactor, Scope3SpendFactorDto };

export type Category2SpendItemDto = {
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

export type Category2SpendEntry = {
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

export type Category2SpendApiResponse<T = Category2SpendItemDto[]> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T | { items: T; total?: number; page?: number; page_size?: number };
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};

export type CreateCategory2SpendPayload = {
    reporting_period_id?: string | null;
    facility_id?: string | null;
    scope3_spend_emission_factor_id: string;
    spend_date: string;
    spend_in_inr: number;
    spend_year: number;
    status?: Scope3SpendStatus;
    notes?: string | null;
};

export type UpdateCategory2SpendPayload = Partial<CreateCategory2SpendPayload>;

export type AmendCategory2SpendPayload = CreateCategory2SpendPayload & {
    amended_from_id: string;
};

export type Category2FilterParams = {
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

// Seeded US EPA USEEIO Spend Factors reference dictionary for Capital Goods (Category 2)
export const DEFAULT_CATEGORY2_USEEIO_FACTORS: Scope3SpendFactor[] = [
    {
        id: "ca68b110-59ba-4c62-b841-270138cc06dd",
        naicsCode: "333111",
        naicsSectorCategory: "Capital Goods & Machinery",
        naicsTitle: "Farm Machinery & Agricultural Equipment Manufacturing",
        commodityTitle: "Farm Machinery & Agricultural Equipment Manufacturing",
        category: "Capital Goods & Machinery",
        kgCo2ePerUsdWithMargins: 0.5120,
        kgCo2ePerUsdWithoutMargins: 0.4480,
        marginKgCo2ePerUsd: 0.0640,
    },
    {
        id: "cat2-factor-2",
        naicsCode: "333249",
        naicsSectorCategory: "Industrial Equipment",
        naicsTitle: "Other Industrial Machinery & Heavy Equipment",
        commodityTitle: "Other Industrial Machinery & Heavy Equipment",
        category: "Industrial Equipment",
        kgCo2ePerUsdWithMargins: 0.6840,
        kgCo2ePerUsdWithoutMargins: 0.6020,
        marginKgCo2ePerUsd: 0.0820,
    },
    {
        id: "cat2-factor-3",
        naicsCode: "335312",
        naicsSectorCategory: "Electrical Equipment",
        naicsTitle: "Motor & Generator Manufacturing (Turbines & Power Plant Goods)",
        commodityTitle: "Motor & Generator Manufacturing (Turbines & Power Plant Goods)",
        category: "Electrical Equipment",
        kgCo2ePerUsdWithMargins: 0.4950,
        kgCo2ePerUsdWithoutMargins: 0.4310,
        marginKgCo2ePerUsd: 0.0640,
    },
    {
        id: "cat2-factor-4",
        naicsCode: "236220",
        naicsSectorCategory: "Buildings & Infrastructure",
        naicsTitle: "Commercial and Institutional Building Construction",
        commodityTitle: "Commercial and Institutional Building Construction",
        category: "Buildings & Infrastructure",
        kgCo2ePerUsdWithMargins: 0.7290,
        kgCo2ePerUsdWithoutMargins: 0.6510,
        marginKgCo2ePerUsd: 0.0780,
    },
    {
        id: "cat2-factor-5",
        naicsCode: "336111",
        naicsSectorCategory: "Transport Equipment",
        naicsTitle: "Automobile and Heavy Fleet Vehicle Manufacturing",
        commodityTitle: "Automobile and Heavy Fleet Vehicle Manufacturing",
        category: "Transport Equipment",
        kgCo2ePerUsdWithMargins: 0.5820,
        kgCo2ePerUsdWithoutMargins: 0.5110,
        marginKgCo2ePerUsd: 0.0710,
    },
    {
        id: "cat2-factor-6",
        naicsCode: "334111",
        naicsSectorCategory: "IT & Electronics Hardware",
        naicsTitle: "Electronic Computer Manufacturing (Servers & Datacenter Hardware)",
        commodityTitle: "Electronic Computer Manufacturing",
        category: "IT & Electronics Hardware",
        kgCo2ePerUsdWithMargins: 0.3850,
        kgCo2ePerUsdWithoutMargins: 0.3350,
        marginKgCo2ePerUsd: 0.0500,
    },
    {
        id: "cat2-factor-7",
        naicsCode: "334510",
        naicsSectorCategory: "Medical & Precision Equipment",
        naicsTitle: "Electromedical and Electrotherapeutic Apparatus Manufacturing",
        commodityTitle: "Electromedical Apparatus Manufacturing",
        category: "Medical & Precision Equipment",
        kgCo2ePerUsdWithMargins: 0.4120,
        kgCo2ePerUsdWithoutMargins: 0.3620,
        marginKgCo2ePerUsd: 0.0500,
    },
    {
        id: "cat2-factor-8",
        naicsCode: "333415",
        naicsSectorCategory: "HVAC & Commercial Appliances",
        naicsTitle: "Air-Conditioning and Warm Air Heating Equipment Manufacturing",
        commodityTitle: "HVAC Equipment Manufacturing",
        category: "HVAC & Commercial Appliances",
        kgCo2ePerUsdWithMargins: 0.6210,
        kgCo2ePerUsdWithoutMargins: 0.5430,
        marginKgCo2ePerUsd: 0.0780,
    },
    {
        id: "cat2-factor-9",
        naicsCode: "332312",
        naicsSectorCategory: "Buildings & Infrastructure",
        naicsTitle: "Fabricated Structural Metal Manufacturing (Steel Frames)",
        commodityTitle: "Fabricated Structural Metal Manufacturing",
        category: "Buildings & Infrastructure",
        kgCo2ePerUsdWithMargins: 0.8140,
        kgCo2ePerUsdWithoutMargins: 0.7240,
        marginKgCo2ePerUsd: 0.0900,
    },
    {
        id: "cat2-factor-10",
        naicsCode: "335311",
        naicsSectorCategory: "Electrical Equipment",
        naicsTitle: "Power, Distribution, and Specialty Transformer Manufacturing",
        commodityTitle: "Power Transformer Manufacturing",
        category: "Electrical Equipment",
        kgCo2ePerUsdWithMargins: 0.5480,
        kgCo2ePerUsdWithoutMargins: 0.4820,
        marginKgCo2ePerUsd: 0.0660,
    },
];
