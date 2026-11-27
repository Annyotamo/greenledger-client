// Shapes mirror the server responses of /tenant/climate-risk (tables in Climate_Risk_Assessment_MVP_Spec.docx, "Data model").
// Units live in field names (_tco2e, _inr) as the spec asks.

export type AssessmentStatus = "draft" | "in_review" | "approved";
export type Rating = "low" | "medium" | "high" | "not_rated";
export type HazardRiskType = "acute" | "chronic" | "non_climate";
/** ThinkHazard level mnemonics. The live API also returns "no-data", which the spec does not list. */
export type HazardLevel = "VLO" | "LOW" | "MED" | "HIG" | "no-data";
export type DataQuality = "measured" | "estimated" | "missing";
export type TriState = "yes" | "no" | "unknown";
export type ScenarioKey = "net_zero_2050" | "delayed_transition" | "current_policies";
/** The signed-in user's level on the climate_risk permission: read = client view, write = analyst, admin = approver. */
export type RiskAccess = { level: "none" | "read" | "write" | "admin"; canRead: boolean; canWrite: boolean; canApprove: boolean };

export type HazardMappingEntry = {
    code: string;
    name: string;
    risk_type: HazardRiskType;
    counts_in_rating: boolean;
};

export type Thresholds = {
    /** Cost share (%) below this is Low */
    a_pct: number;
    /** Cost share (%) above this is High */
    b_pct: number;
};

export type RulesetVersion = {
    id: string;
    version: number;
    label: "DEV" | "LIVE";
    effective_from: string;
    thresholds: Thresholds;
    hazard_mapping: HazardMappingEntry[];
    usd_inr_rate: number;
    notes: string;
};

export type CarbonPrice = {
    id: string;
    ruleset_version_id: string;
    scenario: ScenarioKey;
    ngfs_family: string;
    ngfs_phase: string;
    year: number;
    price: number;
    currency: "USD" | "INR";
    source_url: string;
};

export type RiskAssessment = {
    id: string;
    company_id: string;
    reporting_year: number;
    version: number;
    status: AssessmentStatus;
    ruleset_version_id: string;
    horizon_short: number;
    horizon_medium: number;
    horizon_long: number;
    revenue_inr: number | null;
    /** *_by fields hold display names: api.ts resolves the server's user ids through AssessmentDetail.people. */
    created_by: string;
    created_at: string;
    submitted_by: string | null;
    submitted_at: string | null;
    approved_by: string | null;
    approved_at: string | null;
    supersedes_id: string | null;
    physical_run_at: string | null;
    transition_run_at: string | null;
    /** Runs are append-only: run N's rows stay stored after run N+1. Screens show the latest run. */
    physical_runs: number;
    transition_runs: number;
    scored_at: string | null;
};

export type FacilityLocation = {
    facility_id: string;
    state: string | null;
    district: string | null;
    thinkhazard_code: number | null;
    thinkhazard_label: string | null;
    latitude: number | null;
    longitude: number | null;
    confirmed_by: string | null;
    confirmed_at: string | null;
};

export type HazardSnapshot = {
    id: string;
    assessment_id: string;
    run: number;
    thinkhazard_code: number;
    /** District label and facilities that used this reply, as they were at run time. */
    division_label: string;
    facility_ids: string[];
    source_url: string;
    fetched_at: string;
    raw_json: string | null;
    fetch_status: "ok" | "failed";
    attempts: number;
    error: string | null;
};

export type FacilityHazard = {
    assessment_id: string;
    run: number;
    facility_id: string;
    hazard_code: string;
    hazard_name: string;
    risk_type: HazardRiskType;
    level: HazardLevel;
    points: number | null;
    counts_in_rating: boolean;
};

export type TransitionResult = {
    assessment_id: string;
    run: number;
    facility_id: string;
    scenario: ScenarioKey;
    year: number;
    scope1_tco2e: number | null;
    scope2_tco2e: number | null;
    carbon_price_inr: number;
    carbon_cost_inr: number | null;
    data_quality: DataQuality;
};

export type PolicyFlag = {
    assessment_id: string;
    facility_id: string;
    ccts_covered: TriState;
    cbam_exporter: TriState;
    source: string;
};

export type RiskRating = {
    id: string;
    assessment_id: string;
    scope: "facility" | "company";
    entity_id: string;
    risk_type: "physical" | "transition";
    computed_rating: Rating;
    final_rating: Rating;
    /** What drove the computed rating, e.g. "Tropical cyclone: High" or "Net Zero 2050, 2050: 31.2%" */
    driver: string | null;
    override_reason: string | null;
    overridden_by: string | null;
    overridden_at: string | null;
    not_rated_reason: string | null;
};

/** Read-only inputs pulled from other GreenLedger modules (facilities, GHG engine, CBAM). */
export type FacilityInput = {
    id: string;
    name: string;
    facility_code: string;
    city: string;
    state: string | null;
    scope1_tco2e: number | null;
    scope1_quality: DataQuality;
    scope2_tco2e: number | null;
    cbam_exporter: TriState;
};

export type Company = {
    id: string;
    name: string;
    sasb_industry_code: string | null;
    sasb_industry_name: string | null;
};

export type ThinkHazardDivision = {
    code: number;
    admin0: string;
    admin1: string;
    admin2?: string;
    url: string;
};

/** GET /assessments/{id}: one assessment with all results. */
export type AssessmentDetail = {
    assessment: RiskAssessment;
    company: Company;
    ruleset: RulesetVersion;
    carbon_prices: CarbonPrice[];
    facilities: (FacilityInput & { location: FacilityLocation })[];
    /** Every run's raw replies, newest run first. */
    snapshots: HazardSnapshot[];
    /** Latest physical run only. */
    hazards: FacilityHazard[];
    /** Latest transition run only. */
    transition: TransitionResult[];
    flags: PolicyFlag[];
    ratings: RiskRating[];
    history: Pick<RiskAssessment, "id" | "version" | "status" | "created_at" | "ruleset_version_id">[];
    /** User id → full name for every person the assessment mentions. */
    people: Record<string, string>;
};
