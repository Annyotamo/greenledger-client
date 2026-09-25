"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ElectricityTdActivityEntry, WttFuelActivityEntry } from "@/lib/scope3/category3/types";

interface Category3DetailModalProps {
    type: "fuel" | "electricity";
    fuelEntry?: WttFuelActivityEntry | null;
    elecEntry?: ElectricityTdActivityEntry | null;
    onClose: () => void;
}

export function Category3DetailModal({ type, fuelEntry, elecEntry, onClose }: Category3DetailModalProps) {
    if (type === "fuel" && !fuelEntry) return null;
    if (type === "electricity" && !elecEntry) return null;

    const isFuel = type === "fuel";
    const status = isFuel ? fuelEntry!.status : elecEntry!.status;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-sans text-[11px] font-semibold text-secondary uppercase tracking-wider">
                                Category 3 {isFuel ? "Upstream WTT Fuel" : "Electricity T&D Losses"} Detail
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider ${
                                    status === "verified"
                                        ? "bg-secondary-container text-on-secondary-container"
                                        : status === "submitted"
                                          ? "bg-surface-container-high text-primary"
                                          : status === "rejected"
                                            ? "bg-error-container text-on-error-container"
                                            : "bg-surface-container-high text-on-surface-variant"
                                }`}>
                                {status}
                            </span>
                        </div>
                        <h3 className="font-display text-xl font-bold tracking-tight text-primary">
                            {isFuel ? fuelEntry!.fuelName : "Grid Electricity T&D Losses"}
                        </h3>
                        <p className="font-sans text-xs font-medium text-on-surface-variant">
                            Period: {isFuel ? fuelEntry!.reportingPeriod : elecEntry!.reportingPeriod}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {isFuel ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Fuel Consumption Input</span>
                            <div className="space-y-1">
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Quantity:</span><span className="font-semibold text-primary tabular-nums">{fuelEntry!.fuelQuantity.toLocaleString()} {fuelEntry!.unitSymbol}</span></div>
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Activity Date:</span><span className="font-semibold text-primary">{fuelEntry!.activityDate}</span></div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Calculated WTT Emissions</span>
                            <div className="space-y-1">
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Total tCO₂e:</span><span className="font-semibold text-primary tabular-nums">{fuelEntry!.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Total kgCO₂e:</span><span className="font-semibold text-secondary tabular-nums">{fuelEntry!.calculatedKgCo2e.toLocaleString()} kgCO₂e</span></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Grid Consumption & Rate</span>
                            <div className="space-y-1">
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Electricity Consumed:</span><span className="font-semibold text-primary tabular-nums">{elecEntry!.electricityConsumedKwh.toLocaleString()} kWh</span></div>
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">T&D Loss Rate:</span><span className="font-semibold text-primary tabular-nums">{(elecEntry!.tdLossRate * 100).toFixed(1)}%</span></div>
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Grid Factor:</span><span className="font-semibold text-primary tabular-nums">{elecEntry!.gridKgCo2ePerKwh.toFixed(4)} kg/kWh</span></div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2">
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Calculated T&D Loss Emissions</span>
                            <div className="space-y-1">
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Total tCO₂e:</span><span className="font-semibold text-primary tabular-nums">{elecEntry!.calculatedTCo2e.toFixed(4)} tCO₂e</span></div>
                                <div className="flex justify-between font-sans text-sm"><span className="text-on-surface-variant">Total kgCO₂e:</span><span className="font-semibold text-secondary tabular-nums">{elecEntry!.calculatedKgCo2e.toLocaleString()} kgCO₂e</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {(isFuel ? fuelEntry!.notes : elecEntry!.notes) && (
                    <div className="space-y-1">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">Notes & Remarks:</span>
                        <p className="font-sans text-sm text-slate-700 bg-surface-container-low p-3 rounded-lg">
                            {isFuel ? fuelEntry!.notes : elecEntry!.notes}
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
