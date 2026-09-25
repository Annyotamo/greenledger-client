"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { TravelActivityEntry } from "@/lib/scope3/travel/types";

interface Category7DetailModalProps {
    entry: TravelActivityEntry | null;
    onClose: () => void;
}

export function Category7DetailModal({ entry, onClose }: Category7DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-sans text-[10px] font-bold text-secondary uppercase tracking-wider">
                                Category 7 Employee Commute Detail
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
                        <h3 className="font-display text-xl font-bold text-primary tracking-tight">{entry.title}</h3>
                        <p className="font-sans text-xs text-slate-500 font-medium">
                            Period: {entry.reportingPeriodName} • Dates: {entry.startDate} to {entry.endDate}
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
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Commute Overview</span>
                        <div className="flex justify-between"><span className="text-slate-500">Total Commute Legs:</span><span className="font-semibold text-slate-900">{entry.trips.length} leg(s)</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Total Distance:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.totalDistanceKm.toLocaleString()} km</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Headline Emissions:</span><span className="font-semibold text-secondary tabular-nums">{entry.totalTCo2e.toFixed(4)} tCO₂e</span></div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-sans text-xs">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Gas Breakdown</span>
                        <div className="flex justify-between"><span className="text-slate-500">CO₂ Component:</span><span className="font-semibold text-slate-900 tabular-nums">{entry.totalTCo2.toFixed(4)} tCO₂</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">CH₄ Component:</span><span className="font-semibold text-slate-900 tabular-nums">{(entry.totalKgCh4).toFixed(3)} kg CH₄</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">N₂O Component:</span><span className="font-semibold text-slate-900 tabular-nums">{(entry.totalKgN2o).toFixed(3)} kg N₂O</span></div>
                    </div>
                </div>

                {/* Itemized Commute Legs Table */}
                <div className="space-y-2 font-sans text-xs">
                    <span className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">Itemized Commute Legs ({entry.trips.length})</span>
                    <div className="rounded-xl border border-outline-variant/40 overflow-hidden bg-white">
                        <table className="w-full text-left border-collapse font-sans text-xs">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                                    <th className="p-2.5">Leg</th>
                                    <th className="p-2.5">Description</th>
                                    <th className="p-2.5">Distance</th>
                                    <th className="p-2.5 text-right">Transit Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entry.trips.map((t, idx) => (
                                    <tr key={idx} className="border-b border-outline-variant/20">
                                        <td className="p-2.5 font-semibold text-slate-900 tabular-nums">#{t.tripOrder}</td>
                                        <td className="p-2.5 font-medium text-slate-800">{t.description}</td>
                                        <td className="p-2.5 font-semibold text-slate-900 tabular-nums">{t.distance} km</td>
                                        <td className="p-2.5 text-right text-[11px] text-slate-500 font-medium">
                                            {t.carTypeName || "Transit"} ({t.fuelType || "general"})
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {entry.notes && (
                    <div className="space-y-1 font-sans text-xs">
                        <span className="font-semibold text-slate-900">Notes & Remarks:</span>
                        <p className="text-slate-600 bg-surface-container-low p-3 rounded-lg leading-relaxed">
                            {entry.notes}
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
