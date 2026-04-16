"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
    LuActivity,
    LuBuilding2,
    LuCircleDollarSign,
    LuDroplets,
    LuFactory,
    LuFuel,
    LuLeaf,
    LuPlus,
    LuSparkles,
    LuTriangleAlert,
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
import { useIngestScope1EmissionMutation, useScope1ReportsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { Scope1IngestRequest, Scope1ReportRecord } from "@/types/report";

type ChartTooltipPayload = Array<{ name?: string; value?: number | string }>;

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
    const [ingestForm, setIngestForm] = useState<Scope1IngestRequest>({
        fuelName: "LPG",
        fuelType: "Gaseous Fuel",
        quantity: 45.5,
        cost: 6844.25,
        unit: "tonnes",
        orgName: "greenledger",
        facilityName: "kolkata",
        yearMonth: "2026-04",
    });
    const records = data ?? [];

    useEffect(() => {
        setActiveSection("scope-1");
    }, [setActiveSection]);

    const totals = useMemo(() => {
        const totalCo2e = records.reduce((acc, row) => acc + (row.co2eTotal ?? 0), 0);
        const totalCost = records.reduce((acc, row) => acc + (row.cost ?? 0), 0);
        const withFacility = records.filter((row) => row.facilityName).length;
        const avgFactor = records.length
            ? records.reduce((acc, row) => acc + (row.co2Factor ?? 0), 0) / records.length
            : 0;

        return { totalCo2e, totalCost, withFacility, avgFactor };
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
            .sort((a, b) => b.co2e - a.co2e)
            .slice(0, 5);
    }, [records]);

    async function onSubmitIngest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await ingestMutation.mutateAsync(ingestForm);
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
                    "px-4 pb-8 pt-16 sm:px-5 md:pr-8 md:pt-7 lg:pr-10",
                    sidebarOpen ? "md:pl-80" : "md:pl-28",
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
                                Live report view from backend with professional metrics, trend analytics, and fuel/facility
                                level breakdowns.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/80 px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-white">
                            <LuActivity className="h-4 w-4 text-emerald-800" />
                            Refresh data
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSubmitError(null);
                                setSubmitSuccess(null);
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
                            <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        label: "Total emissions",
                                        value: `${formatNumber(totals.totalCo2e)} kgCO2e`,
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
                                    {
                                        label: "Average CO2 factor",
                                        value: formatNumber(totals.avgFactor),
                                        icon: <LuDroplets />,
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
                                        <p className="mt-3 text-xl font-bold tracking-tight text-emerald-950">{stat.value}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="relative mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
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
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={120}>
                                            <AreaChart data={monthlySeries} margin={{ left: 4, right: 4, top: 10, bottom: 0 }}>
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
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190} debounce={120}>
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
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                                                    {row.name}
                                                </span>
                                                <span className="text-sm font-bold text-slate-800">{formatNumber(row.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="relative mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                            Top facilities by emissions
                                        </h2>
                                        <LuBuilding2 className="h-4 w-4 text-emerald-800/80" />
                                    </div>
                                    <div className="h-56 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190} debounce={120}>
                                            <BarChart data={facilitySeries} layout="vertical" margin={{ left: 20, right: 8 }}>
                                                <CartesianGrid stroke="rgba(15,47,20,0.08)" horizontal={false} />
                                                <XAxis type="number" tickLine={false} axisLine={false} />
                                                <YAxis dataKey="facility" type="category" tickLine={false} axisLine={false} width={112} />
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
                                </section>

                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                            Data quality snapshot
                                        </h2>
                                        <LuTriangleAlert className="h-4 w-4 text-emerald-800/80" />
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { k: "Records with facility", v: `${totals.withFacility}/${records.length}` },
                                            {
                                                k: "Records with report month",
                                                v: `${records.filter((r) => Boolean(r.reportDate)).length}/${records.length}`,
                                            },
                                            {
                                                k: "Records with factor data",
                                                v: `${records.filter((r) => Boolean(r.scope1FactorData)).length}/${records.length}`,
                                            },
                                            {
                                                k: "Records with activity data",
                                                v: `${records.filter((r) => Boolean(r.activityData)).length}/${records.length}`,
                                            },
                                        ].map((row) => (
                                            <div
                                                key={row.k}
                                                className="flex items-center justify-between rounded-xl border border-emerald-900/10 bg-white/85 px-3 py-2.5">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">
                                                    {row.k}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-800">{row.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <section className="mt-5 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-sm sm:p-5">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Scope-1 report records
                                </h2>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-emerald-900/10 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-900/60">
                                                <th className="px-3 py-2">Fuel</th>
                                                <th className="px-3 py-2">Fuel type</th>
                                                <th className="px-3 py-2">Facility</th>
                                                <th className="px-3 py-2">Report month</th>
                                                <th className="px-3 py-2">CO2e</th>
                                                <th className="px-3 py-2">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((row) => (
                                                <tr key={row.id} className="border-b border-emerald-900/7 text-slate-700 hover:bg-emerald-50/45">
                                                    <td className="px-3 py-2 font-semibold text-slate-900">{row.fuelName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.fuelType ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.facilityName ?? "Unmapped facility"}</td>
                                                    <td className="px-3 py-2">{row.reportDate ?? "-"}</td>
                                                    <td className="px-3 py-2 font-semibold text-emerald-900">
                                                        {formatNumber(row.co2eTotal ?? 0)}
                                                    </td>
                                                    <td className="px-3 py-2">{formatNumber(row.cost ?? 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : null}
                </section>
            </main>

            <div
                className={[
                    "fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300",
                    isModalOpen ? "pointer-events-auto bg-black/45 backdrop-blur-sm opacity-100" : "pointer-events-none opacity-0",
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
                        <Field label="Fuel name">
                            <input
                                value={ingestForm.fuelName}
                                onChange={(e) => setIngestForm((p) => ({ ...p, fuelName: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Fuel type">
                            <input
                                value={ingestForm.fuelType}
                                onChange={(e) => setIngestForm((p) => ({ ...p, fuelType: e.target.value }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Quantity">
                            <input
                                type="number"
                                step="0.01"
                                value={ingestForm.quantity}
                                onChange={(e) => setIngestForm((p) => ({ ...p, quantity: Number(e.target.value || 0) }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Cost">
                            <input
                                type="number"
                                step="0.01"
                                value={ingestForm.cost}
                                onChange={(e) => setIngestForm((p) => ({ ...p, cost: Number(e.target.value || 0) }))}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">{label}</span>
            {children}
        </label>
    );
}
