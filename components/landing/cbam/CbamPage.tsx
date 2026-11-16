"use client";

/**
 * Public CBAM page (/cbam), rebuilt in the watercolour paper system of the landing and GHG pages.
 * Content and figures carried over from the previous CBAM page; the dashboard numbers are an illustrative installation.
 */
import { useEffect, useRef, useState } from "react";
import { SiteNav, SiteFooter, fraunces } from "../watercolor/SiteChrome";
import "./cbam.css";

const icon = (d: React.ReactNode, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
    </svg>
);
const Arrow = () => icon(<path d="M5 12h14M13 6l6 6-6 6" />);
const Check = () => icon(<path d="m5 12.5 4.5 4.5L19 7.5" />);

const STEPS = [
    ["Data ingestion", "Monitor installation and production data: fuels, process inputs, output tonnes per CN code."],
    ["Emissions logic", "Embedded emissions by the EU method (Annex IV). Direct plus precursors for steel."],
    ["Third-party audit", "Verification by an EU-accredited verifier. Mandatory for actual data."],
    ["Share with buyers", "Communication template (Annex IV) via the Operators Portal to your EU customers."],
];

type MetricId = "avg" | "nodes" | "gap" | "sync";
const METRICS: { id: MetricId; label: string; value: string; unit?: string; note: string }[] = [
    { id: "avg", label: "Average intensity", value: "1.82", unit: "tCO₂e/t", note: "Across all routes" },
    { id: "nodes", label: "CN codes covered", value: "9", note: "Mapped automatically" },
    { id: "gap", label: "Verified coverage", value: "96", unit: "%", note: "Remainder on EU default" },
    { id: "sync", label: "Product mix", value: "3", unit: "routes", note: "Active reporting" },
];
const CHART: Record<MetricId, { title: string; bars: number[]; ticks: string[] }> = {
    avg: { title: "Average carbon intensity (tCO₂e/t)", bars: [40, 65, 50, 85, 60, 75, 45, 35], ticks: ["00:00", "06:00", "12:00", "18:00"] },
    nodes: { title: "Node activity level (%)", bars: [70, 80, 65, 90, 75, 85, 95, 80], ticks: ["Asia", "Europe", "NA", "LatAm"] },
    gap: { title: "Regulatory compliance variance (%)", bars: [15, 12, 18, 14, 10, 8, 12, 11], ticks: ["Q1 ’24", "Q2 ’24", "Q3 ’24", "Q4 ’24"] },
    sync: { title: "Registry sync latency (ms)", bars: [120, 150, 90, 200, 110, 130, 80, 95], ticks: ["1h ago", "45m ago", "30m ago", "Just now"] },
};
const MIX = [
    ["DRI / sponge iron", 48],
    ["EAF crude steel", 30],
    ["Hot-rolled coil", 22],
] as const;

const REGULATIONS = [
    ["Regulation (EU) 2023/956", "Base CBAM regulation. Embedded-emissions method, Annex IV."],
    ["Regulation (EU) 2025/2083 (Omnibus)", "Steel: precursors counted, finishing excluded. Grid electricity reported, not counted."],
    ["December 2025 implementing acts", "Country- and product-specific default values; +10% in 2026, the cost of not verifying."],
    ["Monitoring methodology", "Documented in English; system boundaries for direct emissions plus precursors."],
];

const ROUTES: { product: string; volume: string; intensity: string; status: "Above" | "Below" | "Near" }[] = [
    { product: "DRI / sponge iron (coal)", volume: "42,500", intensity: "2.4", status: "Above" },
    { product: "EAF crude steel (scrap)", volume: "18,000", intensity: "0.9", status: "Below" },
    { product: "Hot-rolled coil", volume: "12,000", intensity: "1.8", status: "Near" },
];

function HeroVideo() {
    const v = useRef<HTMLVideoElement>(null);
    // React doesn't emit `muted` in server HTML, so autoplay is started here; reduced-motion visitors keep the first frame
    useEffect(() => {
        const el = v.current!;
        el.muted = true;
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) el.play().catch(() => {});
    }, []);
    return <video ref={v} src="/media/cbam-hero.mp4" muted loop playsInline preload="auto" aria-hidden="true" />;
}

function Tracking() {
    const [metric, setMetric] = useState<MetricId>("avg");
    const chart = CHART[metric];
    const max = Math.max(...chart.bars);
    return (
        <section id="tracking" aria-labelledby="trTitle">
            <div className="wrap">
                <div className="cb-panel">
                    <div className="cb-panel-head">
                        <div>
                            <h2 id="trTitle">Embedded emissions tracking</h2>
                            <p>Carbon intensity by product and route, per reporting year. Figures shown are an example installation.</p>
                        </div>
                        <span className="cb-chip">CN / EU</span>
                    </div>
                    <div className="tr-grid">
                        <div className="tr-metrics" role="group" aria-label="Metric shown in the chart">
                            {METRICS.map((m) => (
                                <button key={m.id} type="button" aria-pressed={metric === m.id} onClick={() => setMetric(m.id)}>
                                    <small>{m.label}</small>
                                    <b>
                                        {m.value}
                                        {m.unit && <span>{m.unit}</span>}
                                    </b>
                                    <em>{m.note}</em>
                                </button>
                            ))}
                        </div>
                        <div className="tr-card">
                            <h3>{chart.title}</h3>
                            <div className="tr-bars" aria-hidden="true">
                                {chart.bars.map((b, i) => (
                                    <i key={i} style={{ height: `${(b / max) * 100}%` }} />
                                ))}
                            </div>
                            <div className="tr-ticks" aria-hidden="true">
                                {chart.ticks.map((t) => (
                                    <span key={t}>{t}</span>
                                ))}
                            </div>
                            <p className="sr-only">
                                {chart.title}: {chart.bars.join(", ")}
                            </p>
                        </div>
                        <div className="tr-card">
                            <h3>Product mix</h3>
                            <ul className="tr-mix">
                                {MIX.map(([name, pct], i) => (
                                    <li key={name} style={{ "--o": 1 - i * 0.28 } as React.CSSProperties}>
                                        <span>{name}</span>
                                        <b>{pct}%</b>
                                        <i>
                                            <i style={{ width: `${pct}%` }} />
                                        </i>
                                    </li>
                                ))}
                            </ul>
                            <ul className="cb-checks">
                                {["EU method · Annex IV", "Verified · ISO 14064-3", "Operators Portal"].map((t) => (
                                    <li key={t}>
                                        <Check />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Exposure() {
    const [view, setView] = useState<"default" | "verified">("verified");
    return (
        <section id="exposure" aria-labelledby="exTitle">
            <div className="wrap">
                <div className="cb-panel">
                    <div className="cb-panel-head">
                        <div>
                            <h2 id="exTitle">Verified vs default: what your buyer pays</h2>
                            <p>What your EU buyer pays on embedded emissions. Verified actual data avoids punitive default values; the cost passes back to you through price.</p>
                        </div>
                        <div className="cb-toggle" role="group" aria-label="Highlight">
                            {(["default", "verified"] as const).map((k) => (
                                <button key={k} type="button" aria-pressed={view === k} onClick={() => setView(k)}>
                                    {k === "default" ? "Default" : "Verified"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="ex-bars">
                        <figure className={view === "default" ? "on" : undefined}>
                            <i className="ex-default" />
                            <figcaption>
                                <b>EU default value</b>
                                <span>Worst-decile benchmark · +10% in 2026</span>
                            </figcaption>
                        </figure>
                        <figure className={view === "verified" ? "on" : undefined}>
                            <i className="ex-verified" />
                            <figcaption>
                                <b>Your verified data</b>
                                <span>Actual installation emissions</span>
                            </figcaption>
                        </figure>
                    </div>
                    <p className="ex-save">About 30–40% lower buyer cost with verified data</p>
                    <p className="cb-fine">
                        Your EU buyer purchases certificates from 1 Feb 2027 and first surrenders by 30 Sep 2027 (for 2026 imports). The CBAM factor phases in from 2.5% in
                        2026 to 100% by 2034, so the verified-vs-default gap widens every year.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function CbamPage() {
    return (
        <div className={`wl cb ${fraunces.variable}`}>
            <SiteNav />
            <main>
                <section className="cb-hero" aria-labelledby="cbTitle">
                    <div className="cb-wash" aria-hidden="true"></div>
                    <div className="wrap cb-hero-grid">
                        <div>
                            <h1 id="cbTitle">
                                Mastering CBAM <em>Complexity</em>
                            </h1>
                            <p className="cb-lead">
                                Installation-level embedded-emissions data for your EU buyers, verified and audit-ready, so your shipments aren&apos;t priced on punitive default
                                values.
                            </p>
                            <div className="cb-ctas">
                                <a className="btn" href="#governance">
                                    Start technical audit <Arrow />
                                </a>
                                <a className="btn ghost" href="#regulations">
                                    View documentation
                                </a>
                            </div>
                            <p className="cb-meta">India → EU · Iron &amp; steel · Operator / installation view · Accurate as of 22 Jun 2026</p>
                        </div>
                        <div className="cb-visual">
                            <HeroVideo />
                        </div>
                    </div>
                </section>

                <section id="governance" aria-labelledby="gvTitle">
                    <div className="wrap">
                        <div className="head center">
                            <h2 id="gvTitle">
                                Governance <em>lifecycle</em>
                            </h2>
                            <p>Your path as a producer: measure, calculate, verify, and share with EU buyers.</p>
                        </div>
                        <ol className="cb-steps">
                            {STEPS.map(([title, text], i) => (
                                <li key={title}>
                                    <span className="n" aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <Tracking />

                <section id="regulations" aria-label="Regulations and buyer data sharing">
                    <div className="wrap cb-two">
                        <div className="cb-col">
                            <h2>Regulatory alignment</h2>
                            <ul className="cb-regs">
                                {REGULATIONS.map(([title, text]) => (
                                    <li key={title}>
                                        <h3>{title}</h3>
                                        <p>{text}</p>
                                    </li>
                                ))}
                            </ul>
                            <a className="cb-link" href="#contact">
                                Request the 2026 compliance guide <Arrow />
                            </a>
                        </div>
                        <div className="cb-col">
                            <h2>Buyer data sharing</h2>
                            <div className="cb-counters">
                                <div>
                                    <b>1,240</b>
                                    <span>Verified records</span>
                                </div>
                                <div>
                                    <b>38</b>
                                    <span>EU buyers connected</span>
                                </div>
                            </div>
                            <p className="cb-fine left">Example account.</p>
                            <ul className="cb-checks big">
                                {["Automated CN-code mapping", "Communication template (Annex IV) generation", "Operators Portal registration and buyer access"].map((t) => (
                                    <li key={t}>
                                        <Check />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                            <p className="cb-note">Verified actual values keep your goods off punitive default values.</p>
                        </div>
                    </div>
                </section>

                <section id="supply-chain" aria-labelledby="scTitle">
                    <div className="wrap">
                        <div className="cb-panel">
                            <div className="sc-grid">
                                <div>
                                    <h2 id="scTitle">Production route profile</h2>
                                    <p className="sc-lead">Your plants and routes. Direct emissions plus precursors, benchmarked to EU default values.</p>
                                </div>
                                <div className="sc-routes">
                                    <div className="sc-route hi">
                                        <h3>High-intensity route: coal-based DRI</h3>
                                        <p>Above the EU default benchmark, so a higher cost for your buyer. Direct and precursor emissions drive the steel number.</p>
                                    </div>
                                    <div className="sc-route lo">
                                        <h3>Low-intensity route: EAF / scrap</h3>
                                        <p>Below the benchmark. Prioritise this route for EU-bound shipments to stay competitive.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-table">
                                <table>
                                    <caption className="sr-only">Production routes compared with EU default values (example installation)</caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Product / route</th>
                                            <th scope="col">Volume</th>
                                            <th scope="col">Direct intensity</th>
                                            <th scope="col">vs EU default</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ROUTES.map((r) => (
                                            <tr key={r.product}>
                                                <th scope="row">{r.product}</th>
                                                <td>
                                                    {r.volume} <span className="u">t</span>
                                                </td>
                                                <td>
                                                    {r.intensity} <span className="u">tCO₂e/t</span>
                                                </td>
                                                <td>
                                                    <span className={`sc-pill ${r.status.toLowerCase()}`}>{r.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <Exposure />

                <section className="cb-cta" aria-labelledby="ctaTitle">
                    <div className="wrap">
                        <h2 id="ctaTitle">
                            Built for EU-bound <em>exporters</em>
                        </h2>
                        <p>Give your EU buyers verified, audit-ready emissions data, and stay ahead of default-value penalties as the definitive regime ramps up.</p>
                        <a className="btn" href="#contact">
                            Request demo access <Arrow />
                        </a>
                        <ul className="cb-checks inline">
                            {["Audit-ready data", "Operators Portal", "EU-accredited verification"].map((t) => (
                                <li key={t}>
                                    <Check />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
