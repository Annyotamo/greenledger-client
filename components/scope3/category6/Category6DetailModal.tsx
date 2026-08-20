"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { TravelActivityEntry } from "@/lib/scope3/travel/types";

interface Category6DetailModalProps {
    entry: TravelActivityEntry | null;
    onClose: () => void;
}

export function Category6DetailModal({ entry, onClose }: Category6DetailModalProps) {
    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto">
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase">
                                Category 6 Business Travel Detail
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
                        <h3 className="font-mono text-headline-sm font-bold text-primary">{entry.title}</h3>
                        <p className="font-mono text-xs text-on-surface-variant">
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
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Journey Overview</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Total Segments:</span><span className="font-bold text-primary">{entry.trips.length} trip leg(s)</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Total Distance:</span><span className="font-bold text-primary">{entry.totalDistanceKm.toLocaleString()} km</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">Headline Emissions:</span><span className="font-bold text-secondary">{entry.totalTCo2e.toFixed(4)} tCO₂e</span></div>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">GHG Protocol Gas Breakdown</span>
                        <div className="flex justify-between"><span className="text-on-surface-variant">CO₂ Component:</span><span className="font-bold text-primary">{entry.totalTCo2.toFixed(4)} tCO₂</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">CH₄ Component:</span><span className="font-bold text-primary">{(entry.totalKgCh4).toFixed(3)} kg CH₄</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant">N₂O Component:</span><span className="font-bold text-primary">{(entry.totalKgN2o).toFixed(3)} kg N₂O</span></div>
                    </div>
                </div>

                {/* Itemized Trips Table */}
                <div className="space-y-2 font-mono text-xs">
                    <span className="font-bold text-primary uppercase text-[11px]">Itemized Trip Segments ({entry.trips.length})</span>
                    <div className="rounded-xl border border-outline-variant/40 overflow-hidden bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase text-on-surface-variant font-bold">
                                    <th className="p-2.5">Leg</th>
                                    <th className="p-2.5">Mode</th>
                                    <th className="p-2.5">Description</th>
                                    <th className="p-2.5">Distance</th>
                                    <th className="p-2.5 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entry.trips.map((t, idx) => (
                                    <tr key={idx} className="border-b border-outline-variant/20">
                                        <td className="p-2.5 font-bold">#{t.tripOrder}</td>
                                        <td className="p-2.5">
                                            <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-[10px] font-bold">
                                                {t.transportMode}
                                            </span>
                                        </td>
                                        <td className="p-2.5">{t.description}</td>
                                        <td className="p-2.5 font-bold">{t.distance} km</td>
                                        <td className="p-2.5 text-right text-[10px] text-on-surface-variant">
                                            {t.transportMode === "LAND"
                                                ? `${t.carTypeName || "Car"} (${t.fuelType || "diesel"})`
                                                : t.transportMode === "AIR"
                                                  ? `${t.haulType || "Long-haul"} (${t.cabinClass || "Economy"})`
                                                  : t.passengerType || "Ferry"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
