import { Scope3SpendStatus } from "../category1/types";

export type { Scope3SpendStatus };

// ---------------------------------------------------------------------------
// 4.1 WTT LOOKUP TYPES
// ---------------------------------------------------------------------------

export type WttFuelUnit = {
    unit_id: string;
    unit_name?: string;
    unit_symbol: string;
    unit_type?: string;
    wtt_emission_factor_id: string;
    kg_co2e: number | string;
    t_co2e: number | string;
    source_reference_code?: string;
};

export type WttFuel = {
    fuel_id: string;
    fuel_name: string;
    fuel_slug: string;
    category_id: string;
    category_name: string;
    units: WttFuelUnit[];
};

export type WttFuelFactorDetail = {
    wtt_emission_factor_id: string;
    fuel_id: string;
    fuel_name: string;
    unit_id: string;
    unit_symbol: string;
    kg_co2e: number;
    t_co2e: number;
    source_reference_code: string;
};

// ---------------------------------------------------------------------------
// 4.2 WTT FUELS ACTIVITIES TYPES
// ---------------------------------------------------------------------------

export type WttFuelActivityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    facility_id: string | null;
    facility_name?: string | null;
    reporting_period: string;
    wtt_fuel_emission_factor_id: string;
    fuel_id: string;
    fuel_name?: string;
    unit_id: string;
    unit_symbol?: string;
    activity_date: string;
    fuel_quantity: number;
    calculated_kg_co2e: number;
    calculated_t_co2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejected_reason?: string | null;
    amended_from_id?: string | null;
};

export type WttFuelActivityEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string | null;
    facilityName: string | null;
    reportingPeriod: string;
    wttFuelEmissionFactorId: string;
    fuelId: string;
    fuelName: string;
    unitId: string;
    unitSymbol: string;
    activityDate: string;
    fuelQuantity: number;
    calculatedKgCo2e: number;
    calculatedTCo2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;
};

export type CreateWttFuelPayload = {
    reporting_period: string;
    facility_id?: string | null;
    wtt_fuel_emission_factor_id: string;
    fuel_id: string;
    unit_id: string;
    activity_date: string;
    fuel_quantity: number;
    notes?: string | null;
};

export type UpdateWttFuelPayload = Partial<CreateWttFuelPayload>;

export type AmendWttFuelPayload = CreateWttFuelPayload & {
    amended_from_id: string;
};

// ---------------------------------------------------------------------------
// 4.3 ELECTRICITY T&D LOSSES ACTIVITIES TYPES
// ---------------------------------------------------------------------------

export type ElectricityTdActivityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    facility_id: string | null;
    facility_name?: string | null;
    reporting_period: string;
    electricity_emission_factor_id: string | null;
    activity_date: string;
    electricity_consumed_kwh: number;
    td_loss_rate: number;
    grid_kg_co2e_per_kwh?: number;
    calculated_kg_co2e: number;
    calculated_t_co2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejected_reason?: string | null;
    amended_from_id?: string | null;
};

export type ElectricityTdActivityEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string | null;
    facilityName: string | null;
    reportingPeriod: string;
    electricityEmissionFactorId: string | null;
    activityDate: string;
    electricityConsumedKwh: number;
    tdLossRate: number;
    gridKgCo2ePerKwh: number;
    calculatedKgCo2e: number;
    calculatedTCo2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;
};

export type CreateElectricityTdPayload = {
    reporting_period: string;
    facility_id?: string | null;
    electricity_emission_factor_id?: string | null;
    activity_date: string;
    electricity_consumed_kwh: number;
    td_loss_rate?: number;
    notes?: string | null;
};

export type UpdateElectricityTdPayload = Partial<CreateElectricityTdPayload>;

export type AmendElectricityTdPayload = CreateElectricityTdPayload & {
    amended_from_id: string;
};

export type Category3FilterParams = {
    reporting_period?: string;
    facility_id?: string;
    status?: string;
    activity_date?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

// CEA National Grid Average default grid emission factor (0.7160 kgCO2e/kWh)
export const DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH = 0.7160;

// India National Grid Loss Rate default (17.0% -> 0.1700)
export const DEFAULT_TD_LOSS_RATE = 0.1700;

// Seeded WTT Fuels fallback list for offline/preview mode
export const DEFAULT_WTT_FUELS: WttFuel[] = [
    {
        fuel_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        fuel_name: "Coal (industrial)",
        fuel_slug: "coal-industrial",
        category_id: "solid-fuels-cat",
        category_name: "Solid fuels",
        units: [
            {
                unit_id: "unit-tonne-coal",
                unit_name: "Tonne",
                unit_symbol: "tonnes",
                unit_type: "mass",
                wtt_emission_factor_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
                kg_co2e: 418.14964,
                t_co2e: 0.41814964,
                source_reference_code: "DEFRA_2025_WTT_SOLID_COAL",
            },
            {
                unit_id: "unit-kwh-coal",
                unit_name: "Kilowatt Hour (Net CV)",
                unit_symbol: "kWh (Net CV)",
                unit_type: "energy",
                wtt_emission_factor_id: "e5f6a7b8-1234-5678-90ab-cdef12345678",
                kg_co2e: 0.05925,
                t_co2e: 0.00005925,
                source_reference_code: "DEFRA_2025_WTT_SOLID_COAL_KWH",
            },
        ],
    },
    {
        fuel_id: "diesel-fuel-id",
        fuel_name: "Diesel (100% mineral diesel)",
        fuel_slug: "diesel-mineral",
        category_id: "liquid-fuels-cat",
        category_name: "Liquid fuels",
        units: [
            {
                unit_id: "unit-litres-diesel",
                unit_name: "Litres",
                unit_symbol: "litres",
                unit_type: "volume",
                wtt_emission_factor_id: "wtt-factor-diesel-litres",
                kg_co2e: 0.61240,
                t_co2e: 0.00061240,
                source_reference_code: "DEFRA_2025_WTT_DIESEL",
            },
            {
                unit_id: "unit-kwh-diesel",
                unit_name: "Kilowatt Hour (Net CV)",
                unit_symbol: "kWh (Net CV)",
                unit_type: "energy",
                wtt_emission_factor_id: "wtt-factor-diesel-kwh",
                kg_co2e: 0.06140,
                t_co2e: 0.00006140,
                source_reference_code: "DEFRA_2025_WTT_DIESEL_KWH",
            },
        ],
    },
    {
        fuel_id: "natural-gas-fuel-id",
        fuel_name: "Natural Gas",
        fuel_slug: "natural-gas",
        category_id: "gaseous-fuels-cat",
        category_name: "Gaseous fuels",
        units: [
            {
                unit_id: "unit-cubic-meters-gas",
                unit_name: "Cubic Metres",
                unit_symbol: "m³",
                unit_type: "volume",
                wtt_emission_factor_id: "wtt-factor-gas-m3",
                kg_co2e: 0.25140,
                t_co2e: 0.00025140,
                source_reference_code: "DEFRA_2025_WTT_NATURAL_GAS_M3",
            },
            {
                unit_id: "unit-kwh-gas",
                unit_name: "Kilowatt Hour (Gross CV)",
                unit_symbol: "kWh (Gross CV)",
                unit_type: "energy",
                wtt_emission_factor_id: "wtt-factor-gas-kwh",
                kg_co2e: 0.02450,
                t_co2e: 0.00002450,
                source_reference_code: "DEFRA_2025_WTT_NATURAL_GAS_KWH",
            },
        ],
    },
];
