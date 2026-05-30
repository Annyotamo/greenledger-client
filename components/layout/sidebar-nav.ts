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
    { label: "Team Members", icon: "group", href: "#" },
    { label: "Tenant Profile", icon: "business", href: "#" },
    { label: "Audit Trails", icon: "history", href: "#" },
];

export const SCOPE_NAV_CHILDREN: NavScopeChild[] = [
    { label: "Fuel", href: "/activities/fuel" },
    { label: "Electricity", href: "/activities/electricity" },
];

export const BOTTOM_NAV: NavItem[] = [
    { label: "Settings", icon: "settings", href: "#" },
    { label: "Help & Support", icon: "help", href: "#" },
];
