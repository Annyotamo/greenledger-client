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

function getMostCommon(items: string[]) {
    const counts = items.reduce<Record<string, number>>((acc, item) => {
        if (!item) return acc;
        acc[item] = (acc[item] ?? 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mixed";
}

export function ElectricityActivitySummary({ activities }: ElectricityActivitySummaryProps) {
    const totalEmissions = activities.reduce((sum, activity) => sum + activity.calculatedTCo2e, 0);
    const totalMwh = activities.reduce((sum, activity) => sum + activity.electricityMwh, 0);
    const activeFacilities = new Set(activities.map((activity) => activity.facilityId)).size;
    const activeSources = new Set(activities.map((activity) => activity.sourceType)).size;

    const marketBasedActivities = activities.filter((act) => act.accountingMethod === "market_based");
    const marketCount = marketBasedActivities.length;
    const contractedMwh = marketBasedActivities.reduce((sum, act) => {
        const allocMwh = act.marketAllocation?.contractedElectricityMwh ?? (act.marketAllocation?.contractedElectricityKwh ? act.marketAllocation.contractedElectricityKwh / 1000 : 0);
        return sum + allocMwh;
    }, 0);

    const renewableCertified = activities.filter(
        (activity) => activity.isRenewableCertified || (activity.accountingMethod === "market_based" && ["renewable_ppa", "rec_backed_electricity", "irec_backed_electricity"].includes(activity.sourceType))
    ).length;
    const averageEmissions = activities.length ? totalEmissions / activities.length : 0;
    const averageMwh = activities.length ? totalMwh / activities.length : 0;
    const mostCommonSource = getMostCommon(activities.map((activity) => activity.sourceType));
    const certifiedPercent = activities.length ? Math.round((renewableCertified / activities.length) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <Card className="p-card-padding">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Activities Logged
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(activities.length, 0)}
                </p>
                <p className="mt-2 font-sans text-xs text-on-surface-variant">
                    Across {activeFacilities} facilit{activeFacilities === 1 ? "y" : "ies"} • {marketCount} Market-Based
                </p>
            </Card>

            <Card className="p-card-padding">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total Electricity
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalMwh, 2)}
                    <span className="font-sans text-xs font-medium text-on-surface-variant ml-1">MWh</span>
                </p>
                <p className="mt-2 font-sans text-xs text-secondary font-medium">
                    {formatNumber(contractedMwh, 2)} MWh under PPA/REC contracts
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
                        Renewable Certified
                    </p>
                    <span className="font-sans text-xs font-bold text-secondary tabular-nums">
                        {certifiedPercent}%
                    </span>
                </div>
                <div className="mt-3 space-y-2">
                    <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${certifiedPercent}%` }} />
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant">
                        {renewableCertified} of {activities.length} activities certified green/PPA
                    </p>
                    <div className="mt-1 font-sans text-xs text-on-surface-variant capitalize">
                        Top source: {mostCommonSource.replace(/_/g, " ")}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ElectricityActivitySummary;

