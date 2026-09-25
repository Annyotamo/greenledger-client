import { Card } from "@/components/ui/card";
import { WttFuelActivityEntry } from "@/lib/scope3/category3/types";

type Category3FuelSummaryProps = {
    entries: WttFuelActivityEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category3FuelSummary({ entries }: Category3FuelSummaryProps) {
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);
    const totalQuantity = entries.reduce((sum, e) => sum + e.fuelQuantity, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total WTT Fuel Consumption
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalQuantity, 1)}
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-secondary tabular-nums">
                    Across {entries.length} Upstream Fuel Activity Records
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Upstream WTT Emissions
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant">
                    Extraction, Refining & Fuel Distribution (DEFRA WTT Model)
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Verification Breakdown
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {verifiedCount} <span className="font-sans text-sm font-normal text-on-surface-variant">Verified</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-secondary tabular-nums">
                    {submittedCount} Submitted • {draftCount} Draft
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Average WTT Intensity
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {entries.length > 0 ? formatNumber(totalEmissionsTco2e / entries.length, 3) : "0.000"} <span className="font-sans text-sm font-normal text-on-surface-variant">tCO₂e/record</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant">
                    Scope 3 Cat 3 Upstream Well-To-Tank Model
                </p>
            </Card>
        </div>
    );
}
