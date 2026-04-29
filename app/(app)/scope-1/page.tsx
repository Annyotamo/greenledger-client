"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Select from "react-select";
import {
    LuActivity,
    LuBadgeCheck,
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
import { useIngestScope1EmissionMutation, useScope1ReportsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { Scope1IngestRequest, Scope1ReportRecord } from "@/types/report";

type ChartTooltipPayload = Array<{ name?: string; value?: number | string }>;

type FactorStandard = {
    gwpBasis: string | null;
    source: string | null;
    version: string | null;
};

type FactorRow = {
    id: string;
    fuelName: string | null;
    fuelType: string | null;
    unit: string | null;
    co2eTotal: number | null;
    co2Factor: number | null;
    ch4Factor: number | null;
    n2oFactor: number | null;
    emissionStandard?: FactorStandard | null;
    year?: string | null;
    convertTo?: string | null;
    creationDateString?: string | null;
    updateDateString?: string | null;
};

type GetFactorResponse = {
    response?: string;
    stsCode?: number;
    data?: FactorRow[];
    message?: string;
};

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
        <div className="rounded-2xl bg-white/95 px-4 py-3 text-xs shadow-xl ring-1 ring-emerald-900/10 backdrop-blur-md">
            {label ? <p className="font-bold uppercase tracking-wide text-emerald-900/60">{label}</p> : null}
            <div className="mt-2 space-y-1.5">
                {payload.map((p, i) => (
                    <div key={`${p.name ?? "metric"}-${i}`} className="flex items-center justify-between gap-5">
                        <span className="font-semibold text-slate-700">{p.name}</span>
                        <span className="font-bold text-emerald-950">
                            {typeof p.value === "number" ? p.value.toLocaleString() : (p.value ?? "-")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatTonnesFromKg(value: number): string {
    return (value / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function getMonthLabel(value: string | null): string {
    if (!value) return "N/A";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year.slice(-2)}`;
}

function aggregateMonthly(records: Scope1ReportRecord[]) {
    const byMonth = new Map<string, { co2e: number; cost: number }>();

    for (const row of records) {
        const month = row.reportDate ?? "Unknown";
        const previous = byMonth.get(month) ?? { co2e: 0, cost: 0 };
        byMonth.set(month, {
            co2e: previous.co2e + (row.co2eTotal ?? 0),
            cost: previous.cost + (row.cost ?? 0),
        });
    }

    return Array.from(byMonth.entries())
        .map(([month, values]) => ({ month, monthLabel: getMonthLabel(month), ...values }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

export default function Scope1Page() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const { data, isLoading, isError, refetch } = useScope1ReportsQuery();
    const ingestMutation = useIngestScope1EmissionMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [factors, setFactors] = useState<FactorRow[]>([]);
    const [isLoadingFactors, setIsLoadingFactors] = useState(false);
    const [factorError, setFactorError] = useState<string | null>(null);
    const [selectedStandardKey, setSelectedStandardKey] = useState<string | null>(null);
    const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
    const [selectedFactor, setSelectedFactor] = useState<FactorRow | null>(null);
    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-05");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [recordsPage, setRecordsPage] = useState(1);
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
    const records = data ?? [];

    useEffect(() => {
        setActiveSection("scope-1");
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const standardOptions = useMemo(() => {
        const byKey = new Map<string, FactorStandard>();

        for (const row of factors) {
            const s = row.emissionStandard;
            const source = (s?.source ?? "").trim();
            const gwpBasis = (s?.gwpBasis ?? "").trim();
            const version = (s?.version ?? "").trim();

            if (!source && !gwpBasis && !version) continue;

            const key = [source || "Unknown", gwpBasis || "Unknown", version || "Unknown"].join(" · ");
            if (!byKey.has(key)) {
                byKey.set(key, { source: s?.source ?? null, gwpBasis: s?.gwpBasis ?? null, version: s?.version ?? null });
            }
        }

        return Array.from(byKey.entries())
            .map(([key, s]) => ({
                key,
                label: key,
                value: key,
                meta: s,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [factors]);

    useEffect(() => {
        if (!standardOptions.length) return;
        if (selectedStandardKey) return;
        if (standardOptions.length === 1) {
            setSelectedStandardKey(standardOptions[0]?.key ?? null);
        }
    }, [selectedStandardKey, standardOptions]);

    const filteredByStandard = useMemo(() => {
        if (!selectedStandardKey) return factors;
        return factors.filter((f) => {
            const s = f.emissionStandard;
            const source = (s?.source ?? "").trim() || "Unknown";
            const gwpBasis = (s?.gwpBasis ?? "").trim() || "Unknown";
            const version = (s?.version ?? "").trim() || "Unknown";
            const key = [source, gwpBasis, version].join(" · ");
            return key === selectedStandardKey;
        });
    }, [factors, selectedStandardKey]);

    const fuelTypeOptions = useMemo(() => {
        const set = new Set<string>();
        for (const row of filteredByStandard) {
            const ft = (row.fuelType ?? "").trim();
            if (ft) set.add(ft);
        }
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b))
            .map((ft) => ({ label: ft, value: ft }));
    }, [filteredByStandard]);

    const fuelNameOptions = useMemo(() => {
        const set = new Set<string>();
        for (const row of filteredByStandard) {
            const ft = (row.fuelType ?? "").trim();
            if (selectedFuelType && ft !== selectedFuelType) continue;
            const fn = (row.fuelName ?? "").trim();
            if (fn) set.add(fn);
        }
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b))
            .map((fn) => ({ label: fn, value: fn }));
    }, [filteredByStandard, selectedFuelType]);

    const selectedStandardOption = useMemo(() => {
        if (!selectedStandardKey) return null;
        const found = standardOptions.find((o) => o.key === selectedStandardKey);
        return found ? { label: found.label, value: found.value } : null;
    }, [selectedStandardKey, standardOptions]);

    const selectedFuelTypeOption = useMemo(() => {
        if (!selectedFuelType) return null;
        return { label: selectedFuelType, value: selectedFuelType };
    }, [selectedFuelType]);

    useEffect(() => {
        if (!isModalOpen) return;
        if (factors.length) return;

        let cancelled = false;
        async function run() {
            setIsLoadingFactors(true);
            setFactorError(null);
            try {
                const res = await fetch("/api/factor/getFactor", { method: "GET" });
                const body = (await res.json()) as GetFactorResponse | { message?: string };
                if (!res.ok) {
                    const msg = "message" in body && typeof body.message === "string" ? body.message : "Failed to load factors.";
                    throw new Error(msg);
                }
                const rows = "data" in body && Array.isArray((body as GetFactorResponse).data) ? ((body as GetFactorResponse).data ?? []) : [];
                if (!cancelled) setFactors(rows);
            } catch (e) {
                if (cancelled) return;
                setFactorError(e instanceof Error ? e.message : "Failed to load factors.");
            } finally {
                if (!cancelled) setIsLoadingFactors(false);
            }
        }
        void run();
        return () => {
            cancelled = true;
        };
    }, [factors.length, isModalOpen]);

    const totals = useMemo(() => {
        const totalCo2e = records.reduce((acc, row) => acc + (row.co2eTotal ?? 0), 0);
        const totalCost = records.reduce((acc, row) => acc + (row.cost ?? 0), 0);
        const withFacility = records.filter((row) => row.facilityName).length;
        return { totalCo2e, totalCost, withFacility };
    }, [records]);

    const monthlySeries = useMemo(() => aggregateMonthly(records), [records]);

    const fuelBreakdown = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const key = row.fuelType ?? "Unknown";
            map.set(key, (map.get(key) ?? 0) + (row.co2eTotal ?? 0));
        }

        const palette = [
            "rgba(31,122,63,0.85)",
            "rgba(45,107,78,0.78)",
            "rgba(78,165,108,0.74)",
            "rgba(136,190,151,0.82)",
            "rgba(54,120,96,0.75)",
        ];

        return Array.from(map.entries()).map(([name, value], idx) => ({
            name,
            value,
            color: palette[idx % palette.length],
        }));
    }, [records]);

    const facilitySeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const key = row.facilityName ?? "Unmapped facility";
            map.set(key, (map.get(key) ?? 0) + (row.co2eTotal ?? 0));
        }
        return Array.from(map.entries())
            .map(([facility, co2e]) => ({ facility, co2e }))
            .sort((a, b) => b.co2e - a.co2e);
    }, [records]);

    const sourceSeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            // Some environments may have slightly stale generated types; the API payload includes emissionStandard.
            const src = (row.scope1FactorData as any)?.emissionStandard?.source ?? "Unknown";
            map.set(src, (map.get(src) ?? 0) + (row.co2eTotal ?? 0));
        }
        return Array.from(map.entries())
            .map(([source, co2e]) => ({ source, co2e }))
            .sort((a, b) => b.co2e - a.co2e)
            .slice(0, 5);
    }, [records]);

    const completeness = useMemo(() => {
        const total = records.length || 1;
        return {
            total,
            withFacility: records.filter((r) => Boolean(r.facilityName)).length,
            withReportMonth: records.filter((r) => Boolean(r.reportDate)).length,
            withFactor: records.filter((r) => Boolean(r.scope1FactorData)).length,
            withActivity: records.filter((r) => Boolean(r.activityData)).length,
        };
    }, [records]);

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
            const blob = await downloadScope1ReportCsv(startMonth, endMonth);
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `scope1-report-${startMonth}-to-${endMonth}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            if (error instanceof AxiosError) {
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

    async function onSubmitIngest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            const payload: Scope1IngestRequest = {
                fuelName: ingestForm.fuelName,
                fuelType: ingestForm.fuelType,
                quantity: Number(ingestForm.quantity || 0),
                cost: Number(ingestForm.cost || 0),
                unit: ingestForm.unit,
                orgName: ingestForm.orgName,
                facilityName: ingestForm.facilityName,
                yearMonth: ingestForm.yearMonth,
            };
            await ingestMutation.mutateAsync(payload);
            setSubmitSuccess("New emission record added successfully.");
            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add emission record.");
                return;
            }
            setSubmitError("Failed to add emission record.");
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_10%_10%,rgba(31,122,63,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_90%_5%,rgba(45,107,78,0.14),transparent_60%)]" />
            <Sidebar />

            <main
                className={[
                    "px-4 pb-8 pt-16 sm:px-5 lg:pr-10 lg:pt-7",
                    sidebarOpen ? "lg:pl-80" : "lg:pl-28",
                    "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}>
                <section className="section-bg relative overflow-hidden rounded-3xl border border-white/60 p-5 shadow-[0_30px_90px_-45px_rgba(0,40,25,0.6)] backdrop-blur-md sm:p-6 md:p-7">
                    <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-emerald-500/12 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/12 blur-3xl" />

                    <header className="relative mb-6 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/75">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                                GHG accounting · Scope-1 analytics
                            </p>
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                Scope-1 Emissions Intelligence
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
                                Live report view from backend with professional metrics, trend analytics, and
                                fuel/facility level breakdowns.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSubmitError(null);
                                setSubmitSuccess(null);
                                setFactorError(null);
                                setSelectedStandardKey(null);
                                setSelectedFuelType(null);
                                setSelectedFactor(null);
                                setIngestForm({
                                    fuelName: "",
                                    fuelType: "",
                                    quantity: "",
                                    cost: "",
                                    unit: "",
                                    orgName: "",
                                    facilityName: "",
                                    yearMonth: "",
                                });
                                setIsModalOpen(true);
                            }}
                            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                            <LuPlus className="h-4 w-4" />
                            Add emission data
                        </button>
                    </header>

                    {submitSuccess ? (
                        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                            {submitSuccess}
                        </div>
                    ) : null}

                    {isLoading ? (
                        <div className="rounded-2xl border border-emerald-900/10 bg-white/85 p-6 text-sm font-semibold text-emerald-900">
                            Loading Scope-1 report data...
                        </div>
                    ) : null}

                    {isError ? (
                        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm font-semibold text-red-700">
                            Unable to load Scope-1 report data. Please check token/session and try again.
                        </div>
                    ) : null}

                    {!isLoading && !isError ? (
                        <>
                            <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {[
                                    {
                                        label: "Total emissions",
                                        value: `${formatTonnesFromKg(totals.totalCo2e)} tCO2e`,
                                        icon: <LuLeaf />,
                                    },
                                    {
                                        label: "Total records",
                                        value: records.length.toString(),
                                        icon: <LuFuel />,
                                    },
                                    {
                                        label: "Total cost",
                                        value: `${formatNumber(totals.totalCost)}`,
                                        icon: <LuCircleDollarSign />,
                                    },
                                ].map((stat) => (
                                    <article
                                        key={stat.label}
                                        className="card-hover rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                                        <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-900/70">
                                            {stat.label}
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-900/80">
                                                {stat.icon}
                                            </span>
                                        </p>
                                        <p className="mt-3 text-xl font-bold tracking-tight text-emerald-950">
                                            {stat.value}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <section className="mt-5 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-sm sm:p-5">
                                <div className="flex flex-wrap items-end justify-between gap-3">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                        Scope-1 report records
                                    </h2>
                                    <div className="flex flex-wrap items-end gap-2">
                                        <label className="grid gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-900/65">
                                            Start month
                                            <input
                                                type="month"
                                                value={startMonth}
                                                onChange={(e) => setStartMonth(e.target.value)}
                                                className="h-11 rounded-2xl border border-emerald-900/15 bg-white/85 px-3 text-sm font-medium text-emerald-950 shadow-sm outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45"
                                            />
                                        </label>
                                        <label className="grid gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-900/65">
                                            End month
                                            <input
                                                type="month"
                                                value={endMonth}
                                                onChange={(e) => setEndMonth(e.target.value)}
                                                className="h-11 rounded-2xl border border-emerald-900/15 bg-white/85 px-3 text-sm font-medium text-emerald-950 shadow-sm outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDownloadCsv}
                                            disabled={isDownloading}
                                            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/85 px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                                            <LuDownload className="h-4 w-4 text-emerald-800" />
                                            {isDownloading ? "Downloading..." : "Download CSV"}
                                        </button>
                                        <a
                                            href="/scope-1/records"
                                            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                            <LuMaximize2 className="h-4 w-4" />
                                            View all
                                        </a>
                                    </div>
                                </div>
                                {downloadError ? (
                                    <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                        {downloadError}
                                    </div>
                                ) : null}
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-[1020px] text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-emerald-900/10 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-900/60">
                                                <th className="px-3 py-2">Fuel</th>
                                                <th className="px-3 py-2">Fuel type</th>
                                                <th className="px-3 py-2">Facility</th>
                                                <th className="px-3 py-2">Org</th>
                                                <th className="px-3 py-2">Report month</th>
                                                <th className="px-3 py-2">Quantity</th>
                                                <th className="px-3 py-2">Input unit</th>
                                                <th className="px-3 py-2">Output unit</th>
                                                <th className="px-3 py-2">CO2e</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagedRecords.map((row, idx) => (
                                                <tr
                                                    key={`${row.id}-${idx}`}
                                                    className="border-b border-emerald-900/7 text-slate-700 hover:bg-emerald-50/45">
                                                    <td className="px-3 py-2 font-semibold text-slate-900">{row.fuelName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.fuelType ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.facilityName ?? "Unmapped facility"}</td>
                                                    <td className="px-3 py-2">{row.orgName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.reportDate ?? "-"}</td>
                                                    <td className="px-3 py-2">
                                                        {typeof row.activityData?.quantity === "number"
                                                            ? formatNumber(row.activityData.quantity)
                                                            : "-"}
                                                    </td>
                                                    <td className="px-3 py-2">{row.inputUnit ?? row.activityData?.unit ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.outputUnit ?? row.scope1FactorData?.convertTo ?? "-"}</td>
                                                    <td className="px-3 py-2 font-semibold text-emerald-900">
                                                        {formatNumber(row.co2eTotal ?? 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs font-semibold text-slate-600">
                                        Showing{" "}
                                        <span className="text-slate-900">
                                            {records.length ? (recordsPageSafe - 1) * recordsPageSize + 1 : 0}
                                        </span>
                                        {"–"}
                                        <span className="text-slate-900">
                                            {Math.min(recordsPageSafe * recordsPageSize, records.length)}
                                        </span>{" "}
                                        of <span className="text-slate-900">{records.length}</span>
                                    </p>
                                    <div className="inline-flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage(1)}
                                            disabled={recordsPageSafe <= 1}
                                            className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
                                            First
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage((p) => Math.max(1, p - 1))}
                                            disabled={recordsPageSafe <= 1}
                                            className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
                                            Prev
                                        </button>
                                        <span className="text-xs font-semibold text-slate-700">
                                            Page {recordsPageSafe}/{recordsTotalPages}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage((p) => Math.min(recordsTotalPages, p + 1))}
                                            disabled={recordsPageSafe >= recordsTotalPages}
                                            className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
                                            Next
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecordsPage(recordsTotalPages)}
                                            disabled={recordsPageSafe >= recordsTotalPages}
                                            className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
                                            Last
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <div className="relative mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                            Monthly emissions trend
                                        </h2>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                                            <LuActivity className="h-3.5 w-3.5" />
                                            Live
                                        </span>
                                    </div>
                                    <div className="h-78 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/75 p-2 sm:p-3">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                            minWidth={0}
                                            minHeight={300}
                                            debounce={120}>
                                            <AreaChart
                                                data={monthlySeries}
                                                margin={{ left: 4, right: 4, top: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="scope1-a" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="rgba(31,122,63,0.8)" />
                                                        <stop offset="95%" stopColor="rgba(31,122,63,0.2)" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid stroke="rgba(15,47,20,0.08)" />
                                                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
                                                <YAxis tickLine={false} axisLine={false} />
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="co2e"
                                                    name="CO2e"
                                                    stroke="rgba(31,122,63,0.95)"
                                                    fill="url(#scope1-a)"
                                                    fillOpacity={1}
                                                    isAnimationActive
                                                    animationDuration={950}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                            Fuel mix contribution
                                        </h2>
                                        <LuFactory className="h-4 w-4 text-emerald-800/80" />
                                    </div>
                                    <div className="h-56 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                            minWidth={0}
                                            minHeight={190}
                                            debounce={120}>
                                            <PieChart>
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Pie
                                                    data={fuelBreakdown}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={48}
                                                    outerRadius={82}
                                                    paddingAngle={3}
                                                    isAnimationActive
                                                    animationDuration={1150}>
                                                    {fuelBreakdown.map((p) => (
                                                        <Cell key={p.name} fill={p.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {fuelBreakdown.map((row) => (
                                            <div
                                                key={row.name}
                                                className="flex items-center justify-between rounded-xl bg-white/85 px-3 py-2">
                                                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900/75">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full"
                                                        style={{ background: row.color }}
                                                    />
                                                    {row.name}
                                                </span>
                                                <span className="text-sm font-bold text-slate-800">
                                                    {formatNumber(row.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="relative mt-5 grid gap-5">
                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                            Facility emissions distribution
                                        </h2>
                                        <LuBuilding2 className="h-4 w-4 text-emerald-800/80" />
                                    </div>
                                    <div className="h-[260px] min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                            minWidth={0}
                                            minHeight={190}
                                            debounce={120}>
                                            <BarChart
                                                data={facilitySeries}
                                                layout="vertical"
                                                margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                                                <CartesianGrid stroke="rgba(15,47,20,0.08)" horizontal={false} />
                                                <XAxis type="number" tickLine={false} axisLine={false} />
                                                <YAxis
                                                    dataKey="facility"
                                                    type="category"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={68}
                                                />
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Bar
                                                    dataKey="co2e"
                                                    name="CO2e"
                                                    fill="rgba(31,122,63,0.82)"
                                                    radius={[8, 8, 8, 8]}
                                                    isAnimationActive
                                                    animationDuration={900}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {facilitySeries.map((row) => (
                                            <div
                                                key={row.facility}
                                                className="rounded-xl border border-emerald-900/10 bg-white/85 px-3 py-2">
                                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-900/60">
                                                    {row.facility}
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-emerald-950">{formatTonnesFromKg(row.co2e)} tCO2e</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <section className="mt-5 rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                        Emissions by standard source
                                    </h2>
                                    <LuDroplets className="h-4 w-4 text-emerald-800/80" />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                                    {sourceSeries.map((s) => (
                                        <div
                                            key={s.source}
                                            className="rounded-2xl border border-emerald-900/10 bg-white/85 px-4 py-3">
                                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-emerald-900/60">
                                                {s.source}
                                            </p>
                                            <p className="mt-2 text-lg font-bold tracking-tight text-emerald-950">
                                                {formatTonnesFromKg(s.co2e)}
                                            </p>
                                            <p className="text-xs font-semibold text-slate-600">tCO2e</p>
                                        </div>
                                    ))}
                                    {!sourceSeries.length ? (
                                        <div className="sm:col-span-2 lg:col-span-5 rounded-2xl border border-emerald-900/10 bg-white/85 px-4 py-4 text-sm font-semibold text-slate-600">
                                            No standard source information available yet.
                                        </div>
                                    ) : null}
                                </div>
                            </section>

                        </>
                    ) : null}
                </section>
            </main>

            <div
                className={[
                    "fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300",
                    isModalOpen
                        ? "pointer-events-auto bg-black/45 backdrop-blur-sm opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}>
                <div
                    className={[
                        "w-full max-w-2xl rounded-3xl border border-white/35 bg-white/90 p-5 shadow-2xl transition-all duration-300 sm:p-6",
                        isModalOpen ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]",
                    ].join(" ")}>
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/80">
                                <LuSparkles className="h-3.5 w-3.5" />
                                Scope-1 ingestion
                            </p>
                            <h3 className="mt-2 text-xl font-bold tracking-tight text-emerald-950">
                                Add new emission record
                            </h3>
                            <p className="mt-1 text-sm text-slate-700">
                                Enter activity details to ingest Scope-1 data into the reporting pipeline.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/15 bg-white text-emerald-900 transition hover:bg-emerald-50">
                            <LuX className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={onSubmitIngest} className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
                            <Field label="Standard">
                                {isMounted ? (
                                    <Select
                                        inputId="scope1-standard"
                                        instanceId="scope1-standard"
                                        isLoading={isLoadingFactors}
                                        isDisabled={!standardOptions.length}
                                        value={selectedStandardOption}
                                        onChange={(opt) => {
                                            const key = opt?.value ?? null;
                                            setSelectedStandardKey(key);
                                            setSelectedFuelType(null);
                                            setSelectedFactor(null);
                                            setIngestForm((p) => ({ ...p, fuelName: "", fuelType: "", unit: "" }));
                                        }}
                                        options={standardOptions.map((o) => ({ label: o.label, value: o.value }))}
                                        placeholder={isLoadingFactors ? "Loading standards..." : "Select standard (e.g. DEFRA)"}
                                        classNamePrefix="gl-select"
                                        styles={selectStyles}
                                    />
                                ) : (
                                    <input
                                        disabled
                                        value=""
                                        placeholder="Select standard (e.g. DEFRA)"
                                        className={inputClass}
                                    />
                                )}
                            </Field>

                            <Field label="Fuel type">
                                {isMounted ? (
                                    <Select
                                        inputId="scope1-fueltype"
                                        instanceId="scope1-fueltype"
                                        isDisabled={!fuelTypeOptions.length}
                                        value={selectedFuelTypeOption}
                                        onChange={(opt) => {
                                            const ft = opt?.value ?? null;
                                            setSelectedFuelType(ft);
                                            setSelectedFactor(null);
                                            setIngestForm((p) => ({ ...p, fuelType: ft ?? "", fuelName: "", unit: "" }));
                                        }}
                                        options={fuelTypeOptions}
                                        placeholder="Select fuel type"
                                        classNamePrefix="gl-select"
                                        styles={selectStyles}
                                    />
                                ) : (
                                    <input disabled value="" placeholder="Select fuel type" className={inputClass} />
                                )}
                            </Field>

                            <Field label="Fuel name">
                                {isMounted ? (
                                    <Select
                                        inputId="scope1-fuelname"
                                        instanceId="scope1-fuelname"
                                        isDisabled={!fuelNameOptions.length}
                                        value={
                                            ingestForm.fuelName
                                                ? { label: ingestForm.fuelName, value: ingestForm.fuelName }
                                                : null
                                        }
                                        onChange={(opt) => {
                                            const fuelName = opt?.value ?? "";
                                            const match =
                                                filteredByStandard.find((f) => {
                                                    const fn = (f.fuelName ?? "").trim();
                                                    const ft = (f.fuelType ?? "").trim();
                                                    return fn === fuelName && (!selectedFuelType || ft === selectedFuelType);
                                                }) ?? null;

                                            setSelectedFactor(match);
                                            setIngestForm((p) => ({
                                                ...p,
                                                fuelName,
                                                fuelType: match?.fuelType ?? p.fuelType,
                                                unit: match?.unit ?? p.unit ?? "",
                                            }));
                                        }}
                                        options={fuelNameOptions}
                                        placeholder="Search fuel"
                                        classNamePrefix="gl-select"
                                        styles={selectStyles}
                                    />
                                ) : (
                                    <input disabled value="" placeholder="Search fuel" className={inputClass} />
                                )}
                            </Field>
                        </div>

                        <div className="sm:col-span-2 rounded-2xl border border-emerald-900/10 bg-white/85 p-4 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900/60">
                                        Factor details
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {selectedFactor?.fuelName ? selectedFactor.fuelName : "Select a factor to see unit and conversion info."}
                                    </p>
                                </div>
                                {selectedFactor?.emissionStandard?.source ? (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.72rem] font-semibold text-emerald-900/85">
                                        <LuBadgeCheck className="h-4 w-4" />
                                        {[
                                            selectedFactor.emissionStandard.source,
                                            selectedFactor.emissionStandard.gwpBasis,
                                            selectedFactor.emissionStandard.version,
                                        ]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { k: "Input unit", v: selectedFactor?.unit ?? ingestForm.unit ?? "-" },
                                    { k: "Converted to", v: selectedFactor?.convertTo ?? "-" },
                                    { k: "Factor year", v: selectedFactor?.year ?? "-" },
                                    { k: "CO2e total", v: typeof selectedFactor?.co2eTotal === "number" ? formatNumber(selectedFactor.co2eTotal) : "-" },
                                    { k: "CO2 factor", v: typeof selectedFactor?.co2Factor === "number" ? formatNumber(selectedFactor.co2Factor) : "-" },
                                    { k: "CH4 factor", v: typeof selectedFactor?.ch4Factor === "number" ? formatNumber(selectedFactor.ch4Factor) : "-" },
                                    { k: "N2O factor", v: typeof selectedFactor?.n2oFactor === "number" ? formatNumber(selectedFactor.n2oFactor) : "-" },
                                    {
                                        k: "Conversion",
                                        v:
                                            selectedFactor?.unit && selectedFactor?.convertTo
                                                ? `${selectedFactor.unit} → ${selectedFactor.convertTo}`
                                                : "-",
                                    },
                                ].map((row) => (
                                    <div
                                        key={row.k}
                                        className="rounded-xl border border-emerald-900/10 bg-white/90 px-3 py-2">
                                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-emerald-900/55">
                                            {row.k}
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{row.v}</p>
                                    </div>
                                ))}
                            </div>

                            {factorError ? (
                                <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                    {factorError}
                                </div>
                            ) : null}
                        </div>

                        <Field label="Quantity">
                            <input
                                type="number"
                                step="0.01"
                                value={ingestForm.quantity}
                                onChange={(e) => setIngestForm((p) => ({ ...p, quantity: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Cost">
                            <input
                                type="number"
                                step="0.01"
                                value={ingestForm.cost}
                                onChange={(e) => setIngestForm((p) => ({ ...p, cost: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Unit">
                            <input
                                value={ingestForm.unit}
                                onChange={(e) => setIngestForm((p) => ({ ...p, unit: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Year month">
                            <input
                                value={ingestForm.yearMonth}
                                onChange={(e) => setIngestForm((p) => ({ ...p, yearMonth: e.target.value }))}
                                placeholder="YYYY-MM"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Organization">
                            <input
                                value={ingestForm.orgName}
                                onChange={(e) => setIngestForm((p) => ({ ...p, orgName: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Facility">
                            <input
                                value={ingestForm.facilityName}
                                onChange={(e) => setIngestForm((p) => ({ ...p, facilityName: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>

                        {submitError ? (
                            <p className="sm:col-span-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                {submitError}
                            </p>
                        ) : null}

                        <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={ingestMutation.isPending}
                                className="inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                                {ingestMutation.isPending ? "Saving..." : "Save emission data"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const inputClass =
    "h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45";

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: 40,
        borderRadius: 12,
        borderColor: state.isFocused ? "rgba(52,211,153,0.55)" : "rgba(15,47,20,0.15)",
        boxShadow: state.isFocused ? "0 0 0 4px rgba(167,243,208,0.55)" : "none",
        backgroundColor: "rgba(255,255,255,0.95)",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
        ":hover": {
            borderColor: state.isFocused ? "rgba(52,211,153,0.55)" : "rgba(15,47,20,0.22)",
        },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "0 10px" }),
    placeholder: (base: any) => ({ ...base, color: "rgba(51,65,85,0.7)", fontWeight: 500 }),
    singleValue: (base: any) => ({ ...base, color: "rgba(2,44,34,0.95)", fontWeight: 600 }),
    menu: (base: any) => ({
        ...base,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 25px 60px -35px rgba(0,40,25,0.55)",
        border: "1px solid rgba(15,47,20,0.12)",
    }),
    option: (base: any, state: any) => ({
        ...base,
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(15,23,42,0.95)",
        backgroundColor: state.isSelected
            ? "rgba(16,185,129,0.18)"
            : state.isFocused
              ? "rgba(16,185,129,0.10)"
              : "white",
        ":active": { backgroundColor: "rgba(16,185,129,0.20)" },
    }),
    indicatorSeparator: (base: any) => ({ ...base, backgroundColor: "rgba(15,47,20,0.12)" }),
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">{label}</span>
            {children}
        </label>
    );
}
