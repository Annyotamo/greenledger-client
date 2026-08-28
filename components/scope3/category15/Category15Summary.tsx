import { Card } from "@/components/ui/card";
import { Category15InvestmentEntry } from "@/lib/scope3/category15/types";

type Category15SummaryProps = {
    entries: Category15InvestmentEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category15Summary({ entries }: Category15SummaryProps) {
    const totalOutstandingCrores = entries.reduce((sum, e) => sum + e.outstandingAmountCrores, 0);
    const totalFinancedEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);

    const financedScope1 = entries.reduce((sum, e) => sum + e.financedScope1Emissions, 0);
    const financedScope2 = entries.reduce((sum, e) => sum + e.financedScope2Emissions, 0);
    const financedScope3 = entries.reduce((sum, e) => sum + e.financedScope3Emissions, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Financed Portfolio
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    ₹{formatNumber(totalOutstandingCrores, 2)} <span className="text-body-md font-normal text-on-surface-variant">Cr</span>
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    Across {entries.length} PCAF Asset Class Portfolios
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Financed Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalFinancedEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Scope 3 Cat 15 PCAF Attribution Standard
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Financed Scopes Breakdown (tCO₂e)
                </p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">Financed Scope 1:</span>
                        <span className="font-bold text-primary">{formatNumber(financedScope1, 2)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">Financed Scope 2:</span>
                        <span className="font-bold text-secondary">{formatNumber(financedScope2, 2)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">Financed Scope 3:</span>
                        <span className="font-bold text-primary">{formatNumber(financedScope3, 2)} t</span>
                    </div>
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
