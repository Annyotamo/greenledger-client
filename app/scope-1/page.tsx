"use client";

import { useMemo, useState } from "react";
import { LuCalculator, LuCheck, LuDroplets, LuFactory, LuFlame, LuLeaf, LuSave, LuSparkles } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

type Scope1Form = {
    fuelName: string;
    fuelType: string;
    unit: string;
    co2eTotal: number;
    co2Factor: number;
    ch4Factor: number;
    n2oFactor: number;
    convertTo: string;
    sourceCategory: string;
    region: string;
    reportingYear: string;
};

const defaultValue: Scope1Form = {
    fuelName: "Petrol (100% mineral petrol)",
    fuelType: "Liquid fuels",
    unit: "tonnes",
    co2eTotal: 3154.08213,
    co2Factor: 3135,
    ch4Factor: 11.0432,
    n2oFactor: 8.03893,
    convertTo: "kg",
    sourceCategory: "Stationary combustion",
    region: "India",
    reportingYear: "2026",
};

export default function Scope1Page() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const [form, setForm] = useState<Scope1Form>(defaultValue);

    const payloadPreview = useMemo(
        () => ({
            fuelName: form.fuelName,
            fuelType: form.fuelType,
            unit: form.unit,
            co2eTotal: Number(form.co2eTotal),
            co2Factor: Number(form.co2Factor),
            ch4Factor: Number(form.ch4Factor),
            n2oFactor: Number(form.n2oFactor),
            convertTo: form.convertTo,
            sourceCategory: form.sourceCategory,
            region: form.region,
            reportingYear: form.reportingYear,
        }),
        [form]
    );

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
                        <div className="animate-fade-up">
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/75">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                                Scope-1 emissions factor setup
                            </p>
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                Add Scope-1 Factor
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
                                Configure direct emissions factors with clean validation-ready structure. UI-only for
                                now, built for production-like data entry flow.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm">
                            <LuSparkles className="h-4 w-4" />
                            Professional mode
                        </div>
                    </header>

                    <div className="relative grid gap-5 xl:grid-cols-[1.35fr_1fr]">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Factor details
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm(defaultValue);
                                        setActiveSection("scope-1");
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100">
                                    <LuCheck className="h-3.5 w-3.5" />
                                    Load sample
                                </button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="Fuel name">
                                    <input
                                        value={form.fuelName}
                                        onChange={(e) => setForm((p) => ({ ...p, fuelName: e.target.value }))}
                                        className={inputClass}
                                        placeholder="e.g. Petrol (100% mineral petrol)"
                                    />
                                </Field>
                                <Field label="Fuel type">
                                    <select
                                        value={form.fuelType}
                                        onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value }))}
                                        className={inputClass}>
                                        {["Liquid fuels", "Gaseous fuels", "Solid fuels", "Biofuels", "Blended fuels"].map(
                                            (v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>
                                <Field label="Unit">
                                    <select
                                        value={form.unit}
                                        onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                                        className={inputClass}>
                                        {["tonnes", "litres", "kg", "m3", "Nm3"].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Convert to">
                                    <select
                                        value={form.convertTo}
                                        onChange={(e) => setForm((p) => ({ ...p, convertTo: e.target.value }))}
                                        className={inputClass}>
                                        {["kg", "tCO2e", "g", "lbs"].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="CO2e total">
                                    <input
                                        type="number"
                                        step="0.00001"
                                        value={form.co2eTotal}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, co2eTotal: Number(e.target.value || 0) }))
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="CO2 factor">
                                    <input
                                        type="number"
                                        step="0.00001"
                                        value={form.co2Factor}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, co2Factor: Number(e.target.value || 0) }))
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="CH4 factor">
                                    <input
                                        type="number"
                                        step="0.00001"
                                        value={form.ch4Factor}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, ch4Factor: Number(e.target.value || 0) }))
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="N2O factor">
                                    <input
                                        type="number"
                                        step="0.00001"
                                        value={form.n2oFactor}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, n2oFactor: Number(e.target.value || 0) }))
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Source category">
                                    <select
                                        value={form.sourceCategory}
                                        onChange={(e) => setForm((p) => ({ ...p, sourceCategory: e.target.value }))}
                                        className={inputClass}>
                                        {[
                                            "Stationary combustion",
                                            "Mobile combustion",
                                            "Process emissions",
                                            "Fugitive emissions",
                                        ].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Region">
                                    <select
                                        value={form.region}
                                        onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                                        className={inputClass}>
                                        {["India", "EU", "US", "UK", "SEA", "Global default"].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Reporting year">
                                    <select
                                        value={form.reportingYear}
                                        onChange={(e) => setForm((p) => ({ ...p, reportingYear: e.target.value }))}
                                        className={inputClass}>
                                        {["2026", "2025", "2024", "2023"].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                    <LuSave className="h-4 w-4" />
                                    Save factor
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-900/15 bg-white/80 px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-white">
                                    <LuCalculator className="h-4 w-4" />
                                    Validate formula
                                </button>
                            </div>
                        </form>

                        <aside className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm sm:p-5">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                Live payload preview
                            </h2>
                            <pre className="mt-3 max-h-[360px] overflow-auto rounded-xl border border-emerald-900/10 bg-emerald-950 p-3 text-xs leading-relaxed text-emerald-100">
                                {JSON.stringify(payloadPreview, null, 4)}
                            </pre>

                            <div className="mt-4 grid gap-2">
                                {[
                                    { label: "Method", value: "Direct factor-based", icon: <LuFlame className="h-4 w-4" /> },
                                    { label: "Domain", value: "Scope-1 stationary/mobile", icon: <LuFactory className="h-4 w-4" /> },
                                    { label: "Impact class", value: "CO2 / CH4 / N2O", icon: <LuDroplets className="h-4 w-4" /> },
                                    { label: "Control state", value: "Draft (UI-only)", icon: <LuLeaf className="h-4 w-4" /> },
                                ].map((it) => (
                                    <div
                                        key={it.label}
                                        className="flex items-center justify-between rounded-xl border border-emerald-900/10 bg-white/85 px-3 py-2.5">
                                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-900/65">
                                            {it.icon}
                                            {it.label}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{it.value}</span>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}

const inputClass =
    "h-11 w-full rounded-xl border border-emerald-900/15 bg-white/90 px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">{label}</span>
            {children}
        </label>
    );
}

