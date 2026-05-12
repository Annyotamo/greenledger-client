import type { ApiEnvelope } from "@/types/api/common";

export type ReportType = "scope1";

export interface Scope1ActivityData {
    id: string;
    fuelName: string | null;
    fuelType: string | null;
    quantity: number | null;
    cost: number | null;
    facilityName: string | null;
    orgName: string | null;
    unit: string | null;
    email: string | null;
    yearMonth: string | null;
    status: number | null;
    errorMsg: string | null;
    createDate: string | null;
    updateDate: string | null;
}

export interface Scope1FactorData {
    id: string;
    fuelName: string | null;
    fuelType: string | null;
    unit: string | null;
    co2eTotal: number | null;
    co2Factor: number | null;
    ch4Factor: number | null;
    n2oFactor: number | null;
    emissionStandard?: {
        gwpBasis: string | null;
        source: string | null;
        version: string | null;
    } | null;
    year?: string | null;
    facilityName: string | null;
    convertTo: string | null;
    creationDateString: string | null;
    updateDateString: string | null;
}

export interface Scope1ReportRecord {
    id: string;
    facilityName: string | null;
    fuelName: string | null;
    fuelType: string | null;
    co2eTotal: number;
    orgName: string | null;
    co2Factor: number;
    ch4Factor: number;
    n2oFactor: number;
    cost: number;
    activityData: Scope1ActivityData | null;
    scope1FactorData: Scope1FactorData | null;
    reportDate: string | null;
    createDateString: string | null;
    updateDateString: string | null;
    inputUnit: string | null;
    outputUnit: string | null;
}

export type Scope1ReportResponse = ApiEnvelope<Scope1ReportRecord[]>;

export interface Scope1IngestRequest {
    fuelName: string;
    fuelType: string;
    quantity: number;
    cost: number;
    unit: string;
    orgName: string;
    facilityName: string;
    yearMonth: string;
}

export type Scope1IngestResponse = ApiEnvelope<unknown>;

export interface Scope1EmissionsOverlayDropdownData {
    "Gaseous fuels"?: string[];
    Biogas?: string[];
    Biomass?: string[];
    "Liquid fuels"?: string[];
    "all units"?: string[];
    FuelType?: string[];
    "Solid fuels"?: string[];
    [key: string]: string[] | undefined;
}

export type Scope1EmissionsOverlayResponse = ApiEnvelope<Scope1EmissionsOverlayDropdownData>;

export interface Scope1DashboardFuelSummary {
    total_co2e: number;
    fuel: string;
}

export interface Scope1DashboardFacilitySummary {
    total_co2e: number;
    total_cost: number;
    facility: string;
}

export interface Scope1DashboardTotals {
    co2e: number;
    cost: number;
    current_totalCo2: number;
}

export interface Scope1DashboardData {
    fuel_summary: Scope1DashboardFuelSummary[];
    facility_summary: Scope1DashboardFacilitySummary[];
    current_month_total_emission: Scope1DashboardTotals;
    total_emission: Scope1DashboardTotals;
}

export type Scope1DashboardResponse = {
    data?: Scope1DashboardData;
    success?: boolean;
    status?: number;
    message?: string;
    timestamp?: string;
};

export interface Scope1IngestRecord {
    id: string;
    fuelName: string | null;
    fuelType: string | null;
    quantity: number | null;
    cost: number | null;
    facilityName: string | null;
    orgName: string | null;
    unit: string | null;
    email: string | null;
    yearMonth: string | null;
    status: number | null;
    errorMsg: string | null;
    year: string | null;
    createDate: string | null;
    updateDate: string | null;
}

export type Scope1IngestListResponse = {
    data?: Scope1IngestRecord[];
    success?: boolean;
    status?: number;
    message?: string;
    timestamp?: string;
};

export interface Scope2FactorData {
    factorSource: string | null;
    version: string | null;
    year: number | null;
    inputUnit: string | null;
    factor: number | null;
    email: string | null;
    addedBy: string | null;
    updatedBy: string | null;
}

export interface Scope2ActivityDataIngest {
    id: string;
    quantityConsume: number | null;
    outPutQuantityConsume: number | null;
    unit: string | null;
    fuelName: string | null;
    outputUnit: string | null;
    cost: number | null;
    facilityName: string | null;
    orgName: string | null;
    email: string | null;
    yearMonth: string | null;
    year: string | null;
    status: number | null;
    errorMsg: string | null;
    createDate: string | null;
    reportDate: string | null;
    updateDate: string | null;
    updatedby: string | null;
}

export interface Scope2ReportRecord {
    emissionType: string | null;
    quantityConsume: number | null;
    cost: number | null;
    unit: string | null;
    fuelName: string | null;
    outputUnit: string | null;
    co2eTotal: number | null;
    facilityName: string | null;
    orgName: string | null;
    scope2Factor: Scope2FactorData | null;
    scope2ActivityDataIngest: Scope2ActivityDataIngest | null;
    provider: string | null;
    yearMonth: string | null;
    ingest_reference_id: string | null;
    year: string | null;
    createDateString: string | null;
    reportDate: string | null;
}

export type Scope2ReportResponse = ApiEnvelope<Scope2ReportRecord[]>;

export interface Scope2IngestRequest {
    quantityConsume: number;
    unit: string;
    fuelName: string;
    outputUnit: string;
    cost: number;
    facilityName: string;
    orgName: string;
    yearMonth: string;
    year: string;
}

export type Scope2IngestResponse = ApiEnvelope<unknown>;

export interface CompanyAddress {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface CompanyDetails {
    id: string;
    tenantId: string;
    legalCompanyName: string;
    displayName: string;
    industrySector: string;
    cinNumber: string;
    gstNumber: string;
    registeredAddress: CompanyAddress;
    baselineYear: number;
    reportingCurrency: string;
    fiscalYearStartMonth: number;
    logoUrl: string;
    scope1Enabled: boolean;
    scope2Enabled: boolean;
    scope3Enabled: boolean;
    creationDate: string;
    updateDate: string;
}

export type CompanyDetailsResponse = ApiEnvelope<CompanyDetails[]>;
