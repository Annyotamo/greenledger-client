"use client";

import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
    Area,
    AreaChart,
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
import {
    LuActivity,
    LuBolt,
    LuBuilding2,
    LuCircleDollarSign,
    LuDownload,
    LuFactory,
    LuPlus,
    LuSparkles,
    LuX,
    LuCalendarDays,
} from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { downloadScope2ReportCsv } from "@/lib/report/api";
import { useIngestScope2EmissionMutation, useScope2ReportsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { Scope2IngestRequest } from "@/types/report";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatCO2e(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function getMonthLabel(value: string | null): string {
    if (!value) return "N/A";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year.slice(-2)}`;
}

function toTonne(value: number): number {
    return value / 1000;
}

type ChartTooltipPayload = Array<{ name?: string; value?: number | string; payload?: any }>;

function DashboardTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: ChartTooltipPayload;
    label?: string;
}) {
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
                                style={{ backgroundColor: p.payload?.fill || p.payload?.color || "#059669" }}
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

export default function Scope2Page() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const { data, isLoading, isError } = useScope2ReportsQuery();
    const ingestMutation = useIngestScope2EmissionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-06");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [form, setForm] = useState({
        quantityConsume: "",
        unit: "kWh",
        fuelName: "electricity",
        outputUnit: "MWh",
        cost: "",
        facilityName: "",
        orgName: "",
        yearMonth: "",
    });

    async function handleDownloadCsv() {
        if (!startMonth || !endMonth) {
            setDownloadError("Please select both start and end month.");
            return;
        }
        if (startMonth > endMonth) {
            setDownloadError("Start month must be earlier than or equal to end month.");
            return;
        }

        setDownloadError(null);
        setIsDownloading(true);

        try {
            const blob = await downloadScope2ReportCsv(startMonth, endMonth);
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `scope2-report-${startMonth}-to-${endMonth}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return;
                }
                const responseData = error.response?.data;
                const message =
                    responseData && typeof responseData === "object" && "response" in responseData
                        ? String(responseData.response)
                        : "Unable to download report CSV.";
                setDownloadError(message);
                return;
            }
            setDownloadError("Unable to download report CSV.");
        } finally {
            setIsDownloading(false);
        }
    }

    const records = data ?? [];
    const [recordsPage, setRecordsPage] = useState(1);
    const recordsPageSize = 10;

    useEffect(() => {
        setActiveSection("scope-2");
    }, [setActiveSection]);

    useEffect(() => {
        setRecordsPage(1);
    }, [records.length]);

    const recordsTotalPages = useMemo(() => Math.max(1, Math.ceil(records.length / recordsPageSize)), [records.length]);
    const recordsPageSafe = Math.min(Math.max(1, recordsPage), recordsTotalPages);
    const pagedRecords = useMemo(() => {
        const start = (recordsPageSafe - 1) * recordsPageSize;
        return records.slice(start, start + recordsPageSize);
    }, [records, recordsPageSafe]);

    const totals = useMemo(() => {
        const totalEmissions = records.reduce((acc, row) => acc + (row.co2eTotal ?? 0), 0);
        const totalCost = records.reduce((acc, row) => acc + (row.cost ?? 0), 0);
        const totalConsumed = records.reduce((acc, row) => acc + (row.quantityConsume ?? 0), 0);
        return { totalEmissions, totalCost, totalConsumed };
    }, [records]);

    const monthlySeries = useMemo(() => {
        const map = new Map<string, { emissions: number; cost: number }>();
        for (const row of records) {
            const month = row.yearMonth ?? "Unknown";
            const prev = map.get(month) ?? { emissions: 0, cost: 0 };
            map.set(month, { emissions: prev.emissions + (row.co2eTotal ?? 0), cost: prev.cost + (row.cost ?? 0) });
        }
        return Array.from(map.entries())
            .map(([month, v]) => ({
                month,
                monthLabel: getMonthLabel(month),
                emissions: toTonne(v.emissions),
                cost: v.cost,
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [records]);

    const facilitySeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const facility = row.facilityName ?? "Unknown facility";
            map.set(facility, (map.get(facility) ?? 0) + (row.co2eTotal ?? 0));
        }
        return Array.from(map.entries())
            .map(([facility, co2e]) => ({ facility, co2e: toTonne(co2e) }))
            .sort((a, b) => b.co2e - a.co2e);
    }, [records]);

    const sourceSeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const source = row.scope2Factor?.factorSource ?? "Unknown";
            map.set(source, (map.get(source) ?? 0) + (row.co2eTotal ?? 0));
        }
        const palette = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
        return Array.from(map.entries())
            .map(([source, co2e], idx) => ({ source, co2e: toTonne(co2e), color: palette[idx % palette.length] }))
            .sort((a, b) => b.co2e - a.co2e);
    }, [records]);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);
        try {
            const payload: Scope2IngestRequest = {
                quantityConsume: Number(form.quantityConsume || 0),
                unit: form.unit,
                fuelName: form.fuelName,
                outputUnit: form.outputUnit,
                cost: Number(form.cost || 0),
                facilityName: form.facilityName,
                orgName: form.orgName,
                yearMonth: form.yearMonth,
                year: form.yearMonth.split("-")[0],
            };
            await ingestMutation.mutateAsync(payload);
            setSubmitSuccess("Scope-2 emission record added successfully.");
            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return;
                }
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add Scope-2 emission record.");
                return;
            }
            setSubmitError("Failed to add Scope-2 emission record.");
        }
    }

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
                            className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-emerald-800 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Scope-2 Analytics
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Indirect Emissions
                            </h1>
                            <p className="max-w-xl text-sm font-medium text-slate-500 sm:text-base">
                                Analytics and comprehensive reporting for purchased energy and electricity.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitError(null);
                                    setSubmitSuccess(null);
                                    setForm({
                                        quantityConsume: "",
                                        unit: "kWh",
                                        fuelName: "electricity",
                                        outputUnit: "MWh",
                                        cost: "",
                                        facilityName: "",
                                        orgName: "",
                                        yearMonth: "",
                                    });
                                    setIsModalOpen(true);
                                }}
                                className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40">
                                <LuPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                                Add Emission Data
                            </button>
                        </motion.div>
                    </header>

                    <AnimatePresence>
                        {submitSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden">
                                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/80 px-5 py-4 text-sm font-medium text-emerald-800 backdrop-blur-md">
                                    <span className="font-bold">Success:</span> {submitSuccess}
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
                            <p className="text-lg font-semibold text-red-600">
                                Failed to load Scope-2 report data. Please try again.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        label: "Total Emissions",
                                        value: `${formatNumber(toTonne(totals.totalEmissions))}`,
                                        unit: "tCO₂e",
                                        icon: <LuBolt />,
                                    },
                                    {
                                        label: "Total Records",
                                        value: records.length.toString(),
                                        unit: "Entries",
                                        icon: <LuFactory />,
                                    },
                                    {
                                        label: "Total Cost",
                                        value: `${formatNumber(totals.totalCost)}`,
                                        unit: "",
                                        icon: <LuCircleDollarSign />,
                                    },
                                    {
                                        label: "Energy Consumed",
                                        value: formatNumber(totals.totalConsumed),
                                        unit: "MWh",
                                        icon: <LuActivity />,
                                    },
                                ].map((stat, idx) => (
                                    <motion.div
                                        custom={idx}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={cardVariants}
                                        key={stat.label}
                                        className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-2xl" />

                                        <div className="relative flex items-start justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                {stat.icon}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
                                                {stat.label}
                                            </p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
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

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-8 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Scope-2 Report Records</h2>
                                        <p className="text-xs font-medium text-slate-500 mt-1">
                                            Detailed view of indirect emissions data
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-1.5 border border-white/40">
                                            <LuCalendarDays className="h-4 w-4 text-emerald-600" />
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="month"
                                                    value={startMonth}
                                                    onChange={(e) => setStartMonth(e.target.value)}
                                                    className="h-8 w-32 rounded-lg border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                                />
                                                <span className="text-slate-400 font-medium text-xs">to</span>
                                                <input
                                                    type="month"
                                                    value={endMonth}
                                                    onChange={(e) => setEndMonth(e.target.value)}
                                                    className="h-8 w-32 rounded-lg border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleDownloadCsv}
                                            disabled={isDownloading}
                                            className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-bold text-white shadow-md transition hover:bg-slate-700 disabled:opacity-50">
                                            <LuDownload className="h-4 w-4" />
                                            {isDownloading ? "Downloading..." : "Download CSV"}
                                        </button>
                                    </div>
                                </div>
                                {downloadError && (
                                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                        {downloadError}
                                    </div>
                                )}

                                <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                                    <div className="overflow-x-auto scrollbar-thin">
                                        <table className="min-w-[1020px] w-full text-left text-sm">
                                            <thead className="bg-slate-50/50">
                                                <tr className="border-b border-slate-200/60 text-[0.7rem] uppercase tracking-wider text-slate-500 font-bold">
                                                    <th className="px-4 py-3 whitespace-nowrap">Facility</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Org</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Fuel</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Year Month</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Consumption</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Unit</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">Output Unit</th>
                                                    <th className="px-4 py-3 whitespace-nowrap">tCO₂e</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {pagedRecords.map((row, idx) => (
                                                    <tr
                                                        key={`${row.ingest_reference_id ?? "r"}-${idx}`}
                                                        className="transition-colors hover:bg-white/80">
                                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                                {row.facilityName ?? "Unmapped"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            {row.orgName ?? "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600 font-medium">
                                                            {row.fuelName ?? "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            {row.yearMonth ?? "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            {formatNumber(row.quantityConsume ?? 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                                            {row.unit ?? "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                                            {row.outputUnit ?? "-"}
                                                        </td>
                                                        <td className="px-4 py-3 font-bold text-emerald-600">
                                                            {formatCO2e(toTonne(row.co2eTotal ?? 0))}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {pagedRecords.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={8}
                                                            className="px-4 py-8 text-center text-sm text-slate-500">
                                                            No reporting records found for this period.
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
                                            {records.length ? (recordsPageSafe - 1) * recordsPageSize + 1 : 0}
                                        </span>
                                        {" - "}
                                        <span className="font-bold text-slate-800">
                                            {Math.min(recordsPageSafe * recordsPageSize, records.length)}
                                        </span>{" "}
                                        of <span className="font-bold text-slate-800">{records.length}</span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage(1)}
                                            disabled={recordsPageSafe <= 1}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            First
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage((p) => Math.max(1, p - 1))}
                                            disabled={recordsPageSafe <= 1}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Prev
                                        </button>
                                        <span className="mx-2 text-xs font-bold text-slate-800">
                                            {recordsPageSafe} / {recordsTotalPages}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage((p) => Math.min(recordsTotalPages, p + 1))}
                                            disabled={recordsPageSafe >= recordsTotalPages}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Next
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage(recordsTotalPages)}
                                            disabled={recordsPageSafe >= recordsTotalPages}
                                            className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40">
                                            Last
                                        </button>
                                    </div>
                                </div>
                            </motion.section>

                            <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">
                                                Monthly Emissions Trend
                                            </h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">
                                                Aggregated tracking over time
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-emerald-100/50 px-3 py-1 border border-emerald-200/50 text-xs font-bold text-emerald-700">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            Live
                                        </div>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={monthlySeries}
                                                margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="scope2-a" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="rgba(0,0,0,0.05)"
                                                />
                                                <XAxis
                                                    dataKey="monthLabel"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                                                />
                                                <Tooltip
                                                    content={<DashboardTooltip />}
                                                    cursor={{ stroke: "rgba(16,185,129,0.2)", strokeWidth: 2 }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="emissions"
                                                    name="tCO₂e"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fill="url(#scope2-a)"
                                                    isAnimationActive
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="flex flex-col rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Emissions By Source</h2>
                                            <p className="text-xs font-medium text-slate-500 mt-1">
                                                Total distribution
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <LuFactory className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="relative flex-1 min-h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Pie
                                                    data={sourceSeries}
                                                    dataKey="co2e"
                                                    nameKey="source"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={95}
                                                    paddingAngle={4}
                                                    stroke="none">
                                                    {sourceSeries.map((row) => (
                                                        <Cell key={row.source} fill={row.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {sourceSeries.slice(0, 4).map((row) => (
                                            <div
                                                key={row.source}
                                                className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 border border-white/40">
                                                <div
                                                    className="h-3 w-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: row.color }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
                                                        {row.source}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {formatNumber(row.co2e)}
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
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mt-8 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Facility Distribution</h2>
                                        <p className="text-xs font-medium text-slate-500 mt-1">
                                            Emissions mapped by location
                                        </p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                        <LuBuilding2 className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={facilitySeries}
                                            layout="vertical"
                                            margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="emeraldGradientBar" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#059669" />
                                                    <stop offset="100%" stopColor="#10b981" />
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
                                                dataKey="facility"
                                                type="category"
                                                tickLine={false}
                                                axisLine={false}
                                                width={100}
                                                tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
                                            />
                                            <Tooltip
                                                content={<DashboardTooltip />}
                                                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                                            />
                                            <Bar
                                                dataKey="co2e"
                                                name="tCO₂e"
                                                fill="url(#emeraldGradientBar)"
                                                radius={[0, 8, 8, 0]}
                                                barSize={24}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.section>
                        </>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center sm:p-6">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8 scrollbar-thin">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-100">
                                        <LuSparkles className="h-3.5 w-3.5" />
                                        Manual Ingestion
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
                                        Add New Scope-2 Record
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Enter activity details to directly ingest indirect emissions data.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700">
                                    <LuX className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                                <Field label="Quantity">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.quantityConsume}
                                        onChange={(e) => setForm((p) => ({ ...p, quantityConsume: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Unit">
                                    <select
                                        value={form.unit}
                                        onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                                        className={inputClass}>
                                        <option value="kWh">kWh</option>
                                        <option value="MWh">MWh</option>
                                    </select>
                                </Field>
                                <Field label="Energy Source">
                                    <input
                                        value={form.fuelName}
                                        onChange={(e) => setForm((p) => ({ ...p, fuelName: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Output unit">
                                    <input
                                        value={form.outputUnit}
                                        onChange={(e) => setForm((p) => ({ ...p, outputUnit: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Cost">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.cost}
                                        onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Facility">
                                    <input
                                        value={form.facilityName}
                                        onChange={(e) => setForm((p) => ({ ...p, facilityName: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Organization">
                                    <input
                                        value={form.orgName}
                                        onChange={(e) => setForm((p) => ({ ...p, orgName: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Year Month">
                                    <input
                                        type="month"
                                        value={form.yearMonth}
                                        onChange={(e) => setForm((p) => ({ ...p, yearMonth: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>

                                {submitError && (
                                    <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                        {submitError}
                                    </p>
                                )}

                                <div className="sm:col-span-2 mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-11 rounded-xl px-6 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={ingestMutation.isPending}
                                        className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                        {ingestMutation.isPending ? "Saving..." : "Save Record"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            {children}
        </label>
    );
}
