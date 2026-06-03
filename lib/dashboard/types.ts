export type TrendDirection = "up" | "down" | "neutral";

export type MetricCardData = {
    id: string;
    label: string;
    icon: string;
    value: number;
    unit: string;
    trend?: { value: string; direction: TrendDirection };
    statusLabel?: string;
    progressPercent: number;
    progressClassName?: string;
};

export type EmissionsTrendPoint = {
    month: string;
    actual: number;
    target: number;
};

export type FacilityRow = {
    id: string;
    region: string;
    status: "ACTIVE" | "INACTIVE";
    emissions: number;
    yoyChange: string;
    yoyDirection: TrendDirection;
    dataQuality: number;
};

export type ActivityItem = {
    id: string;
    icon: string;
    iconBgClassName: string;
    iconColorClassName: string;
    title: string;
    subtitle: string;
};

export type Scope1FuelItem = {
    label: string;
    value: number;
    unit: string;
    percent: number;
};

export type Scope2Segment = {
    label: string;
    percent: number;
    color: string;
};

export type ScopeComparisonMonth = {
    month: string;
    scope1: number;
    scope2: number;
};

export type DashboardTab = "emissions" | "energy";
