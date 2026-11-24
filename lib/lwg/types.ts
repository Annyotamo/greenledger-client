// lib/lwg/types.ts

// ============================================================================
// 1. DOMAIN ENUMS & DISCRIMINATED UNIONS
// ============================================================================

export type LwgStage =
    | "stage_1_raw_to_wetblue"
    | "stage_2_wetblue_to_crust"
    | "stage_3_crust_to_finish"
    | "stage_1_to_3_raw_to_finish"
    | "stage_2_to_3_wetblue_to_finish";

export type LwgDepartmentStage = "stage_1" | "stage_2" | "stage_3" | "common";

export type LwgOutputUnit = "sq_ft" | "m2";

export type LwgEffluentType = "direct_discharge_own_etp" | "discharge_to_cetp" | "both";

export type LwgInputMaterial = "raw_hide_skin" | "wet_blue" | "wet_white" | "crust";

export type LwgEnergySource =
    | "grid_electricity"
    | "diesel_hsd"
    | "furnace_oil"
    | "natural_gas_png"
    | "lpg"
    | "coal"
    | "solar_onsite"
    | "purchased_renewable_electricity"
    | "biomass_or_briquettes";

export type LwgEnergyUnit = "kwh" | "mwh" | "litres" | "tonnes" | "kg" | "scm" | "gj";

export type LwgWaterSource =
    | "borewell"
    | "municipal_supply"
    | "tanker"
    | "rainwater_harvested"
    | "recycled_own_etp"
    | "recycled_cetp";

export type LwgDocumentType =
    | "consent_to_operate"
    | "hazardous_waste_authorisation"
    | "electricity_bill"
    | "fuel_invoice"
    | "meter_photo"
    | "lab_report"
    | "other";

export type LwgMedalRating = "gold" | "silver" | "bronze" | "audited" | "fail";

export type LwgSectionStatus = "ready" | "gaps" | "not_started" | "not_in_mvp";

export type LwgGapSeverity = "red" | "amber";

// ============================================================================
// 2. CONSTANTS & METADATA DICTIONARIES
// ============================================================================

export const LWG_CRITICAL_SECTIONS: readonly number[] = [
    2, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
] as const;

export const LWG_NON_CRITICAL_SECTIONS: readonly number[] = [1, 3, 6, 7] as const;

export interface LwgSectionMeta {
    sectionNumber: number;
    title: string;
    isCritical: boolean;
    isInMvp: boolean;
    description: string;
}

export const LWG_ALL_SECTIONS: readonly LwgSectionMeta[] = [
    { sectionNumber: 1, title: "General Information", isCritical: false, isInMvp: false, description: "Facility background, company details, and general operational data." },
    { sectionNumber: 2, title: "Traceability: Subcontracted Operations", isCritical: true, isInMvp: false, description: "Subcontractor audit and outsourced tanning process controls." },
    { sectionNumber: 3, title: "Social Audit", isCritical: false, isInMvp: false, description: "Social compliance and labor standard certifications." },
    { sectionNumber: 4, title: "Operating Permits & Environmental Approvals", isCritical: true, isInMvp: true, description: "Statutory SPCB Consent to Operate (Air/Water) and Hazardous Waste Authorization." },
    { sectionNumber: 5, title: "Production Data", isCritical: true, isInMvp: true, description: "Monthly raw material inputs and normalized leather area outputs (m² & sq ft)." },
    { sectionNumber: 6, title: "Incoming Traceability", isCritical: false, isInMvp: false, description: "Origin tracking of raw hides, skins, and semi-processed leathers." },
    { sectionNumber: 7, title: "Outgoing Traceability", isCritical: false, isInMvp: false, description: "Batch dispatch tracking and customer chain of custody." },
    { sectionNumber: 8, title: "Environmental Management Systems", isCritical: true, isInMvp: false, description: "ISO 14001, environmental policies, and continuous monitoring procedures." },
    { sectionNumber: 9, title: "Restricted Substances & Compliance", isCritical: true, isInMvp: false, description: "MRSL, RSL, and hazardous chemical restriction compliance." },
    { sectionNumber: 10, title: "Energy Consumption", isCritical: true, isInMvp: true, description: "Electricity, fossil fuels, renewable shares, GJ conversions, and energy intensity." },
    { sectionNumber: 11, title: "Water Usage", isCritical: true, isInMvp: true, description: "Borewell extraction, municipal supply, recycling ratio, and water intensity." },
    { sectionNumber: 12, title: "Air & Noise Emissions", isCritical: true, isInMvp: false, description: "Boiler stack monitoring, VOC emissions, and ambient boundary noise." },
    { sectionNumber: 13, title: "Waste Management", isCritical: true, isInMvp: false, description: "Hazardous sludge, chrome shavings, solid waste categorization, and disposal." },
    { sectionNumber: 14, title: "Effluent Treatment", isCritical: true, isInMvp: false, description: "ETP/CETP COD, BOD, TSS, chromium recovery, and discharge compliance." },
    { sectionNumber: 15, title: "Health, Safety & Emergency Preparedness", isCritical: true, isInMvp: false, description: "PPE, fire drills, chemical handling safety, and emergency response." },
    { sectionNumber: 16, title: "Chemical Management & Storage", isCritical: true, isInMvp: false, description: "Secondary containment, bunding, SDS sheets, and chemical segregation." },
    { sectionNumber: 17, title: "Operations & Housekeeping", isCritical: true, isInMvp: false, description: "Shop floor housekeeping, maintenance logs, and general facility hygiene." },
] as const;

export const LWG_STAGE_LABELS: Record<LwgStage, string> = {
    stage_1_raw_to_wetblue: "Stage 1: Raw hide to Wet Blue (Beamhouse & Tanning)",
    stage_2_wetblue_to_crust: "Stage 2: Wet Blue to Crust (Re-tanning & Dyeing)",
    stage_3_crust_to_finish: "Stage 3: Crust to Finished Leather (Finishing)",
    stage_1_to_3_raw_to_finish: "Stage 1 to 3: Fully Integrated Tannery",
    stage_2_to_3_wetblue_to_finish: "Stage 2 to 3: Processing from Wet Blue to Finish",
};

export const LWG_DEPARTMENT_STAGE_LABELS: Record<LwgDepartmentStage, string> = {
    stage_1: "Stage 1: Raw to Wet Blue (Beamhouse & Tanning)",
    stage_2: "Stage 2: Wet Blue to Crust (Re-tanning & Dyeing)",
    stage_3: "Stage 3: Crust to Finish (Finishing)",
    common: "Common / Utility / Effluent Plant (CETP/ETP/Boiler)",
};

export const LWG_EFFLUENT_TYPE_LABELS: Record<LwgEffluentType, string> = {
    direct_discharge_own_etp: "Direct discharge with own on-site ETP",
    discharge_to_cetp: "Pre-treatment with discharge to CETP",
    both: "Both on-site ETP and CETP",
};

export const LWG_INPUT_MATERIAL_LABELS: Record<LwgInputMaterial, string> = {
    raw_hide_skin: "Raw Hide / Skin",
    wet_blue: "Wet Blue",
    wet_white: "Wet White",
    crust: "Crust",
};

export const LWG_ENERGY_SOURCE_LABELS: Record<LwgEnergySource, string> = {
    grid_electricity: "Grid Electricity",
    diesel_hsd: "Diesel (HSD)",
    furnace_oil: "Furnace Oil (HFO)",
    natural_gas_png: "Natural Gas (PNG)",
    lpg: "Liquefied Petroleum Gas (LPG)",
    coal: "Industrial Coal",
    solar_onsite: "On-site Solar PV",
    purchased_renewable_electricity: "Purchased Renewable Electricity (PPA / Green Tariff)",
    biomass_or_briquettes: "Biomass / Agricultural Briquettes",
};

export const LWG_WATER_SOURCE_LABELS: Record<LwgWaterSource, string> = {
    borewell: "Groundwater / Borewell",
    municipal_supply: "Municipal Piped Supply",
    tanker: "Private Tanker Water",
    rainwater_harvested: "Rainwater Harvested",
    recycled_own_etp: "Treated Recycled Water (Own ETP)",
    recycled_cetp: "Recycled Water from CETP",
};

export const LWG_DOCUMENT_TYPE_LABELS: Record<LwgDocumentType, string> = {
    consent_to_operate: "Consent to Operate (CTO Air/Water)",
    hazardous_waste_authorisation: "Hazardous Waste Authorization",
    electricity_bill: "Electricity Utility Bill",
    fuel_invoice: "Fuel Delivery Challan / Invoice",
    meter_photo: "Meter Reading Photo",
    lab_report: "Lab / Effluent Test Analysis",
    other: "Other Supporting Evidence",
};

export const ALLOWED_UNITS_BY_SOURCE: Record<LwgEnergySource, readonly LwgEnergyUnit[]> = {
    grid_electricity: ["kwh", "mwh"],
    purchased_renewable_electricity: ["kwh", "mwh"],
    solar_onsite: ["kwh", "mwh"],
    diesel_hsd: ["litres"],
    furnace_oil: ["litres"],
    natural_gas_png: ["scm"],
    lpg: ["kg", "litres"],
    coal: ["tonnes"],
    biomass_or_briquettes: ["tonnes"],
} as const;

export const ENERGY_GJ_FACTORS: Record<LwgEnergySource, Record<string, number>> = {
    grid_electricity: { kwh: 0.0036, mwh: 3.6 },
    purchased_renewable_electricity: { kwh: 0.0036, mwh: 3.6 },
    solar_onsite: { kwh: 0.0036, mwh: 3.6 },
    diesel_hsd: { litres: 0.0386 },
    furnace_oil: { litres: 0.0418 },
    natural_gas_png: { scm: 0.0385 },
    lpg: { kg: 0.0461, litres: 0.026 },
    coal: { tonnes: 20.0 },
    biomass_or_briquettes: { tonnes: 15.0 },
};

export const LWG_MEDAL_CONFIG: Record<
    LwgMedalRating,
    { label: string; minScore: number; color: string; badgeVariant: "positive" | "negative" | "active" | "neutral" }
> = {
    gold: { label: "Gold", minScore: 85.0, color: "#d97706", badgeVariant: "positive" },
    silver: { label: "Silver", minScore: 75.0, color: "#64748b", badgeVariant: "active" },
    bronze: { label: "Bronze", minScore: 65.0, color: "#b45309", badgeVariant: "neutral" },
    audited: { label: "Audited", minScore: 50.0, color: "#3b82f6", badgeVariant: "neutral" },
    fail: { label: "Fail", minScore: 0.0, color: "#dc2626", badgeVariant: "negative" },
};

// ============================================================================
// 3. BACKEND DATA TRANSFER OBJECTS (DTOs - snake_case)
// ============================================================================

export interface LwgDepartmentDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    name: string;
    stage: LwgDepartmentStage;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LwgTanneryProfileDto {
    id: string;
    tenant_id: string;
    facility_id: string;
    tannery_name: string;
    state: string;
    city: string;
    stages_run: LwgStage[];
    effluent_treatment_type: LwgEffluentType;
    uses_subcontractors: boolean;
    output_unit: LwgOutputUnit;
    data_window_start: string;
    data_window_end: string;
    departments?: LwgDepartmentDto[];
    created_at: string;
    updated_at: string;
}

export interface LwgProductionDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    month: string; // YYYY-MM-01
    stage: LwgStage;
    input_quantity_tonnes: number;
    input_material: LwgInputMaterial;
    output_quantity_m2: number;
    output_quantity_sqft: number;
    sold_at_stage_m2: number;
    sold_at_stage_sqft: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface LwgEnergyDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    month: string; // YYYY-MM-01
    source: LwgEnergySource;
    quantity: number;
    unit: string;
    energy_gj: number;
    department_id: string | null;
    department_name?: string | null;
    is_renewable: boolean;
    is_onsite: boolean;
    bill_proof_file_key: string | null;
    created_at: string;
    updated_at: string;
}

export interface LwgWaterDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    month: string; // YYYY-MM-01
    source: LwgWaterSource;
    volume_m3: number;
    meter_id: string | null;
    department_id: string | null;
    department_name?: string | null;
    meter_photo_file_key: string | null;
    is_fresh_water: boolean;
    is_recycled: boolean;
    created_at: string;
    updated_at: string;
}

export interface LwgEvidenceDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    file_key: string;
    file_name: string;
    file_size_bytes: number;
    mime_type: string;
    lwg_section: number;
    document_type: LwgDocumentType;
    period_from: string | null;
    period_to: string | null;
    expiry_date: string | null;
    meter_id: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface LwgAuditResultDto {
    id: string;
    tenant_id: string;
    tannery_profile_id: string;
    audit_date: string;
    overall_medal: LwgMedalRating;
    section_scores: Record<string, number>;
    holding_down_sections: number[];
    audit_report_file_key: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface LwgReadinessTileDto {
    overall_percent: number;
    production_percent: number;
    energy_percent: number;
    water_percent: number;
    status: "ready" | "gaps" | "not_started";
}

export interface LwgEnergyIntensityTileDto {
    title: string;
    unit: string;
    current_l12: number;
    previous_p12: number;
    yoy_change_percent: number;
    is_favorable: boolean;
}

export interface LwgWaterIntensityTileDto {
    title: string;
    unit: string;
    current_l12: number;
    previous_p12: number;
    yoy_change_percent: number;
    is_favorable: boolean;
}

export interface LwgRenewableShareTileDto {
    title: string;
    percentage: number;
    detail: string;
}

export interface LwgRecycledWaterShareTileDto {
    title: string;
    percentage: number;
    detail: string;
}

export interface LwgMonthGridItemDto {
    month: string;
    month_label: string;
    production_complete: boolean;
    energy_complete: boolean;
    water_complete: boolean;
    is_fully_complete: boolean;
}

export interface LwgGapItemDto {
    severity: LwgGapSeverity;
    check_code: string;
    message: string;
    fix_url: string;
    section_number: number;
    month: string | null;
}

export interface LwgSectionStatusItemDto {
    section_number: number;
    section_name: string;
    status: LwgSectionStatus;
    is_in_mvp: boolean;
    is_critical: boolean;
}

export interface LwgMedalStatusDto {
    overall_medal: LwgMedalRating;
    section_ratings: Record<string, LwgMedalRating>;
    holding_down_sections: number[];
    holding_down_section_names: string[];
    message: string;
}

export interface LwgDashboardDto {
    readiness: LwgReadinessTileDto;
    energy_intensity: LwgEnergyIntensityTileDto;
    water_intensity: LwgWaterIntensityTileDto;
    renewable_share: LwgRenewableShareTileDto;
    onsite_renewable_share?: LwgRenewableShareTileDto;
    recycled_water_share: LwgRecycledWaterShareTileDto;
    month_grid: LwgMonthGridItemDto[];
    gap_list: LwgGapItemDto[];
    section_statuses: LwgSectionStatusItemDto[];
    medal_status: LwgMedalStatusDto;
}

export interface LwgExcelRowErrorDto {
    sheet_name: string;
    row_number: number;
    field: string;
    error_message: string;
    raw_data?: Record<string, unknown>;
}

export interface LwgExcelImportSummaryDto {
    success: boolean;
    production_rows_imported: number;
    energy_rows_imported: number;
    water_rows_imported: number;
    total_imported: number;
    total_failed: number;
    errors: LwgExcelRowErrorDto[];
}

// ============================================================================
// 4. FRONTEND DOMAIN MODELS (camelCase)
// ============================================================================

export interface LwgDepartment {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    name: string;
    stage: LwgDepartmentStage;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LwgTanneryProfile {
    id: string;
    tenantId: string;
    facilityId: string;
    tanneryName: string;
    state: string;
    city: string;
    stagesRun: LwgStage[];
    effluentTreatmentType: LwgEffluentType;
    usesSubcontractors: boolean;
    outputUnit: LwgOutputUnit;
    dataWindowStart: string;
    dataWindowEnd: string;
    departments: LwgDepartment[];
    createdAt: string;
    updatedAt: string;
}

export interface LwgProduction {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    month: string;
    stage: LwgStage;
    inputQuantityTonnes: number;
    inputMaterial: LwgInputMaterial;
    outputQuantityM2: number;
    outputQuantitySqft: number;
    soldAtStageM2: number;
    soldAtStageSqft: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LwgEnergy {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    month: string;
    source: LwgEnergySource;
    quantity: number;
    unit: string;
    energyGj: number;
    departmentId: string | null;
    departmentName: string;
    isRenewable: boolean;
    isOnsite: boolean;
    billProofFileKey: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LwgWater {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    month: string;
    source: LwgWaterSource;
    volumeM3: number;
    meterId: string | null;
    departmentId: string | null;
    departmentName: string;
    meterPhotoFileKey: string | null;
    isFreshWater: boolean;
    isRecycled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LwgEvidence {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    fileKey: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
    lwgSection: number;
    documentType: LwgDocumentType;
    periodFrom: string | null;
    periodTo: string | null;
    expiryDate: string | null;
    meterId: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LwgAuditResult {
    id: string;
    tenantId: string;
    tanneryProfileId: string;
    auditDate: string;
    overallMedal: LwgMedalRating;
    sectionScores: Record<string, number>;
    holdingDownSections: number[];
    auditReportFileKey: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LwgReadinessTile {
    overallPercent: number;
    productionPercent: number;
    energyPercent: number;
    waterPercent: number;
    status: "ready" | "gaps" | "not_started";
}

export interface LwgEnergyIntensityTile {
    title: string;
    unit: string;
    currentL12: number;
    previousP12: number;
    yoyChangePercent: number;
    isFavorable: boolean;
}

export interface LwgWaterIntensityTile {
    title: string;
    unit: string;
    currentL12: number;
    previousP12: number;
    yoyChangePercent: number;
    isFavorable: boolean;
}

export interface LwgShareTile {
    title: string;
    percentage: number;
    detail: string;
}

export interface LwgMonthGridItem {
    month: string;
    monthLabel: string;
    productionComplete: boolean;
    energyComplete: boolean;
    waterComplete: boolean;
    isFullyComplete: boolean;
}

export interface LwgGapItem {
    severity: LwgGapSeverity;
    checkCode: string;
    message: string;
    fixUrl: string;
    sectionNumber: number;
    month: string | null;
}

export interface LwgSectionStatusItem {
    sectionNumber: number;
    sectionName: string;
    status: LwgSectionStatus;
    isInMvp: boolean;
    isCritical: boolean;
}

export interface LwgMedalStatus {
    overallMedal: LwgMedalRating;
    sectionRatings: Record<string, LwgMedalRating>;
    holdingDownSections: number[];
    holdingDownSectionNames: string[];
    message: string;
}

export interface LwgDashboardData {
    readiness: LwgReadinessTile;
    energyIntensity: LwgEnergyIntensityTile;
    waterIntensity: LwgWaterIntensityTile;
    renewableShare: LwgShareTile;
    onsiteRenewableShare?: LwgShareTile;
    recycledWaterShare: LwgShareTile;
    monthGrid: LwgMonthGridItem[];
    gapList: LwgGapItem[];
    sectionStatuses: LwgSectionStatusItem[];
    medalStatus: LwgMedalStatus;
}

export interface LwgExcelRowError {
    sheetName: string;
    rowNumber: number;
    field: string;
    errorMessage: string;
    rawData?: Record<string, unknown>;
}

export interface LwgExcelImportSummary {
    success: boolean;
    productionRowsImported: number;
    energyRowsImported: number;
    waterRowsImported: number;
    totalImported: number;
    totalFailed: number;
    errors: LwgExcelRowError[];
}

// ============================================================================
// 5. MUTATION REQUEST PAYLOADS (What forms send)
// ============================================================================

export interface CreateLwgProfilePayload {
    facilityId: string;
    tanneryName: string;
    state: string;
    city: string;
    stagesRun: LwgStage[];
    effluentTreatmentType: LwgEffluentType;
    usesSubcontractors?: boolean;
    outputUnit?: LwgOutputUnit;
}

export interface UpdateLwgProfilePayload {
    tanneryName?: string;
    state?: string;
    city?: string;
    stagesRun?: LwgStage[];
    effluentTreatmentType?: LwgEffluentType;
    usesSubcontractors?: boolean;
    outputUnit?: LwgOutputUnit;
}

export interface CreateLwgDepartmentPayload {
    name: string;
    stage: LwgDepartmentStage;
    description?: string | null;
}

export interface UpdateLwgDepartmentPayload {
    name?: string;
    stage?: LwgDepartmentStage;
    description?: string | null;
    isActive?: boolean;
}

export interface UpsertLwgProductionPayload {
    month: string; // YYYY-MM-01
    stage: LwgStage;
    inputQuantityTonnes: number;
    inputMaterial: LwgInputMaterial;
    outputQuantity: number; // in user's profile unit
    soldAtStage?: number;
    notes?: string | null;
}

export interface UpsertLwgEnergyPayload {
    month: string; // YYYY-MM-01
    source: LwgEnergySource;
    quantity: number;
    unit: string;
    departmentId?: string | null;
    billProofFileKey?: string | null;
}

export interface UpsertLwgWaterPayload {
    month: string; // YYYY-MM-01
    source: LwgWaterSource;
    volumeM3: number;
    meterId?: string | null;
    departmentId?: string | null;
    meterPhotoFileKey?: string | null;
}

export interface CreateLwgEvidencePayload {
    fileKey: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
    lwgSection: number;
    documentType: LwgDocumentType;
    periodFrom?: string | null;
    periodTo?: string | null;
    expiryDate?: string | null;
    meterId?: string | null;
    notes?: string | null;
}

export interface CreateLwgAuditResultPayload {
    auditDate: string;
    sectionScores: Record<string, number>;
    auditReportFileKey?: string | null;
    notes?: string | null;
}
