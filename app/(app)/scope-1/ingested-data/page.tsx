"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
    LuCircleDollarSign,
    LuDatabase,
    LuFactory,
    LuFilter,
    LuLeaf,
    LuCalendarDays,
} from "react-icons/lu";
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
    return value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
}

function getMonthLabel(value: string | null): string {
    if (!value) return "N/A";

    const [year, month] = value.split("-");

    if (!year || !month) return value;

    return `${month}/${year.slice(-2)}`;
}

function safe(v: unknown): string {
    if (v === null || v === undefined || String(v).trim() === "") {
        return "-";
    }

    return String(v);
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{
        name?: string;
        value?: number | string;
        payload?: any;
    }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-white/90 px-3 py-2 text-[11px] shadow-2xl ring-1 ring-emerald-900/10 backdrop-blur-xl"
        >
            {label ? (
                <p className="mb-1 font-bold uppercase tracking-widest text-emerald-900/50">
                    {label}
                </p>
            ) : null}

            <div className="space-y-1.5">
                {payload.map((p, i) => (
                    <div
                        key={`${p.name ?? "metric"}-${i}`}
                        className="flex items-center justify-between gap-5"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                    backgroundColor:
                                        p.payload?.fill ||
                                        p.payload?.color ||
                                        "#059669",
                                }}
                            />

                            <span className="font-medium text-slate-600">
                                {p.name}
                            </span>
                        </div>

                        <span className="font-bold text-emerald-950">
                            {typeof p.value === "number"
                                ? formatNumber(p.value)
                                : p.value ?? "-"}
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
            ease: [0.22, 1, 0.36, 1] as [
                number,
                number,
                number,
                number,
            ],
        },
    }),

    hover: {
        y: -3,
        scale: 1.01,
        transition: {
            duration: 0.2,
            ease: "easeOut" as const,
        },
    },
};

export default function Scope1IngestedDataPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);

    const setActiveSection = useSidebarStore(
        (s) => s.setActiveSection
    );

    const { data, isLoading, isError } =
        useScope1IngestedRecordsQuery();

    const [startMonth, setStartMonth] =
        useState("2026-01");

    const [endMonth, setEndMonth] =
        useState("2026-06");

    const [statusFilter, setStatusFilter] = useState<
        "all" | "success" | "error"
    >("all");

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

        if (statusFilter === "all") {
            return rangeFiltered;
        }

        if (statusFilter === "success") {
            return rangeFiltered.filter(
                (r) => (r.status ?? 0) >= 0
            );
        }

        return rangeFiltered.filter(
            (r) => (r.status ?? 0) < 0
        );
    }, [
        endMonth,
        records,
        startMonth,
        statusFilter,
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        filtered.length,
        statusFilter,
        startMonth,
        endMonth,
    ]);

    const totals = useMemo(() => {
        const totalQuantity = filtered.reduce(
            (acc, row) => acc + (row.quantity ?? 0),
            0
        );

        const totalCost = filtered.reduce(
            (acc, row) => acc + (row.cost ?? 0),
            0
        );

        const successCount = filtered.filter(
            (r) => (r.status ?? 0) >= 0
        ).length;

        const errorCount = filtered.filter(
            (r) => (r.status ?? 0) < 0
        ).length;

        return {
            totalQuantity,
            totalCost,
            successCount,
            errorCount,
        };
    }, [filtered]);

    const statusChart = useMemo(
        () => [
            {
                name: "Success",
                value: totals.successCount,
                color: "#10b981",
            },
            {
                name: "Errors",
                value: totals.errorCount,
                color: "#ef4444",
            },
        ],
        [totals.errorCount, totals.successCount]
    );

    const fuelChart = useMemo(() => {
        const map = new Map<string, number>();

        for (const row of filtered) {
            const key = row.fuelName ?? "Unknown";

            map.set(
                key,
                (map.get(key) ?? 0) + (row.quantity ?? 0)
            );
        }

        return Array.from(map.entries())
            .map(([fuel, quantity]) => ({
                fuel,
                quantity,
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    }, [filtered]);

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
    );

    const pageSafe = Math.min(
        Math.max(1, page),
        totalPages
    );

    const paged = useMemo(() => {
        const start = (pageSafe - 1) * pageSize;

        return filtered.slice(start, start + pageSize);
    }, [filtered, pageSafe]);

    const rangeInvalid = Boolean(
        startMonth &&
            endMonth &&
            startMonth > endMonth
    );

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50/50 text-slate-900">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-400/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-300/20 blur-[150px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "relative z-10 px-3 pb-8 pt-16 sm:px-4 lg:pr-8 lg:pt-8",
                    sidebarOpen
                        ? "lg:pl-80"
                        : "lg:pl-28",
                    "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}
            >
                <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
                    {/* Header */}
                    <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.5,
                            }}
                            className="space-y-3"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>

                                Scope-1 Ingestion Pipeline
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                Ingested Data Feed
                            </h1>

                            <p className="max-w-lg text-xs font-medium text-slate-500 sm:text-sm">
                                Full ingestion feed with
                                operational summaries and
                                visibility into success and
                                error logs.
                            </p>
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1,
                            }}
                            className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-white/40 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:w-auto"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <LuCalendarDays className="h-4 w-4 text-emerald-600" />

                                    <input
                                        type="month"
                                        value={startMonth}
                                        onChange={(e) =>
                                            setStartMonth(
                                                e.target.value
                                            )
                                        }
                                        className="h-8 w-28 rounded-xl border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50 lg:w-32"
                                    />

                                    <span className="text-xs font-medium text-slate-400">
                                        to
                                    </span>

                                    <input
                                        type="month"
                                        value={endMonth}
                                        onChange={(e) =>
                                            setEndMonth(
                                                e.target.value
                                            )
                                        }
                                        className="h-8 w-28 rounded-xl border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50 lg:w-32"
                                    />
                                </div>

                                <div className="hidden h-5 w-px bg-slate-300/50 md:block" />

                                <div className="flex items-center gap-2">
                                    <LuFilter className="h-4 w-4 text-slate-500" />

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target
                                                    .value as
                                                    | "all"
                                                    | "success"
                                                    | "error"
                                            )
                                        }
                                        className="h-8 rounded-xl border-none bg-white/80 px-2 pr-7 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="all">
                                            All Status
                                        </option>

                                        <option value="success">
                                            Success Only
                                        </option>

                                        <option value="error">
                                            Errors Only
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    <AnimatePresence>
                        {rangeInvalid && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                className="mb-5 overflow-hidden"
                            >
                                <div className="rounded-2xl border border-red-200/50 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-800 backdrop-blur-md">
                                    End month must be later
                                    than or equal to start
                                    month.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-28 animate-pulse rounded-2xl bg-white/40 backdrop-blur-md"
                                />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-6 text-center backdrop-blur-md">
                            <p className="text-sm font-semibold text-red-600">
                                Failed to load ingested
                                data.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stats */}
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        label:
                                            "Ingested Rows",
                                        value:
                                            filtered.length.toString(),
                                        icon: (
                                            <LuDatabase />
                                        ),
                                    },
                                    {
                                        label:
                                            "Total Quantity",
                                        value:
                                            formatNumber(
                                                totals.totalQuantity
                                            ),
                                        icon: <LuLeaf />,
                                    },
                                    {
                                        label:
                                            "Total Cost",
                                        value:
                                            formatNumber(
                                                totals.totalCost
                                            ),
                                        icon: (
                                            <LuCircleDollarSign />
                                        ),
                                    },
                                    {
                                        label:
                                            "Error Rows",
                                        value:
                                            totals.errorCount.toString(),
                                        icon: (
                                            <IoMdAlert />
                                        ),
                                        errorMode:
                                            totals.errorCount >
                                            0,
                                    },
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={idx}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={
                                            cardVariants
                                        }
                                        className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                    >
                                        <div
                                            className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-50 blur-2xl ${
                                                stat.errorMode
                                                    ? "bg-gradient-to-br from-red-100 to-orange-50"
                                                    : "bg-gradient-to-br from-emerald-100 to-teal-50"
                                            }`}
                                        />

                                        <div className="relative flex items-start justify-between">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm text-white shadow-lg ${
                                                    stat.errorMode
                                                        ? "bg-gradient-to-br from-red-500 to-orange-600"
                                                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                                }`}
                                            >
                                                {stat.icon}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">
                                                {stat.label}
                                            </p>

                                            <h3
                                                className={`mt-1 text-2xl font-bold text-slate-800 tracking-tight ${
                                                    stat.errorMode
                                                        ? "text-red-600"
                                                        : "text-slate-800"
                                                }`}
                                            >
                                                {stat.value} {stat.label == "Total Quantity" && <span className="text-sm font-semibold text-slate-500">tCO2e</span>}


                                            </h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                             {/* Table */}
                            <motion.section
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.5,
                                }}
                                className="mt-5 rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                            >
                                <div className="mb-4 border-b border-slate-200/50 pb-3">
                                    <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                        Ingested Records
                                    </h2>

                                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                                        Complete log of
                                        ingestion tasks
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-[720px] w-full text-left text-xs lg:min-w-[720px]">
                                            <thead className="bg-slate-50/50">
    <tr className="border-b border-slate-200/60 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {[
            "Fuel Name",
            "Quantity",
            "Unit",
            "Cost",
            "Facility",
            "Org",
            "Email",
            "Year Month",
        ].map((item) => (
            <th
                key={item}
                className="whitespace-nowrap px-5 py-2.5"
            >
                {item}
            </th>
        ))}
    </tr>
</thead>

    <tbody className="divide-y divide-slate-100">
    {paged.map((row) => {
        return (
            <tr
                key={row.id}
                className="transition-colors hover:bg-white/80"
            >
                <td className="px-5 py-2.5">
    <div className="flex flex-col">
        <span className="font-bold text-slate-800">
            {safe(row.fuelName)}
        </span>

        <div className="mt-1 inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-1 py-[3px]">
            <span className="text-[8px] font-semibold uppercase tracking-wide text-emerald-700">
                {safe(row.fuelType)}
            </span>
        </div>
    </div>
</td>

                <td className="px-3 py-2.5 font-semibold text-slate-700">
                    {formatNumber(row.quantity ?? 0)}
                </td>

                <td className="px-3 py-2.5 text-slate-500">
                    {safe(row.unit)}
                </td>

                <td className="px-3 py-2.5 text-slate-600">
                    {formatNumber(row.cost ?? 0)}
                </td>

                <td className="px-3 py-2.5 text-slate-600">
                    {safe(row.facilityName)}
                </td>

                <td className="px-3 py-2.5 text-slate-600">
                    {safe(row.orgName)}
                </td>

                <td className="px-3 py-2.5 text-[11px] text-slate-500">
                    {safe(row.email)}
                </td>

                <td className="px-3 py-2.5 font-medium text-slate-700">
                    {getMonthLabel(row.yearMonth)}
                </td>
            </tr>
        );
    })}

    {paged.length === 0 && (
        <tr>
            <td
                colSpan={9}
                className="px-4 py-8 text-center text-sm text-slate-500"
            >
                No ingested records found.
            </td>
        </tr>
    )}
</tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs font-medium text-slate-500">
                                        Showing{" "}
                                        <span className="font-bold text-slate-800">
                                            {filtered.length
                                                ? (pageSafe -
                                                      1) *
                                                      pageSize +
                                                  1
                                                : 0}
                                        </span>
                                        {" - "}
                                        <span className="font-bold text-slate-800">
                                            {Math.min(
                                                pageSafe *
                                                    pageSize,
                                                filtered.length
                                            )}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-slate-800">
                                            {
                                                filtered.length
                                            }
                                        </span>
                                    </p>

                                    <div className="flex items-center gap-1">
                                        {[
                                            {
                                                label:
                                                    "First",
                                                action: () =>
                                                    setPage(
                                                        1
                                                    ),
                                                disabled:
                                                    pageSafe <=
                                                    1,
                                            },
                                            {
                                                label:
                                                    "Prev",
                                                action: () =>
                                                    setPage(
                                                        (
                                                            p
                                                        ) =>
                                                            Math.max(
                                                                1,
                                                                p -
                                                                    1
                                                            )
                                                    ),
                                                disabled:
                                                    pageSafe <=
                                                    1,
                                            },
                                            {
                                                label:
                                                    "Next",
                                                action: () =>
                                                    setPage(
                                                        (
                                                            p
                                                        ) =>
                                                            Math.min(
                                                                totalPages,
                                                                p +
                                                                    1
                                                            )
                                                    ),
                                                disabled:
                                                    pageSafe >=
                                                    totalPages,
                                            },
                                            {
                                                label:
                                                    "Last",
                                                action: () =>
                                                    setPage(
                                                        totalPages
                                                    ),
                                                disabled:
                                                    pageSafe >=
                                                    totalPages,
                                            },
                                        ].map(
                                            (
                                                btn
                                            ) => (
                                                <button
                                                    key={
                                                        btn.label
                                                    }
                                                    type="button"
                                                    onClick={
                                                        btn.action
                                                    }
                                                    disabled={
                                                        btn.disabled
                                                    }
                                                    className="h-8 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40"
                                                >
                                                    {
                                                        btn.label
                                                    }
                                                </button>
                                            )
                                        )}

                                        <span className="mx-2 text-xs font-bold text-slate-800">
                                            {pageSafe} /{" "}
                                            {totalPages}
                                        </span>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Charts */}
                            <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
                                {/* Bar Chart */}
                                <motion.section
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                    }}
                                    className="rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                                Quantity By Fuel
                                            </h2>

                                            <p className="mt-1 text-[11px] font-medium text-slate-500">
                                                Volume of
                                                ingested inputs
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-[220px] w-full sm:h-[250px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={
                                                    fuelChart
                                                }
                                                layout="vertical"
                                                margin={{
                                                    left: 0,
                                                    right: 20,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="emeraldGradientBarIn"
                                                        x1="0"
                                                        y1="0"
                                                        x2="1"
                                                        y2="0"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#059669"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#10b981"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    horizontal={
                                                        false
                                                    }
                                                    stroke="rgba(0,0,0,0.05)"
                                                />

                                                <XAxis
                                                    type="number"
                                                    tickLine={
                                                        false
                                                    }
                                                    axisLine={
                                                        false
                                                    }
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#64748b",
                                                    }}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey="fuel"
                                                    tickLine={
                                                        false
                                                    }
                                                    axisLine={
                                                        false
                                                    }
                                                    width={110}
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#475569",
                                                    }}
                                                />

                                                <Tooltip
                                                    content={
                                                        <ChartTooltip />
                                                    }
                                                />

                                                <Bar
                                                    dataKey="quantity"
                                                    name="Quantity"
                                                    fill="url(#emeraldGradientBarIn)"
                                                    radius={[
                                                        0,
                                                        8,
                                                        8,
                                                        0,
                                                    ]}
                                                    barSize={
                                                        18
                                                    }
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.section>

                                {/* Pie Chart */}
                                <motion.section
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                    }}
                                    className="flex flex-col rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                >
                                    <div className="mb-3">
                                        <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                            Status Split
                                        </h2>

                                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                                            Success vs Errors
                                        </p>
                                    </div>

                                    <div className="relative min-h-[180px] flex-1 sm:min-h-[220px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Tooltip
                                                    content={
                                                        <ChartTooltip />
                                                    }
                                                />

                                                <Pie
                                                    data={
                                                        statusChart
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={
                                                        50
                                                    }
                                                    outerRadius={
                                                        75
                                                    }
                                                    paddingAngle={
                                                        4
                                                    }
                                                    stroke="none"
                                                >
                                                    {statusChart.map(
                                                        (
                                                            row
                                                        ) => (
                                                            <Cell
                                                                key={
                                                                    row.name
                                                                }
                                                                fill={
                                                                    row.color
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {statusChart.map(
                                            (row) => (
                                                <div
                                                    key={
                                                        row.name
                                                    }
                                                    className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/60 px-3 py-2"
                                                >
                                                    <div
                                                        className="h-2.5 w-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                row.color,
                                                        }}
                                                    />

                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                            {
                                                                row.name
                                                            }
                                                        </p>

                                                        <p className="text-xs font-bold text-slate-800">
                                                            {formatNumber(
                                                                row.value
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </motion.section>
                            </div>


                        </>
                    )}
                </div>
            </main>
        </div>
    );
}