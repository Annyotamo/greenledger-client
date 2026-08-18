import { Card } from "@/components/ui/card";
import { Category4SpendEntry } from "@/lib/scope3/category4/types";

type Category4SummaryProps = {
    entries: Category4SpendEntry[];
};

function formatCurrencyINR(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category4Summary({ entries }: Category4SummaryProps) {
    const totalSpendInr = entries.reduce((sum, e) => sum + e.spendInInr, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);
    const totalProducerTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2eWithoutMargins, 0);
    const totalMarginTco2e = entries.reduce((sum, e) => sum + e.marginTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Freight & T&D Spend
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatCurrencyINR(totalSpendInr)}
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    Across {entries.length} Freight Transport & Logistics Records
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Headline Upstream T&D Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Spend-Based USEEIO Model (With Margins)
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Producer vs Trade/Transport Margin
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalProducerTco2e, 3)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-secondary font-medium">
                    + {formatNumber(totalMarginTco2e, 3)} tCO₂e Margin Component
                </p>
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
