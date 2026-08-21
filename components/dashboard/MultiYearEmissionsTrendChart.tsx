"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { YearlyEmissionsTrendPoint } from "@/lib/dashboard/types";

type MultiYearEmissionsTrendChartProps = {
    data: YearlyEmissionsTrendPoint[];
};

export function MultiYearEmissionsTrendChart({ data }: MultiYearEmissionsTrendChartProps) {
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
            <div className="px-card-padding py-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="show_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Multi-Year Emissions Trajectory
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Historical trend across Scope 1, 2, 3, and Total (tCO2e)
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#111827]"></span>
                        <span className="text-on-surface-variant font-medium">Total</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                        <span className="text-on-surface-variant font-medium">Scope 1</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                        <span className="text-on-surface-variant font-medium">Scope 2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                        <span className="text-on-surface-variant font-medium">Scope 3</span>
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
                                tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "#45464c" }}
                                dy={5}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "#45464c" }}
                                unit=" t"
                            />
                            <Tooltip
                                formatter={(value: any, name: any) => [
                                    `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} tCO2e`,
                                    name === "totalTco2e"
                                        ? "Total Emissions"
                                        : name === "scope1Tco2e"
                                        ? "Scope 1 Direct"
                                        : name === "scope2Tco2e"
                                        ? "Scope 2 Indirect"
                                        : "Scope 3 Value Chain",
                                ]}
                                labelStyle={{ fontWeight: "bold", color: "#191c1d", fontFamily: "Hanken Grotesk" }}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    borderColor: "#c6c6cd",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    fontSize: "12px",
                                    fontFamily: "JetBrains Mono, monospace",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono", paddingTop: "12px" }}
                                formatter={(value: string) => {
                                    if (value === "totalTco2e") return "Total";
                                    if (value === "scope1Tco2e") return "Scope 1";
                                    if (value === "scope2Tco2e") return "Scope 2";
                                    if (value === "scope3Tco2e") return "Scope 3";
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
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
