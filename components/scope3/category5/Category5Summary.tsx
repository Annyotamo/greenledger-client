import { Card } from "@/components/ui/card";
import { Category5WasteActivityEntry } from "@/lib/scope3/category5/types";

type Category5SummaryProps = {
    entries: Category5WasteActivityEntry[];
};

function formatNumber(value: number, digits = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function Category5Summary({ entries }: Category5SummaryProps) {
    const totalTonnes = entries.reduce((sum, e) => sum + e.wasteGeneratedTonnes, 0);
    const totalEmissionsTco2e = entries.reduce((sum, e) => sum + e.calculatedTCo2e, 0);

    const verifiedCount = entries.filter((e) => e.status === "verified").length;
    const submittedCount = entries.filter((e) => e.status === "submitted").length;
    const draftCount = entries.filter((e) => e.status === "draft").length;

    const recycledTonnes = entries
        .filter((e) => e.treatmentMethod === "open_loop" || e.treatmentMethod === "closed_loop")
        .reduce((sum, e) => sum + e.wasteGeneratedTonnes, 0);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Operational Waste
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalTonnes, 2)} <span className="font-sans text-sm font-normal text-slate-500">tonnes</span>
                </p>
                <p className="mt-2 font-sans text-xs font-semibold text-secondary">
                    Across {entries.length} Operational Disposal Records
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Waste Treatment Emissions
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="font-sans text-sm font-normal text-slate-500">tCO₂e</span>
                </p>
                <p className="mt-2 font-sans text-xs text-slate-500">
                    Scope 3 Cat 5 Treatment & Disposal Model
                </p>
            </Card>

            <Card className="p-5 border-outline-variant/60">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Recycled / Circular Volume
                </p>
                <p className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary tabular-nums">
                    {formatNumber(recycledTonnes, 2)} <span className="font-sans text-sm font-normal text-slate-500">tonnes</span>
                </p>
                <p className="mt-2 font-sans text-xs font-semibold text-secondary tabular-nums">
                    {totalTonnes > 0 ? ((recycledTonnes / totalTonnes) * 100).toFixed(1) : "0.0"}% Circular Diversion Rate
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
