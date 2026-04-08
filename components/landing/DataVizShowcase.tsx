"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { LuCloud, LuFactory, LuShieldCheck } from "react-icons/lu";

type InViewOptions = {
    rootMargin?: string;
    threshold?: number;
};

function useInView(opts: InViewOptions = {}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) {
            setInView(true);
            return;
        }

        const obs = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            {
                rootMargin: opts.rootMargin ?? "0px 0px -15% 0px",
                threshold: opts.threshold ?? 0.15,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [opts.rootMargin, opts.threshold]);

    return { ref, inView };
}

function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const rect = el.getBoundingClientRect();
            const width = Math.max(0, Math.floor(rect.width));
            const height = Math.max(0, Math.floor(rect.height));
            setSize({ width, height });
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, []);

    return { ref, ...size };
}

function GlowCard({
    title,
    subtitle,
    icon,
    children,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white/78 shadow-[0_28px_70px_-32px_rgba(15,80,40,0.28)] backdrop-blur-md">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl transition duration-700 group-hover:scale-110 group-hover:bg-emerald-500/16" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl transition duration-700 group-hover:scale-110" />
            <div className="relative px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-900/60">
                            {subtitle}
                        </p>
                        <h3 className="mt-2 text-lg font-bold tracking-tight text-emerald-950 sm:text-xl">
                            {title}
                        </h3>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-900/70 shadow-sm">
                        {icon}
                    </span>
                </div>
                <div className="mt-5">{children}</div>
            </div>
        </div>
    );
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; payload?: Record<string, unknown> }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-2xl bg-white/95 px-4 py-3 text-xs shadow-xl ring-1 ring-emerald-900/10 backdrop-blur-md">
            {label ? (
                <p className="font-bold uppercase tracking-wide text-emerald-900/60">
                    {label}
                </p>
            ) : null}
            <div className="mt-2 space-y-1">
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
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

export function DataVizShowcase() {
    const { ref, inView } = useInView();
    const [mounted, setMounted] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const barsSize = useElementSize<HTMLDivElement>();
    const areaSize = useElementSize<HTMLDivElement>();
    const pieSize = useElementSize<HTMLDivElement>();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (inView) setAnimKey((k) => k + 1);
    }, [inView]);

    const scopeBars = useMemo(
        () => [
            { month: "Jan", scope1: 2.6, scope2: 1.8, scope3: 6.4 },
            { month: "Feb", scope1: 2.4, scope2: 1.7, scope3: 6.1 },
            { month: "Mar", scope1: 2.2, scope2: 1.6, scope3: 5.7 },
            { month: "Apr", scope1: 2.1, scope2: 1.5, scope3: 5.4 },
            { month: "May", scope1: 2.0, scope2: 1.4, scope3: 5.1 },
            { month: "Jun", scope1: 1.9, scope2: 1.3, scope3: 4.9 },
        ],
        []
    );

    const intensity = useMemo(
        () => [
            { q: "Q1", intensity: 62, target: 60 },
            { q: "Q2", intensity: 58, target: 57 },
            { q: "Q3", intensity: 54, target: 54 },
            { q: "Q4", intensity: 49, target: 50 },
        ],
        []
    );

    const pie = useMemo(
        () => [
            { name: "Purchased goods", value: 34, color: "rgba(31,122,63,0.75)" },
            { name: "Logistics", value: 21, color: "rgba(78,165,108,0.7)" },
            { name: "Energy", value: 18, color: "rgba(45,107,78,0.7)" },
            { name: "Travel", value: 12, color: "rgba(136,190,151,0.8)" },
            { name: "Other", value: 15, color: "rgba(49,90,67,0.55)" },
        ],
        []
    );

    return (
        <section ref={ref} className="full-bleed py-12 md:py-14">
            <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                <div className="mb-8 max-w-4xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-900/60">
                        Live-looking visuals
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                        Finance‑grade ESG dashboards, even before data is connected
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                        These are illustrative examples of the kinds of views you’ll get for Scopes 1–3,
                        reporting readiness, and audit compliance. Scroll away and back—animations replay.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <GlowCard
                        title="Scopes 1–3 rollup"
                        subtitle="Carbon accounting"
                        icon={<LuFactory className="h-5 w-5" aria-hidden />}
                    >
                        <div ref={barsSize.ref} className="h-56 sm:h-60">
                            {mounted && barsSize.width > 0 && barsSize.height > 0 ? (
                                <BarChart
                                    key={`bar-${animKey}`}
                                    width={barsSize.width}
                                    height={barsSize.height}
                                    data={scopeBars}
                                    barCategoryGap={16}
                                >
                                        <CartesianGrid stroke="rgba(15,47,20,0.08)" vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar
                                            name="Scope 1"
                                            dataKey="scope1"
                                            fill="rgba(31,122,63,0.78)"
                                            radius={[10, 10, 10, 10]}
                                            isAnimationActive
                                            animationDuration={900}
                                        />
                                        <Bar
                                            name="Scope 2"
                                            dataKey="scope2"
                                            fill="rgba(78,165,108,0.72)"
                                            radius={[10, 10, 10, 10]}
                                            isAnimationActive
                                            animationDuration={1100}
                                        />
                                        <Bar
                                            name="Scope 3"
                                            dataKey="scope3"
                                            fill="rgba(49,90,67,0.55)"
                                            radius={[10, 10, 10, 10]}
                                            isAnimationActive
                                            animationDuration={1300}
                                        />
                                </BarChart>
                            ) : (
                                <div className="h-full w-full animate-pulse rounded-2xl bg-linear-to-r from-emerald-50/80 via-white/80 to-emerald-50/80 shadow-sm" />
                            )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-950/80">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Facility view</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Energy view</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Scope‑3 categories</span>
                        </div>
                    </GlowCard>

                    <GlowCard
                        title="Emissions intensity trend"
                        subtitle="Performance"
                        icon={<LuCloud className="h-5 w-5" aria-hidden />}
                    >
                        <div ref={areaSize.ref} className="h-56 sm:h-60">
                            {mounted && areaSize.width > 0 && areaSize.height > 0 ? (
                                <AreaChart
                                    key={`area-${animKey}`}
                                    width={areaSize.width}
                                    height={areaSize.height}
                                    data={intensity}
                                    margin={{ left: 0, right: 6, top: 8, bottom: 0 }}
                                >
                                        <CartesianGrid stroke="rgba(15,47,20,0.08)" vertical={false} />
                                        <XAxis dataKey="q" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Area
                                            type="monotone"
                                            name="Intensity"
                                            dataKey="intensity"
                                            stroke="rgba(31,122,63,0.9)"
                                            strokeWidth={2.5}
                                            fill="rgba(31,122,63,0.18)"
                                            isAnimationActive
                                            animationDuration={1000}
                                        />
                                        <Area
                                            type="monotone"
                                            name="Target"
                                            dataKey="target"
                                            stroke="rgba(78,165,108,0.75)"
                                            strokeDasharray="5 6"
                                            strokeWidth={2}
                                            fill="rgba(0,0,0,0)"
                                            isAnimationActive
                                            animationDuration={1200}
                                        />
                                </AreaChart>
                            ) : (
                                <div className="h-full w-full animate-pulse rounded-2xl bg-linear-to-r from-emerald-50/80 via-white/80 to-emerald-50/80 shadow-sm" />
                            )}
                        </div>
                        <p className="mt-4 text-sm text-slate-700">
                            Track intensity vs target with confidence intervals and methodology traits.
                        </p>
                    </GlowCard>

                    <GlowCard
                        title="Scope‑3 category mix"
                        subtitle="Audit‑ready reporting"
                        icon={<LuShieldCheck className="h-5 w-5" aria-hidden />}
                    >
                        <div ref={pieSize.ref} className="h-56 sm:h-60">
                            {mounted && pieSize.width > 0 && pieSize.height > 0 ? (
                                <PieChart
                                    key={`pie-${animKey}`}
                                    width={pieSize.width}
                                    height={pieSize.height}
                                >
                                        <Tooltip content={<ChartTooltip />} />
                                        <Pie
                                            data={pie}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={52}
                                            outerRadius={88}
                                            paddingAngle={3}
                                            isAnimationActive
                                            animationDuration={1100}
                                        >
                                            {pie.map((p) => (
                                                <Cell key={p.name} fill={p.color} />
                                            ))}
                                        </Pie>
                                </PieChart>
                            ) : (
                                <div className="h-full w-full animate-pulse rounded-2xl bg-linear-to-r from-emerald-50/80 via-white/80 to-emerald-50/80 shadow-sm" />
                            )}
                        </div>
                        <div className="mt-4 grid gap-2 text-xs text-slate-700">
                            {pie.slice(0, 3).map((row) => (
                                <div key={row.name} className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ background: row.color }}
                                        />
                                        <span className="font-semibold">{row.name}</span>
                                    </span>
                                    <span className="font-bold text-emerald-950">{row.value}%</span>
                                </div>
                            ))}
                        </div>
                    </GlowCard>
                </div>
            </div>
        </section>
    );
}

