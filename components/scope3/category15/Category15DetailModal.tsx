"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Category15InvestmentEntry } from "@/lib/scope3/category15/types";

interface Category15DetailModalProps {
    entry: Category15InvestmentEntry | null;
    onClose: () => void;
}

export function Category15DetailModal({ entry, onClose }: Category15DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase">
                                Category 15 Financed Investment Detail
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                    entry.status === "verified"
                                        ? "bg-secondary-container text-on-secondary-container"
                                        : entry.status === "submitted"
                                          ? "bg-surface-container-high text-primary"
                                          : entry.status === "rejected"
                                            ? "bg-error-container text-on-error-container"
                                            : "bg-surface-container-high text-on-surface-variant"
                                }`}>
                                {entry.status}
                            </span>
                        </div>
                        <h3 className="font-mono text-headline-sm font-bold text-primary">{entry.whatYouFinanced}</h3>
                        <p className="font-mono text-xs text-on-surface-variant">
                            PCAF Class #{entry.assetClassNo}: {entry.assetClassName} • Period: {entry.reportingPeriodName}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">PCAF Attribution Math</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Outstanding Amount:</span><span className="font-bold text-primary">₹{entry.outstandingAmountCrores.toLocaleString()} Cr</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Total Company Worth:</span><span className="font-bold text-primary">₹{entry.totalCompanyWorthCrores.toLocaleString()} Cr</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Attribution Factor:</span><span className="font-bold text-secondary">{entry.attributionFactor.toFixed(6)} ({entry.attributionFactorPercentage.toFixed(2)}%)</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Valuation Date:</span><span className="font-bold text-primary">{entry.activityDate}</span></div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Financed Emissions Breakdown</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Financed Scope 1:</span><span className="font-bold text-primary">{entry.financedScope1Emissions.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Financed Scope 2:</span><span className="font-bold text-primary">{entry.financedScope2Emissions.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Financed Scope 3:</span><span className="font-bold text-primary">{entry.financedScope3Emissions.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between pt-1 border-t border-outline-variant/40"><span className="text-on-surface-variant font-bold">Total Financed:</span><span className="font-bold text-secondary">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                    </div>
                </div>

                <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Investee Company Gross Emissions (100% Entity Level)</span>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="bg-white p-2 rounded-lg border border-outline-variant/30">
                            <span className="text-[10px] text-on-surface-variant block">Scope 1</span>
                            <span className="font-bold text-primary">{entry.companyScope1Emissions.toLocaleString()} t</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-outline-variant/30">
                            <span className="text-[10px] text-on-surface-variant block">Scope 2</span>
                            <span className="font-bold text-primary">{entry.companyScope2Emissions.toLocaleString()} t</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-outline-variant/30">
                            <span className="text-[10px] text-on-surface-variant block">Scope 3</span>
                            <span className="font-bold text-primary">{entry.companyScope3Emissions.toLocaleString()} t</span>
                        </div>
                    </div>
                </div>

                {entry.notes && (
                    <div className="space-y-1 font-mono text-xs">
                        <span className="font-bold text-primary">Notes & Remarks:</span>
                        <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
                            {entry.notes}
                        </p>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button variant="secondary" size="md" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
