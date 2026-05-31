import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import type { ReportingPeriod } from "@/lib/reportingPeriods/types";

type ReportingPeriodSummaryProps = {
    periods: ReportingPeriod[];
};

interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: string;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function StatCard({ label, value, unit, icon }: StatCardProps) {
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
        </Card>
    );
}

export function ReportingPeriodSummary({ periods }: ReportingPeriodSummaryProps) {
    // Calculate metrics
    const totalPeriods = periods.length;
    const openPeriods = periods.filter((p) => p.periodStatus === "open").length;
    const closedPeriods = periods.filter((p) => p.periodStatus === "closed").length;
    const lockedPeriods = periods.filter((p) => p.periodStatus === "locked").length;

    // Calculate total emissions
    const totalEmissions = periods.reduce((sum, p) => sum + (p.scope1TotalTCo2e ?? 0), 0);
    const avgEmissions = totalPeriods > 0 ? Math.round(totalEmissions / totalPeriods) : 0;

    // Get year range
    const years = periods
        .map((p) => p.reportingYear)
        .filter((year, index, self) => self.indexOf(year) === index)
        .sort();
    const yearRange = years.length > 0 ? `${years[0]}–${years[years.length - 1]}` : "—";

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Periods Card */}
            <StatCard label="Total Periods" value={formatNumber(totalPeriods)} icon="calendar_month" />

            {/* Open Periods Card */}
            <StatCard label="Open Periods" value={openPeriods} icon="schedule" />

            {/* Closed Periods Card */}
            <StatCard label="Closed Periods" value={closedPeriods} icon="done_all" />

            {/* Year Coverage Card */}
            <Card className="p-card-padding flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <p className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                        Year Coverage
                    </p>
                    <MaterialIcon name="date_range" className="text-on-secondary-container" size="sm" />
                </div>
                <div className="text-headline-md font-headline-md font-semibold text-primary">{yearRange}</div>
                <div className="text-[10px] text-on-surface-variant mt-1 font-label-md">
                    {lockedPeriods > 0 && `${lockedPeriods} locked`}
                </div>
            </Card>
        </div>
    );
}
