"use client";

import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ScopeDistributionItem } from "@/lib/dashboard/types";

type ScopeDistributionSectionProps = {
    data: ScopeDistributionItem[];
};

export function ScopeDistributionSection({ data }: ScopeDistributionSectionProps) {
    const [chartMode, setChartMode] = useState<"donut" | "bar">("donut");

    const totalEmissions = data.reduce((acc, curr) => acc + curr.tco2e, 0);

    const barChartData = [
        {
            name: "Emissions",
            "Scope 1": data.find((d) => d.scopeName === "Scope 1")?.tco2e || 0,
            "Scope 2": data.find((d) => d.scopeName === "Scope 2")?.tco2e || 0,
            "Scope 3": data.find((d) => d.scopeName === "Scope 3")?.tco2e || 0,
        },
    ];

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Card Header Strip */}
            <div className="px-card-padding py-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Scope-Wise Distribution
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            GHG Protocol Scope 1, 2 & 3 Breakdown
                        </p>
                    </div>
                </div>

                {/* Donut vs Stacked Bar Visualization Mode Toggle */}
                <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
                    <button
                        type="button"
                        onClick={() => setChartMode("donut")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all ${
                            chartMode === "donut"
                                ? "bg-white text-primary shadow-xs font-bold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        <MaterialIcon name="donut_small" size="sm" className="!text-[14px]" />
                        <span>Donut</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChartMode("bar")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all ${
                            chartMode === "bar"
                                ? "bg-white text-primary shadow-xs font-bold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        <MaterialIcon name="bar_chart" size="sm" className="!text-[14px]" />
                        <span>Bar</span>
                    </button>
                </div>
            </div>

            <div className="p-card-padding flex-1 flex flex-col justify-between space-y-4">
                {chartMode === "donut" ? (
                    <div className="relative flex items-center justify-center h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="tco2e"
                                    nameKey="scopeName">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "JetBrains Mono, monospace",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="font-mono text-[22px] font-extrabold text-primary">
                                {totalEmissions.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-bold">
                                Total tCO2e
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" unit=" t" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} tCO2e`,
                                        String(name || ""),
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#c6c6cd",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                        fontFamily: "JetBrains Mono, monospace",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono", paddingTop: "10px" }} />
                                <Bar dataKey="Scope 1" stackId="a" fill="#f97316" radius={[4, 0, 0, 4]} />
                                <Bar dataKey="Scope 2" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="Scope 3" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Legend & Breakdown Summary List */}
                <div className="grid grid-cols-3 gap-3 border-t border-outline-variant pt-3.5">
                    {data.map((item) => (
                        <div key={item.scopeName} className="bg-surface-container-low p-2.5 rounded border border-outline-variant/30 space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="font-mono text-xs font-bold text-on-surface">{item.scopeName}</span>
                            </div>
                            <div className="flex justify-between items-baseline font-mono text-[11px]">
                                <span className="font-bold text-primary">{item.tco2e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t</span>
                                <span className="text-[10px] text-on-surface-variant font-semibold">{item.sharePct.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
