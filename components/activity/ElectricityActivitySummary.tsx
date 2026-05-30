import { Card } from "@/components/ui/card";
import type { ElectricityActivity } from "@/lib/activity/electricityTypes";

type ElectricityActivitySummaryProps = {
    activities: ElectricityActivity[];
};

function formatNumber(value: number, digits = 0) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function ElectricityActivitySummary({ activities }: ElectricityActivitySummaryProps) {
    const totalEmissions = activities.reduce((sum, activity) => sum + activity.calculatedTCo2e, 0);
    const totalKwh = activities.reduce((sum, activity) => sum + activity.electricityKwh, 0);
    const activeSources = new Set(activities.map((activity) => activity.sourceType)).size;

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="p-card-padding">
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Electricity Emissions
                </p>
                <p className="mt-3 text-headline-lg font-headline-lg font-semibold text-primary">
                    {formatNumber(totalEmissions, 2)}
                    <span className="text-body-md font-normal text-on-surface-variant"> tCO₂e</span>
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Electricity
                </p>
                <p className="mt-3 text-headline-lg font-headline-lg font-semibold text-primary">
                    {formatNumber(totalKwh, 0)}
                    <span className="text-body-md font-normal text-on-surface-variant"> kWh</span>
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                    {activeSources} active sources
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Data Quality
                </p>
                <p className="mt-3 text-headline-sm font-semibold text-primary">{activities.length} records</p>
            </Card>
        </div>
    );
}

export default ElectricityActivitySummary;
