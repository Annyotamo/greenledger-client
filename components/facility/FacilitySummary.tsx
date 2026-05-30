import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import type { Facility } from "@/lib/facility/types";

type FacilitySummaryProps = {
    facilities: Facility[];
};

interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: string;
    trend?: {
        value: string;
        direction: "up" | "down";
        isPositive: boolean;
    };
    subtext?: string;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function StatCard({ label, value, unit, icon, trend, subtext }: StatCardProps) {
    return (
        <Card className="p-card-padding flex flex-col gap-2">
            <div className="flex items-start justify-between">
                <p className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                    {label}
                </p>
                <MaterialIcon name={icon} className="text-on-secondary-container" size="sm" />
            </div>
            <div className="text-headline-md font-headline-md font-semibold text-primary">
                {value}
                {unit && <span className="text-body-md font-normal text-on-surface-variant"> {unit}</span>}
            </div>
            {trend && (
                <div
                    className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive ? "text-secondary" : "text-error"}`}>
                    <MaterialIcon
                        name={trend.direction === "up" ? "trending_up" : "trending_down"}
                        className="text-xs"
                        size="xs"
                    />
                    <span>{trend.value}</span>
                </div>
            )}
            {subtext && <p className="text-xs text-on-surface-variant">{subtext}</p>}
        </Card>
    );
}

export function FacilitySummary({ facilities }: FacilitySummaryProps) {
    // Calculate core metrics
    const facilityCount = facilities.length;
    const totalFloorArea = facilities.reduce((sum, f) => sum + Number(f.floorArea || 0), 0);
    const avgFloorArea = facilityCount > 0 ? Math.round(totalFloorArea / facilityCount) : 0;
    const totalEmployees = facilities.reduce((sum, f) => sum + (f.employeeCount || 0), 0);

    // Calculate active scopes for compliance metric
    const facilitiesWithAllScopes = facilities.filter(
        (f) => f.scope1Enabled && f.scope2Enabled && f.scope3Enabled,
    ).length;
    const reportingCompliance = facilityCount > 0 ? Math.round((facilitiesWithAllScopes / facilityCount) * 100) : 0;

    // Determine scope badges to display (up to 3)
    const scopesList = [
        { label: "SCOPE 1", enabled: facilities.some((f) => f.scope1Enabled) },
        { label: "SCOPE 2", enabled: facilities.some((f) => f.scope2Enabled) },
        { label: "SCOPE 3", enabled: facilities.some((f) => f.scope3Enabled) },
    ].filter((s) => s.enabled);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Facilities Card */}
            <StatCard
                label="Total Facilities"
                value={formatNumber(facilityCount)}
                icon="domain"
                trend={{ value: "+3 this quarter", direction: "up", isPositive: true }}
            />

            {/* Total Floor Area Card */}
            <StatCard
                label="Total Floor Area"
                value={formatNumber(totalFloorArea)}
                unit="sqft"
                icon="straighten"
                subtext={`Avg: ${formatNumber(avgFloorArea)} sqft / site`}
            />

            {/* Total Headcount Card */}
            <StatCard
                label="Total Headcount"
                value={formatNumber(totalEmployees)}
                icon="badge"
                trend={{ value: "-2% YoY growth", direction: "down", isPositive: false }}
            />

            {/* Active Scopes Card */}
            <Card className="p-card-padding flex flex-col">
                <p className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant mb-1">
                    Active Scopes
                </p>
                <div className="flex flex-wrap gap-2">
                    {scopesList.slice(0, 3).map(({ label }) => (
                        <span
                            key={label}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-secondary-container/30 text-on-secondary-container">
                            {label}
                        </span>
                    ))}
                </div>
                <div className="text-[10px] text-on-surface-variant mt-2 font-label-md">
                    REPORTING COMPLIANCE: {reportingCompliance}%
                </div>
            </Card>
        </div>
    );
}
