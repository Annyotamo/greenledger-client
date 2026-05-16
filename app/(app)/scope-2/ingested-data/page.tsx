"use client";

import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
    LuCalendarDays,
    LuCircleDollarSign,
    LuDatabase,
    LuFilter,
    LuPlus,
    LuSparkles,
    LuX,
    LuZap,
} from "react-icons/lu";
import { IoMdAlert } from "react-icons/io";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useIngestScope2EmissionMutation, useScope2IngestedRecordsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { Scope2ActivityDataIngest, Scope2IngestRequest } from "@/types/report";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function getMonthLabel(value: string | null | undefined): string {
    if (!value) return "N/A";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year.slice(-2)}`;
}

function safe(v: unknown): string {
    if (v === null || v === undefined || String(v).trim() === "") return "-";
    return String(v);
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
    hover: {
        y: -3,
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" as const },
    },
};

export default function Scope2IngestedDataPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const { data, isLoading, isError } = useScope2IngestedRecordsQuery();
    const ingestMutation = useIngestScope2EmissionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-06");
    const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">("all");
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    useEffect(() => {
        setActiveSection("scope-2");
    }, [setActiveSection]);

    const records: Scope2ActivityDataIngest[] = data ?? [];

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
    }, [records, startMonth, endMonth, statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [filtered.length, statusFilter, startMonth, endMonth]);

    const totals = useMemo(() => {
        const totalQty = filtered.reduce((a, r) => a + (r.quantityConsume ?? 0), 0);
        const totalCost = filtered.reduce((a, r) => a + (r.cost ?? 0), 0);
        const err = filtered.filter((r) => (r.status ?? 0) < 0).length;
        const ok = filtered.filter((r) => (r.status ?? 0) >= 0).length;
        return { totalQty, totalCost, err, ok };
    }, [filtered]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageSafe = Math.min(Math.max(1, page), totalPages);
    const paged = useMemo(() => {
        const start = (pageSafe - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, pageSafe]);

    const rangeInvalid = Boolean(startMonth && endMonth && startMonth > endMonth);

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
                year: form.yearMonth.split("-")[0] ?? "",
            };
            await ingestMutation.mutateAsync(payload);
            setSubmitSuccess("Scope-2 emission record added successfully.");
            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) return;
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add Scope-2 emission record.");
                return;
            }
            setSubmitError("Failed to add Scope-2 emission record.");
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50/50 text-slate-900">
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-400/15 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-300/15 blur-[150px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-3 pb-8 pt-16 sm:px-4 lg:pr-8 lg:pt-8",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
                    <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                Scope-2 ingestion
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                Ingested data feed
                            </h1>
                        </motion.div>

                        <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-end">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 }}>
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
                                    className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] md:w-auto">
                                    <LuPlus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                    Add emission data
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-white/40 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:w-auto">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <LuCalendarDays className="h-4 w-4 text-emerald-600" />
                                        <input
                                            type="month"
                                            value={startMonth}
                                            onChange={(e) => setStartMonth(e.target.value)}
                                            className="h-8 w-28 rounded-xl border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50 lg:w-32"
                                        />
                                        <span className="text-xs font-medium text-slate-400">to</span>
                                        <input
                                            type="month"
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="h-8 w-28 rounded-xl border-none bg-white/80 px-2 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50 lg:w-32"
                                        />
                                    </div>
                                    <div className="hidden h-5 w-px bg-slate-300/50 md:block" />
                                    <div className="flex items-center gap-2">
                                        <LuFilter className="h-4 w-4 text-slate-500" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value as "all" | "success" | "error")
                                            }
                                            className="h-8 rounded-xl border-none bg-white/80 px-2 pr-7 text-xs font-semibold text-slate-700 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/50">
                                            <option value="all">All status</option>
                                            <option value="success">Success only</option>
                                            <option value="error">Errors only</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </header>

                    <AnimatePresence>
                        {submitSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 overflow-hidden">
                                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 backdrop-blur-md">
                                    <span className="font-bold">Success:</span> {submitSuccess}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {rangeInvalid && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 overflow-hidden">
                                <div className="rounded-2xl border border-red-200/50 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-800 backdrop-blur-md">
                                    End month must be later than or equal to start month.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/40 backdrop-blur-md" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-6 text-center backdrop-blur-md">
                            <p className="text-sm font-semibold text-red-600">Failed to load Scope-2 ingested data.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { label: "Ingested rows", value: filtered.length.toString(), icon: <LuDatabase /> },
                                    {
                                        label: "Total quantity",
                                        value: formatNumber(totals.totalQty),
                                        icon: <LuZap />,
                                    },
                                    {
                                        label: "Total cost",
                                        value: formatNumber(totals.totalCost),
                                        unit: "INR",
                                        icon: <LuCircleDollarSign />,
                                    },
                                    {
                                        label: "Error rows",
                                        value: totals.err.toString(),
                                        icon: <IoMdAlert />,
                                        err: totals.err > 0,
                                    },
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={idx}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={cardVariants}
                                        className={`relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl`}>
                                        <div
                                            className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-50 blur-2xl ${
                                                "err" in stat && stat.err
                                                    ? "bg-gradient-to-br from-red-100 to-orange-50"
                                                    : "bg-gradient-to-br from-emerald-100 to-teal-50"
                                            }`}
                                        />
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm text-white shadow-lg">
                                            {stat.icon}
                                        </div>
                                        <p className="relative mt-4 text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">
                                            {stat.label}
                                        </p>
                                        <h3
                                            className={`relative mt-1 text-2xl font-bold tracking-tight ${
                                                "err" in stat && stat.err ? "text-red-600" : "text-slate-800"
                                            }`}>
                                            {stat.value}
                                            {stat.unit && (
                                                <span className="text-sm font-semibold text-slate-500 ml-2">
                                                    {stat.unit}
                                                </span>
                                            )}
                                        </h3>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                                className="mt-5 rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="mb-4 border-b border-slate-200/50 pb-3">
                                    <h2 className="text-base font-bold text-slate-800 sm:text-lg">Ingested records</h2>
                                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                                        Success rows: {totals.ok} · Errors: {totals.err}
                                    </p>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[960px] text-left text-xs">
                                            <thead className="bg-slate-50/50">
                                                <tr className="border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                                    <th className="px-3 py-2">Fuel</th>
                                                    <th className="px-3 py-2">Qty in</th>
                                                    <th className="px-3 py-2">Qty out</th>
                                                    <th className="px-3 py-2">Units</th>
                                                    <th className="px-3 py-2">Cost</th>
                                                    <th className="px-3 py-2">Facility</th>
                                                    <th className="px-3 py-2">Org</th>
                                                    <th className="px-3 py-2">Month</th>
                                                    <th className="px-3 py-2">Status</th>
                                                    <th className="px-3 py-2">Message</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {paged.map((row) => (
                                                    <tr key={row.id} className="transition-colors hover:bg-white/80">
                                                        <td className="px-3 py-2 font-semibold text-slate-800">
                                                            {safe(row.fuelName)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {formatNumber(row.quantityConsume ?? 0)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {formatNumber(row.outPutQuantityConsume ?? 0)}
                                                        </td>
                                                        <td className="px-3 py-2 text-[10px] text-slate-500">
                                                            {safe(row.unit)} → {safe(row.outputUnit)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {formatNumber(row.cost ?? 0)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {safe(row.facilityName)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {safe(row.orgName)}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-600">
                                                            {getMonthLabel(row.yearMonth)}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                                    (row.status ?? 0) >= 0
                                                                        ? "bg-emerald-100 text-emerald-800"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}>
                                                                {row.status ?? "-"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="max-w-[200px] truncate px-3 py-2 text-[10px] text-slate-500"
                                                            title={safe(row.errorMsg)}>
                                                            {safe(row.errorMsg)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {paged.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={10}
                                                            className="px-4 py-8 text-center text-sm text-slate-500">
                                                            No records in this range.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                                    <p>
                                        Page <span className="font-bold text-slate-800">{pageSafe}</span> / {totalPages}{" "}
                                        · {filtered.length} rows
                                    </p>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            disabled={pageSafe <= 1}
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            className="rounded-lg px-2 py-1 font-semibold hover:bg-white disabled:opacity-40">
                                            Prev
                                        </button>
                                        <button
                                            type="button"
                                            disabled={pageSafe >= totalPages}
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            className="rounded-lg px-2 py-1 font-semibold hover:bg-white disabled:opacity-40">
                                            Next
                                        </button>
                                    </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="scrollbar-thin max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-700">
                                        <LuSparkles className="h-3.5 w-3.5" />
                                        Manual ingestion
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
                                        Add Scope-2 record
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Indirect energy / purchased electricity activity.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
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
                                <Field label="Energy source">
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
                                <Field label="Year month">
                                    <input
                                        type="month"
                                        value={form.yearMonth}
                                        onChange={(e) => setForm((p) => ({ ...p, yearMonth: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                {submitError && (
                                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                                        {submitError}
                                    </p>
                                )}
                                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6 sm:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-11 rounded-xl px-6 text-sm font-bold text-slate-600 hover:bg-slate-100">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={ingestMutation.isPending}
                                        className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50">
                                        {ingestMutation.isPending ? "Saving…" : "Save record"}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="grid gap-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            {children}
        </label>
    );
}
