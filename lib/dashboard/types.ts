export type TrendDirection = "up" | "down" | "neutral";

export type MetricCardData = {
    id: string;
    label: string;
    icon: string;
    value: number;
    unit: string;
    trend?: { value: string; direction: TrendDirection };
    statusLabel?: string;
    progressPercent: number;
    progressClassName?: string;
};

export type EmissionsTrendPoint = {
    month: string;
    actual: number;
    target: number;
};

export type EnergyTrendPoint = {
    month: string;
    captive: number;
    grid: number;
};

export type EnergyBarItem = {
    label: string;
    value: number;
    percent: number;
    color: string;
};

export type EnergySourceNode = {
    label: string;
    value: number;
    unit: string;
    children?: EnergySourceNode[];
    note?: string;
};

export type FacilityRow = {
    id: string;
    region: string;
    status: "ACTIVE" | "INACTIVE";
    emissions: number;
    yoyChange: string;
    yoyDirection: TrendDirection;
    dataQuality: number;
};

export type ActivityItem = {
    id: string;
    icon: string;
    iconBgClassName: string;
    iconColorClassName: string;
    title: string;
    subtitle: string;
};

export type Scope1FuelItem = {
    label: string;
    value: number;
    unit: string;
    percent: number;
};

export type Scope2Segment = {
    label: string;
    percent: number;
    color: string;
};

export type ScopeComparisonMonth = {
    month: string;
    scope1: number;
    scope2: number;
};

export type DashboardTab = "emissions" | "energy";

// ==========================================
// API DTO Types for GET /tenant/energy/dashboard
// ==========================================

export interface EnergyDashboardSummaryDto {
    total_electricity_consumed_kwh: string;
    total_electricity_consumed_mwh: string;
    total_produced_electricity_kwh: string;
    total_produced_electricity_mwh: string;
    total_imported_electricity_kwh: string;
    total_imported_electricity_mwh: string;
    total_exported_electricity_kwh: string;
    total_exported_electricity_mwh: string;
    grid_dependency_percentage: string;
    grid_displacement_kwh: string;
    grid_displacement_mwh: string;
    grid_displacement_percentage: string;
}

export interface ProductionSourceItemDto {
    source_type: string;
    electricity_kwh: string;
    electricity_mwh: string;
    activity_count: number;
}

export interface ProductionBreakdownDto {
    renewable_produced_kwh: string;
    renewable_produced_mwh: string;
    non_renewable_produced_kwh: string;
    non_renewable_produced_mwh: string;
    by_source: ProductionSourceItemDto[];
}

export interface ImportTypeItemDto {
    electricity_activity_type: string;
    electricity_kwh: string;
    electricity_mwh: string;
    activity_count: number;
}

export interface ImportBreakdownDto {
    grid_import_kwh: string;
    grid_import_mwh: string;
    renewable_import_kwh: string;
    renewable_import_mwh: string;
    by_type: ImportTypeItemDto[];
}

export interface FacilityEnergySummaryDto {
    facility_id: string;
    facility_name: string;
    facility_code: string;
    activity_count: number;
    produced_electricity_kwh: string;
    produced_electricity_mwh: string;
    imported_electricity_kwh: string;
    imported_electricity_mwh: string;
    exported_electricity_kwh: string;
    exported_electricity_mwh: string;
    consumed_electricity_kwh: string;
    consumed_electricity_mwh: string;
    grid_dependency_percentage: string;
    grid_displacement_kwh: string;
    grid_displacement_mwh: string;
}

export interface FuelSummaryItemDto {
    fuel_id: string;
    fuel_name: string;
    quantity: string;
    unit_symbol: string;
    energy_content_gj: string;
    generated_electricity_kwh: string;
    generated_electricity_mwh: string;
    activity_count: number;
}

export interface FuelActivitiesSummaryDto {
    total_fuel_consumed_gj: string;
    total_electricity_generated_kwh: string;
    total_electricity_generated_mwh: string;
    fuels: FuelSummaryItemDto[];
}

export interface ElectricityActivityItemDto {
    id: string;
    facility_id: string;
    facility_name: string;
    facility_code: string;
    meter_id: string | null;
    meter_name: string | null;
    meter_identifier: string | null;
    reporting_period_id: string;
    reporting_period_name: string;
    activity_start_date: string;
    activity_end_date: string;
    status: string;
    electricity_activity_type: string;
    source_type: string;
    supplier_name: string | null;
    certificate_reference: string | null;
    electricity_kwh: string;
    electricity_mwh: string;
    data_quality_tier: string;
    estimation_basis: string | null;
    is_amendment: boolean;
    amended_from_id: string | null;
    factor_standard: string | null;
    factor_version: string | null;
    factor_data_year: number | null;
    factor_effective_from: string | null;
    factor_effective_to: string | null;
    factor_source_url: string | null;
    calculated_kg_co2e: string;
    calculated_t_co2e: string;
    calculated_kg_co2: string | null;
    calculated_kg_ch4: string | null;
    calculated_kg_n2o: string | null;
    calculation_method: string | null;
    notes: string | null;
}

export interface FuelActivityItemDto {
    id: string;
    facility_id: string;
    facility_name: string;
    facility_code: string;
    meter_id: string | null;
    meter_name: string | null;
    meter_identifier: string | null;
    reporting_period_id: string;
    reporting_period_name: string;
    activity_start_date: string;
    activity_end_date: string;
    status: string;
    emission_type: string;
    fuel_id: string;
    fuel_name: string;
    quantity: string;
    quantity_unit_symbol: string;
    energy_content_gj: string;
    generated_electricity_kwh: string;
    generated_electricity_mwh: string;
    data_quality_tier: string;
    estimation_basis: string | null;
    is_amendment: boolean;
    amended_from_id: string | null;
    emission_factor_id: string;
    factor_standard: string | null;
    factor_version: string | null;
    source_reference_code: string | null;
    factor_data_year: number | null;
    factor_effective_from: string | null;
    factor_effective_to: string | null;
    factor_source_url: string | null;
    calculated_kg_co2e: string;
    calculated_t_co2e: string;
    calculated_kg_co2: string | null;
    calculated_kg_ch4: string | null;
    calculated_kg_n2o: string | null;
    calculation_method: string | null;
    notes: string | null;
}

export interface ActivityDocumentItemDto {
    id: string;
    created_at: string;
    updated_at: string;
    fuel_activity_id: string | null;
    electricity_activity_id: string | null;
    document_type: string;
    document_name: string;
    source_url: string;
    notes: string | null;
    document_date: string;
    issued_by: string | null;
    uploaded_by: string;
}

export interface MonthlyTrendItemDto {
    month: string;
    month_label: string;
    captive_generated_kwh: string;
    captive_generated_mwh: string;
    grid_sourced_kwh: string;
    grid_sourced_mwh: string;
    renewable_sourced_kwh: string;
    renewable_sourced_mwh: string;
    total_consumed_kwh: string;
    total_consumed_mwh: string;
    captive_share_percentage: string;
}

export interface EnergyDashboardResponseDataDto {
    summary: EnergyDashboardSummaryDto;
    production_breakdown: ProductionBreakdownDto;
    import_breakdown: ImportBreakdownDto;
    facility_summaries: FacilityEnergySummaryDto[];
    fuel_activities_summary: FuelActivitiesSummaryDto;
    electricity_activities: ElectricityActivityItemDto[];
    fuel_activities: FuelActivityItemDto[];
    activity_documents: ActivityDocumentItemDto[];
    monthly_trends: MonthlyTrendItemDto[];
}

export interface EnergyDashboardApiResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: EnergyDashboardResponseDataDto;
}

// Derived Clean Data Model for Client Application
export interface ParsedFacilityEnergySummary {
    facilityId: string;
    facilityName: string;
    facilityCode: string;
    activityCount: number;
    producedMwh: number;
    importedMwh: number;
    exportedMwh: number;
    consumedMwh: number;
    gridDependencyPercent: number;
    gridDisplacementMwh: number;
}

export interface ParsedEnergyDashboardData {
    summary: {
        totalConsumedMwh: number;
        totalConsumedKwh: number;
        totalProducedMwh: number;
        totalProducedKwh: number;
        totalImportedMwh: number;
        totalImportedKwh: number;
        totalExportedMwh: number;
        gridDependencyPercentage: number;
        gridDisplacementMwh: number;
        gridDisplacementPercentage: number;
    };
    metricCards: MetricCardData[];
    monthlyTrends: EnergyTrendPoint[];
    energyMixSegments: Scope2Segment[];
    energyMixTotalMwh: number;
    energyHierarchy: EnergyBarItem[];
    energySourceTree: EnergySourceNode[];
    captiveGenerationSources: EnergyBarItem[];
    boilerFuelMix: EnergyBarItem[];
    facilities: ParsedFacilityEnergySummary[];
    recentActivitiesCount: number;
    documentsCount: number;
    raw: EnergyDashboardResponseDataDto;
}
