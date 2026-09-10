"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { useElectricityActivity } from "@/lib/activity/hooks";
import type { ElectricityActivity } from "@/lib/activity/electricityTypes";

const formatValue = (value: string | number | null | undefined) =>
    value == null || value === "" || Number.isNaN(Number(value)) ? "—" : String(value);

const formatNumber = (value: number | null | undefined, digits = 2) => {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
};

const statusStyles: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 font-bold",
    pending: "bg-amber-500/10 text-amber-800 border-amber-500/20 font-semibold",
    submitted: "bg-blue-500/10 text-blue-800 border-blue-500/20 font-semibold",
    draft: "bg-slate-100 text-slate-700 border-slate-200 font-medium",
    rejected: "bg-rose-500/10 text-rose-800 border-rose-500/20 font-semibold",
    default: "bg-slate-100 text-slate-700 border-slate-200",
};

const marketTypeLabels: Record<string, string> = {
    renewable_ppa: "Renewable PPA",
    non_renewable_ppa: "Non-Renewable PPA",
    rec: "REC (Renewable Energy Certificate)",
    irec: "I-REC (International REC)",
    green_tariff: "Green Power Tariff",
    supplier_specific: "Supplier-Specific Factor",
    none: "None (Standard Grid)",
};

const activityTypeLabels: Record<string, string> = {
    grid_import: "Grid Import",
    renewable: "Onsite Renewable",
    captive: "Captive Generation",
    other: "Other Generation",
};

export function ElectricityActivityDetailModal({
    activity: initialActivity,
    onClose,
    onVerify,
    onReject,
    onSubmit,
    onDelete,
}: {
    activity: ElectricityActivity;
    onClose: () => void;
    onVerify?: (id: string) => void;
    onReject?: (id: string) => void;
    onSubmit?: (id: string) => void;
    onDelete?: (id: string) => void;
}) {
    const { data: fetchedActivity } = useElectricityActivity(initialActivity.id);
    const activity = fetchedActivity || initialActivity;

    const [activeTab, setActiveTab] = useState<"dual_reporting" | "allocation" | "context" | "documents">("dual_reporting");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectBox, setShowRejectBox] = useState(false);

    const isGridImport = activity.electricityActivityType === "grid_import";
    const statusLower = (activity.workflowStatus || "draft").toLowerCase();
    const isVerified = statusLower === "verified";
    const isDraft = statusLower === "draft";
    const isSubmitted = statusLower === "submitted" || statusLower === "pending";
    const isRejected = statusLower === "rejected";

    const activityStart = activity.activityStartDate ? new Date(activity.activityStartDate) : new Date();
    const activityEnd = activity.activityEndDate ? new Date(activity.activityEndDate) : new Date();
    const activeDays = Math.max(
        1,
        Math.ceil((activityEnd.getTime() - activityStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    const locationEmissions = activity.locationCalculatedTCo2e;
    const marketEmissions = activity.marketCalculatedTCo2e;
    const netSavings = locationEmissions != null && marketEmissions != null ? Math.max(0, locationEmissions - marketEmissions) : 0;
    const savingsPercent = locationEmissions != null && locationEmissions > 0 && netSavings > 0
        ? (netSavings / locationEmissions) * 100
        : 0;

    const attachedDocs = activity.attachedDocuments || [];
    const facilityLocation = [activity.facilityCity, activity.facilityCountry].filter(Boolean).join(", ");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-outline-variant max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
                            <MaterialIcon name="offline_bolt" size="sm" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-headline-sm font-semibold text-primary">Electricity Activity Details</h3>
                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] uppercase font-bold tracking-tight border ${statusStyles[statusLower] || statusStyles.default}`}>
                                    {activity.workflowStatus}
                                </span>
                            </div>
                            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                                ID: {activity.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-outline-variant bg-surface-container-lowest px-6 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab("dual_reporting")}
                        className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === "dual_reporting"
                                ? "border-primary text-primary font-semibold"
                                : "border-transparent text-on-surface-variant hover:text-primary"
                        }`}>
                        <MaterialIcon name="calculate" size="xs" />
                        Scope 2 Dual Accounting
                    </button>
                    {isGridImport && activity.hasMarketInstrument && (
                        <button
                            onClick={() => setActiveTab("allocation")}
                            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                                activeTab === "allocation"
                                    ? "border-secondary text-secondary font-semibold"
                                    : "border-transparent text-on-surface-variant hover:text-secondary"
                            }`}>
                            <MaterialIcon name="receipt_long" size="xs" />
                            Market Allocation & Contracts
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab("context")}
                        className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === "context"
                                ? "border-primary text-primary font-semibold"
                                : "border-transparent text-on-surface-variant hover:text-primary"
                        }`}>
                        <MaterialIcon name="domain" size="xs" />
                        Facility & Workflow Context
                    </button>
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === "documents"
                                ? "border-primary text-primary font-semibold"
                                : "border-transparent text-on-surface-variant hover:text-primary"
                        }`}>
                        <MaterialIcon name="attach_file" size="xs" />
                        Evidence Documents ({attachedDocs.length})
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Top KPI Quick Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Electricity Volume
                            </span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono text-primary">
                                    {formatNumber(activity.electricityMwh, 2)}
                                </span>
                                <span className="text-xs text-on-surface-variant font-semibold">MWh</span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                                ({formatNumber(activity.electricityKwh, 0)} kWh)
                            </span>
                        </div>

                        <div className="rounded-xl border border-sky-200 bg-sky-500/5 p-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-900">
                                    Location-Based
                                </span>
                                <span className="px-1 py-0.2 rounded bg-sky-500/15 text-[9px] font-bold text-sky-800">
                                    Grid EF
                                </span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono text-sky-950">
                                    {locationEmissions != null ? formatNumber(locationEmissions, 2) : "—"}
                                </span>
                                <span className="text-xs text-sky-700 font-semibold">tCO₂e</span>
                            </div>
                            <span className="text-[10px] text-sky-700 font-mono">
                                {activity.locationCalculatedKgCo2e != null ? `${formatNumber(activity.locationCalculatedKgCo2e, 0)} kg` : "Non-Grid (null)"}
                            </span>
                        </div>

                        <div className="rounded-xl border border-purple-200 bg-purple-500/5 p-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-900">
                                    Market-Based
                                </span>
                                <span className="px-1 py-0.2 rounded bg-purple-500/15 text-[9px] font-bold text-purple-800">
                                    {activity.hasMarketInstrument ? "Contract" : "Default"}
                                </span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono text-purple-950">
                                    {marketEmissions != null ? formatNumber(marketEmissions, 2) : "—"}
                                </span>
                                <span className="text-xs text-purple-700 font-semibold">tCO₂e</span>
                            </div>
                            <span className="text-[10px] text-purple-700 font-mono">
                                {activity.marketCalculatedKgCo2e != null ? `${formatNumber(activity.marketCalculatedKgCo2e, 0)} kg` : "Non-Grid (null)"}
                            </span>
                        </div>

                        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Carbon Reduction
                            </span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono text-secondary">
                                    {netSavings > 0 ? `-${formatNumber(netSavings, 2)}` : "0.00"}
                                </span>
                                <span className="text-xs text-secondary font-semibold">tCO₂e</span>
                            </div>
                            <span className="text-[10px] text-secondary font-semibold">
                                {savingsPercent > 0 ? `${savingsPercent.toFixed(1)}% savings vs Grid` : "No contractual delta"}
                            </span>
                        </div>
                    </div>

                    {/* Tab 1: Scope 2 Dual Accounting Breakdown */}
                    {activeTab === "dual_reporting" && (
                        <div className="space-y-6">
                            {isGridImport ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Location Breakdown Card */}
                                    <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sky-950 text-sm flex items-center gap-2">
                                                <MaterialIcon name="grid_view" size="xs" className="text-sky-700" />
                                                Location-Based Accounting
                                            </h4>
                                            <span className="font-mono text-xs font-bold text-sky-900">
                                                {formatNumber(activity.locationCalculatedTCo2e, 2)} tCO₂e
                                            </span>
                                        </div>
                                        <p className="text-xs text-sky-800 leading-relaxed">
                                            Reflects average GHG emissions intensity of the regional grid where energy was consumed.
                                        </p>
                                        <div className="pt-2 border-t border-sky-200/80 space-y-1.5 text-xs">
                                            <div className="flex justify-between text-sky-900">
                                                <span>Grid Factor Standard:</span>
                                                <span className="font-semibold">{activity.factorSourceStandard || "National Grid Standard"}</span>
                                            </div>
                                            <div className="flex justify-between text-sky-900">
                                                <span>CO₂ Breakdown:</span>
                                                <span className="font-mono font-medium">{formatNumber(activity.locationKgCo2, 1)} kg CO₂</span>
                                            </div>
                                            <div className="flex justify-between text-sky-900">
                                                <span>CH₄ Breakdown:</span>
                                                <span className="font-mono font-medium">{formatNumber(activity.locationKgCh4, 2)} kg CH₄</span>
                                            </div>
                                            <div className="flex justify-between text-sky-900">
                                                <span>N₂O Breakdown:</span>
                                                <span className="font-mono font-medium">{formatNumber(activity.locationKgN2o, 2)} kg N₂O</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Market Breakdown Card */}
                                    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-purple-950 text-sm flex items-center gap-2">
                                                <MaterialIcon name="verified" size="xs" className="text-purple-700" />
                                                Market-Based Accounting
                                            </h4>
                                            <span className="font-mono text-xs font-bold text-purple-900">
                                                {formatNumber(activity.marketCalculatedTCo2e, 2)} tCO₂e
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-800 leading-relaxed">
                                            Reflects emissions from contractual instruments and supplier-specific green power agreements.
                                        </p>
                                        <div className="pt-2 border-t border-purple-200/80 space-y-1.5 text-xs">
                                            <div className="flex justify-between text-purple-900">
                                                <span>Instrument Type:</span>
                                                <span className="font-semibold">
                                                    {activity.marketInstrumentType ? marketTypeLabels[activity.marketInstrumentType] || activity.marketInstrumentType : "None (Standard Grid)"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-purple-900">
                                                <span>Contracted MWh:</span>
                                                <span className="font-mono font-medium">
                                                    {activity.marketAllocation ? formatNumber(activity.marketAllocation.contractedElectricityMwh, 2) : "0.00"} MWh
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-purple-900">
                                                <span>Contract Emission Factor:</span>
                                                <span className="font-mono font-medium">
                                                    {activity.marketAllocation ? `${activity.marketAllocation.contractedEmissionFactor} ${activity.marketAllocation.contractedEmissionFactorUnit}` : "—"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-purple-900">
                                                <span>Uncovered Residual MWh:</span>
                                                <span className="font-mono font-medium">
                                                    {activity.marketAllocation?.uncoveredElectricityMwh != null ? `${formatNumber(activity.marketAllocation.uncoveredElectricityMwh, 2)} MWh` : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 space-y-2">
                                    <h4 className="font-semibold text-amber-950 text-sm flex items-center gap-2">
                                        <MaterialIcon name="info" size="xs" className="text-amber-700" />
                                        On-site Energy Generation ({activityTypeLabels[activity.electricityActivityType] || activity.electricityActivityType})
                                    </h4>
                                    <p className="text-xs text-amber-900 leading-relaxed">
                                        Non-grid imports (captive, onsite renewable, and waste energy) generate on-site power without direct Scope 2 emissions. All Scope 2 fields return <span className="font-mono font-bold">null</span> in accordance with GHG Protocol single-record dual reporting.
                                    </p>
                                </div>
                            )}

                            {/* Additional Activity Details */}
                            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Activity Profile</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <span className="text-on-surface-variant block">Activity Type</span>
                                        <span className="font-semibold text-primary">{activityTypeLabels[activity.electricityActivityType] || activity.electricityActivityType}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Source Type</span>
                                        <span className="font-semibold text-primary">{activity.sourceType.replace(/_/g, " ")}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Supplier / Utility</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.supplierName)}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Data Quality</span>
                                        <span className="font-semibold uppercase text-primary">{activity.dataQualityTier}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Duration</span>
                                        <span className="font-semibold text-primary">{activeDays} days</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Renewable Certified</span>
                                        <span className="font-semibold text-secondary">{activity.isRenewableCertified ? "Yes (Certified)" : "No"}</span>
                                    </div>
                                </div>
                                {activity.notes && (
                                    <div className="pt-2 border-t border-outline-variant text-xs text-on-surface">
                                        <span className="text-on-surface-variant font-semibold block mb-1">Notes:</span>
                                        <p className="bg-surface-container-low p-2.5 rounded-lg">{activity.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Market Allocation & Contracts */}
                    {activeTab === "allocation" && (
                        <div className="space-y-4">
                            {activity.marketAllocation && (
                                <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Contract Allocation Metrics</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                        <div>
                                            <span className="text-on-surface-variant block">Contracted Electricity</span>
                                            <span className="font-mono font-bold text-primary">
                                                {formatNumber(activity.marketAllocation.contractedElectricityMwh, 2)} MWh ({formatNumber(activity.marketAllocation.contractedElectricityKwh, 0)} kWh)
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Contract Emission Factor</span>
                                            <span className="font-mono font-bold text-primary">
                                                {activity.marketAllocation.contractedEmissionFactor} {activity.marketAllocation.contractedEmissionFactorUnit}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Contracted Emissions</span>
                                            <span className="font-mono font-bold text-secondary">
                                                {formatNumber(activity.marketAllocation.contractedElectricityTco2e, 2)} tCO₂e
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Uncovered Grid Volume</span>
                                            <span className="font-mono font-bold text-primary">
                                                {activity.marketAllocation.uncoveredElectricityMwh != null ? `${formatNumber(activity.marketAllocation.uncoveredElectricityMwh, 2)} MWh` : "—"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Uncovered Emissions</span>
                                            <span className="font-mono font-bold text-primary">
                                                {activity.marketAllocation.uncoveredElectricityTco2e != null ? `${formatNumber(activity.marketAllocation.uncoveredElectricityTco2e, 2)} tCO₂e` : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activity.marketCertificate && (
                                <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Market Certificate Compliance Audit Trail</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                        <div>
                                            <span className="text-on-surface-variant block">Serial Number</span>
                                            <span className="font-mono font-semibold text-primary">{formatValue(activity.marketCertificate.serialNumber)}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Registry Reference</span>
                                            <span className="font-semibold text-primary">{formatValue(activity.marketCertificate.certificateReference)}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Certificate Volume</span>
                                            <span className="font-mono font-semibold text-primary">{formatValue(activity.marketCertificate.quantity)} MWh</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Date Acquired</span>
                                            <span className="font-semibold text-primary">{formatValue(activity.marketCertificate.dateAcquired)}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Expiration Date</span>
                                            <span className="font-semibold text-primary">{formatValue(activity.marketCertificate.expirationDate)}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Certified Renewable</span>
                                            <span className="font-semibold text-secondary">{activity.marketCertificate.isRenewableCertified ? "Yes (Certified)" : "No"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activity.includePurchasedEnergy && activity.purchasedEnergy && (
                                <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Purchased Thermal Energy</h4>
                                    <div className="grid grid-cols-3 gap-3 text-xs">
                                        <div>
                                            <span className="text-on-surface-variant block">Steam Consumption</span>
                                            <span className="font-mono font-semibold text-primary">
                                                {formatNumber(activity.purchasedEnergy.steam, 2)} {activity.purchasedEnergy.unit.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Heating Consumption</span>
                                            <span className="font-mono font-semibold text-primary">
                                                {formatNumber(activity.purchasedEnergy.heating, 2)} {activity.purchasedEnergy.unit.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant block">Cooling Consumption</span>
                                            <span className="font-mono font-semibold text-primary">
                                                {formatNumber(activity.purchasedEnergy.cooling, 2)} {activity.purchasedEnergy.unit.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Context & Workflow */}
                    {activeTab === "context" && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Facility & Reporting Period</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-on-surface-variant block">Facility Name</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.facilityName || activity.facilityId)}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Facility Location</span>
                                        <span className="font-semibold text-primary">{facilityLocation || "—"}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Reporting Period</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.reportingPeriodName || activity.reportingPeriodId)}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Period Dates</span>
                                        <span className="font-semibold text-primary">
                                            {activity.periodStartDate ? `${activity.periodStartDate} to ${activity.periodEndDate}` : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Workflow Audit Trail</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-on-surface-variant block">Workflow Status</span>
                                        <span className="font-semibold uppercase text-primary">{activity.workflowStatus}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Entered By</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.enteredBy)}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Verified By</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.verifiedBy)}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block">Verified At</span>
                                        <span className="font-semibold text-primary">{formatValue(activity.verifiedAt)}</span>
                                    </div>
                                    {activity.rejectedReason && (
                                        <div className="col-span-2 p-2.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
                                            <span className="font-semibold block mb-0.5">Rejected Reason:</span>
                                            <span>{activity.rejectedReason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Evidence Documents */}
                    {activeTab === "documents" && (
                        <div className="space-y-3">
                            {attachedDocs.length === 0 ? (
                                <div className="p-8 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant rounded-xl">
                                    No evidence documents attached to this electricity activity.
                                </div>
                            ) : (
                                attachedDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <MaterialIcon name="description" size="sm" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary">{doc.documentName}</p>
                                                <p className="text-xs text-on-surface-variant font-mono">
                                                    Type: {doc.documentType} {doc.documentDate ? `• Date: ${doc.documentDate}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                        {doc.downloadUrl || doc.sourceUrl ? (
                                            <a
                                                href={doc.downloadUrl || doc.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-md border border-outline-variant text-xs font-semibold text-primary hover:bg-surface transition-colors flex items-center gap-1.5">
                                                <MaterialIcon name="download" size="xs" />
                                                View / Download
                                            </a>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Reject Reason Prompt */}
                    {showRejectBox && (
                        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 space-y-3">
                            <label className="text-xs font-bold text-rose-900 block">
                                Reason for Rejection
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full rounded-lg border border-rose-300 bg-white p-2.5 text-xs text-rose-950 focus:outline-none focus:ring-1 focus:ring-rose-500"
                                placeholder="State reason for rejecting this record..."
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" size="sm" onClick={() => setShowRejectBox(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        if (onReject && rejectReason.trim()) {
                                            onReject(activity.id);
                                            setShowRejectBox(false);
                                        }
                                    }}>
                                    Confirm Rejection
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-outline-variant bg-surface px-6 py-4">
                    <div>
                        {isDraft && onDelete && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(activity.id)}>
                                <MaterialIcon name="delete" size="xs" />
                                Delete Draft
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isDraft && onSubmit && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onSubmit(activity.id)}>
                                <MaterialIcon name="send" size="xs" />
                                Submit for Verification
                            </Button>
                        )}
                        {isSubmitted && onVerify && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onVerify(activity.id)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white">
                                <MaterialIcon name="check_circle" size="xs" />
                                Verify
                            </Button>
                        )}
                        {isSubmitted && onReject && !showRejectBox && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setShowRejectBox(true)}>
                                <MaterialIcon name="cancel" size="xs" />
                                Reject
                            </Button>
                        )}
                        <Button variant="secondary" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ElectricityActivityDetailModal;
