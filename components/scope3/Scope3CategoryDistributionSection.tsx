"use client";

import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SCOPE3_CATEGORIES } from "@/lib/scope3/data";

export function Scope3CategoryDistributionSection() {
    const [chartMode, setChartMode] = useState<"donut" | "bar">("donut");

    const activeCategories = SCOPE3_CATEGORIES.filter((c) => c.isImplemented);
    const totalEmissions = activeCategories.reduce((acc, curr) => acc + curr.emissionsTco2e, 0);

    const pieData = activeCategories.map((c) => ({
        name: `${c.code}: ${c.name}`,
        shortName: c.code,
        tco2e: c.emissionsTco2e,
        sharePct: c.sharePercent,
        color: c.color,
    }));

    const barChartData = [
        activeCategories.reduce(
            (acc, curr) => {
                acc[curr.code] = curr.emissionsTco2e;
                return acc;
            },
            { name: "Scope 3 Categories" } as Record<string, string | number>,
        ),
    ];

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-display text-headline-sm font-bold text-primary tracking-tight">
                            Category Contribution Breakdown
                        </h3>
                        <p className="font-sans text-[11px] font-medium tracking-tight text-on-surface-variant">
                            Relative share of tracked Scope 3 categories
                        </p>
                    </div>
                </div>

                {/* Donut vs Bar mode toggle */}
                <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
                    <button
                        type="button"
                        onClick={() => setChartMode("donut")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-sans text-xs font-medium transition-all ${
                            chartMode === "donut"
                                ? "bg-white text-primary shadow-xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        <MaterialIcon name="donut_small" size="sm" className="!text-[14px]" />
                        <span>Donut</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChartMode("bar")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-sans text-xs font-medium transition-all ${
                            chartMode === "bar"
                                ? "bg-white text-primary shadow-xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        <MaterialIcon name="bar_chart" size="sm" className="!text-[14px]" />
                        <span>Stacked</span>
                    </button>
                </div>
            </div>

            <div className="p-card-padding flex-1 flex flex-col justify-between space-y-4 min-w-0">
                {chartMode === "donut" ? (
                    <div className="relative flex items-center justify-center h-64 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="tco2e"
                                    nameKey="name">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "var(--font-inter), sans-serif",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="font-display text-[22px] font-bold text-primary tabular-nums tracking-tight">
                                {totalEmissions.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="text-[11px] font-sans uppercase tracking-wider text-on-surface-variant font-semibold">
                                Scope 3 tCO2e
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 w-full pt-4 min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" unit=" t" tick={{ fontSize: 11, fontFamily: "var(--font-inter), sans-serif" }} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "var(--font-inter), sans-serif",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-inter), sans-serif", paddingTop: "6px" }} />
                                {activeCategories.map((c) => (
                                    <Bar key={c.code} dataKey={c.code} stackId="scope3" fill={c.color} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Granular Contribution Grid Pills */}
                <div className="grid grid-cols-3 gap-2 border-t border-outline-variant pt-3">
                    {activeCategories.map((item) => (
                        <div key={item.id} className="bg-surface-container-low/70 p-2 rounded border border-outline-variant/30 space-y-0.5">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="font-sans text-[11px] font-bold text-primary truncate" title={item.name}>
                                    {item.code}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline font-sans text-[11px]">
                                <span className="font-display font-bold text-primary tabular-nums">{item.emissionsTco2e.toLocaleString()} t</span>
                                <span className="text-on-surface-variant font-semibold tabular-nums">{item.sharePercent}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
