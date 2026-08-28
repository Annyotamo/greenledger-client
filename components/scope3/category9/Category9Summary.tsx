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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 border-outline-variant/60">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Total Transport Activity Quantity
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalActivityValue, 0)}
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    Across {entries.length} Downstream Freight Logs (tonne.km / km)
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Headline Downstream Freight Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-xs font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    {formatNumber(totalEmissionsKgCo2e, 2)} kgCO₂e Total Impact
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    DEFRA Method Standard
                </p>
                <p className="mt-2 font-mono text-headline-sm font-bold text-secondary">
                    Weight-Distance
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Freighting Goods Factor Catalog
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Audit Verification Status
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {verifiedCount} <span className="text-xs font-normal text-on-surface-variant">Verified</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>
        </div>
    );
}
