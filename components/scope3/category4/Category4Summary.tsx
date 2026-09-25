import { Card } from "@/components/ui/card";
import { Category4TransportActivityEntry } from "@/lib/scope3/category4/types";

type Category4SummaryProps = {
    entries: Category4TransportActivityEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category4Summary({ entries }: Category4SummaryProps) {
    const totalActivityValue = entries.reduce((sum, e) => sum + e.activityValue, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);
    const totalEmissionsKgCo2e = entries.reduce((sum, e) => sum + e.calculatedKgCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total Transport Activity Quantity
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalActivityValue, 0)}
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-secondary tabular-nums">
                    Across {entries.length} Upstream Freight Logs (tonne.km / km)
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Headline Upstream Freight Emissions
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant tabular-nums">
                    {formatNumber(totalEmissionsKgCo2e, 2)} kgCO₂e Total Impact
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    DEFRA Method Standard
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-secondary">
                    Weight-Distance
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant">
                    Freighting Goods Factor Catalog
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Audit Verification Status
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {verifiedCount} <span className="font-sans text-sm font-normal text-on-surface-variant">Verified</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant tabular-nums">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>
        </div>
    );
}
