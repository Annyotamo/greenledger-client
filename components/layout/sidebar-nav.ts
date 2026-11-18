export type NavItem = {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
};

export type NavScopeChild = {
    label: string;
    href: string;
};

export const MAIN_NAV: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { label: "Facilities", icon: "domain", href: "/facilities" },
    { label: "EU CBAM", icon: "verified", href: "/tenant-cbam" },
    { label: "Value Chain", icon: "hub", href: "/scope-3" },
    { label: "Team Members", icon: "group", href: "/team-members" },
    { label: "Tenant Profile", icon: "business", href: "/tenant" },
];

export const SCOPE_NAV_CHILDREN: NavScopeChild[] = [
    { label: "Fuel", href: "/activities/fuel" },
    { label: "Electricity", href: "/activities/electricity" },
];

export const BRSR_NAV_CHILDREN: NavScopeChild[] = [
    { label: "BRSR Reporting", href: "/brsr" },
    { label: "EIA/NIPL Air Emissions", href: "/brsr/air" },
];

export const BOTTOM_NAV: NavItem[] = [
    { label: "Audit Logs", icon: "history", href: "/audit-logs" },
];
