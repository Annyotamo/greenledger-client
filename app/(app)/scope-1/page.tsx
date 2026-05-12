"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
    LuActivity,
    LuBuilding2,
    LuCircleDollarSign,
    LuFlame,
    LuFuel,
    LuLeaf,
    LuTrendingUp,
    LuCalendarDays,
} from "react-icons/lu";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useScope1DashboardQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatTonnesFromKg(value: number): string {
    return (value / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function truncateLabel(value: string, max = 20): string {
    if (value.length <= max) return value;
    return `${value.slice(0, max - 1)}…`;
}

type ChartTooltipPayload = Array<{ name?: string; value?: number | string; payload?: any }>;

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: ChartTooltipPayload; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-white/90 px-4 py-3 text-xs shadow-2xl ring-1 ring-emerald-900/10 backdrop-blur-xl">
            {label ? <p className="mb-2 font-bold uppercase tracking-widest text-emerald-900/50">{label}</p> : null}
            <div className="space-y-2">
                {payload.map((p, i) => (
                    <div key={`${p.name ?? "metric"}-${i}`} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: p.payload?.color || "#059669" }}
                            />
                            <span className="font-medium text-slate-600">{p.name}</span>
                        </div>
                        <span className="font-bold text-emerald-950">
                            {typeof p.value === "number" ? formatNumber(p.value) : (p.value ?? "-")}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    }),
    hover: {
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" as const },
    },
};

export default function Scope1DashboardPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-06");

    const rangeValid = Boolean(startMonth && endMonth && startMonth <= endMonth);

    const { data, isLoading, isError } = useScope1DashboardQuery(startMonth, endMonth, rangeValid);

    useEffect(() => {
        setActiveSection("scope-1");
    }, [setActiveSection]);

    const total = data?.total_emission ?? { co2e: 0, cost: 0, current_totalCo2: 0 };
    const currentMonth = data?.current_month_total_emission ?? { co2e: 0, cost: 0, current_totalCo2: 0 };
    const fuelSummary = data?.fuel_summary ?? [];
    const facilitySummary = data?.facility_summary ?? [];

    const fuelChartData = useMemo(() => {
        const palette = [
            "url(#emeraldGradient1)",
            "url(#emeraldGradient2)",
            "url(#emeraldGradient3)",
            "url(#emeraldGradient4)",
            "url(#emeraldGradient5)",
        ];
        return [...fuelSummary]
            .sort((a, b) => (b.total_co2e ?? 0) - (a.total_co2e ?? 0))
            .slice(0, 10)
            .map((row, i) => ({
                fuel: row.fuel,
                fuelLabel: truncateLabel(row.fuel, 24),
                co2e: row.total_co2e,
                color: palette[i % palette.length],
                rawColor: i % 2 === 0 ? "#10b981" : "#34d399",
            }));
    }, [fuelSummary]);

    const facilityChartData = useMemo(() => {
        const palette = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
        const grandTotal = facilitySummary.reduce((acc, row) => acc + (row.total_co2e ?? 0), 0) || 1;
        return facilitySummary.map((row, i) => ({
            facility: row.facility,
            co2e: row.total_co2e,
            cost: row.total_cost,
            share: (row.total_co2e / grandTotal) * 100,
            color: palette[i % palette.length],
        }));
    }, [facilitySummary]);

    const avgCostPerTonne = total.co2e > 0 ? (total.cost / total.co2e) * 1000 : 0;

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900 bg-slate-50/50">
            {/* Dynamic Background Elements */}
            <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px] gl-drift" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-300/20 blur-[150px] gl-drift-2" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-green-400/10 blur-[100px] gl-spin-slow" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-4 pb-12 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto max-w-7xl">
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-emerald-800 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Scope-1 Analytics
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Scope One Dashboard
                            </h1>
                            <p className="max-w-xl text-sm font-medium text-slate-500 sm:text-base">
                                Real-time monitoring of fuel consumption and facility emissions. Adjust your reporting
                                period below to filter data.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/40 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                            <div className="flex items-center gap-2 px-3 py-2">
                                <LuCalendarDays className="h-5 w-5 text-emerald-600" />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="month"
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(e.target.value)}
                                        className="h-9 w-36 rounded-xl border-none bg-white/80 px-3 text-sm font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                    <span className="text-slate-400 font-medium">to</span>
                                    <input
                                        type="month"
                                        value={endMonth}
                                        onChange={(e) => setEndMonth(e.target.value)}
                                        className="h-9 w-36 rounded-xl border-none bg-white/80 px-3 text-sm font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    <AnimatePresence>
                        {!rangeValid && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden">
                                <div className="rounded-2xl border border-amber-200/50 bg-amber-50/80 px-5 py-4 text-sm font-medium text-amber-800 backdrop-blur-md">
                                    <span className="font-bold">Invalid Date Range:</span> End month must be the same as
                                    or later than start month.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-32 rounded-3xl bg-white/40 animate-pulse backdrop-blur-md" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="rounded-3xl border border-red-200/50 bg-red-50/80 p-8 text-center backdrop-blur-md">
                            <p className="text-lg font-semibold text-red-600">
                                Failed to load dashboard data. Please try again.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        label: "Total Emissions",
                                        value: `${formatTonnesFromKg(total.co2e)}`,
                                        unit: "tCO₂e",
                                        icon: <LuLeaf />,
                                        trend: "+2.4%",
                                        trendUp: false,
                                    },
                                    {
                                        label: "Total Cost",
                                        value: formatNumber(total.cost),
                                        unit: "",
                                        icon: <LuCircleDollarSign />,
                                        trend: "-1.2%",
                                        trendUp: true,
                                    },
                                    {
                                        label: "Monthly Emissions",
                                        value: `${formatTonnesFromKg(currentMonth.co2e)}`,
                                        unit: "tCO₂e",
                                        icon: <LuTrendingUp />,
                                        trend: "+5.1%",
                                        trendUp: false,
                                    },
                                    {
                                        label: "Fuel Categories",
                                        value: fuelSummary.length.toString(),
                                        unit: "Sources",
                                        icon: <LuFuel />,
                                    },
                                ].map((stat, idx) => (
                                    <motion.div
                                        custom={idx}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={cardVariants}
                                        key={stat.label}
                                        className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-2xl" />

                                        <div className="relative flex items-start justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                {stat.icon}
                                            </div>
                                            {stat.trend && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-[0.65rem] font-bold ${stat.trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                                    {stat.trend}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
                                                {stat.label}
                                            </p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                                    {stat.value}
                                                </h3>
                                                {stat.unit && (
                                                    <span className="text-sm font-semibold text-slate-500">
                                                        {stat.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr]">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="rounded-2xl border border-white/60 bg-white/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">
                                                Fuel Emissions Breakdown
                                            </h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">
                                                Top emission sources by fuel type
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <LuActivity className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={fuelChartData}
                                                layout="vertical"
                                                margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="emeraldGradient1" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#059669" />
                                                        <stop offset="100%" stopColor="#10b981" />
                                                    </linearGradient>
                                                    <linearGradient id="emeraldGradient2" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#047857" />
                                                        <stop offset="100%" stopColor="#059669" />
                                                    </linearGradient>
                                                    <linearGradient id="emeraldGradient3" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#0f766e" />
                                                        <stop offset="100%" stopColor="#0d9488" />
                                                    </linearGradient>
                                                    <linearGradient id="emeraldGradient4" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#065f46" />
                                                        <stop offset="100%" stopColor="#047857" />
                                                    </linearGradient>
                                                    <linearGradient id="emeraldGradient5" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#115e59" />
                                                        <stop offset="100%" stopColor="#0f766e" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    horizontal={false}
                                                    stroke="rgba(0,0,0,0.05)"
                                                />
                                                <XAxis
                                                    type="number"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="fuelLabel"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={150}
                                                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
                                                />
                                                <Tooltip
                                                    content={<ChartTooltip />}
                                                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                                                />
                                                <Bar dataKey="co2e" name="CO₂e (kg)" radius={[0, 8, 8, 0]} barSize={24}>
                                                    {fuelChartData.map((row) => (
                                                        <Cell key={row.fuel} fill={row.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col rounded-2xl border border-white/60 bg-white/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Facility Contribution</h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">
                                                Distribution across locations
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <LuBuilding2 className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="relative flex-1 min-h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Tooltip content={<ChartTooltip />} />
                                                <Pie
                                                    data={facilityChartData}
                                                    dataKey="co2e"
                                                    nameKey="facility"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={95}
                                                    paddingAngle={4}
                                                    stroke="none">
                                                    {facilityChartData.map((row) => (
                                                        <Cell key={row.facility} fill={row.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Center Label */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-black text-slate-800">
                                                {facilitySummary.length}
                                            </span>
                                            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                                                Facilities
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {facilityChartData.slice(0, 4).map((row, i) => (
                                            <div
                                                key={row.facility}
                                                className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 border border-white/40">
                                                <div
                                                    className="h-3 w-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: row.color }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
                                                        {row.facility}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {formatTonnesFromKg(row.co2e)}{" "}
                                                        <span className="text-[0.65rem] font-medium text-slate-400">
                                                            tCO₂e
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-8 rounded-2xl border border-white/60 bg-white/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="mb-6 flex items-center justify-between border-b border-slate-200/50 pb-4">
                                    <h2 className="text-lg font-bold text-slate-800">Detailed Facility Performance</h2>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {facilityChartData.map((row) => (
                                        <div
                                            key={row.facility}
                                            className="group relative overflow-hidden rounded-2xl bg-white/60 p-5 border border-white/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1">
                                            <div className="absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-emerald-500/10 blur-xl transition-all group-hover:bg-emerald-500/20" />

                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-600">
                                                    {row.facility}
                                                </p>
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[0.6rem] font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                                                    {Math.round(row.share)}%
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-end gap-1.5">
                                                    <span className="text-xl font-bold text-slate-800">
                                                        {formatTonnesFromKg(row.co2e)}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500 mb-1">
                                                        tCO₂e
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                                    <LuCircleDollarSign className="h-4 w-4 text-emerald-500/70" />
                                                    {formatNumber(row.cost)} total cost
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                                    style={{ width: `${Math.max(5, row.share)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {!facilityChartData.length && (
                                        <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/40 p-8 text-center">
                                            <p className="text-sm font-semibold text-slate-500">
                                                No facility data available for the selected time range.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
