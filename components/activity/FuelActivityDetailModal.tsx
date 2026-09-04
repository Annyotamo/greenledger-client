"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { useFuelActivity } from "@/lib/activity/hooks";
import type { FuelActivity } from "@/lib/activity/types";

const GHG_COLORS = {
    co2: "#2563eb",
    n2o: "#14b8a6",
    ch4: "#f97316",
};

const formatValue = (value: string | number | null | undefined) =>
    value == null || value === "" || Number.isNaN(Number(value)) ? "N/A" : String(value);

const emissionTypeStyles: Record<string, string> = {
    stationary: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    mobile: "bg-sky-500/10 text-sky-800 border-sky-500/20",
    process: "bg-purple-500/10 text-purple-800 border-purple-500/20",
    fugitive: "bg-rose-500/10 text-rose-800 border-rose-500/20",
    default: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusStyles: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 font-bold",
    pending: "bg-amber-500/10 text-amber-800 border-amber-500/20 font-semibold",
    submitted: "bg-blue-500/10 text-blue-800 border-blue-500/20 font-semibold",
    draft: "bg-slate-100 text-slate-700 border-slate-200 font-medium",
    rejected: "bg-rose-500/10 text-rose-800 border-rose-500/20 font-semibold",
    default: "bg-slate-100 text-slate-700 border-slate-200",
};

export function FuelActivityDetailModal({
    activity: initialActivity,
    onClose,
    onVerify,
    onReject,
    onSubmit,
}: {
    activity: FuelActivity;
    onClose: () => void;
    onVerify?: (id: string) => void;
    onReject?: (id: string) => void;
    onSubmit?: (id: string) => void;
}) {
    // Fetch full single fuel activity details from API
    const { data: fetchedActivity, isLoading } = useFuelActivity(initialActivity.id);
    const activity = fetchedActivity || initialActivity;

    const activityStart = activity.activityStartDate ? new Date(activity.activityStartDate) : new Date();
    const activityEnd = activity.activityEndDate ? new Date(activity.activityEndDate) : new Date();
    const activeDays = Math.max(
        1,
        Math.ceil((activityEnd.getTime() - activityStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    const calculatedEmissionsData = [
        {
            name: "CO₂",
            fullName: "Carbon Dioxide (CO₂)",
            value: activity.calculatedTCo2 || 0,
            kgValue: activity.calculatedKgCo2 || 0,
            color: GHG_COLORS.co2,
        },
        {
            name: "N₂O",
            fullName: "Nitrous Oxide (N₂O)",
            value: activity.calculatedTN2o || 0,
            kgValue: activity.calculatedKgN2o || 0,
            color: GHG_COLORS.n2o,
        },
        {
            name: "CH₄",
            fullName: "Methane (CH₄)",
            value: activity.calculatedTCh4 || 0,
            kgValue: activity.calculatedKgCh4 || 0,
            color: GHG_COLORS.ch4,
        },
    ].filter((item) => item.value > 0);

    const statusLower = (activity.workflowStatus || "draft").toLowerCase();
    const isVerified = statusLower === "verified";
    const isDraft = statusLower === "draft";
    const isSubmitted = statusLower === "submitted" || statusLower === "pending";
    const isRejected = statusLower === "rejected";

    const attachedDocs = activity.attachedDocuments || [];
    const facilityLocation = [activity.facilityCity, activity.facilityCountry].filter(Boolean).join(", ");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200/60 flex flex-col">
                {/* Header Bar */}
                <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Scope 1 Fuel Combustion Activity
                            </span>
                            {isLoading && (
                                <span className="text-[10px] text-primary italic font-mono animate-pulse">
                                    • Syncing live details...
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                {activity.fuelName}
                            </h2>
                            <span className="text-xs font-semibold text-slate-600">
                                ({format(activityStart, "MMM d, yyyy")} – {format(activityEnd, "MMM d, yyyy")})
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[11px] font-bold">
                                {activeDays} Days
                            </span>
                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs uppercase tracking-wide border ${statusStyles[statusLower] || statusStyles.default}`}>
                                {activity.workflowStatus}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 shrink-0">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Rejection Alert Banner */}
                    {isRejected && activity.rejectedReason && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                            <MaterialIcon name="error" size="sm" className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Rejection Reason</h4>
                                <p className="text-xs text-rose-700 mt-1 leading-relaxed">{activity.rejectedReason}</p>
                            </div>
                        </div>
                    )}

                    {/* Top KPI Cards (4 Grid) */}
                    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fuel & Emission Type</p>
                            <p className="text-sm font-bold text-slate-950 truncate">{activity.fuelName}</p>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight border ${emissionTypeStyles[activity.emissionType?.toLowerCase()] || emissionTypeStyles.default}`}>
                                    {activity.emissionType}
                                </span>
                                {activity.fuelFactorType && (
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                                        • {activity.fuelFactorType}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantity Consumed</p>
                            <p className="text-base font-bold font-mono text-slate-950">
                                {activity.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-slate-500 font-semibold uppercase">
                                {activity.unitName || activity.unitSymbol} ({activity.unitSymbol})
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Calculated Emissions</p>
                            <p className="text-base font-bold font-mono text-primary">
                                {(activity.calculatedTCo2e || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })} tCO₂e
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                                {(activity.calculatedKgCo2e || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kgCO₂e
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cost & Quality Tier</p>
                            <p className="text-base font-bold font-mono text-slate-950">
                                {activity.cost != null ? `₹${activity.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "N/A"}
                            </p>
                            <p className="text-xs text-slate-500 font-medium capitalize">Tier: {activity.dataQualityTier}</p>
                        </div>
                    </section>

                    {/* Main Content Grid: Gas Breakdown on Left, Facility & Factor Context on Right */}
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Greenhouse Gas Breakdown Card */}
                        <div className="rounded-xl border border-slate-200 p-5 space-y-4 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Greenhouse Gas Breakdown</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Specific gas emissions calculated for this event</p>
                                </div>
                                <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700">
                                    {(activity.calculatedTCo2e || 0).toFixed(4)} tCO₂e
                                </span>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-48 w-full sm:w-1/2">
                                    {calculatedEmissionsData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={calculatedEmissionsData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={42}
                                                    outerRadius={68}
                                                    paddingAngle={3}
                                                    dataKey="value">
                                                    {calculatedEmissionsData.map((entry, index) => (
                                                        <Cell key={`slice-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(val) =>
                                                        typeof val === "number" ? `${val.toFixed(4)} tCO₂e` : val
                                                    }
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">
                                            No breakdown data
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-2 sm:w-1/2">
                                    {calculatedEmissionsData.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-flex h-3 w-3 rounded-sm shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900">{item.name}</div>
                                                    <div className="text-[10px] text-slate-500">{item.fullName}</div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono">
                                                <div className="text-xs font-bold text-slate-950">{item.value.toFixed(4)} t</div>
                                                <div className="text-[10px] text-slate-500">{item.kgValue.toFixed(2)} kg</div>
                                            </div>
                                        </div>
                                    ))}
                                    {activity.biogenicTCo2 != null && activity.biogenicTCo2 > 0 && (
                                        <div className="flex items-center justify-between rounded-lg border border-purple-200/80 bg-purple-50/60 p-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex h-3 w-3 rounded-sm shrink-0 bg-purple-600" />
                                                <div>
                                                    <div className="text-xs font-bold text-purple-950">Biogenic CO₂</div>
                                                    <div className="text-[10px] text-purple-700 font-medium">Outside of Scopes</div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono">
                                                <div className="text-xs font-bold text-purple-950">{activity.biogenicTCo2.toFixed(4)} t</div>
                                                <div className="text-[10px] text-purple-700">{(activity.biogenicKgCo2 ?? (activity.biogenicTCo2 * 1000)).toFixed(2)} kg</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Operational Context & Facility Details */}
                        <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                                Facility & Reporting Context
                            </h3>
                            <div className="grid gap-2.5 text-xs font-mono">
                                <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                    <span className="text-slate-500 font-sans font-medium">Facility</span>
                                    <span className="font-bold text-slate-900 text-right">
                                        {activity.facilityName} {activity.facilityCode && <span className="text-slate-500">({activity.facilityCode})</span>}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                    <span className="text-slate-500 font-sans font-medium">Location</span>
                                    <span className="font-bold text-slate-900">{facilityLocation || "N/A"}</span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                    <span className="text-slate-500 font-sans font-medium">Reporting Period</span>
                                    <span className="font-bold text-slate-900">
                                        {activity.reportingPeriodName} {activity.periodStatus && <span className="text-emerald-700 uppercase text-[10px]">({activity.periodStatus})</span>}
                                    </span>
                                </div>
                                {activity.periodStartDate && activity.periodEndDate && (
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                        <span className="text-slate-500 font-sans font-medium">Period Range</span>
                                        <span className="font-medium text-slate-700 text-[11px]">
                                            {activity.periodStartDate} to {activity.periodEndDate}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                    <span className="text-slate-500 font-sans font-medium">Data Quality Tier</span>
                                    <span className="font-bold text-slate-900 capitalize">{activity.dataQualityTier}</span>
                                </div>
                                {activity.meterId && (
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100/70">
                                        <span className="text-slate-500 font-sans font-medium">Meter Reference</span>
                                        <span className="font-bold text-slate-900">{activity.meterId}</span>
                                    </div>
                                )}
                                {activity.enteredBy && (
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-slate-500 font-sans font-medium">Entered By</span>
                                        <span className="font-medium text-slate-600 text-[11px] truncate max-w-[200px]">{activity.enteredBy}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Emission Factor Reference Information */}
                    <section className="rounded-xl border border-slate-200 p-5 bg-white space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Emission Factor Reference Information
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">Factor dataset used for combustion GHG calculation</p>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                                <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                    {activity.fuelFactorStandard || "IPCC"}
                                </span>
                                {(activity.fuelFactorGwpBasis || activity.gwpBasis || activity.source?.gwpBasis) && (
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px]">
                                        GWP: {activity.fuelFactorGwpBasis || activity.gwpBasis || activity.source?.gwpBasis}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1 font-mono text-xs">
                            <div className="rounded-lg bg-slate-50 p-3">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block font-sans">Database Standard</span>
                                <span className="text-xs font-bold text-slate-900 mt-1 block">
                                    {activity.fuelFactorStandard || "IPCC"}
                                </span>
                                {(activity.fuelFactorGwpBasis || activity.gwpBasis || activity.source?.gwpBasis) && (
                                    <span className="text-[10px] text-slate-600 block mt-0.5 font-sans">
                                        GWP Basis: <span className="font-semibold text-slate-800">{activity.fuelFactorGwpBasis || activity.gwpBasis || activity.source?.gwpBasis}</span>
                                    </span>
                                )}
                                <span className="text-[10px] text-slate-500 block mt-0.5">Region: {activity.fuelFactorRegion || "GLOBAL"}</span>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block font-sans">Factor Data Year</span>
                                <span className="text-xs font-bold text-slate-900 mt-1 block">
                                    {activity.factorDataYear || "2023"}
                                </span>
                                <span className="text-[10px] text-slate-500 block">Unit: {activity.factorEmissionUnit || "kg"}</span>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block font-sans">Total Factor Rate (tCO₂e)</span>
                                <span className="text-xs font-bold text-slate-900 mt-1 block">
                                    {(activity.factorTCo2e || 0).toFixed(7)}
                                </span>
                                <span className="text-[10px] text-slate-500 block">per {activity.unitSymbol}</span>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block font-sans">Total Factor Rate (kgCO₂e)</span>
                                <span className="text-xs font-bold text-slate-900 mt-1 block">
                                    {(activity.factorKgCo2e || 0).toFixed(4)}
                                </span>
                                <span className="text-[10px] text-slate-500 block">per {activity.unitSymbol}</span>
                            </div>
                        </div>

                        {/* Granular Gas Factor Rates */}
                        <div className="grid gap-2 sm:grid-cols-3 pt-2 text-xs font-mono">
                            <div className="flex items-center justify-between px-3 py-2 rounded bg-slate-50/60 border border-slate-100">
                                <span className="text-slate-500 font-sans">CO₂ Factor:</span>
                                <span className="font-bold text-slate-900">{activity.factorKgCo2eOfCo2.toFixed(4)} kg/unit</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 rounded bg-slate-50/60 border border-slate-100">
                                <span className="text-slate-500 font-sans">N₂O Factor:</span>
                                <span className="font-bold text-slate-900">{activity.factorKgCo2eOfN2o.toFixed(4)} kg/unit</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 rounded bg-slate-50/60 border border-slate-100">
                                <span className="text-slate-500 font-sans">CH₄ Factor:</span>
                                <span className="font-bold text-slate-900">{activity.factorKgCo2eOfCh4.toFixed(4)} kg/unit</span>
                            </div>
                        </div>
                    </section>

                    {/* Attached Supporting Evidence Documents Section */}
                    <section className="rounded-xl border border-slate-200 p-5 bg-white space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Attached Evidence Documents ({attachedDocs.length})
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">Verification documents and invoices attached to this activity</p>
                            </div>
                        </div>

                        {attachedDocs.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {attachedDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                                <MaterialIcon name="description" size="sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">{doc.document_name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[9px] font-bold uppercase">
                                                        {doc.document_type}
                                                    </span>
                                                    {doc.document_date && (
                                                        <span className="text-[10px] text-slate-500 font-mono">{doc.document_date}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {doc.source_url ? (
                                            <a
                                                href={doc.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-100 text-primary px-3 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors">
                                                <span>Download</span>
                                                <MaterialIcon name="open_in_new" size="xs" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">No link</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                No evidence documents attached to this activity record.
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer Action Bar */}
                <div className="sticky bottom-0 border-t border-slate-200/70 bg-white/95 px-6 py-4 backdrop-blur-xl shrink-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href={`/activities/fuel/${activity.id}/edit`}>
                            <button className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                                <MaterialIcon name="edit" size="xs" />
                                <span>Edit Activity</span>
                            </button>
                        </Link>

                        <div className="flex items-center gap-3 justify-end">
                            <Button variant="secondary" size="md" onClick={onClose}>
                                Close
                            </Button>

                            {isDraft && onSubmit && (
                                <button
                                    className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded-md shadow-sm font-mono text-xs font-bold uppercase"
                                    onClick={() => {
                                        onSubmit(activity.id);
                                        onClose();
                                    }}>
                                    <MaterialIcon name="send" size="sm" />
                                    <span>Submit Activity</span>
                                </button>
                            )}

                            {isSubmitted && onVerify && (
                                <button
                                    className="bg-emerald-600 text-white px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded-md shadow-sm font-mono text-xs font-bold uppercase"
                                    onClick={() => {
                                        onVerify(activity.id);
                                        onClose();
                                    }}>
                                    <MaterialIcon name="check_circle" size="sm" />
                                    <span>Verify Activity</span>
                                </button>
                            )}

                            {isSubmitted && onReject && (
                                <button
                                    className="bg-rose-600 text-white px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded-md shadow-sm font-mono text-xs font-bold uppercase"
                                    onClick={() => {
                                        onReject(activity.id);
                                        onClose();
                                    }}>
                                    <MaterialIcon name="cancel" size="sm" />
                                    <span>Reject Activity</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
