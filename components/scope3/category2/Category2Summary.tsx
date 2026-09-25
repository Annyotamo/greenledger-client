import { Card } from "@/components/ui/card";
import { Category2SpendEntry } from "@/lib/scope3/category2/types";

type Category2SummaryProps = {
    entries: Category2SpendEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category2Summary({ entries }: Category2SummaryProps) {
    const totalInr = entries.reduce((sum, e) => sum + e.spendInInr, 0);
    const totalUsd = entries.reduce((sum, e) => sum + e.spendInUsd, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);
    const totalProducerTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2eWithoutMargins, 0);
    const totalMarginTco2e = entries.reduce((sum, e) => sum + e.marginTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    const avgIntensityKgPerUsd = totalUsd > 0 ? (totalEmissionsTco2e * 1000) / totalUsd : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Total Capital Goods Spend
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    ₹{formatNumber(totalInr, 0)}
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-secondary tabular-nums">
                    ${formatNumber(totalUsd, 2)} USD (Converted at Annual Average Rate)
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Headline Emissions (USEEIO)
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant">
                    With Equipment & Facility Margins
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Producer & Margin Split
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalProducerTco2e, 3)} <span className="font-sans text-xs font-normal text-on-surface-variant">Producer</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-secondary tabular-nums">
                    + {formatNumber(totalMarginTco2e, 3)} tCO₂e Freight & Distribution Margin
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Audit Verification
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary tabular-nums">
                    {verifiedCount} <span className="font-sans text-sm font-normal text-on-surface-variant">Verified</span>
                </p>
                <p className="mt-2 font-sans text-xs font-medium text-on-surface-variant tabular-nums">
                    {submittedCount} Submitted • {draftCount} Draft • {formatNumber(avgIntensityKgPerUsd, 3)} kgCO₂e/$
                </p>
            </Card>
        </div>
    );
}
