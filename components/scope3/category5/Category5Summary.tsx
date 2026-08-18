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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Total Operational Waste
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalTonnes, 2)} <span className="text-body-md font-normal text-on-surface-variant">tonnes</span>
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium text-secondary">
                    Across {entries.length} Operational Disposal Records
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Waste Treatment Emissions
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(totalEmissionsTco2e, 4)} <span className="text-body-md font-normal text-on-surface-variant">tCO₂e</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
                    Scope 3 Cat 5 Treatment & Disposal Model
                </p>
            </Card>

            <Card className="p-card-padding border-outline-variant/60">
                <p className="font-mono text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Recycled / Circular Volume
                </p>
                <p className="mt-2 font-mono text-headline-md font-bold text-primary">
                    {formatNumber(recycledTonnes, 2)} <span className="text-body-md font-normal text-on-surface-variant">tonnes</span>
                </p>
                <p className="mt-2 font-mono text-[11px] text-secondary font-medium">
                    {totalTonnes > 0 ? ((recycledTonnes / totalTonnes) * 100).toFixed(1) : "0.0"}% Circular Diversion Rate
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
