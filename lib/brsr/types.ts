export type BrsrReportingPeriod = {
    id: string;
    name: string;
    reporting_year: number;
    period_start: string;
    period_end: string;
    period_status: "open" | "closed" | "locked";
};

export interface APIResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: any;
    method?: string;
    path?: string;
    timestamp?: string;
}

export type BRSRStatus = "draft" | "submitted" | "verified" | "approved" | "rejected";

// ==========================================
// SECTION A: GENERAL DISCLOSURES
// ==========================================

export interface BRSRBusinessActivity {
    description: string;
    nic_code: string;
    turnover_percentage: number;
}

export interface BRSRProductSold {
    product_name: string;
    nic_code: string;
    turnover_percentage: number;
}

export interface BRSREntityDetails {
    cin: string;
    company_name: string;
    year_of_incorporation: number | null;
    registered_office_address: string;
    corporate_address: string;
    email: string;
    telephone: string;
    website: string;
    stock_exchanges: string[];
    paid_up_capital_inr: number | null;
}

export interface BRSRProductsServices {
    business_activities: BRSRBusinessActivity[];
    products_sold: BRSRProductSold[];
}

export interface BRSROperations {
    plants_national: number;
    offices_national: number;
    plants_international: number;
    offices_international: number;
    export_turnover_percent: number;
    customer_types_brief: string;
}

export interface BRSREmployeeCategory {
    male: number;
    female: number;
    other: number;
    total: number;
}

export interface BRSRRepresentation {
    count: number;
    percentage: number;
}

export interface BRSREmployees {
    permanent_employees: BRSREmployeeCategory;
    other_employees: BRSREmployeeCategory;
    permanent_workers: BRSREmployeeCategory;
    other_workers: BRSREmployeeCategory;
    differently_abled_employees: BRSREmployeeCategory;
    differently_abled_workers: BRSREmployeeCategory;
    women_in_board: BRSRRepresentation;
    women_in_kmp: BRSRRepresentation;
}

export interface BRSRHoldingSubsidiary {
    entity_name: string;
    entity_type: string;
    shares_held_percent: number;
    participates_in_br: boolean;
}

export interface BRSRCSRDetails {
    is_applicable: boolean;
    turnover_inr: number | null;
    net_worth_inr: number | null;
    total_csr_spend_inr: number | null;
}

export interface BRSRStakeholderGrievance {
    stakeholder_group: string;
    has_mechanism: boolean;
    weblink: string;
    complaints_filed_count: number;
    complaints_pending_count: number;
    remarks: string;
}

export interface BRSRSectionAData {
    id?: string;
    tenant_id?: string;
    reporting_period_id: string;
    financial_year_label: string;
    entity_details: BRSREntityDetails;
    products_services: BRSRProductsServices;
    operations: BRSROperations;
    employees: BRSREmployees;
    holding_subsidiaries: BRSRHoldingSubsidiary[];
    csr_details: BRSRCSRDetails;
    stakeholder_grievances: BRSRStakeholderGrievance[];
    status: BRSRStatus;
    verified_by?: string | null;
    verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type BRSRSectionAResponse = APIResponse<BRSRSectionAData | null>;

// ==========================================
// SECTION B: MANAGEMENT & PROCESS
// ==========================================

export interface BRSRPolicyMatrixItem {
    principle_code: string;
    principle_name: string;
    has_policy: boolean;
    board_approved: boolean;
    web_link: string;
    translated_into_procedures: boolean;
    value_chain_adheres: boolean;
}

export interface BRSRCommitmentGoal {
    goal_statement: string;
    defined_timeline: string;
    progress_status: string;
    reasons_if_delayed?: string | null;
}

export interface BRSRGovernanceLeadership {
    director_statement: string;
    highest_authority_name: string;
    highest_authority_din: string;
    highest_authority_designation: string;
    has_sustainability_committee: boolean;
    sustainability_committee_details: string;
}

export interface BRSRReviewOversight {
    policy_review_body: string;
    policy_review_frequency: string;
    statutory_compliance_review_frequency: string;
}

export interface BRSRIndependentEvaluation {
    has_independent_evaluation: boolean;
    agency_name: string;
    principles_assessed: string;
    evaluation_brief: string;
}

export interface BRSRSectionBData {
    id?: string;
    tenant_id?: string;
    reporting_period_id: string;
    financial_year_label: string;
    policy_matrix: BRSRPolicyMatrixItem[];
    certifications_and_standards: string[];
    commitments_and_goals: BRSRCommitmentGoal[];
    governance_leadership: BRSRGovernanceLeadership;
    review_and_oversight: BRSRReviewOversight;
    independent_evaluation: BRSRIndependentEvaluation;
    status: BRSRStatus;
    created_at?: string;
    updated_at?: string;
}

export type BRSRSectionBResponse = APIResponse<BRSRSectionBData | null>;

// ==========================================
// SECTION C: SOCIAL & GOVERNANCE PRINCIPLES
// ==========================================

export interface BRSRP1Ethics {
    fines_penalties_inr: number;
    anti_corruption_cases_count: number;
    conflict_of_interest_complaints_count: number;
    disciplinary_action_cases_count: number;
    anti_bribery_training_coverage_percent: number;
}

export interface BRSRP2Products {
    rd_capex_esg_percent: number;
    lca_conducted_projects_count: number;
    recycled_input_materials_percent: number;
    epr_plan_implemented: boolean;
    sustainable_sourcing_percent: number;
}

export interface BRSRP3Employees {
    health_and_safety_coverage_percent: number;
    minimum_wages_compliant: boolean;
    maternity_benefits_availed_count: number;
    paternity_benefits_availed_count: number;
    unionized_workforce_percent: number;
    median_safety_training_hours: number;
    lost_time_injury_frequency_rate: number;
}

export interface BRSRP4Stakeholders {
    consultation_channels: string;
    vulnerable_groups_identified: string;
    vulnerable_groups_engagement_summary: string;
}

export interface BRSRP5HumanRights {
    employees_trained_on_human_rights_percent: number;
    minimum_wages_paid_percent: number;
    discrimination_cases_count: number;
    sexual_harassment_cases_count: number;
    child_labor_cases_count: number;
    forced_labor_cases_count: number;
}

export interface BRSRP7Policy {
    trade_association_memberships: string[];
    anti_competitive_conduct_cases_count: number;
    public_policy_advocacy_summary: string;
}

export interface BRSRP8InclusiveGrowth {
    social_impact_assessments_count: number;
    resettlement_and_rehabilitation_cases_count: number;
    direct_csr_beneficiaries_count: number;
    preferential_procurement_msme_percent: number;
    local_sourcing_percent: number;
}

export interface BRSRP9ConsumerValue {
    data_privacy_complaints_count: number;
    cyber_security_incidents_count: number;
    product_recalls_count: number;
    delivery_and_quality_complaints_count: number;
    customer_satisfaction_survey_score: number;
    cyber_security_policy_in_place: boolean;
}

export interface BRSRSectionCData {
    id?: string;
    tenant_id?: string;
    reporting_period_id: string;
    financial_year_label: string;
    principle_1_ethics: BRSRP1Ethics;
    principle_2_products: BRSRP2Products;
    principle_3_employees: BRSRP3Employees;
    principle_4_stakeholders: BRSRP4Stakeholders;
    principle_5_human_rights: BRSRP5HumanRights;
    principle_7_policy: BRSRP7Policy;
    principle_8_inclusive_growth: BRSRP8InclusiveGrowth;
    principle_9_consumer_value: BRSRP9ConsumerValue;
    status: BRSRStatus;
    created_at?: string;
    updated_at?: string;
}

export type BRSRSectionCResponse = APIResponse<BRSRSectionCData | null>;

// ==========================================
// PRINCIPLE 6: STATUTORY DISCLOSURES
// ==========================================

export interface BRSRGhgReductionProject {
    project_name: string;
    project_type: string;
    implemented_year: string;
    reduction_tco2e: number;
    investment_inr: number;
    description: string;
}

export interface BRSRSensitiveAreaDetail {
    location: string;
    sensitive_area_type: string;
    description: string;
}

export interface BRSREIAProject {
    project_name: string;
    eia_notification_number: string;
    eia_date: string;
    web_link: string;
}

export interface BRSRNonComplianceDetail {
    law_name: string;
    fines_inr: number;
    corrective_action: string;
}

export interface BRSRWaterStressDetail {
    facility_name: string;
    area_type: string;
    water_withdrawn_kl: number;
}

export interface BRSRStatutoryDisclosureData {
    id?: string;
    tenant_id?: string;
    reporting_period_id: string;
    financial_year_label: string;
    is_pat_designated_consumer: boolean;
    pat_targets_achieved: boolean;
    pat_remedial_action: string;
    has_zld_mechanism: boolean;
    zld_treatment_details: string;
    has_ghg_reduction_projects: boolean;
    ghg_reduction_details: BRSRGhgReductionProject[];
    waste_management_practices: string;
    has_operations_in_sensitive_areas: boolean;
    sensitive_areas_details: BRSRSensitiveAreaDetail[];
    eia_projects: BRSREIAProject[];
    is_compliant_environmental_laws: boolean;
    non_compliance_details: BRSRNonComplianceDetail[];
    has_water_stress_operations: boolean;
    water_stress_details: BRSRWaterStressDetail[];
    status: BRSRStatus;
    created_at?: string;
    updated_at?: string;
}

export type BRSRStatutoryDisclosureResponse = APIResponse<BRSRStatutoryDisclosureData | null>;

// ==========================================
// CONSOLIDATED DASHBOARD SUMMARY
// ==========================================

export interface BRSRConsolidatedDashboardData {
    reporting_period?: {
        id?: string;
        name?: string;
        reporting_year?: number;
        period_start?: string;
        period_end?: string;
        period_status?: string;
    };
    section_a_completed: boolean;
    section_b_completed: boolean;
    section_c_completed: boolean;
    principle_6_totals: {
        energy_consumption_gj: number;
        water_consumption_kl: number;
        waste_generated_tonne: number;
        scope1_tco2e: number;
        scope2_tco2e: number;
    };
}

export type BRSRConsolidatedDashboardResponse = APIResponse<BRSRConsolidatedDashboardData>;

// ==========================================
// PRINCIPLE 6: ENERGY CONSUMPTION
// ==========================================

export type BrsrEnergyTotals = {
    renewable_fuel_gj: string | number;
    renewable_electricity_gj: string | number;
    renewable_other_gj: string | number;
    total_renewable_energy_gj?: string | number;
    renewable_total_gj?: string | number;
    non_renewable_fuel_gj: string | number;
    non_renewable_electricity_gj: string | number;
    non_renewable_other_gj: string | number;
    total_non_renewable_energy_gj?: string | number;
    non_renewable_total_gj?: string | number;
    total_energy_consumption_gj?: string | number;
    grand_total_gj?: string | number;
    energy_intensity_per_inr: string | number | null;
    energy_intensity_per_inr_crore?: string | number | null;
    energy_intensity_ppp: string | number | null;
    energy_intensity_physical: string | number | null;
    energy_intensity_physical_unit: string | null;
    fuel_activity_count: number;
    electricity_activity_count: number;
    skipped_fuel_activity_count: number;
};

export type BrsrSkippedActivity = {
    activity_id?: string;
    fuel_name: string;
    quantity: string | number;
    quantity_unit_symbol?: string;
    reason: string;
};

export type BrsrEnergyConsumptionData = {
    reporting_period?: BrsrReportingPeriod | { start_date: string; end_date: string };
    turnover_inr: number | null;
    totals: BrsrEnergyTotals;
    skipped_fuel_activities: BrsrSkippedActivity[];
    generated_at: string;
};

export type BrsrEnergyConsumptionResponse = APIResponse<BrsrEnergyConsumptionData>;

// ==========================================
// PRINCIPLE 6: WATER DISCLOSURES
// ==========================================

export type BrsrWaterDischargeDestinationInput = {
    no_treatment_kl: number;
    with_treatment_kl: number;
    treatment_level?: string | null;
};

export type BrsrWaterWithdrawalInput = {
    surface_water_kl: number;
    groundwater_kl: number;
    third_party_water_kl: number;
    seawater_desalinated_kl: number;
    others_kl: number;
};

export type BrsrWaterDischargeInput = {
    surface_water?: BrsrWaterDischargeDestinationInput;
    groundwater?: BrsrWaterDischargeDestinationInput;
    seawater?: BrsrWaterDischargeDestinationInput;
    third_party?: BrsrWaterDischargeDestinationInput;
    others?: BrsrWaterDischargeDestinationInput;
    [key: string]: BrsrWaterDischargeDestinationInput | undefined;
};

export interface BRSRWaterDisclosureSaveInput {
    reporting_period_id?: string;
    financial_year_label: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
    withdrawal: BrsrWaterWithdrawalInput;
    discharge: BrsrWaterDischargeInput;
    total_water_consumption_kl?: number | null;
    status?: BRSRStatus;
}

export type BrsrWaterDisclosurePayload = BRSRWaterDisclosureSaveInput;

export interface BRSRWaterComputedTotals {
    total_water_withdrawal_kl: number | string;
    total_water_discharge_kl: number | string;
    total_water_consumption_kl: number | string;
    water_intensity_per_inr?: number | string | null;
    water_intensity_ppp?: number | string | null;
    water_intensity_physical?: number | string | null;
    water_intensity_physical_unit?: string | null;
    withdrawal?: any;
    discharge?: any;
}

export type BrsrWaterTotals = BRSRWaterComputedTotals;

export interface BRSRWaterDisclosureData {
    id?: string;
    tenant_id?: string;
    reporting_period_id?: string;
    financial_year_label: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
    inputs?: {
        withdrawal: BrsrWaterWithdrawalInput;
        discharge: BrsrWaterDischargeInput;
        total_water_consumption_kl?: number;
    };
    withdrawal?: BrsrWaterWithdrawalInput;
    discharge?: BrsrWaterDischargeInput;
    computed_totals?: BRSRWaterComputedTotals;
    totals?: any;
    status?: BRSRStatus;
}

export type BrsrWaterDisclosureData = BRSRWaterDisclosureData;
export type BrsrWaterDisclosureResponse = APIResponse<BRSRWaterDisclosureData | null>;
export type BRSRWaterDisclosureResponse = BrsrWaterDisclosureResponse;

// ==========================================
// PRINCIPLE 6: WASTE MANAGEMENT
// ==========================================

export interface WasteRecoveryItem {
    recycled_tonne?: number;
    reused_tonne?: number;
    other_recovery_tonne?: number;
    total_tonne?: string | number;
}

export interface WasteDisposalItem {
    incineration_tonne?: number;
    landfilling_tonne?: number;
    other_disposal_tonne?: number;
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
    other_non_hazardous_waste_tonne?: number;
    non_hazardous_solid_waste_tonne?: number;
}

export type WasteRecoveryInput = Record<string, WasteRecoveryItem | any>;
export type WasteDisposalInput = Record<string, WasteDisposalItem | any>;

export interface BRSRWasteDisclosureSaveInput {
    reporting_period_id?: string;
    financial_year_label: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output_tonnes?: number;
    physical_output_unit?: string;
    generation: WasteGenerationInput;
    recovery: WasteRecoveryInput;
    disposal: WasteDisposalInput;
    status?: BRSRStatus;
}

export type BrsrWasteDisclosurePayload = BRSRWasteDisclosureSaveInput;
export type BRSRWasteDisclosurePayload = BRSRWasteDisclosureSaveInput;

export interface WasteGenerationTotals {
    plastic_waste_tonne?: string;
    ewaste_tonne?: string;
    bio_medical_waste_tonne?: string;
    construction_and_demolition_waste_tonne?: string;
    battery_waste_tonne?: string;
    radioactive_waste_tonne?: string;
    other_hazardous_waste_tonne?: string;
    fly_ash_tonne?: string;
    non_hazardous_solid_waste_tonne?: string;
    other_non_hazardous_waste_tonne?: string;
    total_tonne?: string;
    [key: string]: any;
}

export interface WasteRecoveryTotalsCategoryItem {
    recycled_tonne: string;
    reused_tonne: string;
    other_recovery_tonne: string;
    total_tonne: string;
}

export type WasteRecoveryTotals = Record<string, any>;
export type WasteDisposalTotals = Record<string, any>;

export interface BRSRWasteTotalsResponse {
    total_waste_tonne?: string;
    generation?: WasteGenerationTotals;
    recovery?: WasteRecoveryTotals;
    disposal?: WasteDisposalTotals;
    waste_intensity_per_inr?: string;
    waste_intensity_per_physical_output?: string;
    waste_intensity_ppp?: string | null;
    waste_intensity_physical_unit?: string | null;
    total_recovered_tonne?: string;
    total_disposed_tonne?: string;
}

export type BrsrWasteTotals = BRSRWasteTotalsResponse;
export type BRSRWasteCategoryBreakdown = WasteGenerationInput;
export type BRSRWasteRecoveryInput = WasteRecoveryInput;
export type BRSRWasteDisposalInput = WasteDisposalInput;

export interface BRSRWasteComputedTotals {
    generation?: {
        total_hazardous_waste_tonne: number | string;
        total_non_hazardous_waste_tonne: number | string;
        total_waste_generated_tonne: number | string;
        [key: string]: any;
    };
    recovery?: {
        hazardous_recovery_tonne?: WasteRecoveryItem;
        non_hazardous_recovery_tonne?: WasteRecoveryItem;
        total_recovered_tonne: number | string;
        [key: string]: any;
    };
    disposal?: {
        hazardous_disposal_tonne?: WasteDisposalItem;
        non_hazardous_disposal_tonne?: WasteDisposalItem;
        total_disposed_tonne: number | string;
        [key: string]: any;
    };
    overall_recovery_rate_percent?: number | string;
    waste_intensity_per_inr?: number | string;
    waste_intensity_ppp?: number | string;
    waste_intensity_physical?: number | string;
    total_waste_tonne?: string | number;
}

export interface BRSRWasteDisclosureData {
    id?: string;
    tenant_id?: string;
    reporting_period_id?: string;
    financial_year_label: string;
    turnover_inr: number | string;
    physical_output_tonnes?: number | string;
    computed_totals?: BRSRWasteComputedTotals;
    inputs?: any;
    totals?: any;
    status?: BRSRStatus;
}

export type BrsrWasteDisclosureData = BRSRWasteDisclosureData;
export type BrsrWasteDisclosureResponse = APIResponse<BRSRWasteDisclosureData | null>;
export type BRSRWasteDisclosureResponse = BrsrWasteDisclosureResponse;

// ==========================================
// PRINCIPLE 6: AIR EMISSIONS
// ==========================================

export type AttachedUnitEnum =
    | "Main Boiler Unit"
    | "Sponge iron / DRI"
    | "Steel melting"
    | "Ferro alloy"
    | "Blast furnace"
    | "Sinter plant"
    | "Pellet plant"
    | "Coke oven"
    | "Captive power"
    | "Other";

export type ConcentrationUnit = "mg_per_nm3" | "mg/Nm3" | string;
export type FlowRateUnit = "nm3_per_hour" | "Nm3/hr" | string;

export interface BrsrAirValueWithUnit<U extends string = string> {
    value: number | string;
    unit: U;
}

export interface BrsrAirPermittedLimits {
    permitted_limit_nox?: BrsrAirValueWithUnit;
    permitted_limit_sox?: BrsrAirValueWithUnit;
    permitted_limit_pm?: BrsrAirValueWithUnit;
    permitted_limit_pm10?: BrsrAirValueWithUnit;
    permitted_limit_pm25?: BrsrAirValueWithUnit;
    permitted_limit_co?: BrsrAirValueWithUnit;
    permitted_flow_rate?: BrsrAirValueWithUnit;
}

export interface BrsrAirReadingInput {
    sampling_date: string;
    gas_flow_rate: BrsrAirValueWithUnit;
    nox?: BrsrAirValueWithUnit | null;
    sox?: BrsrAirValueWithUnit | null;
    pm?: BrsrAirValueWithUnit | null;
    pm10?: BrsrAirValueWithUnit | null;
    pm25?: BrsrAirValueWithUnit | null;
    co?: BrsrAirValueWithUnit | null;
    particulate_matter?: BrsrAirValueWithUnit | null;
    pop?: BrsrAirValueWithUnit | null;
    voc?: BrsrAirValueWithUnit | null;
    hap?: BrsrAirValueWithUnit | null;
    calculated_rates?: any;
    compliance?: any;
}

export type BrsrAirReadingOutput = BrsrAirReadingInput;

export interface BrsrAirStackInput {
    stack_title: string;
    attached_unit: AttachedUnitEnum | string;
    operating_hours_per_year: number;
    readings: BrsrAirReadingInput[];
    permitted_limits: BrsrAirPermittedLimits;
    report_number?: string | null;
    is_nox_monitored?: boolean;
    is_sox_monitored?: boolean;
    is_pm10_monitored?: boolean;
    is_pm25_monitored?: boolean;
    is_co_monitored?: boolean;
    is_pop_monitored?: boolean;
    is_voc_monitored?: boolean;
    is_hap_monitored?: boolean;
}

export interface BrsrAirOtherPollutantInput {
    label: string;
    quantity: number | string;
    unit?: string;
}

export interface BRSRAirDisclosureSaveInput {
    reporting_period_id?: string;
    financial_year_label: string;
    stacks: BrsrAirStackInput[];
    others?: BrsrAirOtherPollutantInput[] | null;
    status?: BRSRStatus;
}

export type BrsrAirDisclosurePayload = BRSRAirDisclosureSaveInput;

export interface BrsrAirPollutantValues {
    nox?: number | string | null;
    sox?: number | string | null;
    pm10?: number | string | null;
    pm25?: number | string | null;
    co?: number | string | null;
    particulate_matter?: number | string | null;
    pop?: number | string | null;
    voc?: number | string | null;
    hap?: number | string | null;
    unit?: string | null;
    [key: string]: number | string | null | undefined;
}

export interface BrsrAirGasDetailMetric {
    pollutant_key: string;
    pollutant_name: string;
    average_concentration_mg_per_nm3: number | string | null;
    emission_rate_kg_per_hour: number | string | null;
    annual_emission_tonnes_per_year: number | string | null;
    average_gas_flow_rate_nm3_per_hour?: number | string | null;
    operating_hours_per_year?: number | string | null;
    permitted_limit_mg_per_nm3?: number | string | null;
    is_exceeding_permitted_limit: boolean;
    valid_readings_count?: number;
    exceedances_count?: number;
    is_monitored: boolean;
}

export interface BrsrAirCalculatedStack extends BrsrAirStackInput {
    readings_count?: number;
    total_readings?: number;
    average_gas_flow_rate?: BrsrAirValueWithUnit<FlowRateUnit>;
    average_concentration?: BrsrAirPollutantValues;
    emission_rate_kg_per_hour?: BrsrAirPollutantValues;
    annual_emission_tonnes_per_year?: BrsrAirPollutantValues;
    emission_per_hour?: BrsrAirPollutantValues;
    emission_per_year?: BrsrAirPollutantValues;
    gas_details?: Record<string, BrsrAirGasDetailMetric>;
    exceedances_count_by_pollutant?: Record<string, number>;
    is_exceeding_any_limit?: boolean;
}

export interface BRSRAirComputedTotals {
    plant_total_per_pollutant?: {
        nox_kg?: number;
        sox_kg?: number;
        pm_kg?: number;
        co_kg?: number;
        [key: string]: number | undefined;
    };
    total_exceedances_by_pollutant?: {
        nox?: number;
        sox?: number;
        pm?: number;
        co?: number;
        [key: string]: number | undefined;
    };
}

export interface BRSRAirDisclosureData {
    id?: string;
    tenant_id?: string;
    reporting_period_id?: string;
    financial_year_label: string;
    stacks: BrsrAirCalculatedStack[] | BrsrAirStackInput[];
    computed_totals?: BRSRAirComputedTotals;
    status?: BRSRStatus;
    total_stacks_count?: number;
    total_readings_count?: number;
    plant_total_per_pollutant?: any;
    plant_average_concentration?: any;
    plant_combined_hourly_rate?: any;
    plant_gas_details?: Record<string, BrsrAirGasDetailMetric>;
    total_exceedances_by_pollutant?: Record<string, number>;
    other_pollutants?: BrsrAirOtherPollutantInput[];
    inputs?: BrsrAirDisclosurePayload;
    totals?: {
        plant_gas_details?: Record<string, BrsrAirGasDetailMetric>;
        total_exceedances_by_pollutant?: Record<string, number>;
        [key: string]: any;
    };
}

export type BrsrAirDisclosureData = BRSRAirDisclosureData;
export type BrsrAirDisclosureResponse = APIResponse<BRSRAirDisclosureData | null>;
export type BRSRAirDisclosureResponse = BrsrAirDisclosureResponse;

export interface BrsrAirStackPresetsData {
    categories?: AttachedUnitEnum[] | string[];
    attached_units?: AttachedUnitEnum[] | string[];
    presets: Record<string, string[]>;
}

export type BrsrAirStackPresetsResponse = APIResponse<BrsrAirStackPresetsData>;
