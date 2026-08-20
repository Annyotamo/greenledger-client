import { Card } from "@/components/ui/card";
import { TravelActivityEntry, TravelSummaryData } from "@/lib/scope3/travel/types";

type Category6SummaryProps = {
    entries: TravelActivityEntry[];
    summary?: TravelSummaryData;
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category6Summary({ entries, summary }: Category6SummaryProps) {
    const totalDistance = summary?.total_distance_km ?? entries.reduce((s, e) => s + e.totalDistanceKm, 0);
    const totalEmissionsTco2e = summary?.total_t_co2e ?? entries.reduce((s, e) => s + e.totalTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    const airTco2e = summary?.mode_breakdown.AIR ?? entries.reduce((s, e) => s + e.airTCo2e, 0);
    const landTco2e = summary?.mode_breakdown.LAND ?? entries.reduce((s, e) => s + e.landTCo2e, 0);
    const seaTco2e = summary?.mode_breakdown.SEA ?? entries.reduce((s, e) => s + e.seaTCo2e, 0);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Travel Journeys
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {entries.length} <span className="text-body-md font-normal text-on-surface-variant">journeys</span>
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    {formatNumber(totalDistance, 1)} km Total Distance Travelled
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Business Travel Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Scope 3 Cat 6 Multi-Modal Travel Model
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Transport Mode Split (tCO₂e)
                </p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">Air Flights:</span>
                        <span className="font-bold text-primary">{formatNumber(airTco2e, 4)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">Land Transit:</span>
                        <span className="font-bold text-secondary">{formatNumber(landTco2e, 4)} t</span>
                    </div>
                    {seaTco2e > 0 && (
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">Sea Ferries:</span>
                            <span className="font-bold text-primary">{formatNumber(seaTco2e, 4)} t</span>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Audit Verification Status
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {verifiedCount} <span className="text-body-md font-normal text-on-surface-variant">Verified</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>
        </div>
    );
}
