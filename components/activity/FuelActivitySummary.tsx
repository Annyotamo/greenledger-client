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
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Activities Logged
                </p>
                <p className="mt-3 text-headline-lg font-headline-lg font-semibold text-primary">
                    {formatNumber(totalActivities, 0)}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                    Across {uniqueFacilities} facility{uniqueFacilities === 1 ? "" : "ies"}
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Fuel Quantity
                </p>
                <p className="mt-3 text-headline-lg font-headline-lg font-semibold text-primary">
                    {formatNumber(totalQuantity, 0)}
                    <span className="text-body-md font-normal text-on-surface-variant"> {unitSymbol}</span>
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                    Top fuel: {mostCommonFuel}
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Emissions
                </p>
                <p className="mt-3 text-headline-lg font-headline-lg font-semibold text-primary">
                    {formatNumber(totalEmissions, 2)}
                    <span className="text-body-md font-normal text-on-surface-variant"> tCO₂e</span>
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                    Avg. {formatNumber(averageEmissions, 2)} tCO₂e per activity
                </p>
            </Card>

            <Card className="p-card-padding">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-label-md font-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                        Measured Data
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                        {qualityBreakdown.measuredPercent}%
                    </span>
                </div>
                <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                            <span>Measured</span>
                            <span>{qualityBreakdown.measuredPercent}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-secondary"
                                style={{ width: `${qualityBreakdown.measuredPercent}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                            <span>Estimated</span>
                            <span>{qualityBreakdown.estimatedPercent}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
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
