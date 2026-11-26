export type UserRole =
    | "TENANT_OWNER"
    | "TENANT_ADMIN"
    | "ESG_TEAM"
    | "FACILITY_HEAD"
    | "AUDITOR"
    | "CUSTOM";

export type FeatureKey =
    // GHG Protocol Modules
    | "scope_1"
    | "scope_2"
    | "scope_3_cat1"
    | "scope_3_cat2"
    | "scope_3_cat3"
    | "scope_3_cat4"
    | "scope_3_cat5"
    | "scope_3_cat6"
    | "scope_3_cat7"
    | "scope_3_cat9"
    | "scope_3_cat15"
    // Standards & Disclosures
    | "brsr"
    | "cbam"
    | "eia"
    | "lwg"
    // Organization Infrastructure
    | "facilities"
    | "reporting_periods"
    // Performance & Governance
    | "analytics"
    | "team_members"
    | "audit_trails";

export type AccessLevel = "none" | "read" | "write" | "admin";

export interface Scope3CategoriesNav {
    cat1_spend: boolean;
    cat2_spend: boolean;
    cat3_wtt: boolean;
    cat4_transport: boolean;
    cat5_waste: boolean;
    cat6_travel: boolean;
    cat7_commute: boolean;
    cat9_transport: boolean;
    cat15_investments: boolean;
}

export interface UINavigationManifest {
    scope_1: boolean;
    scope_2: boolean;
    scope_3: boolean;
    scope_3_categories: Scope3CategoriesNav;
    brsr: boolean;
    cbam: boolean;
    eia: boolean;
    lwg: boolean;
    facilities: boolean;
    reporting_periods: boolean;
    analytics: boolean;
    team_members: boolean;
    audit_trails: boolean;
    [key: string]: boolean | Scope3CategoriesNav;
}

export interface UserProfile {
    id: string;
    tenant_id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone_number?: string | null;
    job_title?: string | null;
    background?: string | null;
    logo?: string | null;
    bio?: string | null;
    assigned_facility_id?: string | null;
    assigned_facility?: string | null;
    facility?: {
        id: string;
        name: string;
        facility_code?: string;
        city?: string;
        state?: string | null;
        country?: string;
    } | null;
    role: UserRole;
    user_status?: string;
    is_active: boolean;
    is_verified: boolean;
    mfa_enabled?: boolean;
    avatar?: string | null;
    last_login_at?: string | null;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    custom_permissions?: Record<string, AccessLevel> | null;
    permissions: Record<FeatureKey, AccessLevel>;
    ui_navigation: UINavigationManifest;
}

export interface UserPermissionsPayload {
    user_id: string;
    role: UserRole;
    is_admin: boolean;
    custom_permissions: Record<string, AccessLevel> | null;
    effective_permissions: Record<FeatureKey, AccessLevel>;
    ui_navigation: UINavigationManifest;
}

export interface UserPermissionsUpdatePayload {
    custom_permissions: Record<string, AccessLevel>;
}

export interface FeatureMeta {
    key: FeatureKey;
    label: string;
    category: FeatureCategory;
    description: string;
    route: string;
}

export type FeatureCategory =
    | "ghg_protocol"
    | "disclosures"
    | "infrastructure"
    | "analytics"
    | "governance";
