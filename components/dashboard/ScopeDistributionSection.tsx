"use client";

import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ScopeDistributionItem, ParsedGasBreakdownItem } from "@/lib/dashboard/types";

type ScopeDistributionSectionProps = {
    data: ScopeDistributionItem[];
    gasBreakdown?: ParsedGasBreakdownItem[];
};

type ViewDimension = "scope" | "gas";

const DEFAULT_GAS_ITEMS: ParsedGasBreakdownItem[] = [
    {
        gasName: "CO2",
        massKg: 8050.0,
        massT: 8.05,
        tco2e: 8.05,
        sharePct: 97.2,
        color: "#10b981",
        scope1: { kg: 2650.0, t: 2.65, tco2e: 2.65 },
        scope2: { kg: 4000.0, t: 4.0, tco2e: 4.0 },
        scope3: { kg: 1400.0, t: 1.4, tco2e: 1.4 },
    },
    {
        gasName: "CH4",
        massKg: 120.0,
        massT: 0.12,
        tco2e: 0.12,
        sharePct: 1.4,
        color: "#60a5fa",
        scope1: { kg: 10.0, t: 0.01, tco2e: 0.01 },
        scope2: { kg: 50.0, t: 0.05, tco2e: 0.05 },
        scope3: { kg: 60.0, t: 0.06, tco2e: 0.06 },
    },
    {
        gasName: "N2O",
        massKg: 110.0,
        massT: 0.11,
        tco2e: 0.11,
        sharePct: 1.3,
        color: "#f97316",
        scope1: { kg: 20.0, t: 0.02, tco2e: 0.02 },
        scope2: { kg: 50.0, t: 0.05, tco2e: 0.05 },
        scope3: { kg: 40.0, t: 0.04, tco2e: 0.04 },
    },
    {
        gasName: "Biogenic CO2",
        massKg: 0.0,
        massT: 0.0,
        tco2e: 0.0,
        sharePct: 0.0,
        color: "#a855f7",
        scope1: { kg: 0.0, t: 0.0, tco2e: 0.0 },
        scope2: { kg: 0.0, t: 0.0, tco2e: 0.0 },
        scope3: { kg: 0.0, t: 0.0, tco2e: 0.0 },
    },
];

export function ScopeDistributionSection({ data, gasBreakdown }: ScopeDistributionSectionProps) {
    const [viewDimension, setViewDimension] = useState<ViewDimension>("scope");
    const [chartMode, setChartMode] = useState<"donut" | "bar">("donut");

    const totalEmissions = data.reduce((acc, curr) => acc + curr.tco2e, 0);
    const activeGases = (gasBreakdown && gasBreakdown.length > 0 ? gasBreakdown : DEFAULT_GAS_ITEMS).filter(
        (g) => g.tco2e > 0 || g.massKg > 0 || g.gasName === "Biogenic CO2"
    );

    const pieData =
        viewDimension === "scope"
            ? data.map((d) => ({ name: d.scopeName, value: d.tco2e, color: d.color }))
            : activeGases.map((g) => ({ name: g.gasName, value: g.tco2e, color: g.color }));

    const barChartData = [
        viewDimension === "scope"
            ? {
                  name: "Scopes",
                  "Scope 1": data.find((d) => d.scopeName === "Scope 1")?.tco2e || 0,
                  "Scope 2": data.find((d) => d.scopeName === "Scope 2")?.tco2e || 0,
                  "Scope 3": data.find((d) => d.scopeName === "Scope 3")?.tco2e || 0,
              }
            : {
                  name: "Gases",
                  "CO2": activeGases.find((g) => g.gasName === "CO2")?.tco2e || 0,
                  "CH4": activeGases.find((g) => g.gasName === "CH4")?.tco2e || 0,
                  "N2O": activeGases.find((g) => g.gasName === "N2O")?.tco2e || 0,
              },
    ];

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Card Header Strip */}
            <div className="px-card-padding py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                            {viewDimension === "scope" ? "Scope-Wise Distribution" : "GHG Gas Segregation"}
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant">
                            {viewDimension === "scope"
                                ? "GHG Protocol Scope 1, 2 & 3 Breakdown"
                                : "CO₂, CH₄ (Methane) & N₂O Breakdown"}
                        </p>
                    </div>
                </div>

                {/* View Dimension (Scope vs Gas) & Chart Mode (Donut vs Bar) Toggles */}
                <div className="flex items-center gap-2">
                    {/* Dimension Switcher */}
                    <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                        <button
                            type="button"
                            onClick={() => setViewDimension("scope")}
                            className={`px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                viewDimension === "scope"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            By Scope
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewDimension("gas")}
                            className={`px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                viewDimension === "gas"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            By Gas (CH₄ / N₂O)
                        </button>
                    </div>

                    {/* Chart Mode Switcher */}
                    <div className="hidden sm:flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                        <button
                            type="button"
                            onClick={() => setChartMode("donut")}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                chartMode === "donut"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            <MaterialIcon name="donut_small" size="sm" className="!text-[13px]" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartMode("bar")}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                chartMode === "bar"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            <MaterialIcon name="bar_chart" size="sm" className="!text-[13px]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-card-padding flex-1 flex flex-col justify-between space-y-4">
                {chartMode === "donut" ? (
                    <div className="relative flex items-center justify-center h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={92}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "Inter, system-ui, sans-serif",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="font-display text-2xl font-bold text-primary tabular-nums">
                                {totalEmissions.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="text-[11px] font-sans uppercase tracking-wider text-on-surface-variant font-semibold">
                                Total tCO2e
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="h-60 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" unit=" t" tick={{ fontSize: 12, fontFamily: "Inter, system-ui, sans-serif" }} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "Inter, system-ui, sans-serif",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "Inter, system-ui, sans-serif", paddingTop: "10px" }} />
                                {viewDimension === "scope" ? (
                                    <>
                                        <Bar dataKey="Scope 1" stackId="a" fill="#f97316" radius={[4, 0, 0, 4]} />
                                        <Bar dataKey="Scope 2" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="Scope 3" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                                    </>
                                ) : (
                                    <>
                                        <Bar dataKey="CO2" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} />
                                        <Bar dataKey="CH4" stackId="a" fill="#60a5fa" />
                                        <Bar dataKey="N2O" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} />
                                    </>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Legend & Breakdown Summary List */}
                {viewDimension === "scope" ? (
                    <div className="grid grid-cols-3 gap-3 border-t border-outline-variant pt-3.5">
                        {data.map((item) => (
                            <div key={item.scopeName} className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="font-sans text-xs font-semibold text-on-surface">{item.scopeName}</span>
                                </div>
                                <div className="flex justify-between items-baseline font-sans text-xs">
                                    <span className="font-bold text-primary tabular-nums">
                                        {item.tco2e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t
                                    </span>
                                    <span className="text-[11px] text-on-surface-variant font-medium tabular-nums">
                                        {item.sharePct.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-t border-outline-variant pt-3.5">
                        {activeGases.map((gas) => (
                            <div key={gas.gasName} className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: gas.color }} />
                                        <span className="font-sans text-xs font-bold text-on-surface truncate">{gas.gasName}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-on-surface-variant font-bold tabular-nums">
                                        {gas.sharePct.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline font-sans text-xs">
                                    <span className="font-bold text-primary tabular-nums">
                                        {gas.tco2e.toFixed(2)} <span className="text-[10px] font-normal text-on-surface-variant">tCO₂e</span>
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant tabular-nums font-mono">
                                        {gas.massT.toFixed(2)} t
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

