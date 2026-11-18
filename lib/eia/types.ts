export interface EIAValueWithUnit<U extends string = string> {
    value: number | string;
    unit: U;
}

export type EIAPollutantUnit = "mg_per_nm3" | "mg/Nm3" | "ppm" | "%" | string;
export type EIAFlowRateUnit = "nm3_per_hour" | "Nm3/hr" | string;

export interface EIAPermittedLimits {
    permitted_limit_nox?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_limit_sox?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_limit_pm?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_limit_pm10?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_limit_pm25?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_limit_co?: EIAValueWithUnit<EIAPollutantUnit>;
    permitted_flow_rate?: EIAValueWithUnit<EIAFlowRateUnit>;
    custom_limits?: Record<string, EIAValueWithUnit<EIAPollutantUnit>>;
    [key: string]: any;
}

export interface EIAReadingInput {
    sampling_date: string;
    gas_flow_rate: EIAValueWithUnit<EIAFlowRateUnit>;
    nox?: EIAValueWithUnit<EIAPollutantUnit> | null;
    sox?: EIAValueWithUnit<EIAPollutantUnit> | null;
    pm?: EIAValueWithUnit<EIAPollutantUnit> | null;
    pm10?: EIAValueWithUnit<EIAPollutantUnit> | null;
    pm25?: EIAValueWithUnit<EIAPollutantUnit> | null;
    co?: EIAValueWithUnit<EIAPollutantUnit> | null;
    particulate_matter?: EIAValueWithUnit<EIAPollutantUnit> | null;
    pop?: EIAValueWithUnit<EIAPollutantUnit> | null;
    voc?: EIAValueWithUnit<EIAPollutantUnit> | null;
    hap?: EIAValueWithUnit<EIAPollutantUnit> | null;
    co2_percent?: number | null;
    o2_percent?: number | null;
    custom_gases?: Record<string, EIAValueWithUnit<EIAPollutantUnit>>;
}

export interface EIAStackInput {
    attached_unit: string;
    stack_title: string;
    operating_hours_per_year: number;
    report_number?: string | null;
    permitted_limits: EIAPermittedLimits;
    readings: EIAReadingInput[];
    is_nox_monitored?: boolean;
    is_sox_monitored?: boolean;
    is_pm_monitored?: boolean;
    is_pm10_monitored?: boolean;
    is_pm25_monitored?: boolean;
    is_co_monitored?: boolean;
    is_pop_monitored?: boolean;
    is_voc_monitored?: boolean;
    is_hap_monitored?: boolean;
    is_co2_monitored?: boolean;
    is_o2_monitored?: boolean;
}

export interface EIAOtherPollutantInput {
    label: string;
    quantity: number | string;
    unit?: string;
}

export interface EIAAirEmissionsPayload {
    reporting_period_id?: string;
    financial_year_label: string;
    facility_id?: string | null;
    stacks: EIAStackInput[];
    others?: EIAOtherPollutantInput[] | null;
    status?: "draft" | "submitted" | "verified" | "approved";
}

export interface EIACalculatedReading {
    sampling_date: string;
    gas_flow_rate_nm3_hr: number;
    hourly_emission_kg_hr: Record<string, number>;
    exceedances: Record<string, boolean>;
}

export interface EIACalculatedStack {
    attached_unit: string;
    stack_title: string;
    operating_hours_per_year: number;
    readings_count: number;
    average_flow_rate_nm3_hr: number;
    average_concentration_mg_nm3: Record<string, number>;
    average_hourly_emission_kg_hr: Record<string, number>;
    annual_emissions_tonnes_year: Record<string, number>;
    exceedances_count: Record<string, number>;
    calculated_readings?: EIACalculatedReading[];
    permitted_limits?: EIAPermittedLimits;
    readings?: EIAReadingInput[];
    report_number?: string | null;
    is_nox_monitored?: boolean;
    is_sox_monitored?: boolean;
    is_pm_monitored?: boolean;
    is_pm10_monitored?: boolean;
    is_pm25_monitored?: boolean;
    is_co_monitored?: boolean;
    is_pop_monitored?: boolean;
    is_voc_monitored?: boolean;
    is_hap_monitored?: boolean;
    is_co2_monitored?: boolean;
    is_o2_monitored?: boolean;
}

export interface EIAPlantTotals {
    total_stacks_monitored: number;
    total_operating_hours: number;
    plant_combined_hourly_rate_kg_hr: Record<string, number>;
    plant_total_annual_emissions_tonnes_year: Record<string, number>;
    plant_pooled_average_concentration_mg_nm3: Record<string, number>;
    plant_total_exceedances_by_pollutant: Record<string, number>;
}

export interface EIAAirEmissionsComputedData {
    financial_year_label: string;
    facility_id?: string | null;
    reporting_period_id?: string;
    stacks: EIACalculatedStack[];
    plant_totals: EIAPlantTotals;
    computed_totals?: any;
    id?: string;
    tenant_id?: string;
    status?: string;
    verified_by?: string | null;
    verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface EIAStackPresetsData {
    categories: string[];
    presets: Record<string, string[]>;
}

export interface EIAApiResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: any;
    method?: string;
    path?: string;
    timestamp?: string;
}
