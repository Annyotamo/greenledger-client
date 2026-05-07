"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { LuCircleDollarSign, LuDatabase, LuFactory, LuFilter, LuLeaf, LuCalendarDays } from "react-icons/lu";
import { IoMdAlert } from "react-icons/io";
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
import { useScope1IngestedRecordsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { Scope1IngestRecord } from "@/types/report";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function getMonthLabel(value: string | null): string {
    if (!value) return "N/A";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year.slice(-2)}`;
}

function safe(v: unknown): string {
    if (v === null || v === undefined || String(v).trim() === "") return "-";
    return String(v);
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number | string; payload?: any }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-white/90 px-4 py-3 text-xs shadow-2xl ring-1 ring-emerald-900/10 backdrop-blur-xl"
        >
            {label ? <p className="mb-2 font-bold uppercase tracking-widest text-emerald-900/50">{label}</p> : null}
            <div className="space-y-2">
                {payload.map((p, i) => (
                    <div key={`${p.name ?? "metric"}-${i}`} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.payload?.fill || p.payload?.color || '#059669' }} />
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
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
        }
    }),
    hover: {
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" as const }
    }
};

export default function Scope1IngestedDataPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const { data, isLoading, isError } = useScope1IngestedRecordsQuery();

    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-06");
    const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">("all");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        setActiveSection("scope-1");
    }, [setActiveSection]);

    const records: Scope1IngestRecord[] = data ?? [];

    const filtered = useMemo(() => {
        const rangeFiltered = records.filter((row) => {
            const ym = row.yearMonth ?? "";
            if (!startMonth || !endMonth) return true;
            if (!ym) return false;
            return ym >= startMonth && ym <= endMonth;
        });

        if (statusFilter === "all") return rangeFiltered;
        if (statusFilter === "success") return rangeFiltered.filter((r) => (r.status ?? 0) >= 0);
        return rangeFiltered.filter((r) => (r.status ?? 0) < 0);
    }, [endMonth, records, startMonth, statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [filtered.length, statusFilter, startMonth, endMonth]);

    const totals = useMemo(() => {
        const totalQuantity = filtered.reduce((acc, row) => acc + (row.quantity ?? 0), 0);
        const totalCost = filtered.reduce((acc, row) => acc + (row.cost ?? 0), 0);
        const successCount = filtered.filter((r) => (r.status ?? 0) >= 0).length;
        const errorCount = filtered.filter((r) => (r.status ?? 0) < 0).length;
        return { totalQuantity, totalCost, successCount, errorCount };
    }, [filtered]);

    const statusChart = useMemo(
        () => [
            { name: "Success", value: totals.successCount, color: "#10b981" },
            { name: "Errors", value: totals.errorCount, color: "#ef4444" },
        ],
        [totals.errorCount, totals.successCount],
    );

    const fuelChart = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of filtered) {
            const key = row.fuelName ?? "Unknown";
            map.set(key, (map.get(key) ?? 0) + (row.quantity ?? 0));
        }
        return Array.from(map.entries())
            .map(([fuel, quantity]) => ({ fuel, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    }, [filtered]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageSafe = Math.min(Math.max(1, page), totalPages);
    const paged = useMemo(() => {
        const start = (pageSafe - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, pageSafe]);

    const rangeInvalid = Boolean(startMonth && endMonth && startMonth > endMonth);

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
                    "relative z-10 px-4 pb-12 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    sidebarOpen ? "lg:pl-80" : "lg:pl-28",
                    "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}>
                <div className="mx-auto max-w-7xl">
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-emerald-800 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Scope-1 Ingestion Pipeline
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Ingested Data Feed
                            </h1>
                            <p className="max-w-xl text-sm font-medium text-slate-500 sm:text-base">
                                Full ingestion feed with operational summaries and visibility into success and error logs.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/40 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <LuCalendarDays className="h-5 w-5 text-emerald-600" />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="month"
                                            value={startMonth}
                                            onChange={(e) => setStartMonth(e.target.value)}
                                            className="h-9 w-32 rounded-xl border-none bg-white/80 px-3 text-sm font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                        <span className="text-slate-400 font-medium text-sm">to</span>
                                        <input
                                            type="month"
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="h-9 w-32 rounded-xl border-none bg-white/80 px-3 text-sm font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="h-6 w-px bg-slate-300/50" />
                                <div className="flex items-center gap-2">
                                    <LuFilter className="h-5 w-5 text-slate-500" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as "all" | "success" | "error")}
                                        className="h-9 rounded-xl border-none bg-white/80 px-3 pr-8 text-sm font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50">
                                        <option value="all">All Status</option>
                                        <option value="success">Success Only</option>
                                        <option value="error">Errors Only</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    <AnimatePresence>
                        {rangeInvalid && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="rounded-2xl border border-red-200/50 bg-red-50/80 px-5 py-4 text-sm font-medium text-red-800 backdrop-blur-md">
                                    <span className="font-bold">Invalid Date Range:</span> End month must be later than or equal to start month.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 rounded-3xl bg-white/40 animate-pulse backdrop-blur-md" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="rounded-3xl border border-red-200/50 bg-red-50/80 p-8 text-center backdrop-blur-md">
                            <p className="text-lg font-semibold text-red-600">Failed to load ingested data. Please try again.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        label: "Ingested Rows",
                                        value: filtered.length.toString(),
                                        icon: <LuDatabase />,
                                    },
                                    {
                                        label: "Total Quantity",
                                        value: formatNumber(totals.totalQuantity),
                                        icon: <LuLeaf />,
                                    },
                                    {
                                        label: "Total Cost",
                                        value: `$${formatNumber(totals.totalCost)}`,
                                        icon: <LuCircleDollarSign />,
                                    },
                                    {
                                        label: "Error Rows",
                                        value: totals.errorCount.toString(),
                                        icon: <IoMdAlert className={totals.errorCount > 0 ? "text-red-100" : ""} />,
                                        errorMode: totals.errorCount > 0
                                    },
                                ].map((stat, idx) => (
                                    <motion.div
                                        custom={idx}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={cardVariants}
                                        key={stat.label}
                                        className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                    >
                                        <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-50 blur-2xl ${stat.errorMode ? 'bg-gradient-to-br from-red-100 to-orange-50' : 'bg-gradient-to-br from-emerald-100 to-teal-50'}`} />
                                        
                                        <div className="relative flex items-start justify-between">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg ${stat.errorMode ? 'bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/20' : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'}`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
                                                {stat.label}
                                            </p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <h3 className={`text-3xl font-black tracking-tight ${stat.errorMode ? 'text-red-600' : 'text-slate-800'}`}>
                                                    {stat.value}
                                                </h3>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Quantity By Fuel</h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">Volume of ingested inputs</p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <LuFilter className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="h-[290px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={fuelChart} layout="vertical" margin={{ left: 0, right: 20 }}>
                                                <defs>
                                                    <linearGradient id="emeraldGradientBarIn" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#059669" />
                                                        <stop offset="100%" stopColor="#10b981" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                                                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="fuel"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={140}
                                                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
                                                />
                                                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                                <Bar
                                                    dataKey="quantity"
                                                    name="Quantity"
                                                    fill="url(#emeraldGradientBarIn)"
                                                    radius={[0, 8, 8, 0]}
                                                    barSize={24}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Status Split</h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">Success vs Errors</p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <LuFactory className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="relative flex-1 min-h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Tooltip content={<ChartTooltip />} />
                                                <Pie
                                                    data={statusChart}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={95}
                                                    paddingAngle={4}
                                                    stroke="none"
                                                >
                                                    {statusChart.map((row) => (
                                                        <Cell key={row.name} fill={row.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {statusChart.map((row) => (
                                            <div key={row.name} className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 border border-white/40">
                                                <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                                                <div className="min-w-0">
                                                    <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
                                                        {row.name}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {formatNumber(row.value)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            </div>

                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-8 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                            >
                                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Ingested Records</h2>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Complete log of ingestion tasks</p>
                                    </div>
                                </div>
                                
                                <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                                    <div className="overflow-x-auto scrollbar-thin">
                                        <table className="min-w-[1650px] w-full text-left text-sm">
                                            <thead className="bg-slate-50/50">
                                                <tr className="border-b border-slate-200/60 text-[0.7rem] uppercase tracking-wider text-slate-500 font-bold">
                                                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Error Details</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Fuel Name</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Fuel Type</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Quantity</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Unit</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Cost</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Facility</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Org</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Email</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Year Month</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Year</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Created</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Updated</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">ID</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {paged.map((row) => {
                                                    const isErrorRow = (row.status ?? 0) < 0;
                                                    return (
                                                        <tr
                                                            key={row.id}
                                                            className={`transition-colors ${isErrorRow ? 'bg-red-50/40 hover:bg-red-50/80' : 'hover:bg-white/80'}`}
                                                        >
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                                                                        isErrorRow
                                                                            ? "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20"
                                                                            : "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                                    }`}>
                                                                    <div className={`h-1.5 w-1.5 rounded-full ${isErrorRow ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                                    {safe(row.status)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs font-semibold text-red-600">
                                                                {safe(row.errorMsg)}
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                                {safe(row.fuelName)}
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-600">{safe(row.fuelType)}</td>
                                                            <td className="px-4 py-3 font-semibold text-slate-700">{formatNumber(row.quantity ?? 0)}</td>
                                                            <td className="px-4 py-3 text-xs text-slate-500">{safe(row.unit)}</td>
                                                            <td className="px-4 py-3 text-slate-600">${formatNumber(row.cost ?? 0)}</td>
                                                            <td className="px-4 py-3 text-slate-600">{safe(row.facilityName)}</td>
                                                            <td className="px-4 py-3 text-slate-600">{safe(row.orgName)}</td>
                                                            <td className="px-4 py-3 text-xs text-slate-500">{safe(row.email)}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-700">{getMonthLabel(row.yearMonth)}</td>
                                                            <td className="px-4 py-3 text-slate-600">{safe(row.year)}</td>
                                                            <td className="px-4 py-3 text-xs text-slate-500">{safe(row.createDate)}</td>
                                                            <td className="px-4 py-3 text-xs text-slate-500">{safe(row.updateDate)}</td>
                                                            <td className="px-4 py-3 font-mono text-[0.65rem] text-slate-400">
                                                                {row.id}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {paged.length === 0 && (
                                                    <tr>
                                                        <td colSpan={15} className="px-4 py-8 text-center text-sm text-slate-500">
                                                            No ingested records found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs font-medium text-slate-500">
                                        Showing{" "}
                                        <span className="font-bold text-slate-800">
                                            {filtered.length ? (pageSafe - 1) * pageSize + 1 : 0}
                                        </span>
                                        {" - "}
                                        <span className="font-bold text-slate-800">
                                            {Math.min(pageSafe * pageSize, filtered.length)}
                                        </span>{" "}
                                        of <span className="font-bold text-slate-800">{filtered.length}</span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setPage(1)}
                                            disabled={pageSafe <= 1}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            First
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={pageSafe <= 1}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Prev
                                        </button>
                                        <span className="mx-2 text-xs font-bold text-slate-800">
                                            {pageSafe} / {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={pageSafe >= totalPages}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Next
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPage(totalPages)}
                                            disabled={pageSafe >= totalPages}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Last
                                        </button>
                                    </div>
                                </div>
                            </motion.section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
