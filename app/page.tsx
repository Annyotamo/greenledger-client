"use client";

import Image from "next/image";
import { useEffect } from "react";
import { LuBolt, LuChartBar, LuCloud, LuFactory, LuScanLine, LuShieldCheck } from "react-icons/lu";
import greenLedgerLogo from "@/assets/GLLogo.png";
import startupIndia from "@/assets/startupIndia.png";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";
import isoCertifaction from "@/assets/isoCertifaction.png";
import heroMosaic from "@/assets/landing-images/esg_main.960_0_1.jpg";
import esgAccountingImg from "@/assets/landing-images/14841_esgaccounting_572996_crop.jpg";
import esgReportingImg from "@/assets/landing-images/esg-reporting.jpg";
import sustainableFinanceImg from "@/assets/landing-images/ESG-Courses-Sustainable-Finance-1600x900-1.jpg";
import sasbImg from "@/assets/landing-images/Navigating-SASB.webp";
import opsImg from "@/assets/landing-images/746569-848x441.jpg";
import { FeatureSlider, type SliderCard } from "@/components/landing/FeatureSlider";
import { HoverInsightGrid, type HoverInsight } from "@/components/landing/HoverInsightGrid";
import { DataVizShowcase } from "@/components/landing/DataVizShowcase";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { ScrollReveal, useParallaxScroll } from "@/components/landing/ScrollReveal";
import { SolutionsAccordion, type AccordionItem } from "@/components/landing/SolutionsAccordion";
import Footer from "@/components/Footer";

const sliderCards: SliderCard[] = [
    {
        id: "esg",
        eyebrow: "ESG reporting",
        title: "From raw data to audit-ready disclosures",
        description:
            "Regulators—especially in Europe—expect consistent, evidence-backed reporting on environmental and social impact. GreenLedger centralizes collection, validation, and narrative so teams ship CSRD- and ESRS-aligned outputs without spreadsheet chaos.",
        bullets: [
            "Structured data capture mapped to international disclosure frameworks",
            "Automated report generation with version history for auditors",
            "Dashboards for executives and working views for sustainability teams",
            "Banking edition: financed emissions linked to loans and portfolios (PCAF-style workflows)",
        ],
        accent: "#1f7a3f",
        imageSrc: esgReportingImg.src,
    },
    {
        id: "carbon",
        eyebrow: "Carbon accounting",
        title: "A finance-grade footprint across Scopes 1–3",
        description:
            "Treat carbon like a ledger: every activity rolls up to totals you can defend in the boardroom. Built-in GHG Protocol thinking, activity data imports, and uncertainty flags help you improve data quality over time—not just once a year.",
        bullets: [
            "Scope 1 & 2 operational emissions with facility and energy views",
            "Scope 3 categories with supplier and spend-based starting points",
            "Scenario and reduction modeling tied to operational levers",
            "Exports that plug into ESG reports and management commentary",
        ],
        accent: "#315a43",
        imageSrc: opsImg.src,
    },
    {
        id: "trace",
        eyebrow: "Supply chain traceability",
        title: "From supplier to QR—proof consumers can trust",
        description:
            "Modern buyers want to know where things come from and whether production met sustainability expectations. Map ingredients and components across tiers, attach evidence, and publish consumer-facing journeys that start with a scan.",
        bullets: [
            "Multi-tier supplier graph with risk and certification signals",
            "Batch- or SKU-level chain of custody where you need precision",
            "QR-linked product pages: origin, makers, and sustainability claims",
            "Faster verification cycles for procurement and compliance teams",
        ],
        accent: "#2d6b4e",
        imageSrc: heroMosaic.src,
    },
    {
        id: "platform",
        eyebrow: "One operating system",
        title: "Finance, ops, and sustainability on one timeline",
        description:
            "Reporting, accounting, and traceability share the same master data. When a supplier updates a factor or a loan book shifts, every dependent view updates—so your ESG story stays coherent end to end.",
        bullets: [
            "Role-based access for sustainability, finance, and procurement",
            "API-friendly exports for data warehouses and BI tools",
            "Implementation paths: start with reporting, expand to Scope 3, add traceability",
        ],
        accent: "#1f7a3f",
        imageSrc: sustainableFinanceImg.src,
    },
];

const hoverInsights: HoverInsight[] = [
    {
        id: "i1",
        label: "Reporting velocity",
        stat: "50%",
        headline: "Less time in disclosure assembly",
        teaser: "Automations replace manual reconciliation across entities.",
        detail: "Templates, validations, and roll-forward logic mean your team spends time on narrative and strategy—not hunting for the right emission factor in row 400 of a spreadsheet.",
    },
    {
        id: "i2",
        label: "Supplier checks",
        stat: "25%",
        headline: "Faster verification cycles",
        teaser: "Structured requests and evidence storage cut back-and-forth.",
        detail: "Suppliers respond to standardized questionnaires, attach proofs once, and updates propagate to every product and report that depends on their data.",
    },
    {
        id: "i3",
        label: "Adoption",
        stat: "120+",
        headline: "Organizations on the platform",
        teaser: "From mid-market industrials to financial institutions.",
        detail: "Shared patterns for multi-entity roll-ups, banking book splits, and consumer brands launching QR-led transparency stories.",
    },
    {
        id: "i4",
        label: "Audit confidence",
        stat: "360°",
        headline: "Traceable numbers, not one-off estimates",
        teaser: "Every total links to sources you can show an auditor.",
        detail: "Activity logs, methodology notes, and data lineage make it easier to defend figures under scrutiny—whether from regulators, lenders, or large customers.",
    },
];

const accordionItems: AccordionItem[] = [
    {
        id: "c1",
        title: "Why ESG reporting is now a board-level program",
        subtitle: "Legal expectations, CSRD, ESRS, and what “good” looks like",
        body: (
            <>
                <p>
                    Companies—particularly those exposed to European rules—face mandatory reporting on climate and
                    social topics. Frameworks like CSRD and the ESRS set expectations for granularity, comparability,
                    and assurance readiness.
                </p>
                <p className="mt-3">
                    GreenLedger is built to operationalize that workload: governed data collection, controlled
                    transformations into disclosure formats, and clear ownership between sustainability, finance, and
                    legal reviewers. Banks and asset owners can extend the same rigor to financed emissions, aligning
                    lending and investment portfolios with emerging supervisory and stakeholder pressure.
                </p>
            </>
        ),
    },
    {
        id: "c2",
        title: "Carbon accounting that matches how your business actually runs",
        subtitle: "Scopes, activity data, and continuous improvement",
        body: (
            <>
                <p>
                    A credible footprint is more than a single annual number. It is a living model of energy, travel,
                    purchased goods, logistics, and—where relevant—customer use and end-of-life impacts.
                </p>
                <p className="mt-3">
                    GreenLedger combines calculators, import paths for utility and ERP extracts, and supplier-sourced
                    updates so your inventory matures quarter over quarter. Teams see where uncertainty is high,
                    prioritize the next tranche of supplier engagement, and tie reduction initiatives to measurable
                    deltas.
                </p>
            </>
        ),
    },
    {
        id: "c3",
        title: "Supply chain traceability that end customers can experience",
        subtitle: "QR journeys, provenance, and responsible production stories",
        body: (
            <>
                <p>
                    Traceability is the bridge between compliance data and brand trust. When someone scans a QR code
                    on-pack or online, they should see a coherent story: where materials originated, which facilities
                    transformed them, and what sustainability criteria were met along the way.
                </p>
                <p className="mt-3">
                    GreenLedger links internal BOMs and supplier graphs to consumer-safe narratives. Procurement teams
                    keep the detailed evidence; marketing and product teams publish what is accurate, approved, and
                    localized—without maintaining a separate shadow spreadsheet.
                </p>
            </>
        ),
    },
    {
        id: "c4",
        title: "Implementation: start narrow, expand with confidence",
        subtitle: "Typical rollout paths for mixed maturity organizations",
        body: (
            <>
                <p>
                    Most customers do not flip every module on day one. A pragmatic sequence is to stabilize reporting
                    and data governance, extend carbon accounting into the highest-impact Scope 3 categories, then layer
                    traceability on hero SKUs or regions.
                </p>
                <p className="mt-3">
                    GreenLedger’s modules share reference data—suppliers, sites, factors, and products—so each phase
                    compounds instead of creating another silo. Our team helps map your entities, chart of accounts
                    touchpoints, and supplier tiers to a staged plan with measurable milestones.
                </p>
            </>
        ),
    },
];

export default function Home() {
    const heroShift = useParallaxScroll(0.055);
    const heroCounter = useParallaxScroll(-0.028);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full text-slate-900">
            <ScrollProgress />
            <main className="mx-auto w-full max-w-400 px-4 sm:px-5 md:px-6 lg:px-7">
                {/* Hero */}
                <ScrollReveal className="mb-12" rootMargin="0px 0px 0px 0px" threshold={0.05}>
                    <section className="full-bleed relative min-h-[min(90vh,820px)] overflow-hidden rounded-none shadow-[0_24px_80px_-30px_rgba(0,40,25,0.55)]">
                        <Image
                            src="/GreenLedger_Background.jpg"
                            alt=""
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                        <div
                            className="absolute inset-0 bg-linear-to-br from-emerald-950/92 via-emerald-900/78 to-teal-950/88"
                            aria-hidden
                        />
                        <div
                            className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-emerald-950/35"
                            aria-hidden
                        />
                        <div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-10%,rgba(255,255,255,0.16),transparent_52%)]"
                            aria-hidden
                        />
                        <div className="gl-grain" aria-hidden />
                        {/* Ambient orbs (award-site feel) */}
                        <div
                            className="gl-orb gl-drift"
                            style={{
                                left: "6%",
                                top: "18%",
                                width: "320px",
                                height: "320px",
                                background: "rgba(136,190,151,0.55)",
                            }}
                            aria-hidden
                        />
                        <div
                            className="gl-orb gl-drift-2"
                            style={{
                                right: "7%",
                                top: "10%",
                                width: "260px",
                                height: "260px",
                                background: "rgba(31,122,63,0.45)",
                            }}
                            aria-hidden
                        />
                        <div
                            className="gl-orb gl-drift"
                            style={{
                                right: "16%",
                                bottom: "12%",
                                width: "360px",
                                height: "360px",
                                background: "rgba(45,107,78,0.35)",
                            }}
                            aria-hidden
                        />
                        <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 px-4 py-14 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-16 lg:px-12 lg:py-20">
                            <div
                                className="min-w-0 flex-1 will-change-transform"
                                style={{ transform: `translate3d(0,${heroShift}px,0)` }}>
                                <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-50 shadow-sm backdrop-blur-md">
                                    ESG reporting · Carbon accounting · Traceability
                                </p>
                                <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-5xl xl:text-6xl">
                                    Turn sustainability obligations into a clear, defensible operating rhythm
                                </h1>
                                <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-emerald-50/95 sm:text-lg">
                                    GreenLedger helps organizations collect environmental and social data, auto-generate
                                    standards-aligned reports (including CSRD / ESRS / BRSR), run rigorous carbon
                                    accounting across Scopes 1–3, and prove product stories with supply chain
                                    traceability—from factory floor to QR code in a shopper’s hand.
                                </p>
                                <div className="mt-9 flex flex-wrap gap-3">
                                    <a
                                        href="#pillars"
                                        className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-black/20 transition hover:bg-emerald-300">
                                        Explore the platform
                                    </a>
                                    <a
                                        href="#deep-dive"
                                        className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20">
                                        Read how it works
                                    </a>
                                    <a
                                        href="#cta"
                                        className="rounded-xl px-5 py-3 text-sm font-semibold text-white underline decoration-emerald-300/80 decoration-2 underline-offset-[6px] transition hover:decoration-emerald-200">
                                        Request a demo
                                    </a>
                                </div>
                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-50/85">
                                            Supported by
                                        </span>
                                        <span className="h-5 w-px bg-white/20" aria-hidden />
                                        <Image
                                            src={startupIndia}
                                            alt="Startup India"
                                            className="h-7 w-auto object-contain opacity-95"
                                        />
                                        <span className="h-5 w-px bg-white/20" aria-hidden />
                                        <Image
                                            src={entrepreneurCafe}
                                            alt="ISO 27001 certification"
                                            className="h-7 w-auto object-contain opacity-95"
                                        />
                                    </div>
                                    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-md">
                                        <Image
                                            src={isoCertifaction}
                                            alt="ISO 27001 certification"
                                            className="h-8 w-auto object-contain opacity-95"
                                        />
                                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-emerald-50/85">
                                            ISO 27001
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-emerald-50/80">
                                        Startup India ecosystem recognition · ISO 27001 aligned
                                    </span>
                                </div>
                            </div>
                            <div
                                className="flex shrink-0 flex-col items-center gap-5 will-change-transform md:items-end"
                                style={{ transform: `translate3d(0,${heroCounter}px,0)` }}>
                                <div className="rounded-3xl border border-white/40 bg-white/60 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-sm sm:ring-0 gl-shimmer-border">
                                    <Image
                                        src={greenLedgerLogo}
                                        alt="GreenLedger"
                                        width={220}
                                        height={220}
                                        className="h-auto w-[min(100%,200px)] object-contain sm:w-[220px]"
                                        priority
                                    />
                                </div>
                                <div className="hidden w-88 max-w-full grid-cols-2 gap-3 md:grid">
                                    {[
                                        { src: esgAccountingImg, label: "ESG accounting" },
                                        { src: sasbImg, label: "Framework-ready" },
                                        { src: esgReportingImg, label: "Disclosure workflows" },
                                        { src: sustainableFinanceImg, label: "Finance-grade" },
                                    ].map((tile) => (
                                        <div
                                            key={tile.label}
                                            className="card-hover relative overflow-hidden rounded-2xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-md">
                                            <Image
                                                src={tile.src}
                                                alt=""
                                                className="h-28 w-full object-cover"
                                                sizes="(min-width: 768px) 180px, 45vw"
                                            />
                                            <div
                                                className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
                                                aria-hidden
                                            />
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-white backdrop-blur-md">
                                                    {tile.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="max-w-xs text-center text-xs leading-relaxed text-emerald-100/85 md:text-right">
                                    Built for enterprises that need audit-ready numbers and consumer-trusted product
                                    stories—not slide-deck estimates.
                                </p>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Metrics strip */}
                <ScrollReveal className="mb-14" delay={40}>
                    <section
                        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5"
                        aria-label="Highlights">
                        {[
                            { k: "CSRD / ESRS / BRSR", v: "Aligned reporting flows" },
                            { k: "Scopes 1–3", v: "Enterprise carbon ledger" },
                            { k: "PCAF-ready", v: "Financed emissions views" },
                            { k: "QR to origin", v: "Consumer traceability" },
                        ].map((m) => (
                            <div
                                key={m.k}
                                className="rounded-2xl border border-emerald-900/10 bg-white/75 px-3 py-4 text-center shadow-sm backdrop-blur-sm sm:px-5 sm:py-5">
                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">{m.k}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">{m.v}</p>
                            </div>
                        ))}
                    </section>
                </ScrollReveal>

                <ScrollReveal className="mb-16" delay={25}>
                    <DataVizShowcase />
                </ScrollReveal>

                {/* Slider */}
                <ScrollReveal className="mb-16 scroll-mt-24" delay={60}>
                    <section id="pillars" className="scroll-mt-24">
                        <div className="mb-6 max-w-4xl">
                            <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                Three capabilities, one continuous data spine
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                                Slide through how reporting, carbon accounting, and traceability reinforce each other.
                                The same suppliers, sites, and products feed every surface—so you are never reconciling
                                three different “versions of the truth.”
                            </p>
                        </div>
                        <FeatureSlider cards={sliderCards} />
                    </section>
                </ScrollReveal>

                {/* Hover cards */}
                <ScrollReveal className="mb-16" delay={50}>
                    <section
                        className="section-bg rounded-2xl border border-white/50 p-5 shadow-lg sm:p-7 md:p-9"
                        aria-label="Outcomes">
                        <h2 className="text-xl font-bold text-emerald-950 sm:text-2xl">
                            Outcomes teams feel in the first two quarters
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm text-slate-700 sm:text-base">
                            Hover each card for a fuller picture—numbers here are illustrative of the operational
                            improvements customers target.
                        </p>
                        <div className="mt-8">
                            <HoverInsightGrid insights={hoverInsights} />
                        </div>
                    </section>
                </ScrollReveal>

                {/* Services spotlight (unique band) */}
                <ScrollReveal className="mb-16" delay={35}>
                    <section className="full-bleed overflow-hidden py-10 md:py-14">
                        <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                                {/* Finance-grade ESG reporting */}
                                <div className="gl-shimmer-border relative overflow-hidden rounded-3xl bg-white/80 shadow-[0_28px_70px_-30px_rgba(15,80,40,0.35)] backdrop-blur-md">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_10%_20%,rgba(31,122,63,0.12),transparent_55%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_90%_10%,rgba(136,190,151,0.16),transparent_58%)]" />
                                    <div className="relative grid gap-7 p-6 sm:p-8">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900/80 shadow-sm">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-800">
                                                    <LuChartBar className="h-3.5 w-3.5" />
                                                </span>
                                                Finance‑grade ESG reporting
                                            </span>
                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm">
                                                CSRD / ESRS aligned
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-balance text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                                Board‑ready disclosures with audit‑defensible lineage
                                            </h3>
                                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                                                Build ESG reports like financial statements: controlled inputs,
                                                validations, versioned narratives, and outputs you can stand behind in
                                                assurance cycles.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {[
                                                {
                                                    k: "Quality gates",
                                                    v: "Checks that fail fast",
                                                    icon: <LuScanLine className="h-4 w-4" />,
                                                },
                                                {
                                                    k: "Roll‑forwards",
                                                    v: "Quarterly continuity",
                                                    icon: <LuBolt className="h-4 w-4" />,
                                                },
                                                {
                                                    k: "Evidence links",
                                                    v: "Every number traced",
                                                    icon: <LuShieldCheck className="h-4 w-4" />,
                                                },
                                            ].map((it) => (
                                                <div
                                                    key={it.k}
                                                    className="card-hover rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                                                    <div className="flex items-center gap-2 text-emerald-900/80">
                                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700/10">
                                                            {it.icon}
                                                        </span>
                                                        <p className="text-xs font-bold uppercase tracking-wide">
                                                            {it.k}
                                                        </p>
                                                    </div>
                                                    <p className="mt-2 text-sm font-semibold text-slate-800">{it.v}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative overflow-hidden rounded-2xl bg-white/70 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-900/70">
                                                    Disclosure pack preview
                                                </p>
                                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900/80 shadow-sm">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                                                    Ready
                                                </span>
                                            </div>
                                            <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
                                                {[
                                                    { k: "Material topics", v: "12 mapped" },
                                                    { k: "Data checks", v: "48 passed" },
                                                    { k: "Narratives", v: "Versioned" },
                                                    { k: "Exports", v: "XBRL / PDF" },
                                                ].map((tile) => (
                                                    <div
                                                        key={tile.k}
                                                        className="relative overflow-hidden rounded-2xl bg-white/85 p-4 shadow-sm">
                                                        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
                                                        <p className="relative text-xs font-bold uppercase tracking-wide text-emerald-900/60">
                                                            {tile.k}
                                                        </p>
                                                        <p className="relative mt-2 text-sm font-semibold text-slate-800">
                                                            {tile.v}
                                                        </p>
                                                        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-900/10">
                                                            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-600/70 via-emerald-500/60 to-teal-400/60" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Audit compliance */}
                                <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-[0_28px_70px_-30px_rgba(15,80,40,0.32)] backdrop-blur-md">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_85%_15%,rgba(31,122,63,0.10),transparent_55%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_10%_80%,rgba(136,190,151,0.14),transparent_60%)]" />
                                    <div className="relative grid gap-7 p-6 sm:p-8">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900/80 shadow-sm">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-800">
                                                    <LuShieldCheck className="h-3.5 w-3.5" />
                                                </span>
                                                Audit compliance (logs, traits)
                                            </span>
                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm">
                                                Assurance‑ready
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-balance text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                                Built‑in audit trails for every decision, factor, and override
                                            </h3>
                                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                                                Capture “who changed what, when, and why” with structured traits so
                                                reviewers can replay methodology—without hunting through email threads.
                                            </p>
                                        </div>

                                        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                                            <div className="relative overflow-hidden rounded-2xl bg-white/70 shadow-sm">
                                                <div className="flex items-center justify-between gap-3 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700/10">
                                                            <LuFactory className="h-4 w-4 text-emerald-900/80" />
                                                        </span>
                                                        <div className="leading-tight">
                                                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-900/70">
                                                                Audit log
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                Evidence timeline
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900/80 shadow-sm">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                                                        Live
                                                    </span>
                                                </div>
                                                <div className="grid gap-3 px-4 py-4">
                                                    {[
                                                        {
                                                            t: "Emission factor updated",
                                                            d: "Supplier‑provided CO₂e factor supersedes default",
                                                            meta: "Scope‑3 · Category 1",
                                                        },
                                                        {
                                                            t: "Methodology note added",
                                                            d: "Allocation rule documented for shared utilities",
                                                            meta: "Scope‑2 · Facilities",
                                                        },
                                                        {
                                                            t: "Approval recorded",
                                                            d: "Finance reviewer sign‑off captured",
                                                            meta: "Reporting · Disclosure pack",
                                                        },
                                                    ].map((row) => (
                                                        <div
                                                            key={row.t}
                                                            className="group relative overflow-hidden rounded-2xl bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl transition duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20" />
                                                            <p className="relative text-sm font-semibold text-emerald-950">
                                                                {row.t}
                                                            </p>
                                                            <p className="relative mt-1 text-sm text-slate-700">
                                                                {row.d}
                                                            </p>
                                                            <p className="relative mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-900/60">
                                                                {row.meta}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="relative overflow-hidden rounded-2xl bg-white/70 shadow-sm">
                                                <div className="flex items-center justify-between px-4 py-3">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-900/70">
                                                        Traits &amp; controls
                                                    </p>
                                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900/80 shadow-sm">
                                                        Policy‑driven
                                                    </span>
                                                </div>
                                                <div className="grid gap-3 p-4">
                                                    {[
                                                        { k: "Trait", v: "Methodology: Market-based Scope‑2" },
                                                        { k: "Evidence", v: "Utility invoice · File link" },
                                                        { k: "Control", v: "Approval required: Finance reviewer" },
                                                    ].map((row) => (
                                                        <div
                                                            key={row.k}
                                                            className="rounded-2xl bg-white/85 p-4 shadow-sm">
                                                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-900/60">
                                                                {row.k}
                                                            </p>
                                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                                {row.v}
                                                            </p>
                                                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-900/10">
                                                                <div className="h-full w-3/5 rounded-full bg-linear-to-r from-emerald-600/70 via-emerald-500/60 to-teal-400/60" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {["Traits", "Evidence links", "Approvals"].map((chip) => (
                                                            <span
                                                                key={chip}
                                                                className="rounded-full bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-sm">
                                                                {chip}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {[
                                                { k: "CO₂e signals", icon: <LuCloud className="h-4 w-4" /> },
                                                { k: "Energy trails", icon: <LuBolt className="h-4 w-4" /> },
                                                { k: "Review‑ready", icon: <LuShieldCheck className="h-4 w-4" /> },
                                            ].map((it) => (
                                                <div key={it.k} className="rounded-2xl bg-white/70 p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 text-emerald-900/80">
                                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700/10">
                                                            {it.icon}
                                                        </span>
                                                        <p className="text-xs font-bold uppercase tracking-wide">
                                                            {it.k}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Narrative band */}
                <ScrollReveal className="mb-16">
                    <section className="full-bleed bg-linear-to-b from-white/40 via-emerald-50/30 to-transparent py-12 md:py-14">
                        <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                            <div className="grid gap-10 lg:grid-cols-3">
                                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                    <h3 className="text-lg font-semibold text-emerald-950">
                                        For sustainability &amp; legal owners
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                        Package evidence, control narrative, and manage assurance cycles without losing
                                        the thread between source transactions and published disclosures.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                    <h3 className="text-lg font-semibold text-emerald-950">For finance &amp; risk</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                        Tie emissions to books: loans, investments, and counterparty exposures roll up
                                        into financed-emissions views that stand up to internal and external scrutiny.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                    <h3 className="text-lg font-semibold text-emerald-950">
                                        For brand &amp; product teams
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                        Ship QR-led transparency that matches what compliance actually knows—so
                                        marketing claims and regulatory filings tell the same story.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Accordion */}
                <ScrollReveal className="mb-16 scroll-mt-24" delay={30}>
                    <section id="deep-dive" className="scroll-mt-24">
                        <div className="mb-6 max-w-3xl">
                            <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                The longer read—how we think about the problem
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                                Expand any topic for plain-language context. This is the layer executives share with
                                boards and transformation leads when they need more than a feature list.
                            </p>
                        </div>
                        <SolutionsAccordion items={accordionItems} />
                    </section>
                </ScrollReveal>

                {/* Traceability deep section */}
                <ScrollReveal className="mb-16 scroll-mt-24" delay={40}>
                    <section
                        id="traceability"
                        className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-xl backdrop-blur-md sm:p-7 md:p-9 lg:p-11">
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                            <div>
                                <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                                    Supply chain traceability, explained without the buzzwords
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                                    Imagine scanning a QR code on a product and seeing where each ingredient or
                                    component came from, who processed it, and whether key sustainability criteria were
                                    met. That experience only works if the back office maintains a structured map of
                                    suppliers, batches, certificates, and transformations.
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                                    GreenLedger connects operational procurement data with customer-facing storytelling.
                                    You decide what is public, what stays internal, and how much detail each market
                                    requires—while preserving a single governed record underneath.
                                </p>
                                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                    <li className="flex gap-3">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                        <span>
                                            Map multi-tier suppliers with documents, audits, and corrective actions in
                                            one place.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                        <span>
                                            Tie specific lots or SKUs to chain-of-custody events for recalls, claims, or
                                            premium certifications.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                        <span>
                                            Publish localized QR pages that reflect the latest approved facts—no manual
                                            website updates per change.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col justify-center gap-4">
                                {[
                                    {
                                        t: "Scan",
                                        d: "Consumer lands on a branded page with clear provenance and impact context.",
                                    },
                                    {
                                        t: "Trace",
                                        d: "Behind the scenes, every statement resolves to supplier evidence and timestamps.",
                                    },
                                    {
                                        t: "Improve",
                                        d: "Procurement sees gaps instantly—where data is missing or certifications lapse.",
                                    },
                                ].map((step, i) => (
                                    <div
                                        key={step.t}
                                        className="card-hover flex gap-4 rounded-2xl border border-white/70 bg-linear-to-r from-emerald-50/90 to-white/90 p-5 shadow-md">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-emerald-950">{step.t}</h3>
                                            <p className="mt-1 text-sm text-slate-700">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* How it works */}
                <ScrollReveal className="mb-16" delay={35}>
                    <section>
                        <h2 className="mb-8 text-2xl font-bold text-emerald-950 sm:text-3xl">
                            From kickoff to confident reporting
                        </h2>
                        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    step: "01",
                                    title: "Discover & scope",
                                    text: "We map entities, data owners, material topics, and the reporting standards that apply to each geography.",
                                },
                                {
                                    step: "02",
                                    title: "Connect & cleanse",
                                    text: "Ingest activity data, utility files, spend, travel, and supplier responses with validation rules that flag gaps early.",
                                },
                                {
                                    step: "03",
                                    title: "Model & attribute",
                                    text: "Roll up Scopes, allocate shared services, and attribute financed emissions for lending and investment books.",
                                },
                                {
                                    step: "04",
                                    title: "Publish & prove",
                                    text: "Generate disclosures, management commentary inputs, and public traceability surfaces from the same golden record.",
                                },
                            ].map((row) => (
                                <li
                                    key={row.step}
                                    className="card-hover relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
                                    <span className="text-xs font-bold text-emerald-700">{row.step}</span>
                                    <h3 className="mt-2 text-lg font-semibold text-emerald-950">{row.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{row.text}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </ScrollReveal>

                {/* Social proof */}
                <ScrollReveal className="mb-16" delay={45}>
                    <section className="section-bg rounded-2xl border border-white/50 p-6 shadow-lg sm:p-8 md:p-9">
                        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            Trusted by teams moving from compliance to advantage
                        </h2>
                        <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-700">
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                                120+ organizations
                            </span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                                Reporting cycle compression
                            </span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                                Supplier verification acceleration
                            </span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                                Banking &amp; corporate programs
                            </span>
                        </div>
                        <p className="mt-5 max-w-4xl text-sm leading-relaxed text-slate-700 sm:text-base">
                            Sustainability officers use GreenLedger for auditable metrics; finance teams align ledgers
                            with climate data; procurement leads run structured supplier programs. When disclosure
                            season arrives, everyone is looking at the same numbers—and when a customer scans a code,
                            that story still holds.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {["Industrials", "Consumer goods", "Financial services", "Logistics"].map((label) => (
                                <div
                                    key={label}
                                    className="flex h-16 items-center justify-center rounded-xl border border-dashed border-emerald-800/20 bg-white/60 text-xs font-semibold uppercase tracking-wide text-emerald-900/70">
                                    {label}
                                </div>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>

                {/* Benefits */}
                <ScrollReveal className="mb-16" delay={25}>
                    <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                        {[
                            {
                                title: "Accelerate ROI",
                                body: "Turn compliance work into measurable cost reductions, avoided penalties, and improved access to green finance.",
                            },
                            {
                                title: "Increase trust",
                                body: "Give customers, regulators, and partners transparent emissions and custody proofs they can verify.",
                            },
                            {
                                title: "Stay resilient",
                                body: "See weak supplier nodes early and remediate before disruptions or reputational issues compound.",
                            },
                            {
                                title: "Scale confidently",
                                body: "Begin with core reporting and extend to deep Scope 3 and SKU-level traceability without re-platforming.",
                            },
                        ].map((item, i) => (
                            <article
                                key={item.title}
                                className="card-hover animate-fade-up rounded-2xl border border-white/80 bg-emerald-50/80 p-5 shadow-sm backdrop-blur-sm"
                                style={{ animationDelay: `${i * 70}ms` }}>
                                <h3 className="text-base font-semibold text-emerald-900">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
                            </article>
                        ))}
                    </section>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal className="scroll-mt-24" threshold={0.2}>
                    <section
                        id="cta"
                        className="full-bleed border-y border-emerald-200/60 bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-900 py-12 text-white shadow-2xl md:py-14">
                        <div className="mx-auto flex w-full max-w-none flex-col gap-6 px-4 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 lg:px-7 lg:py-2">
                            <div className="min-w-0">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    See GreenLedger on your data in a live session
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                                    Walk through reporting templates, carbon inventory setup, and a traceability example
                                    tailored to your sector. Leave with a 30-day rollout sketch your steering committee
                                    can debate with facts—not assumptions.
                                </p>
                            </div>
                            <a
                                href="#"
                                className="animate-pulse-strong inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-8 py-3.5 text-center text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50">
                                Book a free demo
                            </a>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
}
