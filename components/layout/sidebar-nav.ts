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
    { label: "Dashboard", icon: "dashboard", href: "/dashboard", active: true },
    { label: "Facilities", icon: "domain", href: "/facilities" },
    { label: "Reporting Periods", icon: "calendar_month", href: "/reporting-period" },
    { label: "Team Members", icon: "group", href: "/team-members" },
    { label: "Tenant Profile", icon: "business", href: "/tenant" },
];

export const SCOPE_NAV_CHILDREN: NavScopeChild[] = [
    { label: "Fuel", href: "/activities/fuel" },
    { label: "Electricity", href: "/activities/electricity" },
];

export const BOTTOM_NAV: NavItem[] = [
    { label: "Settings", icon: "settings", href: "#" },
    { label: "Help & Support", icon: "help", href: "#" },
];
