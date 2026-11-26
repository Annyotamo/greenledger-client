import type { FeatureKey } from "@/lib/rbac/types";

export type NavItem = {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
    featureKey?: FeatureKey;
};

export type NavScopeChild = {
    label: string;
    href: string;
    featureKey: FeatureKey;
};

export const MAIN_NAV: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", href: "/dashboard", featureKey: "analytics" },
    { label: "EU CBAM", icon: "verified", href: "/tenant-cbam", featureKey: "cbam" },
    { label: "Leather Module", icon: "workspace_premium", href: "/lwg", featureKey: "lwg" },
    { label: "Value Chain", icon: "hub", href: "/scope-3", featureKey: "scope_3_cat1" },
    { label: "Team Members", icon: "group", href: "/team-members", featureKey: "team_members" },
];

export const SCOPE_NAV_CHILDREN: NavScopeChild[] = [
    { label: "Fuel", href: "/activities/fuel", featureKey: "scope_1" },
    { label: "Electricity", href: "/activities/electricity", featureKey: "scope_2" },
];

export const BRSR_NAV_CHILDREN: NavScopeChild[] = [
    { label: "BRSR Reporting", href: "/brsr", featureKey: "brsr" },
    { label: "EIA/NIPL Air Emissions", href: "/brsr/air", featureKey: "eia" },
];

export const BOTTOM_NAV: NavItem[] = [
    { label: "Audit Logs", icon: "history", href: "/audit-logs", featureKey: "audit_trails" },
];
