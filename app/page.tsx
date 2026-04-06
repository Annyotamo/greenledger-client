"use client";

import Image from "next/image";
import { useEffect } from "react";
import greenLedgerLogo from "@/assets/GLLogo.png";
import { FeatureSlider, type SliderCard } from "@/components/landing/FeatureSlider";
import { HoverInsightGrid, type HoverInsight } from "@/components/landing/HoverInsightGrid";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { ScrollReveal, useParallaxScroll } from "@/components/landing/ScrollReveal";
import { SolutionsAccordion, type AccordionItem } from "@/components/landing/SolutionsAccordion";

const sliderCards: SliderCard[] = [
    {
        id: "esg",
        eyebrow: "ESG reporting",
        title: "From raw data to audit-ready disclosures",
        description:
            "Regulators—especially in Europe—expect consistent, evidence-backed reporting on environmental and social impact. Green Ledger centralizes collection, validation, and narrative so teams ship CSRD- and ESRS-aligned outputs without spreadsheet chaos.",
        bullets: [
            "Structured data capture mapped to international disclosure frameworks",
            "Automated report generation with version history for auditors",
            "Dashboards for executives and working views for sustainability teams",
            "Banking edition: financed emissions linked to loans and portfolios (PCAF-style workflows)",
        ],
        accent: "#1f7a3f",
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
                    Companies—particularly those exposed to European rules—face mandatory reporting on climate and social topics. Frameworks like CSRD and the ESRS set expectations for
                    granularity, comparability, and assurance readiness.
                </p>
                <p className="mt-3">
                    Green Ledger is built to operationalize that workload: governed data collection, controlled transformations into disclosure formats, and clear ownership between
                    sustainability, finance, and legal reviewers. Banks and asset owners can extend the same rigor to financed emissions, aligning lending and investment portfolios with
                    emerging supervisory and stakeholder pressure.
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
                    A credible footprint is more than a single annual number. It is a living model of energy, travel, purchased goods, logistics, and—where relevant—customer use and
                    end-of-life impacts.
                </p>
                <p className="mt-3">
                    Green Ledger combines calculators, import paths for utility and ERP extracts, and supplier-sourced updates so your inventory matures quarter over quarter. Teams see
                    where uncertainty is high, prioritize the next tranche of supplier engagement, and tie reduction initiatives to measurable deltas.
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
                    Traceability is the bridge between compliance data and brand trust. When someone scans a QR code on-pack or online, they should see a coherent story: where materials
                    originated, which facilities transformed them, and what sustainability criteria were met along the way.
                </p>
                <p className="mt-3">
                    Green Ledger links internal BOMs and supplier graphs to consumer-safe narratives. Procurement teams keep the detailed evidence; marketing and product teams publish
                    what is accurate, approved, and localized—without maintaining a separate shadow spreadsheet.
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
                    Most customers do not flip every module on day one. A pragmatic sequence is to stabilize reporting and data governance, extend carbon accounting into the highest-impact
                    Scope 3 categories, then layer traceability on hero SKUs or regions.
                </p>
                <p className="mt-3">
                    Green Ledger’s modules share reference data—suppliers, sites, factors, and products—so each phase compounds instead of creating another silo. Our team helps map your
                    entities, chart of accounts touchpoints, and supplier tiers to a staged plan with measurable milestones.
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
            <main className="mx-auto w-full max-w-[100rem] px-4 sm:px-5 md:px-6 lg:px-7">
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
                            className="absolute inset-0 bg-gradient-to-br from-emerald-950/92 via-emerald-900/78 to-teal-950/88"
                            aria-hidden
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-emerald-950/35" aria-hidden />
                        <div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-10%,rgba(255,255,255,0.16),transparent_52%)]"
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
                                    Green Ledger helps organizations collect environmental and social data, auto-generate standards-aligned reports (including CSRD / ESRS), run rigorous
                                    carbon accounting across Scopes 1–3, and prove product stories with supply chain traceability—from factory floor to QR code in a shopper’s hand.
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
                            </div>
                            <div
                                className="flex shrink-0 flex-col items-center gap-5 will-change-transform md:items-end"
                                style={{ transform: `translate3d(0,${heroCounter}px,0)` }}>
                                <div className="rounded-3xl border border-white/40 bg-white/60 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-sm sm:ring-0">
                                    <Image
                                        src={greenLedgerLogo}
                                        alt="Green Ledger"
                                        width={220}
                                        height={220}
                                        className="h-auto w-[min(100%,200px)] object-contain sm:w-[220px]"
                                        priority
                                    />
                                </div>
                                <p className="max-w-xs text-center text-xs leading-relaxed text-emerald-100/85 md:text-right">
                                    Built for enterprises that need audit-ready numbers and consumer-trusted product stories—not slide-deck estimates.
                                </p>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Metrics strip */}
                <ScrollReveal className="mb-14" delay={40}>
                    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5" aria-label="Highlights">
                    {[
                        { k: "CSRD / ESRS", v: "Aligned reporting flows" },
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

                {/* Slider */}
                <ScrollReveal className="mb-16 scroll-mt-24" delay={60}>
                    <section id="pillars" className="scroll-mt-24">
                    <div className="mb-6 max-w-4xl">
                        <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">Three capabilities, one continuous data spine</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                            Slide through how reporting, carbon accounting, and traceability reinforce each other. The same suppliers, sites, and products feed every surface—so you are
                            never reconciling three different “versions of the truth.”
                        </p>
                    </div>
                    <FeatureSlider cards={sliderCards} />
                    </section>
                </ScrollReveal>

                {/* Hover cards */}
                <ScrollReveal className="mb-16" delay={50}>
                    <section className="section-bg rounded-2xl border border-white/50 p-5 shadow-lg sm:p-7 md:p-9" aria-label="Outcomes">
                    <h2 className="text-xl font-bold text-emerald-950 sm:text-2xl">Outcomes teams feel in the first two quarters</h2>
                    <p className="mt-2 max-w-3xl text-sm text-slate-700 sm:text-base">
                        Hover each card for a fuller picture—numbers here are illustrative of the operational improvements customers target.
                    </p>
                    <div className="mt-8">
                        <HoverInsightGrid insights={hoverInsights} />
                    </div>
                    </section>
                </ScrollReveal>

                {/* Narrative band */}
                <ScrollReveal className="mb-16">
                    <section className="full-bleed bg-gradient-to-b from-white/40 via-emerald-50/30 to-transparent py-12 md:py-14">
                        <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                        <div className="grid gap-10 lg:grid-cols-3">
                            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                <h3 className="text-lg font-semibold text-emerald-950">For sustainability &amp; legal owners</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                    Package evidence, control narrative, and manage assurance cycles without losing the thread between source transactions and published disclosures.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                <h3 className="text-lg font-semibold text-emerald-950">For finance &amp; risk</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                    Tie emissions to books: loans, investments, and counterparty exposures roll up into financed-emissions views that stand up to internal and external
                                    scrutiny.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm lg:p-6">
                                <h3 className="text-lg font-semibold text-emerald-950">For brand &amp; product teams</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                    Ship QR-led transparency that matches what compliance actually knows—so marketing claims and regulatory filings tell the same story.
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
                        <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">The longer read—how we think about the problem</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                            Expand any topic for plain-language context. This is the layer executives share with boards and transformation leads when they need more than a feature list.
                        </p>
                    </div>
                    <SolutionsAccordion items={accordionItems} />
                    </section>
                </ScrollReveal>

                {/* Traceability deep section */}
                <ScrollReveal className="mb-16 scroll-mt-24" delay={40}>
                    <section id="traceability" className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-xl backdrop-blur-md sm:p-7 md:p-9 lg:p-11">
                    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                        <div>
                            <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">Supply chain traceability, explained without the buzzwords</h2>
                            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                                Imagine scanning a QR code on a product and seeing where each ingredient or component came from, who processed it, and whether key sustainability criteria
                                were met. That experience only works if the back office maintains a structured map of suppliers, batches, certificates, and transformations.
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                                Green Ledger connects operational procurement data with customer-facing storytelling. You decide what is public, what stays internal, and how much detail
                                each market requires—while preserving a single governed record underneath.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                    <span>Map multi-tier suppliers with documents, audits, and corrective actions in one place.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                    <span>Tie specific lots or SKUs to chain-of-custody events for recalls, claims, or premium certifications.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                                    <span>Publish localized QR pages that reflect the latest approved facts—no manual website updates per change.</span>
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
                                    className="card-hover flex gap-4 rounded-2xl border border-white/70 bg-gradient-to-r from-emerald-50/90 to-white/90 p-5 shadow-md">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">{i + 1}</span>
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
                    <h2 className="mb-8 text-2xl font-bold text-emerald-950 sm:text-3xl">From kickoff to confident reporting</h2>
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
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Trusted by teams moving from compliance to advantage</h2>
                    <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-700">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">120+ organizations</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">Reporting cycle compression</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">Supplier verification acceleration</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">Banking &amp; corporate programs</span>
                    </div>
                    <p className="mt-5 max-w-4xl text-sm leading-relaxed text-slate-700 sm:text-base">
                        Sustainability officers use Green Ledger for auditable metrics; finance teams align ledgers with climate data; procurement leads run structured supplier programs.
                        When disclosure season arrives, everyone is looking at the same numbers—and when a customer scans a code, that story still holds.
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
                    <section id="cta" className="full-bleed border-y border-emerald-200/60 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 py-12 text-white shadow-2xl md:py-14">
                        <div className="mx-auto flex w-full max-w-none flex-col gap-6 px-4 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 lg:px-7 lg:py-2">
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See Green Ledger on your data in a live session</h2>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                                Walk through reporting templates, carbon inventory setup, and a traceability example tailored to your sector. Leave with a 30-day rollout sketch your
                                steering committee can debate with facts—not assumptions.
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
                <ScrollReveal threshold={0.05}>
                    <footer className="mt-14 rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 section-bg backdrop-blur-sm sm:p-7">
                    <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                        <div className="max-w-md">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">Green Ledger</p>
                            <p className="mt-2 text-xs leading-relaxed">
                                ESG reporting, carbon accounting, and supply chain traceability on one platform—designed for audit-ready enterprises and consumer-trusted brands.
                            </p>
                        </div>
                        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                            <a href="#" className="hover:text-emerald-700">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-emerald-700">
                                Terms
                            </a>
                            <a href="#" className="hover:text-emerald-700">
                                Security
                            </a>
                            <a href="#" className="hover:text-emerald-700">
                                Contact
                            </a>
                        </nav>
                        <p className="text-xs text-slate-500 sm:w-full sm:text-center">© {new Date().getFullYear()} Green Ledger. All rights reserved.</p>
                    </div>
                    </footer>
                </ScrollReveal>
            </main>
        </div>
    );
}
