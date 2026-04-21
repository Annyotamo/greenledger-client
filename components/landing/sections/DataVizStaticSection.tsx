import { LuCloud, LuFactory, LuShieldCheck } from "react-icons/lu";

function CardShell({
    subtitle,
    title,
    icon,
    children,
}: {
    subtitle: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="group relative min-w-0 overflow-hidden rounded-3xl bg-white/78 shadow-[0_28px_70px_-32px_rgba(15,80,40,0.28)] backdrop-blur-md">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="relative px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-900/60">{subtitle}</p>
                        <h3 className="mt-2 text-lg font-bold tracking-tight text-emerald-950 sm:text-xl">{title}</h3>
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

function ChartFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-56 min-w-0 rounded-2xl bg-white/85 p-3 shadow-sm ring-1 ring-emerald-900/10 sm:h-60">
            {children}
        </div>
    );
}

function BarsSvg() {
    // Static SVG bars (no JS / no canvas).
    const bars = [
        { m: "Jan", a: 26, b: 18, c: 64 },
        { m: "Feb", a: 24, b: 17, c: 61 },
        { m: "Mar", a: 22, b: 16, c: 57 },
        { m: "Apr", a: 21, b: 15, c: 54 },
        { m: "May", a: 20, b: 14, c: 51 },
        { m: "Jun", a: 19, b: 13, c: 49 },
    ];
    const max = 70;
    return (
        <svg viewBox="0 0 360 180" className="h-full w-full" role="img" aria-label="Scopes 1-3 rollup chart">
            <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(31,122,63,0.9)" />
                    <stop offset="100%" stopColor="rgba(31,122,63,0.35)" />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(78,165,108,0.85)" />
                    <stop offset="100%" stopColor="rgba(78,165,108,0.32)" />
                </linearGradient>
                <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(49,90,67,0.7)" />
                    <stop offset="100%" stopColor="rgba(49,90,67,0.22)" />
                </linearGradient>
            </defs>
            {/* grid */}
            {[20, 50, 80, 110, 140].map((y) => (
                <line key={y} x1="18" y1={y} x2="348" y2={y} stroke="rgba(15,47,20,0.08)" strokeWidth="1" />
            ))}
            {bars.map((row, i) => {
                const x = 24 + i * 54;
                const w = 10;
                const scale = 120 / max;
                const ha = row.a * scale;
                const hb = row.b * scale;
                const hc = row.c * scale;
                return (
                    <g key={row.m}>
                        <rect x={x} y={150 - ha} width={w} height={ha} rx="5" fill="url(#g1)" />
                        <rect x={x + 14} y={150 - hb} width={w} height={hb} rx="5" fill="url(#g2)" />
                        <rect x={x + 28} y={150 - hc} width={w} height={hc} rx="5" fill="url(#g3)" />
                        <text x={x + 16} y="172" textAnchor="middle" fontSize="10" fill="rgba(15,47,20,0.55)">
                            {row.m}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function TrendSvg() {
    return (
        <svg viewBox="0 0 360 180" className="h-full w-full" role="img" aria-label="Emissions intensity trend chart">
            <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(31,122,63,0.22)" />
                    <stop offset="100%" stopColor="rgba(31,122,63,0.02)" />
                </linearGradient>
            </defs>
            {[30, 60, 90, 120, 150].map((y) => (
                <line key={y} x1="18" y1={y} x2="348" y2={y} stroke="rgba(15,47,20,0.08)" strokeWidth="1" />
            ))}
            {/* Area */}
            <path
                d="M30 120 C 75 110, 105 98, 140 96 C 175 92, 210 85, 250 78 C 290 70, 320 62, 338 66 L338 150 L30 150 Z"
                fill="url(#area)"
            />
            {/* Line */}
            <path
                d="M30 120 C 75 110, 105 98, 140 96 C 175 92, 210 85, 250 78 C 290 70, 320 62, 338 66"
                fill="none"
                stroke="rgba(31,122,63,0.92)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Target dashed */}
            <path
                d="M30 112 C 85 108, 150 98, 210 90 C 270 82, 312 76, 338 78"
                fill="none"
                stroke="rgba(78,165,108,0.78)"
                strokeWidth="2.5"
                strokeDasharray="6 7"
                strokeLinecap="round"
            />
            {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
                <text
                    key={q}
                    x={54 + i * 92}
                    y="172"
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgba(15,47,20,0.55)">
                    {q}
                </text>
            ))}
        </svg>
    );
}

function PieSvg() {
    return (
        <svg viewBox="0 0 240 180" className="h-full w-full" role="img" aria-label="Scope 3 category mix chart">
            {/* ring */}
            <g transform="translate(120 92)">
                <circle r="54" fill="none" stroke="rgba(15,47,20,0.08)" strokeWidth="18" />
                {/* segments (approx) */}
                <circle
                    r="54"
                    fill="none"
                    stroke="rgba(31,122,63,0.78)"
                    strokeWidth="18"
                    strokeDasharray="113 226"
                    strokeDashoffset="0"
                    transform="rotate(-90)"
                    strokeLinecap="round"
                />
                <circle
                    r="54"
                    fill="none"
                    stroke="rgba(78,165,108,0.72)"
                    strokeWidth="18"
                    strokeDasharray="70 226"
                    strokeDashoffset="-118"
                    transform="rotate(-90)"
                    strokeLinecap="round"
                />
                <circle
                    r="54"
                    fill="none"
                    stroke="rgba(45,107,78,0.72)"
                    strokeWidth="18"
                    strokeDasharray="60 226"
                    strokeDashoffset="-192"
                    transform="rotate(-90)"
                    strokeLinecap="round"
                />
                <circle
                    r="54"
                    fill="none"
                    stroke="rgba(136,190,151,0.85)"
                    strokeWidth="18"
                    strokeDasharray="40 226"
                    strokeDashoffset="-256"
                    transform="rotate(-90)"
                    strokeLinecap="round"
                />
            </g>
            <g fontSize="10" fill="rgba(15,47,20,0.6)">
                <text x="16" y="18">Purchased goods</text>
                <text x="16" y="34">Logistics</text>
                <text x="16" y="50">Energy</text>
            </g>
        </svg>
    );
}

export default function DataVizStaticSection() {
    return (
        <section className="full-bleed py-12 md:py-14">
            <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                <div className="mb-8 max-w-4xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-900/60">Live-looking visuals</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                        Finance grade ESG dashboards, even before data is connected
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                        These are illustrative examples of the kinds of views you’ll get for Scopes 1–3, reporting readiness,
                        and audit compliance.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <CardShell subtitle="Carbon accounting" title="Scopes 1–3 rollup" icon={<LuFactory className="h-5 w-5" aria-hidden />}>
                        <ChartFrame>
                            <BarsSvg />
                        </ChartFrame>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-950/80">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Facility view</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Energy view</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 shadow-sm">Scope‑3 categories</span>
                        </div>
                    </CardShell>

                    <CardShell subtitle="Performance" title="Emissions intensity trend" icon={<LuCloud className="h-5 w-5" aria-hidden />}>
                        <ChartFrame>
                            <TrendSvg />
                        </ChartFrame>
                        <p className="mt-4 text-sm text-slate-700">
                            Track intensity vs target with confidence intervals and methodology traits.
                        </p>
                    </CardShell>

                    <CardShell subtitle="Audit‑ready reporting" title="Scope‑3 category mix" icon={<LuShieldCheck className="h-5 w-5" aria-hidden />}>
                        <ChartFrame>
                            <PieSvg />
                        </ChartFrame>
                        <div className="mt-4 grid gap-2 text-xs text-slate-700">
                            {[
                                { name: "Purchased goods", value: "34%", color: "rgba(31,122,63,0.78)" },
                                { name: "Logistics", value: "21%", color: "rgba(78,165,108,0.72)" },
                                { name: "Energy", value: "18%", color: "rgba(45,107,78,0.72)" },
                            ].map((row) => (
                                <div key={row.name} className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                                        <span className="font-semibold">{row.name}</span>
                                    </span>
                                    <span className="font-bold text-emerald-950">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardShell>
                </div>
            </div>
        </section>
    );
}

