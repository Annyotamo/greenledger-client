"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LuActivity, LuBolt, LuBuilding2, LuCircleDollarSign, LuFactory, LuPlus, LuSparkles, LuX } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useIngestScope2EmissionMutation, useScope2ReportsQuery } from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { Scope2IngestRequest } from "@/types/report";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
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

function DashboardTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number | string }>;
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
                            {typeof p.value === "number" ? formatNumber(p.value) : (p.value ?? "-")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Scope2Page() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const { data, isLoading, isError } = useScope2ReportsQuery();
    const ingestMutation = useIngestScope2EmissionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [form, setForm] = useState({
        quantityConsume: "",
        unit: "kwh",
        fuelName: "electricity",
        outputUnit: "MWh",
        cost: "",
        facilityName: "",
        orgName: "",
        yearMonth: "",
        year: "",
    });

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
            .map(([month, v]) => ({ month, monthLabel: getMonthLabel(month), emissions: toTonne(v.emissions), cost: v.cost }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [records]);

    const facilitySeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const facility = row.facilityName ?? "Unknown facility";
            map.set(facility, (map.get(facility) ?? 0) + (row.co2eTotal ?? 0));
        }
        return Array.from(map.entries()).map(([facility, co2e]) => ({ facility, co2e: toTonne(co2e) })).sort((a, b) => b.co2e - a.co2e);
    }, [records]);

    const sourceSeries = useMemo(() => {
        const map = new Map<string, number>();
        for (const row of records) {
            const source = row.scope2Factor?.factorSource ?? "Unknown";
            map.set(source, (map.get(source) ?? 0) + (row.co2eTotal ?? 0));
        }
        const palette = [
            "rgba(31,122,63,0.88)",
            "rgba(45,107,78,0.82)",
            "rgba(78,165,108,0.78)",
            "rgba(136,190,151,0.84)",
            "rgba(54,120,96,0.8)",
        ];
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
                year: form.year,
            };
            await ingestMutation.mutateAsync(payload);
            setSubmitSuccess("Scope-2 emission record added successfully.");
            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add Scope-2 emission record.");
                return;
            }
            setSubmitError("Failed to add Scope-2 emission record.");
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_10%_10%,rgba(31,122,63,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_90%_5%,rgba(45,107,78,0.14),transparent_60%)]" />
            <Sidebar />

            <main className={["px-4 pb-8 pt-16 sm:px-5 lg:pr-10 lg:pt-7", sidebarOpen ? "lg:pl-80" : "lg:pl-28", "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"].join(" ")}>
                <section className="section-bg relative overflow-hidden rounded-3xl border border-white/60 p-5 shadow-[0_30px_90px_-45px_rgba(0,40,25,0.6)] backdrop-blur-md sm:p-6 md:p-7">
                    <header className="relative mb-6 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/75">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                                GHG accounting · Scope-2 analytics
                            </p>
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">Scope-2 Emissions Intelligence</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">Electricity and indirect emissions overview with clean visual analytics.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSubmitError(null);
                                setSubmitSuccess(null);
                                setForm({ quantityConsume: "", unit: "kwh", fuelName: "electricity", outputUnit: "MWh", cost: "", facilityName: "", orgName: "", yearMonth: "", year: "" });
                                setIsModalOpen(true);
                            }}
                            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            <LuPlus className="h-4 w-4" />
                            Add emission data
                        </button>
                    </header>

                    {submitSuccess ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{submitSuccess}</div> : null}
                    {isLoading ? <div className="rounded-2xl border border-emerald-900/10 bg-white/85 p-6 text-sm font-semibold text-emerald-900">Loading Scope-2 report data...</div> : null}
                    {isError ? <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm font-semibold text-red-700">Unable to load Scope-2 report data. Please check token/session and try again.</div> : null}

                    {!isLoading && !isError ? (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { label: "Total emissions", value: `${formatNumber(toTonne(totals.totalEmissions))} tCO2e`, icon: <LuBolt /> },
                                    { label: "Total records", value: records.length.toString(), icon: <LuFactory /> },
                                    { label: "Total cost", value: formatNumber(totals.totalCost), icon: <LuCircleDollarSign /> },
                                    { label: "Energy consumed", value: formatNumber(totals.totalConsumed), icon: <LuActivity /> },
                                ].map((stat) => (
                                    <article key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                                        <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-900/70">
                                            {stat.label}
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-900/80">{stat.icon}</span>
                                        </p>
                                        <p className="mt-3 text-xl font-bold tracking-tight text-emerald-950">{stat.value}</p>
                                    </article>
                                ))}
                            </div>

                            <section className="mt-5 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-sm sm:p-5">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">Scope-2 report records</h2>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-[1020px] text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-emerald-900/10 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-900/60">
                                                <th className="px-3 py-2">Facility</th>
                                                <th className="px-3 py-2">Org</th>
                                                <th className="px-3 py-2">Fuel</th>
                                                <th className="px-3 py-2">Year month</th>
                                                <th className="px-3 py-2">Consumption</th>
                                                <th className="px-3 py-2">Unit</th>
                                                <th className="px-3 py-2">Output unit</th>
                                                <th className="px-3 py-2">tCO2e</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagedRecords.map((row, idx) => (
                                                <tr key={`${row.ingest_reference_id ?? "r"}-${idx}`} className="border-b border-emerald-900/7 text-slate-700 hover:bg-emerald-50/45">
                                                    <td className="px-3 py-2 font-semibold text-slate-900">{row.facilityName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.orgName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.fuelName ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.yearMonth ?? "-"}</td>
                                                    <td className="px-3 py-2">{formatNumber(row.quantityConsume ?? 0)}</td>
                                                    <td className="px-3 py-2">{row.unit ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.outputUnit ?? "-"}</td>
                                                    <td className="px-3 py-2 font-semibold text-emerald-900">{formatNumber(toTonne(row.co2eTotal ?? 0))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs font-semibold text-slate-600">
                                        Showing{" "}
                                        <span className="text-slate-900">{records.length ? (recordsPageSafe - 1) * recordsPageSize + 1 : 0}</span>
                                        {"–"}
                                        <span className="text-slate-900">{Math.min(recordsPageSafe * recordsPageSize, records.length)}</span> of{" "}
                                        <span className="text-slate-900">{records.length}</span>
                                    </p>
                                    <div className="inline-flex items-center gap-2">
                                        <button type="button" onClick={() => setRecordsPage(1)} disabled={recordsPageSafe <= 1} className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">First</button>
                                        <button type="button" onClick={() => setRecordsPage((p) => Math.max(1, p - 1))} disabled={recordsPageSafe <= 1} className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">Prev</button>
                                        <span className="text-xs font-semibold text-slate-700">Page {recordsPageSafe}/{recordsTotalPages}</span>
                                        <button type="button" onClick={() => setRecordsPage((p) => Math.min(recordsTotalPages, p + 1))} disabled={recordsPageSafe >= recordsTotalPages} className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">Next</button>
                                        <button type="button" onClick={() => setRecordsPage(recordsTotalPages)} disabled={recordsPageSafe >= recordsTotalPages} className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white/85 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">Last</button>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">Monthly emissions trend</h2>
                                    <div className="h-72 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/75 p-2 sm:p-3">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                                            <AreaChart data={monthlySeries} margin={{ left: 4, right: 4, top: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="scope2-a" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="rgba(31,122,63,0.8)" />
                                                        <stop offset="95%" stopColor="rgba(31,122,63,0.2)" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid stroke="rgba(15,47,20,0.08)" />
                                                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
                                                <YAxis tickLine={false} axisLine={false} />
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Area type="monotone" dataKey="emissions" name="tCO2e" stroke="rgba(31,122,63,0.95)" fill="url(#scope2-a)" fillOpacity={1} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                    <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">Emissions by source</h2>
                                    <div className="h-72 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190}>
                                            <PieChart>
                                                <Tooltip content={<DashboardTooltip />} />
                                                <Pie
                                                    data={sourceSeries}
                                                    dataKey="co2e"
                                                    nameKey="source"
                                                    innerRadius={48}
                                                    outerRadius={84}
                                                    paddingAngle={3}
                                                >
                                                    {sourceSeries.map((row) => (
                                                        <Cell key={row.source} fill={row.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        {sourceSeries.map((row) => (
                                            <div key={row.source} className="flex items-center justify-between rounded-xl bg-white/85 px-3 py-2">
                                                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-900/65">
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                                                    {row.source}
                                                </span>
                                                <span className="text-sm font-bold text-emerald-950">{formatNumber(row.co2e)} tCO2e</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <section className="mt-5 rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">Facility emissions distribution</h2>
                                    <LuBuilding2 className="h-4 w-4 text-emerald-800/80" />
                                </div>
                                <div className="h-72 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190}>
                                        <BarChart data={facilitySeries} layout="vertical" margin={{ left: 0, right: 8 }}>
                                            <CartesianGrid stroke="rgba(15,47,20,0.08)" horizontal={false} />
                                            <XAxis type="number" tickLine={false} axisLine={false} />
                                            <YAxis dataKey="facility" type="category" tickLine={false} axisLine={false} width={80} />
                                            <Tooltip content={<DashboardTooltip />} />
                                            <Bar dataKey="co2e" name="tCO2e" fill="rgba(31,122,63,0.82)" radius={[8, 8, 8, 8]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                        </>
                    ) : null}
                </section>
            </main>

            <div className={["fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300", isModalOpen ? "pointer-events-auto bg-black/45 backdrop-blur-sm opacity-100" : "pointer-events-none opacity-0"].join(" ")}>
                <div className={["w-full max-w-2xl rounded-3xl border border-white/35 bg-white/90 p-5 shadow-2xl transition-all duration-300 sm:p-6", isModalOpen ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"].join(" ")}>
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/80">
                                <LuSparkles className="h-3.5 w-3.5" />
                                Scope-2 ingestion
                            </p>
                            <h3 className="mt-2 text-xl font-bold tracking-tight text-emerald-950">Add new emission record</h3>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/15 bg-white text-emerald-900 transition hover:bg-emerald-50">
                            <LuX className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
                        <Field label="Quantity consume"><input type="number" step="0.01" value={form.quantityConsume} onChange={(e) => setForm((p) => ({ ...p, quantityConsume: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Unit"><input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Fuel name"><input value={form.fuelName} onChange={(e) => setForm((p) => ({ ...p, fuelName: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Output unit"><input value={form.outputUnit} onChange={(e) => setForm((p) => ({ ...p, outputUnit: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Cost"><input type="number" step="0.01" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Facility"><input value={form.facilityName} onChange={(e) => setForm((p) => ({ ...p, facilityName: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Organization"><input value={form.orgName} onChange={(e) => setForm((p) => ({ ...p, orgName: e.target.value }))} className={inputClass} /></Field>
                        <Field label="Year month"><input value={form.yearMonth} onChange={(e) => setForm((p) => ({ ...p, yearMonth: e.target.value }))} placeholder="YYYY-MM" className={inputClass} /></Field>
                        <Field label="Year"><input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className={inputClass} /></Field>

                        {submitError ? <p className="sm:col-span-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{submitError}</p> : null}

                        <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-white px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50">Cancel</button>
                            <button type="submit" disabled={ingestMutation.isPending} className="inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">{ingestMutation.isPending ? "Saving..." : "Save emission data"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const inputClass = "h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">{label}</span>
            {children}
        </label>
    );
}

