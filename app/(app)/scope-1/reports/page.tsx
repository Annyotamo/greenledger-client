"use client";

import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Select from "react-select";

import {
    LuActivity,
    LuBuilding2,
    LuCircleDollarSign,
    LuDownload,
    LuDroplets,
    LuFactory,
    LuFuel,
    LuLeaf,
    LuMaximize2,
    LuPlus,
    LuSparkles,
    LuX,
    LuCalendarDays,
} from "react-icons/lu";

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

import { Sidebar } from "@/components/dashboard/SidebarShell";

import { downloadScope1ReportCsv } from "@/lib/report/api";

import {
    useIngestScope1EmissionMutation,
    useScope1EmissionsOverlayDropdownQuery,
    useScope1ReportsQuery,
} from "@/lib/report/hooks";

import { useSidebarStore } from "@/lib/sidebarStore";

import type { ApiErrorBody } from "@/types/api/common";

import type {
    Scope1IngestRequest,
    Scope1ReportRecord,
} from "@/types/report";

type ChartTooltipPayload = Array<{
    name?: string;
    value?: number | string;
    payload?: any;
}>;

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
                                ? p.value.toLocaleString()
                                : p.value ?? "-"}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
}

function formatTonnesFromKg(value: number): string {
    return (value / 1000).toLocaleString(undefined, {
        maximumFractionDigits: 3,
    });
}

function getMonthLabel(value: string | null): string {
    if (!value) return "N/A";

    const [year, month] = value.split("-");

    if (!year || !month) return value;

    return `${month}/${year.slice(-2)}`;
}

function aggregateMonthly(records: Scope1ReportRecord[]) {
    const byMonth = new Map<
        string,
        {
            co2e: number;
            cost: number;
        }
    >();

    for (const row of records) {
        const month = row.reportDate ?? "Unknown";

        const previous = byMonth.get(month) ?? {
            co2e: 0,
            cost: 0,
        };

        byMonth.set(month, {
            co2e: previous.co2e + (row.co2eTotal ?? 0),
            cost: previous.cost + (row.cost ?? 0),
        });
    }

    return Array.from(byMonth.entries())
        .map(([month, values]) => ({
            month,
            monthLabel: getMonthLabel(month),
            ...values,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },

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

export default function Scope1Page() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);

    const setActiveSection = useSidebarStore(
        (s) => s.setActiveSection
    );

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const { data, isLoading, isError, refetch } =
        useScope1ReportsQuery();

    const {
        data: overlayDropdownData,
        isLoading: isLoadingOverlayData,
        isError: isOverlayDataError,
    } = useScope1EmissionsOverlayDropdownQuery(
        isModalOpen
    );

    const ingestMutation =
        useIngestScope1EmissionMutation();

    const [submitError, setSubmitError] = useState<
        string | null
    >(null);

    const [submitSuccess, setSubmitSuccess] =
        useState<string | null>(null);

    const [isMounted, setIsMounted] =
        useState(false);

    const [selectedFuelType, setSelectedFuelType] =
        useState<string | null>(null);

    const [startMonth, setStartMonth] =
        useState("2026-01");

    const [endMonth, setEndMonth] =
        useState("2026-06");

    const [isDownloading, setIsDownloading] =
        useState(false);

    const [downloadError, setDownloadError] =
        useState<string | null>(null);

    const [recordsPage, setRecordsPage] =
        useState(1);

    const recordsPageSize = 10;

    const [ingestForm, setIngestForm] = useState<{
        fuelName: string;
        fuelType: string;
        quantity: string;
        cost: string;
        unit: string;
        orgName: string;
        facilityName: string;
        yearMonth: string;
    }>({
        fuelName: "",
        fuelType: "",
        quantity: "",
        cost: "",
        unit: "",
        orgName: "",
        facilityName: "",
        yearMonth: "",
    });

    const records: Scope1ReportRecord[] =
        (data ?? []) as Scope1ReportRecord[];

    useEffect(() => {
        setActiveSection("scope-1");
    }, [setActiveSection]);

    useEffect(() => {
        setRecordsPage(1);
    }, [records.length]);

    const recordsTotalPages = useMemo(
        () =>
            Math.max(
                1,
                Math.ceil(records.length / recordsPageSize)
            ),
        [records.length]
    );

    const recordsPageSafe = Math.min(
        Math.max(1, recordsPage),
        recordsTotalPages
    );

    const pagedRecords = useMemo(() => {
        const start =
            (recordsPageSafe - 1) * recordsPageSize;

        return records.slice(
            start,
            start + recordsPageSize
        );
    }, [records, recordsPageSafe]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fuelTypeOptions = useMemo(() => {
        const fuelTypes =
            overlayDropdownData?.FuelType ?? [];

        return Array.from(new Set(fuelTypes))
            .sort((a, b) => a.localeCompare(b))
            .map((ft) => ({
                label: ft,
                value: ft,
            }));
    }, [overlayDropdownData]);

    const fuelNameOptions = useMemo(() => {
        if (!overlayDropdownData || !selectedFuelType)
            return [];

        const rows =
            overlayDropdownData[selectedFuelType] ?? [];

        return Array.from(new Set(rows))
            .sort((a, b) => a.localeCompare(b))
            .map((fn) => ({
                label: fn,
                value: fn,
            }));
    }, [overlayDropdownData, selectedFuelType]);

    const selectedFuelTypeOption = useMemo(() => {
        if (!selectedFuelType) return null;

        return {
            label: selectedFuelType,
            value: selectedFuelType,
        };
    }, [selectedFuelType]);

    const unitOptions = useMemo(() => {
        const units =
            overlayDropdownData?.["all units"] ?? [];

        return Array.from(new Set(units))
            .sort((a, b) => a.localeCompare(b))
            .map((unit) => ({
                label: unit,
                value: unit,
            }));
    }, [overlayDropdownData]);

    const totals = useMemo(() => {
        const totalCo2e = records.reduce(
            (acc, row) =>
                acc + (row.co2eTotal ?? 0),
            0
        );

        const totalCost = records.reduce(
            (acc, row) => acc + (row.cost ?? 0),
            0
        );

        const withFacility = records.filter(
            (row) => row.facilityName
        ).length;

        return {
            totalCo2e,
            totalCost,
            withFacility,
        };
    }, [records]);

    const monthlySeries = useMemo(
        () => aggregateMonthly(records),
        [records]
    );

    const fuelBreakdown = useMemo(() => {
        const map = new Map<string, number>();

        for (const row of records) {
            const key = row.fuelType ?? "Unknown";

            map.set(
                key,
                (map.get(key) ?? 0) +
                    (row.co2eTotal ?? 0)
            );
        }

        const palette = [
            "#059669",
            "#10b981",
            "#34d399",
            "#6ee7b7",
            "#a7f3d0",
        ];

        return Array.from(map.entries()).map(
            ([name, value], idx) => ({
                name,
                value,
                color:
                    palette[idx % palette.length],
            })
        );
    }, [records]);

    const facilitySeries = useMemo(() => {
        const map = new Map<string, number>();

        for (const row of records) {
            const key =
                row.facilityName ??
                "Unmapped facility";

            map.set(
                key,
                (map.get(key) ?? 0) +
                    (row.co2eTotal ?? 0)
            );
        }

        return Array.from(map.entries())
            .map(([facility, co2e]) => ({
                facility,
                co2e,
            }))
            .sort((a, b) => b.co2e - a.co2e);
    }, [records]);

    const sourceSeries = useMemo(() => {
        const map = new Map<string, number>();

        for (const row of records) {
            const src =
                (
                    row.scope1FactorData as any
                )?.emissionStandard?.source ??
                "Unknown";

            map.set(
                src,
                (map.get(src) ?? 0) +
                    (row.co2eTotal ?? 0)
            );
        }

        return Array.from(map.entries())
            .map(([source, co2e]) => ({
                source,
                co2e,
            }))
            .sort((a, b) => b.co2e - a.co2e)
            .slice(0, 5);
    }, [records]);

    async function handleDownloadCsv() {
        if (!startMonth || !endMonth) {
            setDownloadError(
                "Please select both start and end month."
            );

            return;
        }

        if (startMonth > endMonth) {
            setDownloadError(
                "Start month must be earlier than or equal to end month."
            );

            return;
        }

        setDownloadError(null);

        setIsDownloading(true);

        try {
            const blob =
                await downloadScope1ReportCsv(
                    startMonth,
                    endMonth
                );

            const objectUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = objectUrl;

            link.download = `scope1-report-${startMonth}-to-${endMonth}.csv`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401
                ) {
                    return;
                }

                const responseData =
                    error.response?.data;

                const message =
                    responseData &&
                    typeof responseData ===
                        "object" &&
                    "response" in responseData
                        ? String(
                              responseData.response
                          )
                        : "Unable to download report CSV.";

                setDownloadError(message);

                return;
            }

            setDownloadError(
                "Unable to download report CSV."
            );
        } finally {
            setIsDownloading(false);
        }
    }

    async function onSubmitIngest(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setSubmitError(null);

        setSubmitSuccess(null);

        try {
            const payload: Scope1IngestRequest = {
                fuelName: ingestForm.fuelName,
                fuelType: ingestForm.fuelType,
                quantity: Number(
                    ingestForm.quantity || 0
                ),
                cost: Number(
                    ingestForm.cost || 0
                ),
                unit: ingestForm.unit,
                orgName: ingestForm.orgName,
                facilityName:
                    ingestForm.facilityName,
                yearMonth:
                    ingestForm.yearMonth,
            };

            await ingestMutation.mutateAsync(
                payload
            );

            setSubmitSuccess(
                "New emission record added successfully."
            );

            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401
                ) {
                    return;
                }

                const body =
                    error.response
                        ?.data as
                        | ApiErrorBody
                        | undefined;

                setSubmitError(
                    body?.response ??
                        body?.message ??
                        "Failed to add emission record."
                );

                return;
            }

            setSubmitError(
                "Failed to add emission record."
            );
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50/50 text-slate-900">
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

                                Scope-1 Analytics
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                Emissions Intelligence
                            </h1>

                            <p className="max-w-lg text-xs font-medium text-slate-500 sm:text-sm">
                                Comprehensive
                                reporting data and
                                detailed metric
                                analysis.
                            </p>
                        </motion.div>
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
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitError(null);
                                    setSubmitSuccess(null);
                                    setSelectedFuelType(
                                        null
                                    );

                                    setIngestForm({
                                        fuelName: "",
                                        fuelType: "",
                                        quantity: "",
                                        cost: "",
                                        unit: "",
                                        orgName: "",
                                        facilityName:
                                            "",
                                        yearMonth: "",
                                    });

                                    setIsModalOpen(
                                        true
                                    );
                                }}
                                className="group inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40"
                            >
                                <LuPlus className="h-4 w-4 transition-transform group-hover:rotate-90" />

                                Add Emission
                                Data
                            </button>
                        </motion.div>
                    </header>

                    <AnimatePresence>
                        {submitSuccess && (
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
                                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 backdrop-blur-md">
                                    <span className="font-bold">
                                        Success:
                                    </span>{" "}
                                    {
                                        submitSuccess
                                    }
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="h-28 animate-pulse rounded-2xl bg-white/40 backdrop-blur-md"
                                    />
                                )
                            )}
                        </div>
                    ) : isError ? (
                        <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-6 text-center backdrop-blur-md">
                            <p className="text-sm font-semibold text-red-600">
                                Failed to load
                                report data.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* STATS */}
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {[
                                    {
                                        label:
                                            "Total Emissions",
                                        value:
                                            formatTonnesFromKg(
                                                totals.totalCo2e
                                            ),
                                        unit: "tCO₂e",
                                        icon: (
                                            <LuLeaf />
                                        ),
                                    },
                                    {
                                        label:
                                            "Total Records",
                                        value:
                                            records.length.toString(),
                                        unit: "Entries",
                                        icon: (
                                            <LuFuel />
                                        ),
                                    },
                                    {
                                        label:
                                            "Total Cost",
                                        value:
                                            formatNumber(
                                                totals.totalCost
                                            ),
                                        unit: "",
                                        icon: (
                                            <LuCircleDollarSign />
                                        ),
                                    },
                                ].map(
                                    (
                                        stat,
                                        idx
                                    ) => (
                                        <motion.div
                                            key={
                                                stat.label
                                            }
                                            custom={
                                                idx
                                            }
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            variants={
                                                cardVariants
                                            }
                                            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
                                        >
                                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-2xl" />

                                            <div className="relative flex items-start justify-between">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm text-white shadow-lg shadow-emerald-500/20">
                                                    {
                                                        stat.icon
                                                    }
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">
                                                    {
                                                        stat.label
                                                    }
                                                </p>

                                                <div className="mt-1 flex items-baseline gap-1">
                                                    <h3 className="text-2xl font-black tracking-tight text-slate-800 lg:text-3xl">
                                                        {
                                                            stat.value
                                                        }
                                                    </h3>

                                                    {stat.unit && (
                                                        <span className="text-xs font-semibold text-slate-500">
                                                            {
                                                                stat.unit
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>

                            {/* TABLE */}
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
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                            Scope-1
                                            Report
                                            Records
                                        </h2>

                                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                                            Detailed
                                            reporting
                                            records
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/60 px-2 py-1.5">
                                            <LuCalendarDays className="h-4 w-4 text-emerald-600" />

                                            <input
                                                type="month"
                                                value={
                                                    startMonth
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setStartMonth(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="h-8 w-28 rounded-lg border-none bg-white/80 px-2 text-[11px] font-semibold text-slate-700 shadow-inner outline-none lg:w-32"
                                            />

                                            <span className="text-[10px] text-slate-400">
                                                to
                                            </span>

                                            <input
                                                type="month"
                                                value={
                                                    endMonth
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEndMonth(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="h-8 w-28 rounded-lg border-none bg-white/80 px-2 text-[11px] font-semibold text-slate-700 shadow-inner outline-none lg:w-32"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleDownloadCsv
                                            }
                                            disabled={
                                                isDownloading
                                            }
                                            className="inline-flex h-8 items-center gap-2 rounded-xl bg-slate-800 px-3 text-[11px] font-bold text-white shadow-md transition hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            <LuDownload className="h-3.5 w-3.5" />

                                            {isDownloading
                                                ? "Downloading..."
                                                : "Download CSV"}
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[760px] table-fixed text-left text-xs">
                                            <thead className="bg-slate-50/50">
                                                <tr className="border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Fuel
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Facility
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Org
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Month
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Quantity
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Input
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        Output
                                                    </th>

                                                    <th className="whitespace-nowrap px-2 py-2">
                                                        CO₂e
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-100">
                                                {pagedRecords.map(
                                                    (
                                                        row,
                                                        idx
                                                    ) => (
                                                        <tr
                                                            key={`${row.id}-${idx}`}
                                                            className="transition-colors hover:bg-white/80"
                                                        >
                                                            <td className="max-w-[180px] px-2 py-2">
                                                                <div className="flex flex-col">
                                                                    <span className="truncate font-semibold text-slate-800">
                                                                        {row.fuelName ??
                                                                            "-"}
                                                                    </span>

                                                                    <div className="mt-1 inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-[2px]">
                                                                        <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
                                                                            {row.fuelType ??
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-2 py-2 text-slate-600">
                                                                <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-[3px] text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                                    {row.facilityName ??
                                                                        "Unmapped"}
                                                                </span>
                                                            </td>

                                                            <td className="truncate px-2 py-2 text-slate-600">
                                                                {row.orgName ??
                                                                    "-"}
                                                            </td>

                                                            <td className="px-2 py-2 text-slate-600">
                                                                {row.reportDate ??
                                                                    "-"}
                                                            </td>

                                                            <td className="px-2 py-2 text-slate-600">
                                                                {typeof row
                                                                    .activityData
                                                                    ?.quantity ===
                                                                "number"
                                                                    ? formatNumber(
                                                                          row
                                                                              .activityData
                                                                              .quantity
                                                                      )
                                                                    : "-"}
                                                            </td>

                                                            <td className="px-2 py-2 text-[10px] text-slate-500">
                                                                {row.inputUnit ??
                                                                    row
                                                                        .activityData
                                                                        ?.unit ??
                                                                    "-"}
                                                            </td>

                                                            <td className="px-2 py-2 text-[10px] text-slate-500">
                                                                {row.outputUnit ??
                                                                    row
                                                                        .scope1FactorData
                                                                        ?.convertTo ??
                                                                    "-"}
                                                            </td>

                                                            <td className="px-2 py-2 font-bold text-emerald-600">
                                                                {formatNumber(
                                                                    row.co2eTotal ??
                                                                        0
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.section>
                            <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
    >
        <div className="mb-4 flex items-center justify-between">
            <div>
                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Monthly Emissions Trend
                </h2>

                <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Aggregated tracking over time
                </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-100/50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>

                Live
            </div>
        </div>

        <div className="h-[230px] w-full sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={monthlySeries}
                    margin={{
                        left: -20,
                        right: 0,
                        top: 10,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="scope1-a"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.4}
                            />

                            <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                            />
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
                        tick={{
                            fontSize: 10,
                            fill: "#64748b",
                        }}
                        dy={10}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{
                            fontSize: 10,
                            fill: "#64748b",
                        }}
                    />

                    <Tooltip
                        content={<DashboardTooltip />}
                    />

                    <Area
                        type="monotone"
                        dataKey="co2e"
                        name="CO₂e"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#scope1-a)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </motion.section>

    <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
    >
        <div className="mb-3 flex items-center justify-between">
            <div>
                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Fuel Mix
                </h2>

                <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Total distribution
                </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <LuFactory className="h-4 w-4" />
            </div>
        </div>

        <div className="relative min-h-[180px] flex-1 sm:min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        content={<DashboardTooltip />}
                    />

                    <Pie
                        data={fuelBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        stroke="none"
                    >
                        {fuelBreakdown.map((row) => (
                            <Cell
                                key={row.name}
                                fill={row.color}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
            {fuelBreakdown
                .slice(0, 4)
                .map((row) => (
                    <div
                        key={row.name}
                        className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/60 px-3 py-2"
                    >
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                                backgroundColor:
                                    row.color,
                            }}
                        />

                        <div className="min-w-0">
                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {row.name}
                            </p>

                            <p className="text-xs font-bold text-slate-800">
                                {formatNumber(
                                    row.value
                                )}
                            </p>
                        </div>
                    </div>
                ))}
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