import { Scope3SpendStatus } from "../category1/types";

export type { Scope3SpendStatus };

export type AssetClassEnum =
    | "listed_shares_or_corporate_bonds"
    | "business_loan_or_unlisted_equity"
    | "project_finance"
    | "commercial_property_loan"
    | "home_loan_mortgage"
    | "motor_vehicle_loan"
    | "sovereign_debt";

export type AssetClassMetadata = {
    asset_class: AssetClassEnum;
    asset_class_no: number;
    name: string;
    description: string;
};

export type Category15InvestmentDto = {
    id: string;
    tenant_id?: string;
    reporting_period_id: string | null;
    reporting_period_name?: string | null;
    facility_id: string | null;
    facility_name?: string | null;
    facility_code?: string | null;
    activity_date: string;
    what_you_financed: string;
    asset_class_no: number;
    asset_class: AssetClassEnum;
    asset_class_name?: string | null;
    outstanding_amount: number | string;
    total_company_worth: number | string;
    currency?: string;
    company_scope1_emissions?: number | string;
    company_scope2_emissions?: number | string;
    company_scope3_emissions?: number | string;
    attribution_factor?: number | string;
    attribution_factor_percentage?: number | string;
    financed_scope1_emissions?: number | string;
    financed_scope2_emissions?: number | string;
    financed_scope3_emissions?: number | string;
    calculated_t_co2e: number | string;
    calculated_kg_co2e?: number | string;
    status: Scope3SpendStatus;
    notes: string | null;
    rejected_reason?: string | null;
    verified_by?: string | null;
    verified_by_name?: string | null;
    verified_at?: string | null;
    entered_by?: string | null;
    entered_by_name?: string | null;
    is_amendment?: boolean;
    amended_from_id?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type Category15InvestmentEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    reportingPeriodId: string | null;
    reportingPeriodName: string;
    facilityId: string | null;
    facilityName: string | null;
    activityDate: string;
    whatYouFinanced: string;
    assetClassNo: number;
    assetClass: AssetClassEnum;
    assetClassName: string;
    outstandingAmountCrores: number;
    totalCompanyWorthCrores: number;
    currency: string;
    companyScope1Emissions: number;
    companyScope2Emissions: number;
    companyScope3Emissions: number;
    attributionFactor: number;
    attributionFactorPercentage: number;
    financedScope1Emissions: number;
    financedScope2Emissions: number;
    financedScope3Emissions: number;
    calculatedTCo2e: number;
    calculatedKgCo2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;
};

export type CreateCategory15InvestmentPayload = {
    reporting_period_id?: string | null;
    facility_id?: string | null;
    activity_date: string;
    what_you_financed: string;
    asset_class: AssetClassEnum;
    asset_class_no?: number;
    outstanding_amount: number;
    total_company_worth: number;
    currency?: string;
    company_scope1_emissions?: number;
    company_scope2_emissions?: number;
    company_scope3_emissions?: number;
    status?: Scope3SpendStatus;
    notes?: string | null;
};

export type UpdateCategory15InvestmentPayload = Partial<CreateCategory15InvestmentPayload>;

export type AmendCategory15InvestmentPayload = CreateCategory15InvestmentPayload & {
    amended_from_id: string;
};

export type Category15FilterParams = {
    reporting_period_id?: string;
    facility_id?: string;
    asset_class?: AssetClassEnum;
    asset_class_no?: number;
    status?: string;
    activity_date?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

export const DEFAULT_ASSET_CLASSES: AssetClassMetadata[] = [
    {
        asset_class: "listed_shares_or_corporate_bonds",
        asset_class_no: 1,
        name: "Listed shares or corporate bonds",
        description: "Equity and debt investments in listed corporate entities.",
    },
    {
        asset_class: "business_loan_or_unlisted_equity",
        asset_class_no: 2,
        name: "Business loan or unlisted equity",
        description: "Loans or equity investments in private and unlisted businesses.",
    },
    {
        asset_class: "project_finance",
        asset_class_no: 3,
        name: "Project finance",
        description: "Financing designated for specific infrastructure or industrial projects.",
    },
    {
        asset_class: "commercial_property_loan",
        asset_class_no: 4,
        name: "Commercial property loan",
        description: "Loans provided for commercial real estate developments or acquisitions.",
    },
    {
        asset_class: "home_loan_mortgage",
        asset_class_no: 5,
        name: "Home loan / mortgage",
        description: "Residential real estate and mortgage portfolios.",
    },
    {
        asset_class: "motor_vehicle_loan",
        asset_class_no: 6,
        name: "Motor vehicle loan",
        description: "Vehicle fleet financing and personal auto loan portfolios.",
    },
    {
        asset_class: "sovereign_debt",
        asset_class_no: 9,
        name: "Sovereign debt",
        description: "Sovereign bond holdings and government-backed securities.",
    },
];

export type TotalValueMethodInfo = {
    title: string;
    method: string;
    denominatorLabel: string;
    note?: string;
    icon: string;
};

export const ASSET_CLASS_TOTAL_VALUE_METHODS: Record<AssetClassEnum, TotalValueMethodInfo> = {
    listed_shares_or_corporate_bonds: {
        title: "Listed shares or corporate bonds",
        method: "Market cap + total debt (EVIC). Bonds to a private firm: equity + debt.",
        denominatorLabel: "Total Company Worth / EVIC (₹ Cr)",
        note: "Under the PCAF standard, Enterprise Value Including Cash (EVIC) is the sum of market cap at fiscal year-end plus total debt.",
        icon: "account_balance",
    },
    business_loan_or_unlisted_equity: {
        title: "Business loan or unlisted equity",
        method: "Listed borrower: EVIC. Private borrower: total equity + debt.",
        denominatorLabel: "Total Borrower Worth (₹ Cr)",
        note: "For unlisted private businesses, use the book value of total equity plus total debt as the attribution denominator.",
        icon: "business",
    },
    project_finance: {
        title: "Project finance",
        method: "Total project equity + debt",
        denominatorLabel: "Total Project Equity + Debt (₹ Cr)",
        note: "Calculated based on the specific ring-fenced project capital structure rather than the general parent balance sheet.",
        icon: "precision_manufacturing",
    },
    commercial_property_loan: {
        title: "Commercial property loan",
        method: "Property value at origination",
        denominatorLabel: "Property Value at Origination (₹ Cr)",
        note: "Use the official certified commercial property valuation recorded at loan origination.",
        icon: "apartment",
    },
    home_loan_mortgage: {
        title: "Home loan / mortgage",
        method: "Property value at origination",
        denominatorLabel: "Property Value at Origination (₹ Cr)",
        note: "Use the appraised value or property transaction purchase price at mortgage origination.",
        icon: "home",
    },
    motor_vehicle_loan: {
        title: "Motor vehicle loan",
        method: "Total vehicle or fleet value at origination",
        denominatorLabel: "Total Vehicle / Fleet Value at Origination (₹ Cr)",
        note: "Use the total vehicle purchase price or fleet valuation recorded at credit origination.",
        icon: "directions_car",
    },
    sovereign_debt: {
        title: "Sovereign debt",
        method: "PPP-adjusted GDP of that country in international USD",
        denominatorLabel: "PPP-Adjusted GDP (₹ Cr / USD eq.)",
        note: "Purchasing Power Parity (PPP) adjusted Gross Domestic Product of the issuing sovereign state.",
        icon: "public",
    },
};
