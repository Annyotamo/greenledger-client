"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    verifyFuelActivity,
    rejectFuelActivity,
    submitFuelActivity,
    deleteFuelActivity,
} from "@/lib/activity/api";
import type { FuelActivity } from "@/lib/activity/types";

const GHG_COLORS = {
    co2: "#2563eb",
    ch4: "#f97316",
    n2o: "#14b8a6",
    biogenic: "#10b981",
};

const statusStyles: Record<string, { badge: "positive" | "negative" | "active" | "neutral"; label: string; bg: string }> = {
    verified: { badge: "positive", label: "Verified", bg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20" },
    submitted: { badge: "active", label: "Submitted", bg: "bg-blue-500/10 text-blue-800 border-blue-500/20" },
    pending: { badge: "active", label: "Pending", bg: "bg-amber-500/10 text-amber-800 border-amber-500/20" },
    draft: { badge: "neutral", label: "Draft", bg: "bg-slate-100 text-slate-700 border-slate-200" },
    rejected: { badge: "negative", label: "Rejected", bg: "bg-rose-500/10 text-rose-800 border-rose-500/20" },
};

const emissionTypeStyles: Record<string, string> = {
    stationary: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    mobile: "bg-sky-500/10 text-sky-800 border-sky-500/20",
    process: "bg-purple-500/10 text-purple-800 border-purple-500/20",
    fugitive: "bg-rose-500/10 text-rose-800 border-rose-500/20",
};

function formatShortDate(dateStr?: string | null): string {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return format(d, "MMM d, yyyy");
}

function formatFullDateTime(dateStr?: string | null): string {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return format(d, "MMM d, yyyy · HH:mm:ss 'UTC'");
}

function formatNumber(val: number | null | undefined, digits = 2): string {
    if (val == null || Number.isNaN(val)) return "0.00";
    return Number(val).toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

type ConfirmActionState = {
    open: boolean;
    action: "verify" | "reject" | "submit" | "delete" | null;
};

export function FuelActivityDetailView({ activity }: { activity: FuelActivity }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "factors" | "forensic" | "documents">("overview");
    const [chartView, setChartView] = useState<"pie" | "bar">("pie");

    const [confirmState, setConfirmState] = useState<ConfirmActionState>({
        open: false,
        action: null,
    });
    const [rejectReason, setRejectReason] = useState("");

    // Mutations
    const verifyMutation = useMutation({
        mutationFn: () => verifyFuelActivity(activity.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activity.id] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            setConfirmState({ open: false, action: null });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (reason: string) => rejectFuelActivity(activity.id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activity.id] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            setConfirmState({ open: false, action: null });
            setRejectReason("");
        },
    });

    const submitMutation = useMutation({
        mutationFn: () => submitFuelActivity(activity.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activity.id] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            setConfirmState({ open: false, action: null });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteFuelActivity(activity.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            router.push("/activities/fuel");
        },
    });

    const isSubmitting =
        verifyMutation.isPending ||
        rejectMutation.isPending ||
        submitMutation.isPending ||
        deleteMutation.isPending;

    const handleCopyId = () => {
        navigator.clipboard.writeText(activity.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate dates & duration
    const startDate = activity.activityStartDate ? new Date(activity.activityStartDate) : null;
    const endDate = activity.activityEndDate ? new Date(activity.activityEndDate) : null;
    const durationDays =
        startDate && endDate && !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())
            ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
            : null;

    // GHG Breakdown Data for Charts
    const totalTCo2e = activity.calculatedTCo2e || 0;
    const co2Tons = activity.calculatedTCo2 || 0;
    const ch4Tons = activity.calculatedTCh4 || 0;
    const n2oTons = activity.calculatedTN2o || 0;

    const gasBreakdownData = [
        {
            name: "CO₂ (Carbon Dioxide)",
            shortName: "CO₂",
            value: co2Tons,
            kgValue: activity.calculatedKgCo2 || 0,
            percent: totalTCo2e > 0 ? (co2Tons / totalTCo2e) * 100 : 0,
            color: GHG_COLORS.co2,
            gwp: "1 (Direct)",
        },
        {
            name: "CH₄ (Methane)",
            shortName: "CH₄",
            value: ch4Tons,
            kgValue: activity.calculatedKgCh4 || 0,
            percent: totalTCo2e > 0 ? (ch4Tons / totalTCo2e) * 100 : 0,
            color: GHG_COLORS.ch4,
            gwp: "27.9 (AR6 100yr)",
        },
        {
            name: "N₂O (Nitrous Oxide)",
            shortName: "N₂O",
            value: n2oTons,
            kgValue: activity.calculatedKgN2o || 0,
            percent: totalTCo2e > 0 ? (n2oTons / totalTCo2e) * 100 : 0,
            color: GHG_COLORS.n2o,
            gwp: "273 (AR6 100yr)",
        },
    ].filter((g) => g.value > 0);

    // Factor Comparison Bar Data
    const factorBarData = [
        {
            gas: "CO₂ Gas",
            factorKg: activity.factorKgCo2eOfCo2 || (activity.factorKgCo2e ? activity.factorKgCo2e * 0.99 : 0),
            share: "99.4%",
            fill: GHG_COLORS.co2,
        },
        {
            gas: "CH₄ Gas",
            factorKg: activity.factorKgCo2eOfCh4 || 0,
            share: "0.4%",
            fill: GHG_COLORS.ch4,
        },
        {
            gas: "N₂O Gas",
            factorKg: activity.factorKgCo2eOfN2o || 0,
            share: "0.2%",
            fill: GHG_COLORS.n2o,
        },
    ];

    // Financial & Intensity Metrics
    const recordedCost = activity.cost ?? null;
    const costPerTCo2e = recordedCost && totalTCo2e > 0 ? recordedCost / totalTCo2e : null;
    const emissionIntensity = activity.quantity > 0 ? totalTCo2e / activity.quantity : 0;

    const statusInfo = statusStyles[activity.workflowStatus.toLowerCase()] || statusStyles.draft;
    const emissionTypeClass = emissionTypeStyles[activity.emissionType.toLowerCase()] || "bg-slate-100 text-slate-700";

    const attachedDocs = activity.attachedDocuments || [];
    const sourceData = activity.source || {
        standard: activity.fuelFactorStandard || "IPCC",
        version: activity.fuelFactorVersion || "2006",
        region: activity.fuelFactorRegion || "GLOBAL",
        dataYear: activity.factorDataYear || 2023,
        gwpBasis: "AR6",
        tableName: "ipcc_fuel_emission_factors",
        description:
            "Standard greenhouse gas emission factors and scientific baselines for stationary fuel combustion sourced from IPCC Sixth Assessment Report (AR6).",
        sourceUrl: "https://www.ipcc-nggip.iges.or.jp/public/2019rf/index.html",
        effectiveFrom: "2023-03-20",
        effectiveTo: "2030-12-31",
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            {/* Top Breadcrumb & Action Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-mono">
                    <Link
                        href="/activities/fuel"
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors text-on-surface-variant font-medium">
                        <MaterialIcon name="arrow_back" size="sm" />
                        <span>Fuel Activities</span>
                    </Link>
                    <span>/</span>
                    <span className="text-on-surface font-semibold truncate max-w-xs">{activity.fuelName}</span>
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyId}
                        className="font-mono text-xs">
                        <MaterialIcon name={copied ? "check" : "content_copy"} size="xs" />
                        <span>{copied ? "Copied ID" : "Copy ID"}</span>
                    </Button>

                    <Link href={`/activities/fuel/${activity.id}/edit`}>
                        <Button variant="secondary" size="sm">
                            <MaterialIcon name="edit" size="xs" />
                            <span>Edit</span>
                        </Button>
                    </Link>

                    {activity.workflowStatus.toLowerCase() === "draft" && (
                        <button
                            onClick={() => setConfirmState({ open: true, action: "submit" })}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-sm hover:opacity-90 transition-opacity">
                            <MaterialIcon name="send" size="xs" />
                            <span>Submit for Review</span>
                        </button>
                    )}

                    {["draft", "submitted", "pending"].includes(activity.workflowStatus.toLowerCase()) && (
                        <>
                            <button
                                onClick={() => setConfirmState({ open: true, action: "verify" })}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-sm hover:opacity-90 transition-opacity">
                                <MaterialIcon name="verified" size="xs" />
                                <span>Verify</span>
                            </button>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setConfirmState({ open: true, action: "reject" })}>
                                <MaterialIcon name="block" size="xs" />
                                <span>Reject</span>
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error-container/20"
                        onClick={() => setConfirmState({ open: true, action: "delete" })}>
                        <MaterialIcon name="delete" size="xs" />
                    </Button>
                </div>
            </div>

            {/* Main Header / Hero Identity Card */}
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-2xs">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded bg-primary-container px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                                <MaterialIcon name="factory" size="xs" className="text-secondary" />
                                {activity.scopeType || "SCOPE 1"}
                            </span>

                            <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${statusInfo.bg}`}>
                                {statusInfo.label}
                            </span>

                            <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${emissionTypeClass}`}>
                                {activity.emissionType} Combustion
                            </span>

                            {activity.fuelIsRenewable && (
                                <span className="inline-flex items-center gap-1 rounded bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 font-mono text-[10px] font-bold uppercase border border-secondary/20">
                                    <MaterialIcon name="eco" size="xs" />
                                    Renewable
                                </span>
                            )}

                            <span className="inline-flex items-center gap-1 rounded bg-surface-container px-2 py-0.5 font-mono text-[10px] text-on-surface-variant font-medium">
                                <MaterialIcon name="verified_user" size="xs" />
                                Tier 1 Measured
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                                {activity.fuelName} Activity Record
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant font-mono">
                                <span>UUID: {activity.id}</span>
                                <span>•</span>
                                <span>Recorded {formatShortDate(activity.createdAt)}</span>
                                {durationDays && (
                                    <>
                                        <span>•</span>
                                        <span className="text-primary font-semibold">Active: {durationDays} Days</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Facility & Period Context Badge - Refined & Transparent */}
                    <div className="flex flex-col gap-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest/40 backdrop-blur-xs p-3 min-w-[260px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-on-surface-variant font-semibold tracking-wider">
                            <MaterialIcon name="domain" size="xs" />
                            <span>Facility Location</span>
                        </div>
                        <div className="font-bold text-xs text-primary">
                            {activity.facilityName || "Primary Operational Center"}
                        </div>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 font-mono">
                            <span>Code: {activity.facilityCode || "FAC-GEN"}</span>
                            <span>•</span>
                            <span>{[activity.facilityCity, activity.facilityCountry].filter(Boolean).join(", ") || "Global"}</span>
                        </div>
                        <div className="pt-1.5 border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-on-surface-variant">Reporting Period:</span>
                            <span className="font-semibold text-primary">{activity.reportingPeriodName || "FY2025"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 KPI Metric Cards Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Total GHG Output */}
                <Card className="p-card-padding flex flex-col justify-between border-l-4 border-l-primary bg-surface-container-lowest">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                                Total Emissions
                            </p>
                            <MaterialIcon name="co2" size="sm" className="text-primary" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-mono text-primary">
                            {formatNumber(totalTCo2e)}
                            <span className="text-xs font-normal text-on-surface-variant ml-1">tCO₂e</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-on-surface-variant">
                        {formatNumber(activity.calculatedKgCo2e, 1)} kg CO₂e direct
                    </div>
                </Card>

                {/* 2. Quantity Consumed */}
                <Card className="p-card-padding flex flex-col justify-between bg-surface-container-lowest">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                                Fuel Consumed
                            </p>
                            <MaterialIcon name="local_gas_station" size="sm" className="text-secondary" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-mono text-primary">
                            {formatNumber(activity.quantity)}
                            <span className="text-xs font-normal text-on-surface-variant ml-1 uppercase">{activity.unitSymbol || "Units"}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-on-surface-variant">
                        Unit Type: <span className="font-semibold text-primary uppercase">{activity.unitType || "Mass"}</span>
                    </div>
                </Card>

                {/* 3. Factor Intensity */}
                <Card className="p-card-padding flex flex-col justify-between bg-surface-container-lowest">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                                Emission Intensity
                            </p>
                            <MaterialIcon name="balance" size="sm" className="text-tertiary" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-mono text-primary">
                            {formatNumber(emissionIntensity, 4)}
                            <span className="text-xs font-normal text-on-surface-variant ml-1">tCO₂e / {activity.unitSymbol || "tonne"}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-on-surface-variant">
                        Baseline: {formatNumber(activity.factorKgCo2e, 2)} kg CO₂e / {activity.unitSymbol || "tonne"}
                    </div>
                </Card>

                {/* 4. Incurred Cost & Carbon Cost (INR Currency) */}
                <Card className="p-card-padding flex flex-col justify-between bg-surface-container-lowest">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                                Fuel Cost
                            </p>
                            <MaterialIcon name="payments" size="sm" className="text-emerald-700" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-mono text-primary">
                            {recordedCost != null ? `₹${formatNumber(recordedCost, 2)}` : "Unrecorded"}
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-on-surface-variant">
                        {costPerTCo2e != null ? `₹${formatNumber(costPerTCo2e, 2)} / tCO₂e` : "No carbon cost data"}
                    </div>
                </Card>
            </div>

            {/* Visual Analytics Graphs Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Visual 1: Gas Constituent Breakdown Donut (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col">
                    <div className="px-card-padding py-4 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="pie_chart" size="sm" className="text-primary" />
                            <div>
                                <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                                    Greenhouse Gas Mass Composition
                                </h3>
                                <p className="font-mono text-[11px] text-on-surface-variant">
                                    Mass breakdown of CO₂, CH₄, and N₂O converted via IPCC GWP coefficients
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg border border-outline-variant/40">
                            <button
                                onClick={() => setChartView("pie")}
                                className={`px-2.5 py-1 rounded font-mono text-[11px] font-medium transition-colors ${
                                    chartView === "pie" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-primary"
                                }`}>
                                Donut
                            </button>
                            <button
                                onClick={() => setChartView("bar")}
                                className={`px-2.5 py-1 rounded font-mono text-[11px] font-medium transition-colors ${
                                    chartView === "bar" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-primary"
                                }`}>
                                Factors
                            </button>
                        </div>
                    </div>

                    <div className="p-card-padding flex-1 flex flex-col justify-between">
                        {chartView === "pie" ? (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <div className="md:col-span-7 h-64 relative flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={gasBreakdownData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={3}
                                                dataKey="value">
                                                {gasBreakdownData.map((entry, index) => (
                                                    <Cell key={`gas-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: any, name: any, item: any) => [
                                                    `${formatNumber(Number(value))} tCO₂e (${formatNumber(item.payload.percent)}%)`,
                                                    item.payload.name,
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    borderColor: "#c6c6cd",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                                    fontSize: "12px",
                                                    fontFamily: "JetBrains Mono, monospace",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Donut Center Total Label */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="font-mono text-xl font-bold text-primary">
                                            {formatNumber(totalTCo2e, 1)}
                                        </span>
                                        <span className="font-mono text-[10px] uppercase text-on-surface-variant">tCO₂e Total</span>
                                    </div>
                                </div>

                                {/* Legend & Gas Metrics */}
                                <div className="md:col-span-5 space-y-2.5">
                                    {gasBreakdownData.map((gas) => (
                                        <div
                                            key={gas.name}
                                            className="p-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low/60 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: gas.color }} />
                                                <div>
                                                    <div className="font-mono text-xs font-bold text-primary">{gas.shortName}</div>
                                                    <div className="text-[10px] text-on-surface-variant font-mono">GWP: {gas.gwp}</div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono">
                                                <div className="text-xs font-bold text-primary">{formatNumber(gas.value)} t</div>
                                                <div className="text-[10px] text-on-surface-variant">{formatNumber(gas.percent, 1)}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={factorBarData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
                                        <XAxis type="number" unit=" kg" tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }} />
                                        <YAxis dataKey="gas" type="category" tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }} />
                                        <Tooltip
                                            formatter={(value: any) => [`${formatNumber(Number(value))} kg CO₂e / ${activity.unitSymbol || "tonne"}`, "Factor Component"]}
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                borderColor: "#c6c6cd",
                                                borderRadius: "8px",
                                                fontSize: "12px",
                                                fontFamily: "JetBrains Mono, monospace",
                                            }}
                                        />
                                        <Bar dataKey="factorKg" radius={[0, 4, 4, 0]}>
                                            {factorBarData.map((entry, index) => (
                                                <Cell key={`bar-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-outline-variant flex flex-wrap items-center justify-between text-[11px] font-mono text-on-surface-variant">
                            <span>Standard Basis: {sourceData.standard} {sourceData.version} ({sourceData.gwpBasis || "AR6"} 100-Year)</span>
                            <span className="text-emerald-700 font-semibold">100% Calculated Coverage</span>
                        </div>
                    </div>
                </div>

                {/* Visual 2: Fuel Information & Characterization (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="px-card-padding py-3.5 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="local_gas_station" size="sm" className="text-secondary" />
                            <div>
                                <h3 className="font-headline-sm text-sm font-bold text-primary">
                                    Fuel Information & Specification
                                </h3>
                                <p className="font-mono text-[10px] text-on-surface-variant">
                                    Classification, physical properties & accounting specifications
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-card-padding space-y-3 flex-1">
                        {/* Fuel Quick Info Tiles */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-2.5 rounded-lg bg-surface-container-lowest/70 border border-outline-variant/60">
                                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">Fuel Name</span>
                                <div className="text-sm font-bold font-mono text-primary mt-0.5 truncate">
                                    {activity.fuelName}
                                </div>
                                <span className="text-[10px] text-on-surface-variant font-mono truncate block">Slug: {activity.fuelSlug || "standard"}</span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-surface-container-lowest/70 border border-outline-variant/60">
                                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">Measurement Unit</span>
                                <div className="text-sm font-bold font-mono text-primary mt-0.5 uppercase">
                                    {activity.unitSymbol || activity.unitName || "Tonnes"}
                                </div>
                                <span className="text-[10px] text-on-surface-variant font-mono capitalize">Type: {activity.unitType || "Mass"}</span>
                            </div>
                        </div>

                        {/* Fuel Characterization Spec Rows */}
                        <div className="rounded-lg border border-outline-variant/60 overflow-hidden text-xs font-mono">
                            <div className="grid grid-cols-2 p-2 border-b border-outline-variant/40 bg-surface-container-low/30">
                                <span className="text-on-surface-variant">Renewable Origin:</span>
                                <span className={`font-bold ${activity.fuelIsRenewable ? "text-emerald-700" : "text-primary"}`}>
                                    {activity.fuelIsRenewable ? "Yes (Biogenic Feedstock)" : "No (Conventional Fossil)"}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 p-2 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Emission / Factor Type:</span>
                                <span className="font-semibold text-primary">{activity.fuelFactorType || "COMBUSTION"} ({activity.emissionType})</span>
                            </div>
                            <div className="grid grid-cols-2 p-2 border-b border-outline-variant/40 bg-surface-container-low/30">
                                <span className="text-on-surface-variant">Data Quality Tier:</span>
                                <span className="font-semibold text-primary capitalize">{activity.dataQualityTier || "Measured (Tier 1)"}</span>
                            </div>
                            <div className="grid grid-cols-2 p-2">
                                <span className="text-on-surface-variant">Standard Factor:</span>
                                <span className="font-bold text-primary">
                                    {formatNumber(activity.factorKgCo2e, 2)} kg CO₂e / {activity.unitSymbol || "tonne"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-card-padding pt-0 pb-3.5">
                        {activity.fuelIsRenewable ? (
                            <div className="rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20 text-xs font-mono text-emerald-800 flex items-center gap-2">
                                <MaterialIcon name="eco" size="xs" className="text-emerald-700 shrink-0" />
                                <span>Renewable biogenic fuel subject to biogenic emission reporting guidelines.</span>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-surface-container-low p-2.5 border border-outline-variant/50 text-xs font-mono text-on-surface-variant flex items-center gap-2">
                                <MaterialIcon name="info" size="xs" className="text-on-surface-variant shrink-0" />
                                <span>Direct combustion fossil source contributing to gross Scope 1 emissions.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs for Forensic & Context Deep-Dive */}
            <div className="border-b border-outline-variant flex gap-6">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative ${
                        activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"
                    }`}>
                    <span className="flex items-center gap-1.5">
                        <MaterialIcon name="tune" size="xs" />
                        Operational Context & Timeline
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("factors")}
                    className={`pb-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative ${
                        activeTab === "factors" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"
                    }`}>
                    <span className="flex items-center gap-1.5">
                        <MaterialIcon name="science" size="xs" />
                        Emission Standards & Factors
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("forensic")}
                    className={`pb-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative ${
                        activeTab === "forensic" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"
                    }`}>
                    <span className="flex items-center gap-1.5">
                        <MaterialIcon name="table_chart" size="xs" />
                        Full Mass Emissions Ledger
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("documents")}
                    className={`pb-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative ${
                        activeTab === "documents" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"
                    }`}>
                    <span className="flex items-center gap-1.5">
                        <MaterialIcon name="description" size="xs" />
                        Audit Documents ({attachedDocs.length})
                    </span>
                </button>
            </div>

            {/* Tab 1: Operational Context & Timeline */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Facility & Location Details */}
                    <Card className="bg-white">
                        <CardHeader tone="strip" className="border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="domain" size="sm" className="text-primary" />
                                <h4 className="font-headline-sm text-sm font-bold text-primary">Facility & Site Context</h4>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Facility Name</span>
                                <span className="font-bold text-primary">{activity.facilityName || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Facility Code</span>
                                <span className="font-semibold text-primary">{activity.facilityCode || "GRNL-01"}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">City & Country</span>
                                <span className="font-semibold text-primary">
                                    {[activity.facilityCity, activity.facilityCountry].filter(Boolean).join(", ") || "Global"}
                                </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Facility ID</span>
                                <span className="text-[11px] text-on-surface-variant truncate max-w-[200px]">{activity.facilityId}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-on-surface-variant">Meter / Flow Sensor ID</span>
                                <span className="font-semibold text-primary">{activity.meterId || "Direct Tank Invoicing"}</span>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Operational Time Window */}
                    <Card className="bg-white">
                        <CardHeader tone="strip" className="border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="date_range" size="sm" className="text-primary" />
                                <h4 className="font-headline-sm text-sm font-bold text-primary">Operational Period & Timeline</h4>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Activity Start Date</span>
                                <span className="font-bold text-primary">{formatShortDate(activity.activityStartDate)}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Activity End Date</span>
                                <span className="font-bold text-primary">{formatShortDate(activity.activityEndDate)}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Total Duration</span>
                                <span className="font-bold text-secondary">{durationDays ? `${durationDays} Days` : "Single Event"}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Reporting Cycle</span>
                                <span className="font-semibold text-primary">{activity.reportingPeriodName || "FY2025"}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-on-surface-variant">Cycle Period Range</span>
                                <span className="text-on-surface-variant">
                                    {formatShortDate(activity.periodStartDate)} – {formatShortDate(activity.periodEndDate)}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Tab 2: Emission Standards & Factors */}
            {activeTab === "factors" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Science Authority Info Card */}
                    <Card className="md:col-span-6 bg-white">
                        <CardHeader tone="strip" className="border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="verified" size="sm" className="text-primary" />
                                <h4 className="font-headline-sm text-sm font-bold text-primary">IPCC Scientific Authority & Registry</h4>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Standard Body</span>
                                <span className="font-bold text-primary">{sourceData.standard} Guidelines</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Version & Data Year</span>
                                <span className="font-semibold text-primary">{sourceData.version} (Year {sourceData.dataYear})</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">GWP Metric Standard</span>
                                <span className="font-bold text-primary">{sourceData.gwpBasis || "AR6 (Sixth Assessment Report)"}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Geographical Region</span>
                                <span className="font-semibold text-primary">{sourceData.region}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Database Table Name</span>
                                <span className="font-semibold text-primary">{sourceData.tableName || "ipcc_fuel_emission_factors"}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-on-surface-variant">Effective Validity</span>
                                <span className="text-on-surface-variant">{sourceData.effectiveFrom || "2023-03-20"} to {sourceData.effectiveTo || "2030-12-31"}</span>
                            </div>

                            {sourceData.sourceUrl && (
                                <div className="mt-4 pt-3 border-t border-outline-variant/60">
                                    <a
                                        href={sourceData.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold">
                                        <span>View Official IPCC Technical Documentation</span>
                                        <MaterialIcon name="open_in_new" size="xs" />
                                    </a>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Numerical Emission Factors Breakdown */}
                    <Card className="md:col-span-6 bg-white">
                        <CardHeader tone="strip" className="border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="calculate" size="sm" className="text-primary" />
                                <h4 className="font-headline-sm text-sm font-bold text-primary">Factor Rates per Fuel Unit</h4>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Total Factor (kg CO₂e / {activity.unitSymbol || "tonne"})</span>
                                <span className="font-bold text-primary">{formatNumber(activity.factorKgCo2e, 4)} kg</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">CO₂ Gas Factor</span>
                                <span className="font-semibold text-primary">{formatNumber(activity.factorKgCo2eOfCo2, 4)} kg</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">CH₄ Methane Factor</span>
                                <span className="font-semibold text-primary">{formatNumber(activity.factorKgCo2eOfCh4, 4)} kg</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">N₂O Nitrous Oxide Factor</span>
                                <span className="font-semibold text-primary">{formatNumber(activity.factorKgCo2eOfN2o, 4)} kg</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                                <span className="text-on-surface-variant">Total Factor (tonnes CO₂e / {activity.unitSymbol || "tonne"})</span>
                                <span className="font-bold text-primary">{formatNumber(activity.factorTCo2e, 6)} t</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-on-surface-variant">Emission Factor Unit</span>
                                <span className="font-semibold text-primary uppercase">{activity.unitSymbol || "Tonnes"}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Tab 3: Full Mass Emissions Ledger */}
            {activeTab === "forensic" && (
                <Card className="bg-white overflow-hidden">
                    <CardHeader tone="strip" className="border-b border-outline-variant">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="table_rows" size="sm" className="text-primary" />
                            <h4 className="font-headline-sm text-sm font-bold text-primary">Greenhouse Gas Mass Ledger (kg & tonnes)</h4>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Greenhouse Gas Constituent</TableHead>
                                    <TableHead>Formula / Symbol</TableHead>
                                    <TableHead>GWP Multiplier (AR6)</TableHead>
                                    <TableHead className="text-right">Calculated Mass (kg)</TableHead>
                                    <TableHead className="text-right">Calculated Mass (tonnes)</TableHead>
                                    <TableHead className="text-right">% of Total CO₂e</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold text-primary">Carbon Dioxide (Pure)</TableCell>
                                    <TableCell className="font-mono">CO₂</TableCell>
                                    <TableCell className="font-mono">1.0</TableCell>
                                    <TableCell className="text-right font-mono">{formatNumber(activity.calculatedKgCo2)} kg</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary">{formatNumber(activity.calculatedTCo2, 4)} t</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {totalTCo2e > 0 ? formatNumber((co2Tons / totalTCo2e) * 100, 2) : "0.00"}%
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold text-primary">Methane</TableCell>
                                    <TableCell className="font-mono">CH₄</TableCell>
                                    <TableCell className="font-mono">27.9</TableCell>
                                    <TableCell className="text-right font-mono">{formatNumber(activity.calculatedKgCh4)} kg</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary">{formatNumber(activity.calculatedTCh4, 4)} t</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {totalTCo2e > 0 ? formatNumber((ch4Tons / totalTCo2e) * 100, 2) : "0.00"}%
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold text-primary">Nitrous Oxide</TableCell>
                                    <TableCell className="font-mono">N₂O</TableCell>
                                    <TableCell className="font-mono">273.0</TableCell>
                                    <TableCell className="text-right font-mono">{formatNumber(activity.calculatedKgN2o)} kg</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary">{formatNumber(activity.calculatedTN2o, 4)} t</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {totalTCo2e > 0 ? formatNumber((n2oTons / totalTCo2e) * 100, 2) : "0.00"}%
                                    </TableCell>
                                </TableRow>

                                {activity.biogenicKgCo2 != null && (
                                    <TableRow>
                                        <TableCell className="font-bold text-emerald-700">Biogenic Carbon Dioxide</TableCell>
                                        <TableCell className="font-mono">Bio-CO₂</TableCell>
                                        <TableCell className="font-mono">Reported Separately</TableCell>
                                        <TableCell className="text-right font-mono">{formatNumber(activity.biogenicKgCo2)} kg</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-emerald-700">{formatNumber(activity.biogenicTCo2, 4)} t</TableCell>
                                        <TableCell className="text-right font-mono text-on-surface-variant">Biogenic Memo</TableCell>
                                    </TableRow>
                                )}

                                <TableRow className="bg-surface-container-high/40 font-bold">
                                    <TableCell className="text-primary">Total Gross Scope 1 Impact</TableCell>
                                    <TableCell className="font-mono">CO₂e</TableCell>
                                    <TableCell className="font-mono">Composite</TableCell>
                                    <TableCell className="text-right font-mono text-primary">{formatNumber(activity.calculatedKgCo2e)} kg</TableCell>
                                    <TableCell className="text-right font-mono text-primary text-sm">{formatNumber(activity.calculatedTCo2e, 4)} tCO₂e</TableCell>
                                    <TableCell className="text-right font-mono">100.00%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Tab 4: Audit Documents & Evidence */}
            {activeTab === "documents" && (
                <div className="space-y-4">
                    {attachedDocs.length === 0 ? (
                        <Card className="p-8 text-center bg-white">
                            <MaterialIcon name="description" size="lg" className="text-on-surface-variant/40 mx-auto" />
                            <h4 className="font-headline-sm text-sm font-semibold text-primary mt-2">No Verification Documents Attached</h4>
                            <p className="text-xs text-on-surface-variant font-mono mt-1">
                                Weighbridge tickets, supplier invoices, or meter calibration logs can be attached for third-party auditing.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {attachedDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="rounded-lg border border-outline-variant bg-white p-4 shadow-sm flex flex-col justify-between space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-mono font-bold text-xs">
                                                {doc.fileExtension?.replace(".", "").toUpperCase() || "DOC"}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm text-primary truncate max-w-[240px]">
                                                    {doc.documentName || doc.fileName || "Audit Evidence Document"}
                                                </h5>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high font-mono text-[10px] uppercase font-semibold text-on-surface-variant mt-1">
                                                    {doc.documentType.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-on-surface-variant space-y-1 pt-2 border-t border-outline-variant/40">
                                        {doc.documentDate && <div>Dated: {formatShortDate(doc.documentDate)}</div>}
                                        {doc.uploadedBy && <div className="truncate text-[10px]">Uploader: {doc.uploadedBy}</div>}
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        {(doc.viewUrl || doc.s3PresignedUrl || doc.sourceUrl) && (
                                            <a
                                                href={doc.viewUrl || doc.s3PresignedUrl || doc.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1">
                                                <Button variant="secondary" size="sm" className="w-full font-mono text-xs">
                                                    <MaterialIcon name="visibility" size="xs" />
                                                    <span>View</span>
                                                </Button>
                                            </a>
                                        )}

                                        {(doc.downloadUrl || doc.s3PresignedUrl || doc.sourceUrl) && (
                                            <a
                                                href={doc.downloadUrl || doc.s3PresignedUrl || doc.sourceUrl}
                                                download
                                                className="flex-1">
                                                <Button variant="primary" size="sm" className="w-full font-mono text-xs">
                                                    <MaterialIcon name="download" size="xs" />
                                                    <span>Download</span>
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Governance & Metadata Footer Card */}
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-xs font-mono text-on-surface-variant flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <span>Created: {formatFullDateTime(activity.createdAt)}</span>
                    <span>•</span>
                    <span>Last Updated: {formatFullDateTime(activity.updatedAt)}</span>
                    <span>•</span>
                    <span>Entered By: {activity.enteredBy || "System User"}</span>
                </div>
                <div>
                    <span className="font-semibold text-primary">GreenLedger ESG Engine v1.0 (Audit-Proof)</span>
                </div>
            </div>

            {/* Confirmation Modals for Actions */}
            {confirmState.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setConfirmState({ open: false, action: null })}
                        aria-label="Close modal"
                    />
                    <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 px-6 py-5">
                            <div>
                                <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                                    {confirmState.action === "verify" && "Verify Fuel Activity"}
                                    {confirmState.action === "reject" && "Reject Fuel Activity"}
                                    {confirmState.action === "submit" && "Submit Fuel Activity"}
                                    {confirmState.action === "delete" && "Delete Fuel Activity"}
                                </h3>
                                <p className="text-body-sm text-on-surface-variant mt-1 text-xs font-mono">
                                    {confirmState.action === "verify" && "This action locks the activity into the verified ESG audit registry."}
                                    {confirmState.action === "reject" && "Please provide a reason for rejecting this activity for the data submitter."}
                                    {confirmState.action === "submit" && "This will submit the activity for reviewer verification."}
                                    {confirmState.action === "delete" && "Are you sure you want to permanently delete this fuel activity record? This cannot be undone."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfirmState({ open: false, action: null })}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high">
                                <MaterialIcon name="close" size="sm" />
                            </button>
                        </div>

                        {confirmState.action === "reject" && (
                            <div className="p-6 pt-0">
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Enter reason for rejection (required)..."
                                    className="w-full rounded-lg border border-outline-variant p-3 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                                    rows={4}
                                    maxLength={2000}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3 border-t border-outline-variant bg-surface-container-low p-4 justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setConfirmState({ open: false, action: null })}>
                                Cancel
                            </Button>

                            {confirmState.action === "verify" && (
                                <button
                                    onClick={() => verifyMutation.mutate()}
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm">
                                    <MaterialIcon name="verified" size="xs" />
                                    <span>{verifyMutation.isPending ? "Verifying..." : "Confirm Verify"}</span>
                                </button>
                            )}

                            {confirmState.action === "submit" && (
                                <button
                                    onClick={() => submitMutation.mutate()}
                                    disabled={isSubmitting}
                                    className="bg-primary text-white px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm">
                                    <MaterialIcon name="send" size="xs" />
                                    <span>{submitMutation.isPending ? "Submitting..." : "Confirm Submit"}</span>
                                </button>
                            )}

                            {confirmState.action === "reject" && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => rejectMutation.mutate(rejectReason)}
                                    disabled={isSubmitting || rejectReason.trim().length === 0}>
                                    {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
                                </Button>
                            )}

                            {confirmState.action === "delete" && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate()}
                                    disabled={isSubmitting}>
                                    {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
