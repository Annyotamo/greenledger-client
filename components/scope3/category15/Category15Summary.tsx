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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Financed Portfolio
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    ₹{formatNumber(totalOutstandingCrores, 2)} <span className="font-sans text-sm font-normal text-slate-500">Cr</span>
                </p>
                <p className="mt-2 font-sans text-xs font-semibold text-secondary tabular-nums">
                    Across {entries.length} PCAF Asset Class Portfolios
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Financed Emissions
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalFinancedEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-slate-500">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500">
                    Scope 3 Cat 15 PCAF Attribution Standard
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Financed Scopes Breakdown (tCO₂e)
                </p>
                <div className="mt-2 space-y-1 font-sans text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Financed Scope 1:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">{formatNumber(financedScope1, 2)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Financed Scope 2:</span>
                        <span className="font-semibold text-secondary tabular-nums">{formatNumber(financedScope2, 2)} t</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Financed Scope 3:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">{formatNumber(financedScope3, 2)} t</span>
                    </div>
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
