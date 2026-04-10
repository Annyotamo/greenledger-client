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
import { useSidebarStore } from "@/lib/sidebarStore";

function DashboardTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number }>;
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
                            {typeof p.value === "number" ? p.value.toFixed(1) : "-"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

    const fluidSeries = useMemo(
        () => [
            { month: "Jan", reporting: -12, finance: -32, traceability: 95, advisory: 58 },
            { month: "Feb", reporting: -28, finance: -86, traceability: 18, advisory: 110 },
            { month: "Mar", reporting: -8, finance: 18, traceability: 82, advisory: -48 },
            { month: "Apr", reporting: -18, finance: -20, traceability: -62, advisory: 82 },
            { month: "May", reporting: -30, finance: -36, traceability: 64, advisory: -82 },
            { month: "Jun", reporting: -92, finance: 28, traceability: 118, advisory: 42 },
            { month: "Jul", reporting: 24, finance: -44, traceability: 168, advisory: 32 },
        ],
        [],
    );

    const supplierSegments = useMemo(
        () => [
            { name: "Low risk", value: 46, color: "rgba(31,122,63,0.82)" },
            { name: "Medium risk", value: 33, color: "rgba(45,107,78,0.72)" },
            { name: "High risk", value: 14, color: "rgba(78,165,108,0.72)" },
            { name: "Watchlist", value: 7, color: "rgba(136,190,151,0.85)" },
        ],
        [],
    );

    const regionalProgress = useMemo(
        () => [
            { region: "EU", completion: 92 },
            { region: "India", completion: 84 },
            { region: "APAC", completion: 76 },
            { region: "Americas", completion: 71 },
        ],
        [],
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_10%_10%,rgba(31,122,63,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_90%_5%,rgba(45,107,78,0.14),transparent_60%)]" />
            <Sidebar />

            <main
                className={[
                    "px-4 pb-2 pt-16 sm:px-5 md:pr-8 md:pt-4 lg:pr-10",
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
                                    Fluid intelligence graph
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
                                    <AreaChart data={fluidSeries} margin={{ left: 4, right: 4, top: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="fluid-a" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(255,99,132,0.78)" />
                                                <stop offset="95%" stopColor="rgba(255,99,132,0.28)" />
                                            </linearGradient>
                                            <linearGradient id="fluid-b" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(33,150,243,0.75)" />
                                                <stop offset="95%" stopColor="rgba(33,150,243,0.24)" />
                                            </linearGradient>
                                            <linearGradient id="fluid-c" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(31,122,63,0.78)" />
                                                <stop offset="95%" stopColor="rgba(31,122,63,0.22)" />
                                            </linearGradient>
                                            <linearGradient id="fluid-d" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(245,195,76,0.8)" />
                                                <stop offset="95%" stopColor="rgba(245,195,76,0.24)" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="rgba(15,47,20,0.08)" />
                                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip content={<DashboardTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="reporting"
                                            name="ESG reporting"
                                            stackId="1"
                                            stroke="rgba(255,99,132,0.95)"
                                            fill="url(#fluid-a)"
                                            fillOpacity={1}
                                            isAnimationActive
                                            animationDuration={900}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="finance"
                                            name="Financed emissions"
                                            stackId="1"
                                            stroke="rgba(33,150,243,0.9)"
                                            fill="url(#fluid-b)"
                                            fillOpacity={1}
                                            isAnimationActive
                                            animationDuration={1100}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="traceability"
                                            name="Traceability"
                                            stackId="1"
                                            stroke="rgba(31,122,63,0.95)"
                                            fill="url(#fluid-c)"
                                            fillOpacity={1}
                                            isAnimationActive
                                            animationDuration={1250}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="advisory"
                                            name="Advisory"
                                            stackId="1"
                                            stroke="rgba(245,195,76,0.95)"
                                            fill="url(#fluid-d)"
                                            fillOpacity={1}
                                            isAnimationActive
                                            animationDuration={1400}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="mt-3 text-xs text-slate-600">
                                Illustrative stacked-flow visualization for ESG reporting, financed emissions,
                                traceability, and advisory pipelines.
                            </p>
                        </section>

                        <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Demographics
                                </h2>
                                <LuSettings2 className="h-4 w-4 text-emerald-800/80" />
                            </div>
                            <div className="h-48 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                    minWidth={0}
                                    minHeight={170}
                                    debounce={120}>
                                    <PieChart>
                                        <Tooltip content={<DashboardTooltip />} />
                                        <Pie
                                            data={supplierSegments}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={42}
                                            outerRadius={72}
                                            paddingAngle={3}
                                            isAnimationActive
                                            animationDuration={1150}>
                                            {supplierSegments.map((p) => (
                                                <Cell key={p.name} fill={p.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {supplierSegments.map((row) => (
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
                                        <span className="text-sm font-bold text-slate-800">{row.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="relative mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                        <section className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900/65">
                                    Regional readiness
                                </h2>
                                <LuArrowUpRight className="h-4 w-4 text-emerald-800/80" />
                            </div>
                            <div className="h-56 min-w-0 rounded-2xl border border-emerald-900/10 bg-white/85 p-2">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                    minWidth={0}
                                    minHeight={190}
                                    debounce={120}>
                                    <BarChart data={regionalProgress} layout="vertical" margin={{ left: 20, right: 8 }}>
                                        <CartesianGrid stroke="rgba(15,47,20,0.08)" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="region"
                                            type="category"
                                            tickLine={false}
                                            axisLine={false}
                                            width={72}
                                        />
                                        <Tooltip content={<DashboardTooltip />} />
                                        <Bar
                                            dataKey="completion"
                                            name="Readiness"
                                            fill="rgba(31,122,63,0.8)"
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
                                    Settings snapshot
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
