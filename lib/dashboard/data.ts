import type {
    ActivityItem,
    DashboardTab,
    EmissionsTrendPoint,
    EnergyTrendPoint,
    EnergyBarItem,
    EnergySourceNode,
    FacilityRow,
    MetricCardData,
    Scope1FuelItem,
    Scope2Segment,
    ScopeComparisonMonth,
    ParsedScopeGasSegregation,
    ParsedGasBreakdownItem,
    YearlyEmissionsTrendPoint,
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

export const DEFAULT_SCOPE_GAS_SEGREGATION: ParsedScopeGasSegregation = {
    overall: {
        co2Kg: 8050.0,
        co2T: 8.05,
        co2Tco2e: 8.05,
        ch4Kg: 120.0,
        ch4T: 0.12,
        ch4Tco2e: 0.12,
        n2oKg: 110.0,
        n2oT: 0.11,
        n2oTco2e: 0.11,
        biogenicCo2Kg: 0.0,
        biogenicCo2T: 0.0,
        totalTco2e: 8.28,
    },
    total: {
        co2Kg: 8050.0,
        co2T: 8.05,
        co2Tco2e: 8.05,
        ch4Kg: 120.0,
        ch4T: 0.12,
        ch4Tco2e: 0.12,
        n2oKg: 110.0,
        n2oT: 0.11,
        n2oTco2e: 0.11,
        biogenicCo2Kg: 0.0,
        biogenicCo2T: 0.0,
        totalTco2e: 8.28,
    },
    scope1: {
        co2Kg: 2650.0,
        co2T: 2.65,
        co2Tco2e: 2.65,
        ch4Kg: 10.0,
        ch4T: 0.01,
        ch4Tco2e: 0.01,
        n2oKg: 20.0,
        n2oT: 0.02,
        n2oTco2e: 0.02,
        biogenicCo2Kg: 0.0,
        biogenicCo2T: 0.0,
        totalTco2e: 2.68,
    },
    scope2: {
        co2Kg: 4000.0,
        co2T: 4.0,
        co2Tco2e: 4.0,
        ch4Kg: 50.0,
        ch4T: 0.05,
        ch4Tco2e: 0.05,
        n2oKg: 50.0,
        n2oT: 0.05,
        n2oTco2e: 0.05,
        biogenicCo2Kg: 0.0,
        biogenicCo2T: 0.0,
        totalTco2e: 4.10,
    },
    scope3: {
        co2Kg: 1400.0,
        co2T: 1.4,
        co2Tco2e: 1.4,
        ch4Kg: 60.0,
        ch4T: 0.06,
        ch4Tco2e: 0.06,
        n2oKg: 40.0,
        n2oT: 0.04,
        n2oTco2e: 0.04,
        biogenicCo2Kg: 0.0,
        biogenicCo2T: 0.0,
        totalTco2e: 1.50,
    },
};

export const DEFAULT_GRANULAR_GAS_BREAKDOWN: ParsedGasBreakdownItem[] = [
    {
        gasName: "CO2",
        massKg: 8050.0,
        massT: 8.05,
        tco2e: 8.05,
        sharePct: 97.2,
        color: "#10b981",
        scope1: { kg: 2650.0, t: 2.65, tco2e: 2.65 },
        scope2: { kg: 4000.0, t: 4.0, tco2e: 4.0 },
        scope3: { kg: 1400.0, t: 1.4, tco2e: 1.4 },
    },
    {
        gasName: "CH4",
        massKg: 120.0,
        massT: 0.12,
        tco2e: 0.12,
        sharePct: 1.4,
        color: "#60a5fa",
        scope1: { kg: 10.0, t: 0.01, tco2e: 0.01 },
        scope2: { kg: 50.0, t: 0.05, tco2e: 0.05 },
        scope3: { kg: 60.0, t: 0.06, tco2e: 0.06 },
    },
    {
        gasName: "N2O",
        massKg: 110.0,
        massT: 0.11,
        tco2e: 0.11,
        sharePct: 1.3,
        color: "#f97316",
        scope1: { kg: 20.0, t: 0.02, tco2e: 0.02 },
        scope2: { kg: 50.0, t: 0.05, tco2e: 0.05 },
        scope3: { kg: 40.0, t: 0.04, tco2e: 0.04 },
    },
    {
        gasName: "Biogenic CO2",
        massKg: 0.0,
        massT: 0.0,
        tco2e: 0.0,
        sharePct: 0.0,
        color: "#a855f7",
        scope1: { kg: 0.0, t: 0.0, tco2e: 0.0 },
        scope2: { kg: 0.0, t: 0.0, tco2e: 0.0 },
        scope3: { kg: 0.0, t: 0.0, tco2e: 0.0 },
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
        id: "PL-01",
        region: "Mumbai Plant (Mumbai, India)",
        status: "ACTIVE",
        emissions: 8.28,
        yoyChange: "-4.2%",
        yoyDirection: "down",
        dataQuality: 100,
        co2Tco2e: 8.05,
        ch4Tco2e: 0.12,
        n2oTco2e: 0.11,
        sharePct: 100.0,
    },
    {
        id: "FAC-8812",
        region: "Berlin Manufacturing (Berlin, Germany)",
        status: "ACTIVE",
        emissions: 1124.0,
        yoyChange: "-2.4%",
        yoyDirection: "down",
        dataQuality: 95,
        co2Tco2e: 1088.0,
        ch4Tco2e: 20.5,
        n2oTco2e: 15.5,
        sharePct: 52.0,
    },
    {
        id: "FAC-4409",
        region: "Tokyo Logistics Hub (Tokyo, Japan)",
        status: "ACTIVE",
        emissions: 988.2,
        yoyChange: "+0.9%",
        yoyDirection: "up",
        dataQuality: 90,
        co2Tco2e: 960.0,
        ch4Tco2e: 16.2,
        n2oTco2e: 12.0,
        sharePct: 48.0,
    },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
    {
        id: "1",
        icon: "upload_file",
        iconBgClassName: "bg-secondary-container/40",
        iconColorClassName: "text-secondary",
        title: "New energy bill uploaded",
        subtitle: "Facility PL-01 • 12 mins ago",
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
        subtitle: "Mumbai Facility Exceeded Target • 5 hours ago",
    },
    {
        id: "5",
        icon: "verified",
        iconBgClassName: "bg-emerald-500/10",
        iconColorClassName: "text-emerald-500",
        title: "Electricity Activity Verified",
        subtitle: "Facility PL-01 • 2026-08-18 • 4.10 tCO2e",
    },
    {
        id: "6",
        icon: "bolt",
        iconBgClassName: "bg-blue-500/10",
        iconColorClassName: "text-blue-500",
        title: "Grid Power Factor Updated",
        subtitle: "CEA Factors 2025/26 • 1 day ago",
    },
    {
        id: "7",
        icon: "local_fire_department",
        iconBgClassName: "bg-orange-500/10",
        iconColorClassName: "text-orange-500",
        title: "Fuel Combustion Batch Added",
        subtitle: "Mumbai Plant (Scope 1) • 2.68 tCO2e",
    },
    {
        id: "8",
        icon: "category",
        iconBgClassName: "bg-emerald-500/10",
        iconColorClassName: "text-emerald-500",
        title: "Waste Generated in Operations",
        subtitle: "Mumbai Manufacturing • 2026-08-16 • 10.5 tonnes",
    },
    {
        id: "9",
        icon: "local_shipping",
        iconBgClassName: "bg-blue-500/10",
        iconColorClassName: "text-blue-500",
        title: "Upstream Transportation Logged",
        subtitle: "London HQ Office • 2026-08-15 • 4.35 tCO2e",
    },
    {
        id: "10",
        icon: "apartment",
        iconBgClassName: "bg-orange-500/10",
        iconColorClassName: "text-orange-500",
        title: "Stationary Combustion Report",
        subtitle: "Facility PL-01 • 2026-08-14 • 2.65 tCO2e",
    },
    {
        id: "11",
        icon: "fact_check",
        iconBgClassName: "bg-emerald-500/10",
        iconColorClassName: "text-emerald-500",
        title: "Biogenic CO2 Emissions Audit",
        subtitle: "Verified by GHG Standard • 2026-08-12",
    },
    {
        id: "12",
        icon: "hub",
        iconBgClassName: "bg-purple-500/10",
        iconColorClassName: "text-purple-500",
        title: "Purchased Goods & Services",
        subtitle: "Scope 3 Category 1 • 2026-08-10 • 1.50 tCO2e",
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
    { month: "January", scope1: 45, scope2: 70, scope3: 20, total: 135, co2Tco2e: 131.2, ch4Tco2e: 2.0, n2oTco2e: 1.8 },
    { month: "February", scope1: 42, scope2: 68, scope3: 18, total: 128, co2Tco2e: 124.5, ch4Tco2e: 1.9, n2oTco2e: 1.6 },
    { month: "March", scope1: 48, scope2: 75, scope3: 22, total: 145, co2Tco2e: 141.0, ch4Tco2e: 2.1, n2oTco2e: 1.9 },
    { month: "April", scope1: 50, scope2: 65, scope3: 21, total: 136, co2Tco2e: 132.3, ch4Tco2e: 2.0, n2oTco2e: 1.7 },
    { month: "May", scope1: 47, scope2: 72, scope3: 19, total: 138, co2Tco2e: 134.2, ch4Tco2e: 2.0, n2oTco2e: 1.8 },
    { month: "June", scope1: 52, scope2: 80, scope3: 25, total: 157, co2Tco2e: 152.6, ch4Tco2e: 2.3, n2oTco2e: 2.1 },
];

export const ENERGY_METRIC_CARDS: MetricCardData[] = [
    {
        id: "energy-total",
        label: "Total Energy Consumed",
        icon: "leaderboard",
        value: 38600,
        unit: "MWh",
        progressPercent: 100,
        progressClassName: "bg-primary",
    },
    {
        id: "energy-captive",
        label: "Captive Generated",
        icon: "energy_savings_leaf",
        value: 30400,
        unit: "MWh",
        progressPercent: 79,
        progressClassName: "bg-secondary",
    },
    {
        id: "energy-grid",
        label: "Grid Sourced",
        icon: "bolt",
        value: 8200,
        unit: "MWh",
        progressPercent: 21,
        progressClassName: "bg-primary-container",
    },
    {
        id: "energy-displacement",
        label: "Grid Displacement",
        icon: "trending_up",
        value: 56,
        unit: "%",
        statusLabel: "Improved vs. FY24",
        progressPercent: 56,
        progressClassName: "bg-secondary-fixed-dim shadow-[0_0_8px_rgba(78,222,163,0.5)]",
    },
];

export const ENERGY_TREND: EnergyTrendPoint[] = [
    { month: "Apr", captive: 3200, grid: 900 },
    { month: "May", captive: 3300, grid: 860 },
    { month: "Jun", captive: 3400, grid: 820 },
    { month: "Jul", captive: 3450, grid: 780 },
    { month: "Aug", captive: 3500, grid: 760 },
    { month: "Sep", captive: 3600, grid: 740 },
    { month: "Oct", captive: 3550, grid: 800 },
    { month: "Nov", captive: 3580, grid: 820 },
    { month: "Dec", captive: 3600, grid: 840 },
];

export const ENERGY_MIX_SEGMENTS: Scope2Segment[] = [
    { label: "Captive Generated", percent: 79, color: "var(--gl-secondary)" },
    { label: "Grid Purchase", percent: 21, color: "#fb923c" },
];

export const ENERGY_MIX_TOTAL = 30400;

export const ENERGY_HIERARCHY: EnergyBarItem[] = [
    { label: "Captive Steam WHRB", value: 19200, percent: 95, color: "var(--gl-secondary)" },
    { label: "Captive Fossil", value: 10200, percent: 50, color: "#fb923c" },
    { label: "Captive Solar", value: 1000, percent: 10, color: "#60a5fa" },
    { label: "Grid DISCOM", value: 8200, percent: 41, color: "#64748b" },
];

export const ENERGY_SOURCE_TREE: EnergySourceNode[] = [
    {
        label: "Captive Generated",
        value: 30400,
        unit: "MWh",
        children: [
            {
                label: "Captive Steam",
                value: 19200,
                unit: "MWh",
                children: [
                    { label: "WHRB 3 DRI Kilns", value: 19200, unit: "MWh" },
                    {
                        label: "Kiln 1",
                        value: 6500,
                        unit: "MWh",
                    },
                    {
                        label: "Kiln 2",
                        value: 6400,
                        unit: "MWh",
                    },
                    {
                        label: "Kiln 3",
                        value: 6300,
                        unit: "MWh",
                    },
                ],
            },
            {
                label: "Captive Fossil",
                value: 10200,
                unit: "MWh",
                children: [
                    { label: "FBC Coal", value: 6600, unit: "MWh" },
                    { label: "FBC Dolo", value: 3600, unit: "MWh" },
                ],
            },
            {
                label: "Captive Renewable",
                value: 1000,
                unit: "MWh",
            },
        ],
    },
    {
        label: "Grid DISCOM",
        value: 8200,
        unit: "MWh",
        note: "EF 0.712 tCO₂/MWh — CEA V21.0",
    },
];

export const ENERGY_GENERATION_SOURCES: EnergyBarItem[] = [
    { label: "WHRB Kiln 1-3", value: 20400, percent: 100, color: "var(--gl-secondary)" },
    { label: "FBC Coal", value: 6600, percent: 32, color: "#fb923c" },
    { label: "FBC Dolo", value: 3600, percent: 18, color: "#f59e0b" },
    { label: "Solar Rooftop", value: 1000, percent: 5, color: "#60a5fa" },
];

export const ENERGY_BOILER_FUEL: EnergyBarItem[] = [
    { label: "WHRB (Waste Heat)", value: 20400, percent: 100, color: "var(--gl-secondary)" },
    { label: "FBC Coal", value: 6600, percent: 32, color: "#fb923c" },
    { label: "FBC Dolo", value: 3600, percent: 18, color: "#fbbf24" },
];

export const USER_PROFILE = {
    name: "Elena Vance",
    role: "Sustainability Lead",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbd88smEnp1T918UBdVCrUYQlGMk_bf4VZ4nDnPCvzQ2sYS4fJPMeBc64gkCy63c_nFTWr55SP4srlFHafPjwME_8k_N6uRcNlIM-tiOe6uD51b4zH8iwFoZu4BaE40iXLw6-Mn8lA4oGgw-k3qWx3XkksRmznyrVjsC-TDBlHRs6MTVBM3j7rC0XX3NUihu1a7BMzdTKuS-yfmAzVrb2T2QUNbvQ0uNldVQdoegNhUjWpDSTRcZtHE5R9bCyZDHWUjsNJmK7Am2A",
};

export const SCOPE1_BUILDING_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3yEAKsMBBxCLV4LMmL2smuYjQYcHksTTCriDf2dSoZd96Wk9gysw0dWlD0gDSYhiXt5Uixkgms5n1umXEcHp5uqNqJP1dJ42N3gggMBmU4PNBAOq_gfrQmV_6bNm3cmLswlKq0cb56YuCJynM2Gcr7c0BY7-1SJObU5TB1zxtBkFGE0H_pf033O9Vs6KZKnXjN49sT1kwl6O9XZzCscryfF2g2gtufMWDo2YgwhpG3wDEKwRDjeBlczx2OzK1MM8LjNR2BUx8J0Y";
