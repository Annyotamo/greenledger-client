import { Card } from "@/components/ui/card";
import { ElectricityTdActivityEntry } from "@/lib/scope3/category3/types";

type Category3ElecSummaryProps = {
    entries: ElectricityTdActivityEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category3ElecSummary({ entries }: Category3ElecSummaryProps) {
    const totalKwh = entries.reduce((sum, e) => sum + e.electricityConsumedKwh, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    const avgLossRate = entries.length > 0
        ? entries.reduce((sum, e) => sum + e.tdLossRate, 0) / entries.length
        : 0.1700;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Grid Electricity Consumed
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalKwh, 0)} <span className="text-body-md font-normal text-on-surface-variant">kWh</span>
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    Across {entries.length} Facility T&D Grid Records
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Upstream T&D Losses Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Transmission & Distribution Loss Grid Model
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Average T&D Grid Loss Rate
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {(avgLossRate * 100).toFixed(1)}%
                </p>
                <p className="mt-2 font-mono text-[11px] text-secondary font-medium">
                    National Grid Loss Factor Benchmark (17.0% CEA)
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
