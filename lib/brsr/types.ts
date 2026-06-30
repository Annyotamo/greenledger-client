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

export type BrsrWaterDisclosurePayload = {
    financial_year_label: string;
    surface_water_kl: string;
    groundwater_kl: string;
    third_party_water_kl: string;
    seawater_desalinated_kl: string;
    others_kl: string;
    total_water_consumption_kl: string;
    turnover_inr: string;
};

export type BrsrWaterDisclosureData = {
    financial_year_label: string;
    surface_water_kl: string;
    groundwater_kl: string;
    third_party_water_kl: string;
    seawater_desalinated_kl: string;
    others_kl: string;
    total_water_consumption_kl: string;
    turnover_inr: string;
    water_intensity_per_inr?: string | null;
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
