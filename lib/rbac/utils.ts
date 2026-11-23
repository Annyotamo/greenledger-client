import type { AccessLevel, FeatureKey, UINavigationManifest, UserProfile, UserRole } from "./types";
import { ROLE_DEFAULT_PERMISSIONS } from "./constants";

export const ACCESS_RANK: Record<AccessLevel, number> = {
    none: 0,
    read: 10,
    write: 20,
    admin: 30,
};

/**
 * Compare two access levels.
 * Returns true if userLevel meets or exceeds requiredLevel.
 */
export function hasAccess(userLevel: AccessLevel | undefined | null, requiredLevel: AccessLevel): boolean {
    const current = ACCESS_RANK[userLevel || "none"] ?? 0;
    const target = ACCESS_RANK[requiredLevel] ?? 0;
    return current >= target;
}

/**
 * Check if the user has required access level for a specific feature.
 * Automatically grants access if the user is TENANT_OWNER or TENANT_ADMIN.
 */
export function checkPermission(
    user: UserProfile | null | undefined,
    feature: FeatureKey,
    requiredLevel: AccessLevel = "read",
): boolean {
    if (!user) return false;
    if (user.role === "TENANT_OWNER" || user.role === "TENANT_ADMIN") {
        return true;
    }

    const currentLevel = user.permissions?.[feature] ?? "none";
    return hasAccess(currentLevel, requiredLevel);
}

/**
 * Resolves effective permissions by layering custom overrides on top of role defaults.
 * Tenant owners and tenant admins always resolve to full admin on all features.
 */
export function resolveEffectivePermissions(
    role: UserRole,
    customOverrides?: Record<string, AccessLevel> | null,
): Record<FeatureKey, AccessLevel> {
    const defaults = ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.CUSTOM;

    if (role === "TENANT_OWNER" || role === "TENANT_ADMIN") {
        return { ...defaults };
    }

    const resolved = { ...defaults };
    if (customOverrides && typeof customOverrides === "object") {
        for (const [key, level] of Object.entries(customOverrides)) {
            if (key in resolved && (level === "none" || level === "read" || level === "write" || level === "admin")) {
                resolved[key as FeatureKey] = level;
            }
        }
    }

    return resolved;
}

/**
 * Constructs a fallback UINavigationManifest from effective permissions if the backend did not provide one.
 */
export function buildUINavigationManifest(
    permissions: Record<FeatureKey, AccessLevel>,
    role: UserRole,
): UINavigationManifest {
    if (role === "TENANT_OWNER" || role === "TENANT_ADMIN") {
        return {
            scope_1: true,
            scope_2: true,
            scope_3: true,
            scope_3_categories: {
                cat1_spend: true,
                cat2_spend: true,
                cat3_wtt: true,
                cat4_transport: true,
                cat5_waste: true,
                cat6_travel: true,
                cat7_commute: true,
                cat9_transport: true,
                cat15_investments: true,
            },
            brsr: true,
            cbam: true,
            eia: true,
            facilities: true,
            reporting_periods: true,
            analytics: true,
            team_members: true,
            audit_trails: true,
        };
    }

    const canSee = (k: FeatureKey) => (ACCESS_RANK[permissions[k]] ?? 0) > 0;

    const cat1 = canSee("scope_3_cat1");
    const cat2 = canSee("scope_3_cat2");
    const cat3 = canSee("scope_3_cat3");
    const cat4 = canSee("scope_3_cat4");
    const cat5 = canSee("scope_3_cat5");
    const cat6 = canSee("scope_3_cat6");
    const cat7 = canSee("scope_3_cat7");
    const cat9 = canSee("scope_3_cat9");
    const cat15 = canSee("scope_3_cat15");

    const hasAnyScope3 = cat1 || cat2 || cat3 || cat4 || cat5 || cat6 || cat7 || cat9 || cat15;

    return {
        scope_1: canSee("scope_1"),
        scope_2: canSee("scope_2"),
        scope_3: hasAnyScope3,
        scope_3_categories: {
            cat1_spend: cat1,
            cat2_spend: cat2,
            cat3_wtt: cat3,
            cat4_transport: cat4,
            cat5_waste: cat5,
            cat6_travel: cat6,
            cat7_commute: cat7,
            cat9_transport: cat9,
            cat15_investments: cat15,
        },
        brsr: canSee("brsr"),
        cbam: canSee("cbam"),
        eia: canSee("eia"),
        facilities: canSee("facilities"),
        reporting_periods: canSee("reporting_periods"),
        analytics: canSee("analytics"),
        team_members: canSee("team_members"),
        audit_trails: canSee("audit_trails"),
    };
}
