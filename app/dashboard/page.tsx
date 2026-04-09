"use client";

import { useMemo } from "react";
import {
    LuActivity,
    LuArrowUpRight,
    LuBellRing,
    LuCloud,
    LuFactory,
    LuGauge,
    LuLeaf,
    LuSettings2,
    LuShieldCheck,
    LuSparkles,
} from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

export default function DashboardPage() {
    const activeSection = useSidebarStore((s) => s.activeSection);
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const heading = useMemo(() => {
        const labels: Record<string, string> = {
            "esg-accounting": "ESG accounting cockpit",
            "ghg-accounting": "GHG accounting overview",
            "finance-esg-reporting": "Finance-grade reporting",
            "audit-compliance": "Audit compliance center",
            "scope-1": "Scope-1 emissions",
            traceability: "Traceability studio",
            settings: "Workspace settings",
        };
        return labels[activeSection ?? "esg-accounting"] ?? "Dashboard";
    }, [activeSection]);

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
                                GreenLedger Control Tower
                            </p>
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                {heading}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
                                Unified sustainability operations with premium clarity across ESG ledgers, scope data,
                                controls, and disclosure workflows.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/80 px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-white">
                            <LuBellRing className="h-4 w-4 text-emerald-800" />
                            Notifications
                        </button>
                    </header>

                    <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: "Portfolio emissions", value: "42.8k tCO2e", delta: "-4.2%", icon: <LuCloud /> },
                            { label: "Assurance readiness", value: "93%", delta: "+6 pts", icon: <LuShieldCheck /> },
                            { label: "Supplier traceability", value: "78%", delta: "+11%", icon: <LuFactory /> },
                            { label: "Active controls", value: "164", delta: "All healthy", icon: <LuGauge /> },
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
                                <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-950">{stat.value}</p>
                                <p className="mt-1 text-xs font-semibold text-emerald-800">{stat.delta}</p>
                            </article>
                        ))}
                    </div>

                    <div className="relative mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
                        <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Performance timeline
                                </h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                                    <LuActivity className="h-3.5 w-3.5" />
                                    Live
                                </span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    {
                                        t: "CSRD package v3 approved",
                                        m: "Finance reviewer signoff completed",
                                    },
                                    {
                                        t: "Scope-3 supplier factors updated",
                                        m: "28 tier-1 suppliers synced",
                                    },
                                    {
                                        t: "Evidence trails enriched",
                                        m: "New controls linked to 52 entries",
                                    },
                                    {
                                        t: "Traceability storyboard published",
                                        m: "Consumer QR flow in staging",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.t}
                                        className="rounded-2xl border border-emerald-900/10 bg-white/85 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                                        <p className="text-sm font-semibold text-emerald-950">{item.t}</p>
                                        <p className="mt-1 text-xs text-slate-700">{item.m}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Settings
                                </h2>
                                <LuSettings2 className="h-4 w-4 text-emerald-800/80" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    { k: "Default framework", v: "CSRD + ESRS" },
                                    { k: "Risk alerts", v: "Enabled" },
                                    { k: "Approval mode", v: "Two-step review" },
                                    { k: "Workspace region", v: "EU + APAC" },
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
                            <button
                                type="button"
                                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                Open full settings
                                <LuArrowUpRight className="h-4 w-4" />
                            </button>
                        </section>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                        {[
                            { label: "Award-grade UI baseline", icon: <LuSparkles className="h-3.5 w-3.5" /> },
                            { label: "Scope 1-3 workflows", icon: <LuLeaf className="h-3.5 w-3.5" /> },
                            { label: "Evidence + controls", icon: <LuShieldCheck className="h-3.5 w-3.5" /> },
                        ].map((chip) => (
                            <span
                                key={chip.label}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1.5 font-semibold text-emerald-900/85 shadow-sm">
                                {chip.icon}
                                {chip.label}
                            </span>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

