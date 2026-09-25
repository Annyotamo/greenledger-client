"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Category9TransportActivityEntry } from "@/lib/scope3/category9/types";

interface Category9DetailModalProps {
    entry: Category9TransportActivityEntry | null;
    onClose: () => void;
}

export function Category9DetailModal({ entry, onClose }: Category9DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-sans text-[10px] font-bold text-secondary uppercase tracking-wider">
                                Category 9 Downstream Freight Transport Detail
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${
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
                        <h3 className="font-display text-xl font-bold text-primary tracking-tight">
                            {entry.vehicleType}
                        </h3>
                        <p className="font-sans text-xs text-slate-500 font-medium">
                            Mode: {entry.activityCategory} • Group: {entry.factorGroup} • Standard: {entry.sourceStandard}
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
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-sans text-xs">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Activity Parameters</span>
                        <div className="flex justify-between"><span className="text-slate-500">Reporting Period:</span><span className="font-semibold text-slate-900">{entry.reportingPeriodName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Activity Date:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.activityDate}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Quantity:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.activityValue.toLocaleString()} {entry.unitSymbol}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Factor Rate:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.appliedFactorKgCo2e.toFixed(5)} kgCO₂e/{entry.unitSymbol}</span></div>
                        {entry.facilityName && (
                            <div className="flex justify-between"><span className="text-slate-500">Facility:</span><span className="font-semibold text-slate-900">{entry.facilityName}</span></div>
                        )}
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-sans text-xs">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Calculated Transport Emissions</span>
                        <div className="flex justify-between"><span className="text-slate-500">Headline Emissions:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Kilogram Equivalent:</span><span className="font-semibold text-secondary tabular-nums">{entry.calculatedKgCo2e.toFixed(2)} kgCO₂e</span></div>
                        {entry.enteredByEmail && (
                            <div className="flex justify-between"><span className="text-slate-500">Logged By:</span><span className="font-semibold text-slate-900 truncate max-w-[150px]">{entry.enteredByEmail}</span></div>
                        )}
                        {entry.verifiedByEmail && (
                            <div className="flex justify-between"><span className="text-slate-500">Verified By:</span><span className="font-semibold text-secondary truncate max-w-[150px]">{entry.verifiedByEmail}</span></div>
                        )}
                    </div>
                </div>

                {entry.calculationDetails && (
                    <div className="space-y-1 font-sans text-xs">
                        <span className="font-semibold text-slate-900">Calculation Audit Formula:</span>
                        <p className="text-slate-600 bg-surface-container-low p-3 rounded-lg text-xs leading-relaxed tabular-nums">
                            {entry.calculationDetails}
                        </p>
                    </div>
                )}

                {entry.description && (
                    <div className="space-y-1 font-sans text-xs">
                        <span className="font-semibold text-slate-900">Cargo & Route Description:</span>
                        <p className="text-slate-600 bg-surface-container-low p-3 rounded-lg leading-relaxed">
                            {entry.description}
                        </p>
                    </div>
                )}

                {entry.notes && (
                    <div className="space-y-1 font-sans text-xs">
                        <span className="font-semibold text-slate-900">Notes & Invoice Remarks:</span>
                        <p className="text-slate-600 bg-surface-container-low p-3 rounded-lg leading-relaxed">
                            {entry.notes}
                        </p>
                    </div>
                )}

                {entry.rejectedReason && (
                    <div className="space-y-1 font-sans text-xs">
                        <span className="font-semibold text-error">Rejection Reason:</span>
                        <p className="text-on-error-container bg-error-container/20 p-3 rounded-lg border border-error/30 leading-relaxed">
                            {entry.rejectedReason}
                        </p>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button variant="secondary" size="md" onClick={onClose} className="font-sans text-xs font-semibold">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
