export type CBAMSector =
    | "CEMENT"
    | "ELECTRICITY"
    | "FERTILISERS"
    | "IRON_AND_STEEL"
    | "ALUMINIUM"
    | "CHEMICALS";

export type CBAMStreamMethod = "Combustion" | "Mass balance";

export type CBAMActivityUnit = "t" | "1000 Nm3";

export type CBAMEmissionFactorUnit = "tCO2/TJ" | "tCO2/t" | "tCO2/1000Nm3";

export type CBAMBoundaryMode = "DIRECT" | "INDIRECT_WITH_PRECURSORS";

export interface CBAMApiResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: { code?: string; details?: unknown } | null;
    method?: string;
    path?: string;
    timestamp?: string;
}

export interface CBAMCategory {
    id: string;
    name: string;
    slug: string;
    sector: CBAMSector;
    goods_nature: string;
    covered_gases: string[];
    direct_emissions_applicable: boolean;
    indirect_emissions_applicable: boolean;
    production_unit: string;
    production_routes: string[];
    requires_precursors: boolean;
    possible_precursor_ids: string[];
    possible_precursors?: CBAMCategory[];
    description: string;
    is_active: boolean;
}

export interface CBAMProductionRoutesResponse {
    category_id: string;
    category_name: string;
    production_routes: string[];
}

export interface CBAMProductNamesResponse {
    category_id: string;
    category_name: string;
    product_names: string[];
}

export interface CBAMCNDetails {
    id: string;
    cn_code: string;
    product_name: string;
    specification: string;
    full_description: string;
}

export interface CBAMSpecificationsResponse {
    category_id: string;
    category_name: string;
    product_name: string;
    specifications: CBAMCNDetails[];
}

export interface CBAMCountry {
    code: string;
    name: string;
}

export interface CBAMCountriesResponse {
    total: number;
    countries: CBAMCountry[];
}

export interface CBAMIPCCFuel {
    id: string;
    fuel_id: string;
    fuel_name: string;
    unit_id: string;
    unit_name: string;
    unit_symbol: string;
    kg_co2e: number;
    kg_co2e_of_co2: number;
    default_ef_tco2_per_unit: number;
}

export interface CBAMInstallationGood {
    id?: string;
    slot_number: number; // 1..10
    category_id: string;
    category_name?: string;
    category_slug?: string;
    production_routes: string[];
}

export interface CBAMProductionProcess {
    id?: string;
    process_id: string; // "P1".."P10"
    name: string;
    target_category_id: string;
    target_category_name?: string;
    boundary_mode: CBAMBoundaryMode;
    included_precursor_ids: string[];
}

export interface CBAMPurchasedPrecursor {
    id?: string;
    precursor_id: string; // "PP1".."PP20"
    name: string;
    category_id: string;
    category_name?: string;
    supplier_name?: string;
    country_of_origin?: string;
    production_route?: string;
    direct_specific_emissions?: number;
    indirect_specific_emissions?: number;
}

export interface CBAMInstallationProfile {
    id: string;
    start_date?: string | null;
    end_date?: string | null;
    reporting_period_id?: string | null;
    installation_name_english: string;
    installation_name_local?: string | null;
    street_number?: string | null;
    economic_activity?: string | null;
    post_code?: string | null;
    po_box?: string | null;
    city: string;
    country: string;
    unlocode: string;
    latitude: number;
    longitude: number;
    authorized_rep_name?: string | null;
    authorized_rep_email?: string | null;
    authorized_rep_telephone?: string | null;
    verifier_company_name?: string | null;
    verifier_street_number?: string | null;
    verifier_city?: string | null;
    verifier_post_code?: string | null;
    verifier_country?: string | null;
    verifier_rep_name?: string | null;
    verifier_rep_email?: string | null;
    verifier_rep_telephone?: string | null;
    verifier_rep_fax?: string | null;
    verifier_accreditation_member_state?: string | null;
    verifier_accreditation_body?: string | null;
    verifier_accreditation_number?: string | null;
    is_active?: boolean;
    goods: CBAMInstallationGood[];
    processes: CBAMProductionProcess[];
    purchased_precursors: CBAMPurchasedPrecursor[];
}

export interface CreateCBAMInstallationPayload {
    start_date?: string | null;
    end_date?: string | null;
    reporting_period_id?: string | null;
    installation_name_english: string;
    installation_name_local?: string | null;
    street_number?: string | null;
    economic_activity?: string | null;
    post_code?: string | null;
    po_box?: string | null;
    city: string;
    country: string;
    unlocode: string;
    latitude: number;
    longitude: number;
    authorized_rep_name?: string | null;
    authorized_rep_email?: string | null;
    authorized_rep_telephone?: string | null;
    verifier_company_name?: string | null;
    verifier_street_number?: string | null;
    verifier_city?: string | null;
    verifier_post_code?: string | null;
    verifier_country?: string | null;
    verifier_rep_name?: string | null;
    verifier_rep_email?: string | null;
    verifier_rep_telephone?: string | null;
    verifier_rep_fax?: string | null;
    verifier_accreditation_member_state?: string | null;
    verifier_accreditation_body?: string | null;
    verifier_accreditation_number?: string | null;
    goods?: CBAMInstallationGood[];
    processes?: CBAMProductionProcess[];
    purchased_precursors?: CBAMPurchasedPrecursor[];
}

export interface CBAMSourceStream {
    id: string;
    installation_id: string;
    slot_number: number;
    method: CBAMStreamMethod;
    name: string;
    activity_data: number;
    activity_unit: CBAMActivityUnit;
    biomass_fraction: number;
    ipcc_fuel_id?: string | null;
    ipcc_fuel_name?: string | null;
    ncv?: number | null;
    emission_factor?: number | null;
    emission_factor_unit?: CBAMEmissionFactorUnit | null;
    oxidation_factor?: number | null;
    carbon_content?: number | null;
    fossil_co2_emissions: number;
    biomass_co2_emissions: number;
    energy_content_fossil_tj: number;
    energy_content_bio_tj: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateCBAMSourceStreamPayload {
    slot_number?: number;
    method: CBAMStreamMethod;
    name: string;
    activity_data: number;
    activity_unit?: CBAMActivityUnit;
    biomass_fraction?: number;
    ipcc_fuel_id?: string | null;
    ncv?: number | null;
    emission_factor?: number | null;
    emission_factor_unit?: CBAMEmissionFactorUnit | null;
    oxidation_factor?: number | null;
    carbon_content?: number | null;
}

export interface CBAMCalculatePreviewPayload {
    method: CBAMStreamMethod;
    activity_data: number;
    activity_unit?: CBAMActivityUnit;
    biomass_fraction?: number;
    ipcc_fuel_id?: string | null;
    ncv?: number | null;
    emission_factor?: number | null;
    emission_factor_unit?: CBAMEmissionFactorUnit | null;
    oxidation_factor?: number | null;
    carbon_content?: number | null;
}

export interface CBAMCalculatePreviewResponse {
    method: CBAMStreamMethod;
    fossil_co2_emissions: number;
    biomass_co2_emissions: number;
    energy_content_fossil_tj: number;
    energy_content_bio_tj: number;
    ncv_applied?: number | null;
    emission_factor_applied?: number | null;
    oxidation_factor_applied?: number | null;
    carbon_content_applied?: number | null;
}

export interface CBAMSourceStreamsSummary {
    installation_id: string;
    total_fossil_co2_emissions: number;
    total_biomass_co2_emissions: number;
    total_direct_co2_emissions: number;
    total_fossil_energy_tj: number;
    total_bio_energy_tj: number;
    stream_count: number;
    combustion_stream_count: number;
    mass_balance_stream_count: number;
}
