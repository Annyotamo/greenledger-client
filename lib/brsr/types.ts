export type BrsrReportingPeriod = {
    id: string;
    name: string;
    reporting_year: number;
    period_start: string;
    period_end: string;
    period_status: "open" | "closed" | "locked";
};

export type BrsrEnergyTotals = {
    renewable_electricity_gj: string;
    renewable_fuel_gj: string;
    renewable_other_gj: string;
    renewable_total_gj: string;
    non_renewable_electricity_gj: string;
    non_renewable_fuel_gj: string;
    non_renewable_other_gj: string;
    non_renewable_total_gj: string;
    grand_total_gj: string;
    energy_intensity_per_inr: string | null;
    energy_intensity_ppp: string | null;
    energy_intensity_physical: string | null;
    energy_intensity_physical_unit: string | null;
    fuel_activity_count: number;
    electricity_activity_count: number;
    skipped_fuel_activity_count: number;
};

export type BrsrSkippedActivity = {
    activity_id: string;
    fuel_name: string;
    quantity: string;
    quantity_unit_symbol: string;
    reason: string;
};

export type BrsrEnergyConsumptionData = {
    reporting_period: BrsrReportingPeriod;
    turnover_inr: number | null;
    totals: BrsrEnergyTotals;
    skipped_fuel_activities: BrsrSkippedActivity[];
    generated_at: string;
};

export type BrsrEnergyConsumptionResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: BrsrEnergyConsumptionData;
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
};

export type BrsrWaterDischargeDestinationInput = {
    no_treatment_kl: number;
    with_treatment_kl: number;
    treatment_level?: string | null;
};

export type BrsrWaterDisclosurePayload = {
    financial_year_label: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
    withdrawal: {
        surface_water_kl: number;
        groundwater_kl: number;
        third_party_water_kl: number;
        seawater_desalinated_kl: number;
        others_kl: number;
    };
    discharge: {
        surface_water: BrsrWaterDischargeDestinationInput;
        groundwater: BrsrWaterDischargeDestinationInput;
        seawater: BrsrWaterDischargeDestinationInput;
        third_party: BrsrWaterDischargeDestinationInput;
        others: BrsrWaterDischargeDestinationInput;
    };
    total_water_consumption_kl?: number | null;
};

export type BrsrWaterTotals = {
    withdrawal: {
        surface_water_kl: string;
        groundwater_kl: string;
        third_party_water_kl: string;
        seawater_desalinated_kl: string;
        others_kl: string;
    };
    total_water_withdrawal_kl: string;
    discharge: {
        surface_water: {
            no_treatment_kl: string;
            with_treatment_kl: string;
            treatment_level?: string | null;
        };
        groundwater: {
            no_treatment_kl: string;
            with_treatment_kl: string;
            treatment_level?: string | null;
        };
        seawater: {
            no_treatment_kl: string;
            with_treatment_kl: string;
            treatment_level?: string | null;
        };
        third_party: {
            no_treatment_kl: string;
            with_treatment_kl: string;
            treatment_level?: string | null;
        };
        others: {
            no_treatment_kl: string;
            with_treatment_kl: string;
            treatment_level?: string | null;
        };
    };
    total_water_discharge_kl: string;
    total_water_consumption_kl: string;
    water_intensity_per_inr: string | null;
    water_intensity_ppp: string | null;
    water_intensity_physical: string | null;
    water_intensity_physical_unit: string | null;
};

export type BrsrWaterDisclosureData = {
    financial_year_label: string;
    turnover_inr: number;
    inputs: BrsrWaterDisclosurePayload;
    totals: BrsrWaterTotals;
};

export type BrsrWaterDisclosureResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: BrsrWaterDisclosureData;
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
};

export interface WasteRecoveryItem {
    recycled_tonne: number;
    reused_tonne: number;
    other_recovery_tonne: number;
    total_tonne?: string | number;
}

export interface WasteDisposalItem {
    incineration_tonne: number;
    landfilling_tonne: number;
    other_disposal_tonne: number;
    total_tonne?: string | number;
}

export interface WasteGenerationInput {
    plastic_waste_tonne: number;
    ewaste_tonne: number;
    bio_medical_waste_tonne: number;
    construction_and_demolition_waste_tonne: number;
    battery_waste_tonne: number;
    radioactive_waste_tonne: number;
    other_hazardous_waste_tonne: number;
    fly_ash_tonne: number;
    non_hazardous_solid_waste_tonne: number;
}

export interface WasteRecoveryInput {
    plastic_waste: WasteRecoveryItem;
    ewaste: WasteRecoveryItem;
    bio_medical_waste: WasteRecoveryItem;
    construction_and_demolition_waste: WasteRecoveryItem;
    battery_waste: WasteRecoveryItem;
    radioactive_waste: WasteRecoveryItem;
    other_hazardous_waste: WasteRecoveryItem;
    fly_ash: WasteRecoveryItem;
    non_hazardous_solid_waste: WasteRecoveryItem;
}

export interface WasteDisposalInput {
    plastic_waste: WasteDisposalItem;
    ewaste: WasteDisposalItem;
    bio_medical_waste: WasteDisposalItem;
    construction_and_demolition_waste: WasteDisposalItem;
    battery_waste: WasteDisposalItem;
    radioactive_waste: WasteDisposalItem;
    other_hazardous_waste: WasteDisposalItem;
    fly_ash: WasteDisposalItem;
    non_hazardous_solid_waste: WasteDisposalItem;
}

export interface BRSRWasteDisclosurePayload {
    financial_year_label: string;
    turnover_inr: number;
    physical_output_tonnes: number;
    ppp_conversion_factor?: number;
    physical_output_unit?: string;
    generation: WasteGenerationInput;
    recovery: WasteRecoveryInput;
    disposal: WasteDisposalInput;
}

export interface WasteGenerationTotals {
    plastic_waste_tonne: string;
    ewaste_tonne: string;
    bio_medical_waste_tonne: string;
    construction_and_demolition_waste_tonne: string;
    battery_waste_tonne: string;
    radioactive_waste_tonne: string;
    other_hazardous_waste_tonne: string;
    fly_ash_tonne: string;
    non_hazardous_solid_waste_tonne: string;
    other_non_hazardous_waste_tonne: string;
    total_tonne: string;
}

export interface WasteRecoveryTotalsCategoryItem {
    recycled_tonne: string;
    reused_tonne: string;
    other_recovery_tonne: string;
    total_tonne: string;
}

export interface WasteRecoveryTotals {
    plastic_waste: WasteRecoveryTotalsCategoryItem;
    ewaste: WasteRecoveryTotalsCategoryItem;
    bio_medical_waste: WasteRecoveryTotalsCategoryItem;
    construction_and_demolition_waste: WasteRecoveryTotalsCategoryItem;
    battery_waste: WasteRecoveryTotalsCategoryItem;
    radioactive_waste: WasteRecoveryTotalsCategoryItem;
    other_hazardous_waste: WasteRecoveryTotalsCategoryItem;
    fly_ash: WasteRecoveryTotalsCategoryItem;
    non_hazardous_solid_waste: WasteRecoveryTotalsCategoryItem;
    other_non_hazardous_waste: WasteRecoveryTotalsCategoryItem;
    total_recycled_tonne: string;
    total_reused_tonne: string;
    total_other_recovery_tonne: string;
    total_recovered_tonne: string;
}

export interface WasteDisposalTotalsCategoryItem {
    incineration_tonne: string;
    landfilling_tonne: string;
    other_disposal_tonne: string;
    total_tonne: string;
}

export interface WasteDisposalTotals {
    plastic_waste: WasteDisposalTotalsCategoryItem;
    ewaste: WasteDisposalTotalsCategoryItem;
    bio_medical_waste: WasteDisposalTotalsCategoryItem;
    construction_and_demolition_waste: WasteDisposalTotalsCategoryItem;
    battery_waste: WasteDisposalTotalsCategoryItem;
    radioactive_waste: WasteDisposalTotalsCategoryItem;
    other_hazardous_waste: WasteDisposalTotalsCategoryItem;
    fly_ash: WasteDisposalTotalsCategoryItem;
    non_hazardous_solid_waste: WasteDisposalTotalsCategoryItem;
    other_non_hazardous_waste: WasteDisposalTotalsCategoryItem;
    total_incineration_tonne: string;
    total_landfilling_tonne: string;
    total_other_disposal_tonne: string;
    total_disposed_tonne: string;
}

export interface BRSRWasteTotalsResponse {
    total_waste_tonne: string;
    generation: WasteGenerationTotals;
    recovery: WasteRecoveryTotals;
    disposal: WasteDisposalTotals;
    waste_intensity_per_inr: string;
    waste_intensity_per_physical_output: string;
    waste_intensity_ppp?: string | null;
    waste_intensity_physical_unit?: string | null;
    total_recovered_tonne?: string;
    total_disposed_tonne?: string;
}

export type BrsrWasteDisclosurePayload = BRSRWasteDisclosurePayload;
export type BrsrWasteTotals = BRSRWasteTotalsResponse;
export type BRSRWasteCategoryBreakdown = WasteGenerationInput;
export type BRSRWasteRecoveryInput = WasteRecoveryInput;
export type BRSRWasteDisposalInput = WasteDisposalInput;

export interface BRSRWasteDisclosureData {
    financial_year_label: string;
    turnover_inr: string | number;
    physical_output_tonnes: string | number;
    totals: BRSRWasteTotalsResponse;
    inputs?: any;
}

export type BrsrWasteDisclosureData = BRSRWasteDisclosureData;

export interface BRSRWasteDisclosureResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: BRSRWasteDisclosureData;
    error?: null | unknown;
    method?: string;
    path?: string;
    timestamp?: string;
}

export type BrsrWasteDisclosureResponse = BRSRWasteDisclosureResponse;

// ==========================================
// BRSR Air Disclosure Types & Schema
// ==========================================

export type AttachedUnitEnum =
    | "Sponge iron / DRI"
    | "Steel melting"
    | "Ferro alloy"
    | "Blast furnace"
    | "Sinter plant"
    | "Pellet plant"
    | "Coke oven"
    | "Captive power"
    | "Other";

export type ConcentrationUnit = "mg_per_nm3";
export type FlowRateUnit = "nm3_per_hour";

export interface BrsrAirValueWithUnit<U extends string> {
    value: number;
    unit: U;
}

export interface BrsrAirPermittedLimits {
    permitted_limit_nox: BrsrAirValueWithUnit<ConcentrationUnit>;
    permitted_limit_sox: BrsrAirValueWithUnit<ConcentrationUnit>;
    permitted_limit_pm: BrsrAirValueWithUnit<ConcentrationUnit>;
    permitted_flow_rate: BrsrAirValueWithUnit<FlowRateUnit>;
}

export interface BrsrAirReadingInput {
    sampling_date: string;
    gas_flow_rate: BrsrAirValueWithUnit<FlowRateUnit>;
    nox?: BrsrAirValueWithUnit<ConcentrationUnit>;
    sox?: BrsrAirValueWithUnit<ConcentrationUnit>;
    particulate_matter?: BrsrAirValueWithUnit<ConcentrationUnit>;
    pop?: BrsrAirValueWithUnit<ConcentrationUnit> | null;
    voc?: BrsrAirValueWithUnit<ConcentrationUnit> | null;
    hap?: BrsrAirValueWithUnit<ConcentrationUnit> | null;
}

export interface BrsrAirStackInput {
    attached_unit: AttachedUnitEnum | string;
    stack_title: string;
    operating_hours_per_year: number;
    permitted_limits: BrsrAirPermittedLimits;
    report_number?: string | null;
    is_pop_monitored?: boolean;
    is_voc_monitored?: boolean;
    is_hap_monitored?: boolean;
    readings: BrsrAirReadingInput[];
}

export interface BrsrAirOtherPollutantInput {
    label: string;
    quantity: number;
}

export interface BrsrAirDisclosurePayload {
    financial_year_label: string;
    stacks: BrsrAirStackInput[];
    others?: BrsrAirOtherPollutantInput[] | null;
}

export interface BrsrAirPollutantValues {
    nox?: number | string | null;
    sox?: number | string | null;
    particulate_matter?: number | string | null;
    pop?: number | string | null;
    voc?: number | string | null;
    hap?: number | string | null;
    unit?: string | null;
}

export interface BrsrAirGasDetailMetric {
    pollutant_key: string;
    pollutant_name: string;
    average_concentration_mg_per_nm3: number | null;
    emission_rate_kg_per_hour: number | null;
    annual_emission_tonnes_per_year: number | null;
    average_gas_flow_rate_nm3_per_hour: number | null;
    operating_hours_per_year: number | null;
    permitted_limit_mg_per_nm3: number | null;
    is_exceeding_permitted_limit: boolean | null;
    is_monitored: boolean;
}

export interface BrsrAirCalculatedStack {
    attached_unit: AttachedUnitEnum | string;
    stack_title: string;
    total_readings?: number;
    operating_hours_per_year: number;
    report_number?: string | null;
    average_gas_flow_rate: BrsrAirValueWithUnit<FlowRateUnit>;
    permitted_limits: BrsrAirPermittedLimits;
    average_concentration: BrsrAirPollutantValues;
    emission_per_hour: BrsrAirPollutantValues;
    emission_per_year: BrsrAirPollutantValues;
    gas_details: Record<string, BrsrAirGasDetailMetric>;
    is_pop_monitored?: boolean;
    is_voc_monitored?: boolean;
    is_hap_monitored?: boolean;
    readings?: BrsrAirReadingInput[];
}

export interface BrsrAirStackPresetsData {
    attached_units: AttachedUnitEnum[];
    presets: Record<string, string[]>;
}

export interface BrsrAirStackPresetsResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: BrsrAirStackPresetsData;
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
}

export interface BrsrAirOptionalPollutantDisclosures {
    pop_monitored_stacks_count: number;
    voc_monitored_stacks_count: number;
    hap_monitored_stacks_count: number;
    total_pop_tonnes_per_year: number | null;
    total_voc_tonnes_per_year: number | null;
    total_hap_tonnes_per_year: number | null;
    average_pop_mg_per_nm3: number | null;
    average_voc_mg_per_nm3: number | null;
    average_hap_mg_per_nm3: number | null;
}

export interface BrsrAirTotals {
    stacks: BrsrAirCalculatedStack[];
    stack_results?: BrsrAirCalculatedStack[];
    plant_gas_details?: Record<string, BrsrAirGasDetailMetric>;
    plant_total_per_pollutant: BrsrAirPollutantValues;
    plant_average_concentration: BrsrAirPollutantValues;
    optional_pollutant_disclosures?: BrsrAirOptionalPollutantDisclosures;
}

export interface BrsrAirDisclosureData {
    financial_year_label: string;
    inputs: BrsrAirDisclosurePayload;
    totals: BrsrAirTotals;
}

export interface BrsrAirDisclosureResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: BrsrAirDisclosureData;
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
}

