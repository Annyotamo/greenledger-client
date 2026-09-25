import { Card } from "@/components/ui/card";
import { Category9TransportActivityEntry } from "@/lib/scope3/category9/types";

type Category9SummaryProps = {
    entries: Category9TransportActivityEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category9Summary({ entries }: Category9SummaryProps) {
    const totalActivityValue = entries.reduce((sum, e) => sum + e.activityValue, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);
    const totalEmissionsKgCo2e = entries.reduce((sum, e) => sum + e.calculatedKgCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Transport Activity Quantity
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalActivityValue, 0)}
                </p>
                <p className="mt-2 font-sans text-xs font-semibold text-secondary tabular-nums">
                    Across {entries.length} Downstream Freight Logs (tonne.km / km)
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Headline Downstream Freight Emissions
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-slate-500">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500 tabular-nums">
                    {formatNumber(totalEmissionsKgCo2e, 2)} kgCO₂e Total Impact
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    DEFRA Method Standard
                </p>
                <p className="mt-2 font-display text-xl lg:text-2xl font-bold text-secondary tracking-tight">
                    Weight-Distance
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500">
                    Freighting Goods Factor Catalog
                </p>
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
