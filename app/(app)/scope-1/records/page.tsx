"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LuArrowLeft, LuDownload } from "react-icons/lu";
import { downloadScope1ReportCsv } from "@/lib/report/api";
import { useScope1ReportsQuery } from "@/lib/report/hooks";
import type { Scope1ReportRecord } from "@/types/report";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function getCell(value: unknown): string {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") return formatNumber(value);
    return String(value);
}

export default function Scope1RecordsPage() {
    const { data, isLoading, isError } = useScope1ReportsQuery();
    const records = data ?? [];

    const [page, setPage] = useState(1);
    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
    const pageSafe = Math.min(Math.max(1, page), totalPages);

    const paged = useMemo(() => {
        const start = (pageSafe - 1) * pageSize;
        return records.slice(start, start + pageSize);
    }, [pageSafe, records]);

    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-05");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

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
        } catch {
            setDownloadError("Unable to download report CSV.");
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_10%_10%,rgba(31,122,63,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_90%_5%,rgba(45,107,78,0.14),transparent_60%)]" />

            <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8">
                <div className="rounded-3xl border border-white/60 bg-white/82 p-5 shadow-[0_30px_90px_-45px_rgba(0,40,25,0.6)] backdrop-blur-md sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <Link
                                href="/scope-1"
                                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-950 ring-1 ring-emerald-900/10 hover:bg-white"
                            >
                                <LuArrowLeft className="h-4 w-4" />
                                Back to dashboard
                            </Link>
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950">
                                Scope‑1 records
                            </h1>
                            <p className="mt-1 text-sm text-slate-700">
                                Full dataset view (paginated). Includes activity + factor linkage where available.
                            </p>
                        </div>

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
                                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <LuDownload className="h-4 w-4" />
                                {isDownloading ? "Downloading..." : "Download CSV"}
                            </button>
                        </div>
                    </div>

                    {downloadError ? (
                        <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                            {downloadError}
                        </div>
                    ) : null}

                    {isLoading ? (
                        <div className="mt-6 rounded-2xl border border-emerald-900/10 bg-white/85 p-6 text-sm font-semibold text-emerald-900">
                            Loading records...
                        </div>
                    ) : null}

                    {isError ? (
                        <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-6 text-sm font-semibold text-red-700">
                            Unable to load Scope‑1 records.
                        </div>
                    ) : null}

                    {!isLoading && !isError ? (
                        <>
                            <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-900/10 bg-white/85">
                                <table className="min-w-[1600px] w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-emerald-900/10 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-900/60">
                                            <th className="px-3 py-2">Facility</th>
                                            <th className="px-3 py-2">Org</th>
                                            <th className="px-3 py-2">Fuel</th>
                                            <th className="px-3 py-2">Fuel type</th>
                                            <th className="px-3 py-2">Report month</th>
                                            <th className="px-3 py-2">Quantity</th>
                                            <th className="px-3 py-2">Input unit</th>
                                            <th className="px-3 py-2">Output unit</th>
                                            <th className="px-3 py-2">CO2e</th>
                                            <th className="px-3 py-2">Cost</th>
                                            <th className="px-3 py-2">CO2 factor</th>
                                            <th className="px-3 py-2">CH4 factor</th>
                                            <th className="px-3 py-2">N2O factor</th>
                                            <th className="px-3 py-2">Std source</th>
                                            <th className="px-3 py-2">Std version</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paged.map((row: Scope1ReportRecord, idx) => {
                                            const std = (row.scope1FactorData as any)?.emissionStandard;
                                            return (
                                                <tr
                                                    key={`${row.id}-${idx}`}
                                                    className="border-b border-emerald-900/7 text-slate-700 hover:bg-emerald-50/45"
                                                >
                                                    <td className="px-3 py-2 font-semibold text-slate-900">
                                                        {getCell(row.facilityName)}
                                                    </td>
                                                    <td className="px-3 py-2">{getCell(row.orgName)}</td>
                                                    <td className="px-3 py-2">{getCell(row.fuelName)}</td>
                                                    <td className="px-3 py-2">{getCell(row.fuelType)}</td>
                                                    <td className="px-3 py-2">{getCell(row.reportDate)}</td>
                                                    <td className="px-3 py-2">
                                                        {typeof row.activityData?.quantity === "number"
                                                            ? formatNumber(row.activityData.quantity)
                                                            : "-"}
                                                    </td>
                                                    <td className="px-3 py-2">{getCell(row.inputUnit ?? row.activityData?.unit)}</td>
                                                    <td className="px-3 py-2">{getCell(row.outputUnit ?? row.scope1FactorData?.convertTo)}</td>
                                                    <td className="px-3 py-2 font-semibold text-emerald-900">
                                                        {formatNumber(row.co2eTotal ?? 0)}
                                                    </td>
                                                    <td className="px-3 py-2">{formatNumber(row.cost ?? 0)}</td>
                                                    <td className="px-3 py-2">{formatNumber(row.co2Factor ?? 0)}</td>
                                                    <td className="px-3 py-2">{formatNumber(row.ch4Factor ?? 0)}</td>
                                                    <td className="px-3 py-2">{formatNumber(row.n2oFactor ?? 0)}</td>
                                                    <td className="px-3 py-2">{getCell(std?.source)}</td>
                                                    <td className="px-3 py-2">{getCell(std?.version)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-xs font-semibold text-slate-600">
                                    Showing{" "}
                                    <span className="text-slate-900">
                                        {records.length ? (pageSafe - 1) * pageSize + 1 : 0}
                                    </span>
                                    {"–"}
                                    <span className="text-slate-900">
                                        {Math.min(pageSafe * pageSize, records.length)}
                                    </span>{" "}
                                    of <span className="text-slate-900">{records.length}</span>
                                </p>
                                <div className="inline-flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPage(1)}
                                        disabled={pageSafe <= 1}
                                        className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        First
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={pageSafe <= 1}
                                        className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-xs font-semibold text-slate-700">
                                        Page {pageSafe}/{totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={pageSafe >= totalPages}
                                        className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Next
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPage(totalPages)}
                                        disabled={pageSafe >= totalPages}
                                        className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </main>
        </div>
    );
}

