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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase">
                                Category 9 Downstream Freight Transport Detail
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
                            {entry.vehicleType}
                        </h3>
                        <p className="font-mono text-xs text-on-surface-variant">
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
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Activity Parameters</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Reporting Period:</span><span className="font-bold text-primary">{entry.reportingPeriodName}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Activity Date:</span><span className="font-bold text-primary">{entry.activityDate}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Quantity:</span><span className="font-bold text-primary">{entry.activityValue.toLocaleString()} {entry.unitSymbol}</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Factor Rate:</span><span className="font-bold text-primary">{entry.appliedFactorKgCo2e.toFixed(5)} kgCO₂e/{entry.unitSymbol}</span></div>
                        {entry.facilityName && (
                            <div className="flex justify-between"><span className="text-on-surface-variant">Facility:</span><span className="font-bold text-primary">{entry.facilityName}</span></div>
                        )}
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Calculated Transport Emissions</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Headline Emissions:</span><span className="font-bold text-primary">{entry.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Kilogram Equivalent:</span><span className="font-bold text-secondary">{entry.calculatedKgCo2e.toFixed(2)} kgCO₂e</span></div>
                        {entry.enteredByEmail && (
                            <div className="flex justify-between"><span className="text-on-surface-variant">Logged By:</span><span className="font-bold text-primary truncate max-w-[150px]">{entry.enteredByEmail}</span></div>
                        )}
                        {entry.verifiedByEmail && (
                            <div className="flex justify-between"><span className="text-on-surface-variant">Verified By:</span><span className="font-bold text-secondary truncate max-w-[150px]">{entry.verifiedByEmail}</span></div>
                        )}
                    </div>
                </div>

                {entry.calculationDetails && (
                    <div className="space-y-1 font-mono text-xs">
                        <span className="font-bold text-primary">Calculation Audit Formula:</span>
                        <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-lg text-[11px] leading-relaxed">
                            {entry.calculationDetails}
                        </p>
                    </div>
                )}

                {entry.description && (
                    <div className="space-y-1 font-mono text-xs">
                        <span className="font-bold text-primary">Cargo & Route Description:</span>
                        <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
                            {entry.description}
                        </p>
                    </div>
                )}

                {entry.notes && (
                    <div className="space-y-1 font-mono text-xs">
                        <span className="font-bold text-primary">Notes & Invoice Remarks:</span>
                        <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
                            {entry.notes}
                        </p>
                    </div>
                )}

                {entry.rejectedReason && (
                    <div className="space-y-1 font-mono text-xs">
                        <span className="font-bold text-error">Rejection Reason:</span>
                        <p className="text-on-error-container bg-error-container/20 p-3 rounded-lg border border-error/30">
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
