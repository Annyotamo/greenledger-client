"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import type { FuelActivity } from "@/lib/activity/types";

const GHG_COLORS = {
    co2: "#2563eb",
    ch4: "#f97316",
    n2o: "#14b8a6",
};

const formatValue = (value: string | number | null | undefined) =>
    value == null || value === "" || Number.isNaN(Number(value)) ? "N/A" : String(value);

export function FuelActivityDetailModal({
    activity,
    onClose,
    onVerify,
}: {
    activity: FuelActivity;
    onClose: () => void;
    onVerify: (id: string) => void;
}) {
    const activityStart = new Date(activity.activityStartDate);
    const activityEnd = new Date(activity.activityEndDate);

    // Prepare calculated emissions breakdown for pie chart
    const calculatedEmissionsData = [
        {
            name: "CO₂",
            value: activity.calculatedTCo2,
            color: GHG_COLORS.co2,
        },
        {
            name: "CH₄",
            value: activity.calculatedTCh4,
            color: GHG_COLORS.ch4,
        },
        {
            name: "N₂O",
            value: activity.calculatedTN2o,
            color: GHG_COLORS.n2o,
        },
    ].filter((item) => item.value > 0);

    const comparisonData = [
        {
            name: "Total CO₂e",
            Calculated: Number(activity.calculatedTCo2e.toFixed(2)),
            Factor: Number(activity.factorTCo2e.toFixed(4)),
        },
        {
            name: "CO₂",
            Calculated: Number(activity.calculatedTCo2.toFixed(2)),
            Factor: Number(activity.factorTCo2eOfCo2.toFixed(4)),
        },
        {
            name: "CH₄",
            Calculated: Number(activity.calculatedTCh4.toFixed(2)),
            Factor: Number(activity.factorTCo2eOfCh4.toFixed(4)),
        },
        {
            name: "N₂O",
            Calculated: Number(activity.calculatedTN2o.toFixed(2)),
            Factor: Number(activity.factorTCo2eOfN2o.toFixed(4)),
        },
    ];

    const isVerified = activity.workflowStatus.toLowerCase() === "verified";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-slate-200/40">
                <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Activity Details</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                            {format(activityStart, "MMMM d, yyyy")} to {format(activityEnd, "MMMM d, yyyy")}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                <div className="flex flex-1 min-h-0 max-h-[calc(100vh-12rem)] flex-col overflow-y-auto px-6 py-5">
                    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            [
                                { label: "Fuel", value: activity.fuelName },
                                { label: "Usage Type", value: activity.usageType.replace(/_/g, " ") },
                                { label: "Quantity", value: `${activity.quantity.toFixed(2)} ${activity.unitSymbol}` },
                                { label: "Scope", value: activity.scopeType },
                            ] as const
                        ).map((item) => (
                            <div
                                key={item.label}
                                className="rounded-md border border-slate-200/80 bg-slate-50 px-4 py-4">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
                                <p className="mt-3 text-sm font-semibold text-slate-950">{item.value}</p>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] mt-4">
                        <div className="rounded-md border border-gray-300 p-5">
                            <div className="flex items-center justify-between ">
                                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                                    Calculated emissions
                                </p>
                                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    tCO₂e
                                </span>
                            </div>
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-60 w-full sm:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={calculatedEmissionsData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                dataKey="value">
                                                {calculatedEmissionsData.map((entry, index) => (
                                                    <Cell key={`slice-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) =>
                                                    typeof value === "number" ? value.toFixed(2) : value
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid gap-3 sm:w-1/2">
                                    {calculatedEmissionsData.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-md border border-slate-200/80 bg-slate-50 px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="inline-flex h-3.5 w-3.5 rounded-md"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-950">
                                                {item.value.toFixed(2)} t
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-md border border-gray-300 p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                                    Totals
                                </p>
                                <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    {activity.workflowStatus}
                                </span>
                            </div>
                            <div className="mt-5 grid gap-4">
                                <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                                    <span>Total CO₂e (tonnes)</span>
                                    <span className="text-base font-semibold text-slate-950">
                                        {activity.calculatedTCo2e.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 border-t border-slate-200/80 pt-4 text-sm text-slate-500">
                                    <span>Total CO₂e (kg)</span>
                                    <span className="text-base font-semibold text-slate-950">
                                        {activity.calculatedKgCo2e.toFixed(0)}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200/80 pt-4">
                                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                                        Gas breakdown
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                                        <div className="flex justify-between">
                                            <span>CO₂</span>
                                            <span>{activity.calculatedTCo2.toFixed(2)} t</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>CH₄</span>
                                            <span>{activity.calculatedTCh4.toFixed(2)} t</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>N₂O</span>
                                            <span>{activity.calculatedTN2o.toFixed(2)} t</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-md border border-gray-300 p-6 mt-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                                    Trend Comparison
                                </p>
                                <p className="text-sm text-slate-500">
                                    A visual comparison of calculated and factor emissions.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-md border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                                <span className="inline-flex h-2.5 w-2.5 rounded-md bg-[#2563eb]" /> Calculated
                                <span className="inline-flex h-2.5 w-2.5 rounded-md bg-[#14b8a6]" /> Factor
                            </div>
                        </div>
                        <div className="mt-5 h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={comparisonData} margin={{ top: 10, right: 12, left: -6, bottom: 12 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value) => (typeof value === "number" ? value.toFixed(4) : value)}
                                        contentStyle={{
                                            borderRadius: 18,
                                            borderColor: "rgba(148,163,184,0.3)",
                                            backgroundColor: "#ffffff",
                                            boxShadow: "0 18px 54px rgba(15,23,42,0.08)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Calculated"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Factor"
                                        stroke="#14b8a6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#14b8a6", stroke: "#ffffff", strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-2 mt-4">
                        <div className="rounded-md border border-gray-300 p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Factor Data
                            </p>
                            <div className="mt-4 grid gap-3 text-sm text-slate-700">
                                {[
                                    { label: "Source", value: activity.fuelFactorStandard },
                                    { label: "Version", value: activity.fuelFactorVersion },
                                    { label: "Region", value: activity.fuelFactorRegion },
                                    { label: "Total CO₂e (t)", value: activity.factorTCo2e.toFixed(6) },
                                    { label: "CO₂ CO₂e (t)", value: activity.factorTCo2eOfCo2.toFixed(6) },
                                    { label: "CH₄ CO₂e (t)", value: activity.factorTCo2eOfCh4.toFixed(6) },
                                    { label: "N₂O CO₂e (t)", value: activity.factorTCo2eOfN2o.toFixed(6) },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="font-medium text-slate-950">{formatValue(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-md border border-gray-300 p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Activity Metadata
                            </p>
                            <div className="mt-4 grid gap-3 text-sm text-slate-700">
                                {[
                                    { label: "Emission type", value: activity.emissionType },
                                    {
                                        label: "Energy content (GJ)",
                                        value:
                                            activity.energyContentGJ > 0 ? activity.energyContentGJ.toFixed(2) : "N/A",
                                    },
                                    {
                                        label: "Generator efficiency",
                                        value: activity.generatorEfficiencyPercentage
                                            ? `${activity.generatorEfficiencyPercentage.toFixed(2)}%`
                                            : "N/A",
                                    },
                                    {
                                        label: "Generated electricity (kWh)",
                                        value: activity.generatedElectricityKwh
                                            ? activity.generatedElectricityKwh.toFixed(2)
                                            : "N/A",
                                    },
                                    {
                                        label: "Generated steam (GJ)",
                                        value: activity.generatedSteamGJ ? activity.generatedSteamGJ.toFixed(2) : "N/A",
                                    },
                                    { label: "Estimation basis", value: activity.estimationBasis ?? "N/A" },
                                    { label: "Notes", value: activity.notes ?? "None" },
                                    { label: "Calculation method", value: activity.calculationMethod ?? "N/A" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="font-medium text-slate-950">{formatValue(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="sticky bottom-0 border-t border-slate-200/70 bg-white/95 px-6 py-4 backdrop-blur-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
                            Close
                        </Button>
                        <Link href={`/activities/fuel/${activity.id}/edit`} className="w-full sm:w-auto">
                            <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                                <MaterialIcon name="edit" size="sm" />
                                <span className="font-label-md text-label-md uppercase">Edit</span>
                            </button>
                        </Link>
                        {!isVerified && (
                            <button
                                className="bg-green-500 text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm"
                                onClick={() => {
                                    onVerify(activity.id);
                                    onClose();
                                }}>
                                <MaterialIcon name="check_circle" size="sm" />
                                <span className="font-label-md text-label-md uppercase">Verify</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
