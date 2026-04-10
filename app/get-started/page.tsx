import Image from "next/image";
import Link from "next/link";
import {
    LuArrowRight,
    LuCalendarClock,
    LuChartColumnIncreasing,
    LuFileCheck2,
    LuGlobe,
    LuLeaf,
    LuNetwork,
    LuQrCode,
    LuShieldCheck,
} from "react-icons/lu";
import greenLedgerLogo from "@/assets/GLLogo.png";

const offerings = [
    "AI-Powered ESG Data Management & Reporting",
    "CSRD & ESRS Reporting Software",
    "Financed Emission Reporting Platform for BFSI",
    "Supply Chain Traceability Solution",
    "ESG Reports Aligned with Global Frameworks",
    "Real Time Analytics & Dashboards",
    "In-depth Supplier Assessments",
    "Internal & External Traceability",
    "Carbon Accounting Software",
    "Batch Processing Traceability",
    "Scope 1, 2, & 3 Emissions Calculator",
    "QR Code-based Product Journey",
    "Blockchain-based Traceability Solution",
    "ESG Advisory & Consulting",
];

const journey = [
    {
        title: "Discovery call",
        body: "A focused 20-30 minute conversation to understand your entities, reporting obligations, and current data sources.",
    },
    {
        title: "Use-case mapping",
        body: "We map your priorities: CSRD/ESRS readiness, Scope 1-3 accounting, financed emissions, and traceability targets.",
    },
    {
        title: "Live working session",
        body: "A tailored walkthrough on Google Meet with the right stakeholders from sustainability, finance, procurement, and operations.",
    },
    {
        title: "Rollout blueprint",
        body: "You receive a practical onboarding sequence covering data, governance, and milestones for the first 30-90 days.",
    },
];

export default function GetStartedPage() {
    return (
        <div className="min-h-screen w-full text-slate-900">
            <main className="mx-auto w-full max-w-400 px-4 sm:px-5 md:px-6 lg:px-7">
                <section className="full-bleed relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 py-14 text-white md:py-18">
                    <div className="gl-orb gl-drift" style={{ top: "8%", left: "5%", width: 280, height: 280 }} />
                    <div
                        className="gl-orb gl-drift-2"
                        style={{ bottom: "10%", right: "8%", width: 340, height: 340 }}
                    />
                    <div className="relative mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
                            Get started with GreenLedger
                        </p>
                        <h1 className="mt-5 max-w-4xl text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                            Carbon accounting and ESG reporting built for serious teams
                        </h1>
                        <p className="mt-5 max-w-3xl text-base leading-relaxed text-emerald-50/95 sm:text-lg">
                            Choose how you want to begin. If you prefer a guided path, our team contacts you first and
                            schedules a dedicated working session. If you are ready to share requirements, submit your
                            company details directly through our intake form.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Link
                                href="#contact-first"
                                className="group rounded-2xl border border-emerald-300/40 bg-emerald-300 px-5 py-4 text-left text-sm font-bold text-emerald-950 shadow-2xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200">
                                <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-emerald-900/80">
                                    Recommended
                                </span>
                                <span className="mt-1 block text-base sm:text-lg">Talk to us first</span>
                                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-900/85 group-hover:translate-x-0.5 transition">
                                    Contact + schedule meeting
                                    <LuArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </Link>
                            <Link
                                href="/get-started/application"
                                className="group rounded-2xl border border-white/35 bg-white/15 px-5 py-4 text-left text-sm font-bold text-white shadow-xl backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20">
                                <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-emerald-100/90">
                                    Fast track
                                </span>
                                <span className="mt-1 block text-base sm:text-lg">Submit company details now</span>
                                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-100/95 group-hover:translate-x-0.5 transition">
                                    Fill intake form directly
                                    <LuArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="mb-6 max-w-3xl">
                        <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                            What we do for modern enterprises
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                            GreenLedger combines reporting, carbon accounting, and traceability in one operating layer.
                            Teams no longer chase disconnected spreadsheets, conflicting supplier records, or fragile
                            reporting pipelines.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {offerings.map((item, idx) => (
                            <article
                                key={item}
                                className="card-hover animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                                style={{ animationDelay: `${idx * 35}ms` }}>
                                <p className="text-sm font-semibold text-slate-800">{item}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: <LuFileCheck2 className="h-5 w-5" />,
                            title: "Framework aligned",
                            body: "CSRD, ESRS, and enterprise disclosure workflows with evidence-backed reporting.",
                        },
                        {
                            icon: <LuChartColumnIncreasing className="h-5 w-5" />,
                            title: "Actionable analytics",
                            body: "Real-time dashboards for sustainability, finance, procurement, and leadership.",
                        },
                        {
                            icon: <LuNetwork className="h-5 w-5" />,
                            title: "Supplier intelligence",
                            body: "In-depth supplier assessments, data validation, and risk-oriented traceability.",
                        },
                        {
                            icon: <LuQrCode className="h-5 w-5" />,
                            title: "Proof at product level",
                            body: "Batch-level and QR-led journeys for internal and external transparency.",
                        },
                    ].map((card) => (
                        <article
                            key={card.title}
                            className="card-hover rounded-2xl border border-emerald-900/10 bg-emerald-50/75 p-5 shadow-sm">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-900">
                                {card.icon}
                            </span>
                            <h3 className="mt-3 text-base font-semibold text-emerald-950">{card.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">{card.body}</p>
                        </article>
                    ))}
                </section>

                <section
                    id="contact-first"
                    className="mt-16 scroll-mt-24 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur-md sm:p-8 md:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                                <LuCalendarClock className="h-3.5 w-3.5" />
                                Option 1: Contact-first onboarding
                            </p>
                            <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                                Prefer to speak first? We contact you and schedule a tailored session
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                                Ideal for organizations that want expert guidance before filling technical details. We
                                align the right stakeholders and schedule a live session on Google Meet (or your
                                preferred platform) to scope your roadmap.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a
                                    href="mailto:sales@greenledger.com?subject=GreenLedger%20-%20Schedule%20a%20discovery%20session"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
                                    Contact sales team
                                    <LuArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://meet.google.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-900/20 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50">
                                    Schedule on Google Meet
                                    <LuGlobe className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-white p-4 sm:p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-900/70">
                                Guided kickoff journey
                            </p>
                            <ol className="mt-4 space-y-3">
                                {journey.map((step, i) => (
                                    <li
                                        key={step.title}
                                        className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
                                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                            Step {i + 1}
                                        </p>
                                        <h3 className="mt-1 text-sm font-semibold text-emerald-950">{step.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{step.body}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                <section className="mt-14 rounded-3xl border border-emerald-900/10 bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-6 text-white shadow-2xl sm:p-8 md:p-10 mb-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-3xl">
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
                                <LuShieldCheck className="h-3.5 w-3.5" />
                                Option 2: Direct intake
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                                Ready to share details directly?
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-50/95 sm:text-base">
                                Complete our guided intake form with your organization profile, emissions scope, and
                                reporting priorities. Our team reviews it and responds with a tailored next-step plan.
                            </p>
                        </div>
                        <Link
                            href="/get-started/application"
                            className="animate-pulse-strong inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50">
                            Start company intake form
                            <LuLeaf className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
