"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SCOPE3_TREND_DATA } from "@/lib/scope3/data";

export function Scope3MonthlyTrendChart() {
    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-3.5 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="show_chart" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Monthly Value Chain Trajectory
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Upstream supply chain vs downstream distribution trajectory (tCO2e/month)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary px-2.5 py-1 rounded">
                        12 Months (FY 2025-26)
                    </span>
                </div>
            </div>

            <div className="p-card-padding flex-1 flex flex-col justify-between min-w-0">
                <div className="h-72 w-full pt-2 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={SCOPE3_TREND_DATA} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                                stroke="#76777d"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                                stroke="#76777d"
                                unit=" t"
                            />
                            <Tooltip
                                formatter={(value: any, name: any) => [
                                    `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 1 })} tCO2e`,
                                    name === "upstream" ? "Upstream (Cat 1–7)" : "Downstream (Cat 9, 15)",
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
                            <Legend
                                wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", paddingTop: "8px" }}
                                formatter={(val) => (val === "upstream" ? "Upstream Supply Chain (Cat 1–7)" : "Downstream Logistics & Finance (Cat 9, 15)")}
                            />
                            <Bar dataKey="upstream" stackId="month" fill="#10b981" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="downstream" stackId="month" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-outline-variant pt-3 text-center">
                    <div className="p-2 rounded bg-surface-container-low/60 border border-outline-variant/30">
                        <span className="block font-mono text-[10px] text-on-surface-variant font-bold uppercase">Upstream Monthly Avg</span>
                        <span className="font-mono text-sm font-bold text-emerald-800">2,603.5 tCO2e / mo</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low/60 border border-outline-variant/30">
                        <span className="block font-mono text-[10px] text-on-surface-variant font-bold uppercase">Downstream Monthly Avg</span>
                        <span className="font-mono text-sm font-bold text-blue-800">241.6 tCO2e / mo</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
