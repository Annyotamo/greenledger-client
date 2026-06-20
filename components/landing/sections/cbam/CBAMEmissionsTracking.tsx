"use client";

import { useState } from "react";

type MetricId = "avg" | "nodes" | "gap" | "sync";

export default function CBAMEmissionsTracking() {
    const [activeMetric, setActiveMetric] = useState<MetricId>("avg");

    // Dynamic data matching the selected active metric
    const chartData: Record<MetricId, { title: string; bars: number[]; times: string[] }> = {
        avg: {
            title: "Average Carbon Intensity (tCO2e/t)",
            bars: [40, 65, 50, 85, 60, 75, 45, 35],
            times: ["00:00", "06:00", "12:00", "18:00"],
        },
        nodes: {
            title: "Node Activity Level (%)",
            bars: [70, 80, 65, 90, 75, 85, 95, 80],
            times: ["Asia", "Europe", "NA", "LatAm"],
        },
        gap: {
            title: "Regulatory Compliance Variance (%)",
            bars: [15, 12, 18, 14, 10, 8, 12, 11],
            times: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
        },
        sync: {
            title: "Registry Sync Latency (ms)",
            bars: [120, 150, 90, 200, 110, 130, 80, 95],
            times: ["1h ago", "45m ago", "30m ago", "Just now"],
        },
    };

    return (
        <section id="tracking" className="scroll-mt-24">
            <div className="bg-[#031c15]/95 rounded-xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,40,25,0.4)] border border-emerald-500/10 relative backdrop-blur-md">
                {/* Tech Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="p-8 lg:p-12 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-emerald-400 text-2xl">language</span>
                                <h3 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
                                    Embedded Emissions Tracking
                                </h3>
                            </div>
                            <p className="text-emerald-100/60 text-sm md:text-base">
                                Real-time monitoring of carbon intensity across the manufacturing lifecycle.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded tracking-wider uppercase font-semibold">
                                Real-time Global Mapping
                            </span>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-[#031c15] bg-emerald-800 flex items-center justify-center text-[10px] text-white font-bold">CN</div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#031c15] bg-emerald-700 flex items-center justify-center text-[10px] text-white font-bold">EU</div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#031c15] bg-emerald-500 flex items-center justify-center text-[10px] text-emerald-950 font-bold">+12</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar Metrics (Interactive) */}
                        <div className="lg:col-span-4 space-y-3">
                            {/* Metric 1 */}
                            <button
                                onClick={() => setActiveMetric("avg")}
                                className={`w-full p-5 text-left rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 group ${
                                    activeMetric === "avg"
                                        ? "bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                }`}>
                                <div>
                                    <div className="text-emerald-300/60 font-mono text-[10px] tracking-wider uppercase mb-1">
                                        AVG Intensity
                                    </div>
                                    <div className="text-emerald-400 text-2xl font-extrabold tracking-tight">
                                        1.82 tCO2e
                                    </div>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 transition-all duration-500"
                                        style={{ width: activeMetric === "avg" ? "75%" : "65%" }}></div>
                                </div>
                            </button>

                            {/* Metric 2 */}
                            <button
                                onClick={() => setActiveMetric("nodes")}
                                className={`w-full p-5 text-left rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 group ${
                                    activeMetric === "nodes"
                                        ? "bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                }`}>
                                <div>
                                    <div className="text-emerald-300/60 font-mono text-[10px] tracking-wider uppercase mb-1">
                                        Active Nodes
                                    </div>
                                    <div className="text-white text-2xl font-extrabold tracking-tight">
                                        124 Locations
                                    </div>
                                </div>
                                <div className="text-[10px] text-emerald-100/40">
                                    Continuous data streaming live
                                </div>
                            </button>

                            {/* Metric 3 */}
                            <button
                                onClick={() => setActiveMetric("gap")}
                                className={`w-full p-5 text-left rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 group ${
                                    activeMetric === "gap"
                                        ? "bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                }`}>
                                <div>
                                    <div className="text-emerald-300/60 font-mono text-[10px] tracking-wider uppercase mb-1">
                                        Compliance Variance
                                    </div>
                                    <div className="text-rose-400 text-2xl font-extrabold tracking-tight">
                                        12.4% Variance
                                    </div>
                                </div>
                                <div className="text-[10px] text-rose-300/60 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">warning</span>
                                    Exceeding default threshold
                                </div>
                            </button>

                            {/* Metric 4 */}
                            <button
                                onClick={() => setActiveMetric("sync")}
                                className={`w-full p-5 text-left rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 group ${
                                    activeMetric === "sync"
                                        ? "bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                }`}>
                                <div>
                                    <div className="text-emerald-300/60 font-mono text-[10px] tracking-wider uppercase mb-1">
                                        Last Sync Status
                                    </div>
                                    <div className="text-emerald-100 text-2xl font-extrabold tracking-tight">
                                        04:00 GMT
                                    </div>
                                </div>
                                <div className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                    Sync successful
                                </div>
                            </button>
                        </div>

                        {/* Visual Charts Area */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Stream Chart Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[320px]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-white font-bold text-lg">
                                        {chartData[activeMetric].title}
                                    </span>
                                    <span className="material-symbols-outlined text-emerald-400 opacity-60">
                                        bar_chart
                                    </span>
                                </div>

                                {/* Custom Animated Bar Chart */}
                                <div className="h-44 flex items-end justify-between gap-2.5 px-2 relative">
                                    {chartData[activeMetric].bars.map((heightVal, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-400/80 rounded-t-sm transition-all duration-500 group relative cursor-pointer"
                                            style={{ height: `${heightVal}%` }}>
                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-emerald-900 border border-emerald-500/20 text-white text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-xl">
                                                {heightVal}%
                                            </div>
                                            {/* Accent indicator bar */}
                                            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-400 rounded-full opacity-50 group-hover:opacity-100"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* X-Axis Labels */}
                                <div className="flex justify-between mt-4 text-[9px] font-mono text-emerald-100/40 uppercase tracking-wider">
                                    {chartData[activeMetric].times.map((time, idx) => (
                                        <span key={idx}>{time}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Asset Distribution progress bars */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[320px]">
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-white font-bold text-lg">Asset Distribution</span>
                                        <span className="material-symbols-outlined text-emerald-400 opacity-60">
                                            pie_chart
                                        </span>
                                    </div>

                                    {/* Progress Lines */}
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between font-mono text-[11px] mb-2 text-emerald-100/85">
                                                <span>STEEL PRODUCTION</span>
                                                <span className="font-bold text-emerald-400">64%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all duration-1000"
                                                    style={{ width: "64%" }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between font-mono text-[11px] mb-2 text-emerald-100/85">
                                                <span>ALUMINUM SMELTING</span>
                                                <span className="font-bold text-slate-300">22%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-slate-400 rounded-full transition-all duration-1000"
                                                    style={{ width: "22%" }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between font-mono text-[11px] mb-2 text-emerald-100/85">
                                                <span>ENERGY LOGISTICS</span>
                                                <span className="font-bold text-slate-400">14%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-slate-600 rounded-full transition-all duration-1000"
                                                    style={{ width: "14%" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-emerald-100/30 text-[9px] font-mono uppercase tracking-wider">
                                        Calculated with v2.4 Logic
                                    </span>
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-sm">verified</span>
                                        Fully Audited
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
