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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Travel Journeys
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {entries.length} <span className="font-sans text-sm font-normal text-slate-500">journeys</span>
                </p>
                <p className="mt-2 font-sans text-xs font-semibold text-secondary tabular-nums">
                    {formatNumber(totalDistance, 1)} km Total Distance Travelled
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Business Travel Emissions
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-slate-500">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500">
                    Scope 3 Cat 6 Multi-Modal Travel Model
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Transport Mode Split (tCO₂e)
                </p>
                <div className="mt-2 space-y-1 font-sans text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Air Flights:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">{formatNumber(airTco2e, 4)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Land Transit:</span>
                        <span className="font-semibold text-secondary tabular-nums">{formatNumber(landTco2e, 4)} t</span>
                    </div>
                    {seaTco2e > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Sea Ferries:</span>
                            <span className="font-semibold text-slate-900 tabular-nums">{formatNumber(seaTco2e, 4)} t</span>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Audit Verification Status
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {verifiedCount} <span className="font-sans text-sm font-normal text-slate-500">Verified</span>
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>
        </div>
    );
}
