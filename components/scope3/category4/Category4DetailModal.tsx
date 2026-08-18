"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Category4SpendEntry } from "@/lib/scope3/category4/types";

interface Category4DetailModalProps {
    entry: Category4SpendEntry | null;
    onClose: () => void;
}

export function Category4DetailModal({ entry, onClose }: Category4DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase">
                                Category 4 Upstream Transportation Detail
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
                        <h3 className="font-mono text-headline-sm font-bold text-primary">
                            {entry.factor?.naicsTitle || entry.factor?.commodityTitle || "Upstream Freight Transport"}
                        </h3>
                        <p className="font-mono text-xs text-on-surface-variant">
                            NAICS Code: {entry.factor?.naicsCode || "484110"} • Period: {entry.reportingPeriod}
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
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Spend Financial Details</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Spend in INR:</span><span className="font-bold text-primary">₹{entry.spendInInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Spend in USD:</span><span className="font-bold text-primary">${entry.spendInUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Exchange Rate:</span><span className="font-bold text-primary">₹{entry.exchangeRateUsdToInr}/USD ({entry.spendYear})</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Spend Date:</span><span className="font-bold text-primary">{entry.spendDate}</span></div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Emissions Breakdown (tCO₂e)</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Headline Emissions:</span><span className="font-bold text-primary">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Producer Component:</span><span className="font-bold text-primary">{entry.calculatedTCo2eWithoutMargins.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Trade/Transport Margin:</span><span className="font-bold text-secondary">{entry.marginTCo2e.toFixed(4)} tCO₂e</span></div>
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
