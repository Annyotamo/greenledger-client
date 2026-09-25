import { Card } from "@/components/ui/card";
import type { FuelActivity } from "@/lib/activity/types";

type FuelActivitySummaryProps = {
    activities: FuelActivity[];
};

function formatNumber(value: number, digits = 0) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

function getQualityBreakdown(activities: FuelActivity[]) {
    const measured = activities.filter((activity) => activity.dataQualityTier.toLowerCase() === "measured").length;
    const estimated = activities.length - measured;
    const total = Math.max(activities.length, 1);

    return {
        measured,
        estimated,
        measuredPercent: Math.round((measured / total) * 100),
        estimatedPercent: Math.round((estimated / total) * 100),
    };
}

function getMostCommonFuel(activities: FuelActivity[]) {
    const counts = activities.reduce<Record<string, number>>((acc, activity) => {
        const fuel = activity.fuelName ?? "Unknown";
        acc[fuel] = (acc[fuel] ?? 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mixed fuels";
}

export function FuelActivitySummary({ activities }: FuelActivitySummaryProps) {
    const totalEmissions = activities.reduce((sum, activity) => sum + activity.calculatedTCo2e, 0);
    const totalQuantity = activities.reduce((sum, activity) => sum + activity.quantity, 0);
    const totalActivities = activities.length;
    const activeFuelTypes = new Set(activities.map((activity) => activity.fuelName)).size;
    const uniqueFacilities = new Set(activities.map((activity) => activity.facilityId)).size;
    const qualityBreakdown = getQualityBreakdown(activities);
    const unitSymbol = activities[0]?.unitSymbol ?? "Units";
    const averageEmissions = totalActivities ? totalEmissions / totalActivities : 0;
    const mostCommonFuel = getMostCommonFuel(activities);

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <Card className="p-card-padding">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Activities Logged
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalActivities, 0)}
                </p>
                <p className="mt-2 font-sans text-xs text-on-surface-variant">
                    Across {uniqueFacilities} facilit{uniqueFacilities === 1 ? "y" : "ies"}
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total Fuel Quantity
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalQuantity, 0)}
                    <span className="font-sans text-xs font-medium text-on-surface-variant ml-1">{unitSymbol}</span>
                </p>
                <p className="mt-2 font-sans text-xs text-on-surface-variant">
                    Top fuel: {mostCommonFuel}
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total Emissions
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissions, 2)}
                    <span className="font-sans text-xs font-medium text-on-surface-variant ml-1">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs text-on-surface-variant">
                    Avg. {formatNumber(averageEmissions, 2)} tCO₂e per activity
                </p>
            </Card>

            <Card className="p-card-padding">
                <div className="flex items-center justify-between gap-4">
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Measured Data
                    </p>
                    <span className="font-sans text-xs font-bold text-primary tabular-nums">
                        {qualityBreakdown.measuredPercent}%
                    </span>
                </div>
                <div className="mt-3 space-y-2">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-xs text-on-surface-variant">
                            <span>Measured</span>
                            <span className="font-semibold tabular-nums">{qualityBreakdown.measuredPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-secondary"
                                style={{ width: `${qualityBreakdown.measuredPercent}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-xs text-on-surface-variant">
                            <span>Estimated</span>
                            <span className="font-semibold tabular-nums">{qualityBreakdown.estimatedPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-secondary-container"
                                style={{ width: `${qualityBreakdown.estimatedPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
