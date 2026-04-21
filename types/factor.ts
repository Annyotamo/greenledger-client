import type { ApiEnvelope } from "@/types/api/common";

export type EmissionScope = "scope-1" | "scope-2" | "scope-3";

export interface EmissionStandard {
    name: string;
    version: string;
    sourceType: string;
    year: number;
}

export interface AddFactorRequest {
    fuelName: string;
    fuelType: string;
    unit: string;
    co2eTotal: number;
    co2Factor: number;
    ch4Factor: number;
    n2oFactor: number;
    convertTo: string;
    emissionStandard?: EmissionStandard;
}

export interface FactorRecord extends AddFactorRequest {
    id?: string;
    scope?: EmissionScope;
    createdAt?: string;
    updatedAt?: string;
}

export type AddFactorResponse = ApiEnvelope<FactorRecord | string | null>;
