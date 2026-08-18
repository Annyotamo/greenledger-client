"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Category1SpendEntry } from "@/lib/scope3/category1/types";

interface Category1DetailModalProps {
    entry: Category1SpendEntry | null;
    onClose: () => void;
}

export function Category1DetailModal({ entry, onClose }: Category1DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase">
                                Category 1 Spend Detail
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
                            {entry.factor?.commodityTitle ?? "Purchased Goods Spend"}
                        </h3>
                        <p className="font-mono text-xs text-on-surface-variant">
                            NAICS {entry.factor?.naicsCode ?? "111110"} • Period: {entry.reportingPeriod}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Calculation Breakdown Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                            Financial Input & Conversion
                        </span>
                        <div className="space-y-1">
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">Spend in INR:</span>
                                <span className="font-bold text-primary">₹{entry.spendInInr.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">Spend Year:</span>
                                <span className="font-bold text-primary">{entry.spendYear}</span>
                            </div>
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">Exchange Rate:</span>
                                <span className="font-bold text-primary">₹{entry.exchangeRateUsdToInr}/USD</span>
                            </div>
                            <div className="flex justify-between font-mono text-xs pt-1 border-t border-outline-variant/30">
                                <span className="text-on-surface-variant font-bold">Spend in USD:</span>
                                <span className="font-bold text-secondary">${entry.spendInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                            Headline Emissions (With Margins)
                        </span>
                        <div className="space-y-1">
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">Total Calculated:</span>
                                <span className="font-bold text-primary">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span>
                            </div>
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">In Kilograms:</span>
                                <span className="font-bold text-primary">{entry.calculatedKgCo2e.toLocaleString()} kgCO₂e</span>
                            </div>
                            <div className="flex justify-between font-mono text-xs">
                                <span className="text-on-surface-variant">Factor with Margins:</span>
                                <span className="font-bold text-secondary">{entry.factor?.kgCo2ePerUsdWithMargins ?? 0.4093} kg/USD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Producer vs Margin Component Detailed Split */}
                <div className="rounded-xl bg-surface-container-high/40 p-4 border border-outline-variant/50 space-y-3">
                    <span className="font-mono text-xs font-bold text-primary uppercase">
                        USEEIO Margin Component Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                            <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                                Producer Price Component (Without Margins)
                            </span>
                            <p className="font-mono text-headline-sm font-bold text-primary">
                                {entry.calculatedTCo2eWithoutMargins.toFixed(4)} <span className="text-xs font-normal">tCO₂e</span>
                            </p>
                            <p className="font-mono text-[10px] text-on-surface-variant">
                                Factor: {entry.factor?.kgCo2ePerUsdWithoutMargins ?? 0.3541} kgCO₂e/USD
                            </p>
                        </div>

                        <div className="space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                            <span className="font-mono text-[10px] uppercase font-bold text-secondary">
                                Trade & Transport Margin Component
                            </span>
                            <p className="font-mono text-headline-sm font-bold text-secondary">
                                {entry.marginTCo2e.toFixed(4)} <span className="text-xs font-normal">tCO₂e</span>
                            </p>
                            <p className="font-mono text-[10px] text-on-surface-variant">
                                Factor: {entry.factor?.marginKgCo2ePerUsd ?? 0.0552} kgCO₂e/USD
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes & Audit Info */}
                {entry.notes && (
                    <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-primary">Notes & Remarks:</span>
                        <p className="font-mono text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
                            {entry.notes}
                        </p>
                    </div>
                )}

                {entry.rejectedReason && (
                    <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-error">Rejection Reason:</span>
                        <p className="font-mono text-xs text-error bg-error-container/20 p-3 rounded-lg">
                            {entry.rejectedReason}
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
