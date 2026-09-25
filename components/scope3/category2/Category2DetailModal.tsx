"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Category2SpendEntry } from "@/lib/scope3/category2/types";

interface Category2DetailModalProps {
    entry: Category2SpendEntry | null;
    onClose: () => void;
}

export function Category2DetailModal({ entry, onClose }: Category2DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-sans text-[11px] font-semibold text-secondary uppercase tracking-wider">
                                Category 2 Capital Goods Detail
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider ${
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
                        <h3 className="font-display text-xl font-bold tracking-tight text-primary">
                            {entry.factor?.commodityTitle ?? "Capital Goods Spend"}
                        </h3>
                        <p className="font-sans text-xs font-medium text-on-surface-variant">
                            NAICS {entry.factor?.naicsCode ?? "333111"} • Period: {entry.reportingPeriod}
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
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                            Capital Spend & Currency Conversion
                        </span>
                        <div className="space-y-1">
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">Spend in INR:</span>
                                <span className="font-semibold text-primary tabular-nums">₹{entry.spendInInr.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">Spend Year:</span>
                                <span className="font-semibold text-primary tabular-nums">{entry.spendYear}</span>
                            </div>
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">Exchange Rate:</span>
                                <span className="font-semibold text-primary tabular-nums">₹{entry.exchangeRateUsdToInr}/USD</span>
                            </div>
                            <div className="flex justify-between font-sans text-sm pt-1 border-t border-outline-variant/30">
                                <span className="text-on-surface-variant font-medium">Spend in USD:</span>
                                <span className="font-semibold text-secondary tabular-nums">${entry.spendInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                            Headline Emissions (With Margins)
                        </span>
                        <div className="space-y-1">
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">Total Calculated:</span>
                                <span className="font-semibold text-primary tabular-nums">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span>
                            </div>
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">In Kilograms:</span>
                                <span className="font-semibold text-primary tabular-nums">{entry.calculatedKgCo2e.toLocaleString()} kgCO₂e</span>
                            </div>
                            <div className="flex justify-between font-sans text-sm">
                                <span className="text-on-surface-variant">Factor with Margins:</span>
                                <span className="font-semibold text-secondary tabular-nums">{entry.factor?.kgCo2ePerUsdWithMargins ?? 0.5120} kg/USD</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-surface-container-high/40 p-4 border border-outline-variant/50 space-y-3">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                        Capital Equipment Producer vs Trade Margin Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                            <span className="font-sans text-[11px] uppercase font-semibold text-on-surface-variant tracking-wider">
                                Producer Price Component (Without Margins)
                            </span>
                            <p className="font-display text-xl font-bold tracking-tight text-primary tabular-nums">
                                {entry.calculatedTCo2eWithoutMargins.toFixed(4)} <span className="text-xs font-normal">tCO₂e</span>
                            </p>
                            <p className="font-sans text-xs text-on-surface-variant tabular-nums">
                                Factor: {entry.factor?.kgCo2ePerUsdWithoutMargins ?? 0.4480} kgCO₂e/USD
                            </p>
                        </div>

                        <div className="space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                            <span className="font-sans text-[11px] uppercase font-semibold text-secondary tracking-wider">
                                Trade & Freight Distribution Margin
                            </span>
                            <p className="font-display text-xl font-bold tracking-tight text-secondary tabular-nums">
                                {entry.marginTCo2e.toFixed(4)} <span className="text-xs font-normal">tCO₂e</span>
                            </p>
                            <p className="font-sans text-xs text-on-surface-variant tabular-nums">
                                Factor: {entry.factor?.marginKgCo2ePerUsd ?? 0.0640} kgCO₂e/USD
                            </p>
                        </div>
                    </div>
                </div>

                {entry.notes && (
                    <div className="space-y-1">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">Notes & Asset Remarks:</span>
                        <p className="font-sans text-sm text-slate-700 bg-surface-container-low p-3 rounded-lg">
                            {entry.notes}
                        </p>
                    </div>
                )}

                {entry.rejectedReason && (
                    <div className="space-y-1">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-error">Rejection Reason:</span>
                        <p className="font-sans text-sm text-error font-medium bg-error-container/20 p-3 rounded-lg">
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
