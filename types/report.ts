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
