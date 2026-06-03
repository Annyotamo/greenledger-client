import type {
    ActivityItem,
    DashboardTab,
    EmissionsTrendPoint,
    FacilityRow,
    MetricCardData,
    Scope1FuelItem,
    Scope2Segment,
    ScopeComparisonMonth,
} from "./types";

export const DASHBOARD_TABS: { id: DashboardTab; label: string }[] = [
    { id: "emissions", label: "Emissions" },
    { id: "energy", label: "Energy" },
];

export const DATE_RANGE_LABEL = "April 1, 2025 - March 31, 2026";

export const METRIC_CARDS: MetricCardData[] = [
    {
        id: "total",
        label: "Total Emissions",
        icon: "leaderboard",
        value: 12482.5,
        unit: "tCO2e",
        trend: { value: "-4.2%", direction: "down" },
        progressPercent: 75,
        progressClassName: "bg-primary",
    },
    {
        id: "scope1",
        label: "Scope 1 (Direct)",
        icon: "factory",
        value: 3120.2,
        unit: "tCO2e",
        trend: { value: "+1.1%", direction: "up" },
        progressPercent: 25,
        progressClassName: "bg-secondary",
    },
    {
        id: "scope2",
        label: "Scope 2 (Indirect)",
        icon: "bolt",
        value: 9362.3,
        unit: "tCO2e",
        trend: { value: "-8.5%", direction: "down" },
        progressPercent: 66,
        progressClassName: "bg-secondary",
    },
    {
        id: "net-zero",
        label: "Net Zero Progress",
        icon: "eco",
        value: 42.5,
        unit: "Reduction",
        statusLabel: "On Track",
        progressPercent: 42.5,
        progressClassName: "bg-secondary-fixed-dim shadow-[0_0_8px_rgba(78,222,163,0.5)]",
    },
];

export const EMISSIONS_TREND: EmissionsTrendPoint[] = [
    { month: "Jan 23", actual: 180, target: 150 },
    { month: "Mar 23", actual: 170, target: 135 },
    { month: "May 23", actual: 165, target: 132 },
    { month: "Jul 23", actual: 140, target: 120 },
    { month: "Sep 23", actual: 130, target: 110 },
    { month: "Nov 23", actual: 120, target: 100 },
    { month: "Jan 24", actual: 115, target: 100 },
];

export const FACILITY_ROWS: FacilityRow[] = [
    {
        id: "FAC-8812",
        region: "Berlin, DE",
        status: "ACTIVE",
        emissions: 1124.0,
        yoyChange: "-2.4%",
        yoyDirection: "down",
        dataQuality: 4,
    },
    {
        id: "FAC-4409",
        region: "Tokyo, JP",
        status: "ACTIVE",
        emissions: 988.2,
        yoyChange: "+0.9%",
        yoyDirection: "up",
        dataQuality: 3,
    },
    {
        id: "FAC-2291",
        region: "Austin, US",
        status: "ACTIVE",
        emissions: 842.5,
        yoyChange: "-1.2%",
        yoyDirection: "down",
        dataQuality: 5,
    },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
    {
        id: "1",
        icon: "upload_file",
        iconBgClassName: "bg-secondary-container/40",
        iconColorClassName: "text-secondary",
        title: "New energy bill uploaded",
        subtitle: "Facility FAC-8812 • 12 mins ago",
    },
    {
        id: "2",
        icon: "fact_check",
        iconBgClassName: "bg-tertiary-container/10",
        iconColorClassName: "text-on-tertiary-container",
        title: "Audit verification complete",
        subtitle: "Q2 Sustainability Report • 1 hour ago",
    },
    {
        id: "3",
        icon: "person_add",
        iconBgClassName: "bg-surface-container-high/50",
        iconColorClassName: "text-primary",
        title: "Team member invited",
        subtitle: "Marcus Thorne • 3 hours ago",
    },
    {
        id: "4",
        icon: "warning",
        iconBgClassName: "bg-error-container/30",
        iconColorClassName: "text-error",
        title: "Scope 1 Threshold Alert",
        subtitle: "Austin Facility Exceeded Target • 5 hours ago",
    },
];

export const SCOPE1_FUELS: Scope1FuelItem[] = [
    { label: "Natural Gas", value: 1240, unit: "tCO2e", percent: 65 },
    { label: "Diesel (Fleet)", value: 2100, unit: "tCO2e", percent: 85 },
    { label: "Refrigerants", value: 780, unit: "tCO2e", percent: 35 },
];

export const SCOPE2_SEGMENTS: Scope2Segment[] = [
    { label: "Grid Purchase", percent: 72, color: "var(--gl-chart-esg-teal)" },
    { label: "Solar On-site", percent: 18, color: "var(--gl-chart-solar)" },
    { label: "Wind Power", percent: 10, color: "var(--gl-chart-wind)" },
];

export const SCOPE2_TOTAL = 9400;
export const SCOPE2_CARBON_INTENSITY = 245;

export const SCOPE_COMPARISON: ScopeComparisonMonth[] = [
    { month: "January", scope1: 45, scope2: 70 },
    { month: "February", scope1: 42, scope2: 68 },
    { month: "March", scope1: 48, scope2: 75 },
    { month: "April", scope1: 50, scope2: 65 },
    { month: "May", scope1: 47, scope2: 72 },
    { month: "June", scope1: 52, scope2: 80 },
];

export const USER_PROFILE = {
    name: "Elena Vance",
    role: "Sustainability Lead",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbd88smEnp1T918UBdVCrUYQlGMk_bf4VZ4nDnPCvzQ2sYS4fJPMeBc64gkCy63c_nFTWr55SP4srlFHafPjwME_8k_N6uRcNlIM-tiOe6uD51b4zH8iwFoZu4BaE40iXLw6-Mn8lA4oGgw-k3qWx3XkksRmznyrVjsC-TDBlHRs6MTVBM3j7rC0XX3NUihu1a7BMzdTKuS-yfmAzVrb2T2QUNbvQ0uNldVQdoegNhUjWpDSTRcZtHE5R9bCyZDHWUjsNJmK7Am2A",
};

export const SCOPE1_BUILDING_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3yEAKsMBBxCLV4LMmL2smuYjQYcHksTTCriDf2dSoZd96Wk9gysw0dWlD0gDSYhiXt5Uixkgms5n1umXEcHp5uqNqJP1dJ42N3gggMBmU4PNBAOq_gfrQmV_6bNm3cmLswlKq0cb56YuCJynM2Gcr7c0BY7-1SJObU5TB1zxtBkFGE0H_pf033O9Vs6KZKnXjN49sT1kwl6O9XZzCscryfF2g2gtufMWDo2YgwhpG3wDEKwRDjeBlczx2OzK1MM8LjNR2BUx8J0Y";
