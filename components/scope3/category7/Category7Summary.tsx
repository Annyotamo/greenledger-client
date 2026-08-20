import { Card } from "@/components/ui/card";
import { TravelActivityEntry, TravelSummaryData } from "@/lib/scope3/travel/types";

type Category7SummaryProps = {
    entries: TravelActivityEntry[];
    summary?: TravelSummaryData;
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category7Summary({ entries, summary }: Category7SummaryProps) {
    const totalDistance = summary?.total_distance_km ?? entries.reduce((s, e) => s + e.totalDistanceKm, 0);
    const totalEmissionsTco2e = summary?.total_t_co2e ?? entries.reduce((s, e) => s + e.totalTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    const landTco2e = summary?.mode_breakdown.LAND ?? entries.reduce((s, e) => s + e.landTCo2e, 0);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Employee Commute Logs
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {entries.length} <span className="text-body-md font-normal text-on-surface-variant font-mono">logs</span>
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    {formatNumber(totalDistance, 1)} km Total Commute Distance
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Commute Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant font-mono">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Scope 3 Cat 7 Employee Commute Model
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Transit & Vehicle Share
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(landTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant font-mono">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-secondary font-medium">
                    Suburban Rail, Bus, Carpool & Private Vehicles
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Audit Verification Status
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {verifiedCount} <span className="text-body-md font-normal text-on-surface-variant font-mono">Verified</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>
        </div>
    );
}
