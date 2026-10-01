"use client";

import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { YearlyEmissionsTrendPoint } from "@/lib/dashboard/types";

type MultiYearEmissionsTrendChartProps = {
    data: YearlyEmissionsTrendPoint[];
};

type TrendDimension = "scope" | "gas";

export function MultiYearEmissionsTrendChart({ data }: MultiYearEmissionsTrendChartProps) {
    const [trendDimension, setTrendDimension] = useState<TrendDimension>("scope");

    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-outline-variant rounded-lg p-card-padding h-full flex items-center justify-center text-center text-on-surface-variant font-mono text-xs">
                No multi-year emissions trend data available.
            </div>
        );
    }

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Card Header Strip */}
            <div className="px-card-padding py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="show_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                            {trendDimension === "scope" ? "Multi-Year Scope Trajectory" : "Multi-Year Gas Trajectory"}
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant">
                            {trendDimension === "scope"
                                ? "Historical trend across Scope 1, 2, 3, and Total (tCO2e)"
                                : "Historical trend across CO₂, CH₄, N₂O, and Total (tCO2e)"}
                        </p>
                    </div>
                </div>

                {/* View Dimension Switcher */}
                <div className="flex items-center gap-2">
                    <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                        <button
                            type="button"
                            onClick={() => setTrendDimension("scope")}
                            className={`px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                trendDimension === "scope"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            By Scope
                        </button>
                        <button
                            type="button"
                            onClick={() => setTrendDimension("gas")}
                            className={`px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                                trendDimension === "gas"
                                    ? "bg-white text-primary shadow-2xs font-semibold"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}>
                            By Gas (CH₄ / N₂O)
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-card-padding flex-1 flex flex-col justify-between space-y-4">
                <div className="h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="yearLabel"
                                tick={{ fontSize: 12, fontFamily: "Inter, system-ui, sans-serif", fill: "#45464c" }}
                                dy={5}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fontFamily: "Inter, system-ui, sans-serif", fill: "#45464c" }}
                                unit=" t"
                            />
                            <Tooltip
                                formatter={(value: any, name: any) => {
                                    const formattedVal = `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e`;
                                    if (name === "totalTco2e") return [formattedVal, "Total Emissions"];
                                    if (name === "scope1Tco2e") return [formattedVal, "Scope 1 Direct"];
                                    if (name === "scope2Tco2e") return [formattedVal, "Scope 2 Indirect"];
                                    if (name === "scope3Tco2e") return [formattedVal, "Scope 3 Value Chain"];
                                    if (name === "co2Tco2e") return [formattedVal, "CO₂ (Carbon Dioxide)"];
                                    if (name === "ch4Tco2e") return [formattedVal, "CH₄ (Methane)"];
                                    if (name === "n2oTco2e") return [formattedVal, "N₂O (Nitrous Oxide)"];
                                    return [formattedVal, String(name || "")];
                                }}
                                labelStyle={{ fontWeight: "600", color: "#191c1d", fontFamily: "Inter, system-ui, sans-serif" }}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    borderColor: "#c6c6cd",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    fontSize: "12px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: "12px", fontFamily: "Inter, system-ui, sans-serif", paddingTop: "12px" }}
                                formatter={(value: string) => {
                                    if (value === "totalTco2e") return "Total Emissions";
                                    if (value === "scope1Tco2e") return "Scope 1";
                                    if (value === "scope2Tco2e") return "Scope 2";
                                    if (value === "scope3Tco2e") return "Scope 3";
                                    if (value === "co2Tco2e") return "CO₂";
                                    if (value === "ch4Tco2e") return "CH₄ (Methane)";
                                    if (value === "n2oTco2e") return "N₂O (Nitrous Oxide)";
                                    return value;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalTco2e"
                                stroke="#111827"
                                strokeWidth={3}
                                dot={{ r: 5, fill: "#111827" }}
                                activeDot={{ r: 7 }}
                            />
                            {trendDimension === "scope" ? (
                                <>
                                    <Line
                                        type="monotone"
                                        dataKey="scope1Tco2e"
                                        stroke="#f97316"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#f97316" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="scope2Tco2e"
                                        stroke="#3b82f6"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#3b82f6" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="scope3Tco2e"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#10b981" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Line
                                        type="monotone"
                                        dataKey="co2Tco2e"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#10b981" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ch4Tco2e"
                                        stroke="#60a5fa"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#60a5fa" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="n2oTco2e"
                                        stroke="#f97316"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#f97316" }}
                                    />
                                </>
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

