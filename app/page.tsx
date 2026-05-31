import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/sections/HeroSection";
import DataVizStaticSection from "@/components/landing/sections/DataVizStaticSection";
import MetricsStripSection from "@/components/landing/sections/MetricsStripSection";
import PillarsSection from "@/components/landing/sections/PillarsSection";
import DeepDiveSection from "@/components/landing/sections/DeepDiveSection";
import TraceabilityExplainerSection from "@/components/landing/sections/TraceabilityExplainerSection";
import KickoffToReportingSection from "@/components/landing/sections/KickoffToReportingSection";
import SocialProofSection from "@/components/landing/sections/SocialProofSection";
import BenefitsSection from "@/components/landing/sections/BenefitsSection";

import MotionInView from "@/components/landing/MotionInView";
import NewsTicker from "@/components/landing/NewsTicker";
import BlogsSection from "@/components/landing/sections/BlogsSection";
import VideoBandSection from "@/components/landing/sections/VideoBandSection";
import esgReportingImg from "@/assets/landing-images/esg-reporting.jpg";
import opsImg from "@/assets/landing-images/746569-848x441.jpg";
import heroMosaic from "@/assets/landing-images/esg_main.960_0_1.jpg";
import sustainableFinanceImg from "@/assets/landing-images/ESG-Courses-Sustainable-Finance-1600x900-1.jpg";
import type { SliderCard } from "@/components/landing/FeatureSlider";

const sliderCards: SliderCard[] = [
    {
        id: "esg",
        eyebrow: "ESG reporting",
        title: "ESG reporting & GHG accounting — live and defensible",
        description:
            "Capture activity-level data, validate it, and produce audit-ready disclosures with versioned evidence and traceable transformations.",
        bullets: [
            "Continuous GHG accounting across Scopes 1–3",
            "Standards-aligned outputs with revision history for auditors",
            "Built-in validations and uncertainty flags for higher data quality",
            "Executive dashboards and working views for teams",
        ],
        accent: "#1f7a3f",
        imageSrc: esgReportingImg.src,
    },
    {
        id: "audit",
        eyebrow: "Audit ready",
        title: "Immutable logging & evidence-first workflows",
        description:
            "Every submission carries verifiable attachments and tamper-evident logs so auditors see the provenance and reviewers see who signed off when.",
        bullets: [
            "Append-only logs and exportable audit trails",
            "Evidence attachments tied to activity records",
            "Verification states and auditor-friendly exports",
        ],
        accent: "#315a43",
        imageSrc: opsImg.src,
    },
    {
        id: "roles",
        eyebrow: "Permissions & approvals",
        title: "Role-based auth with activity submission approval",
        description:
            "Segregate duties and manage approval queues: submitters, reviewers, and approvers with clear audit stamps and notifications.",
        bullets: [
            "Role-based access controls and scoped permissions",
            "Approval workflows for fuel/electricity/energy activities",
            "Activity-level comments, rejections, and resubmissions",
        ],
        accent: "#2d6b4e",
        imageSrc: heroMosaic.src,
    },
    {
        id: "activities",
        eyebrow: "Fuel & Electricity",
        title: "Fuel, electricity and energy activities — measured right",
        description:
            "Ingest meters, invoices and manual entries. Normalize units, flag anomalies, and reconcile against contracts so operational teams can trust the numbers.",
        bullets: [
            "Meter-level ingestion and invoice reconciliation",
            "Unit normalization and conversion chains",
            "Activity validation rules and exception reporting",
        ],
        accent: "#1f7a3f",
        imageSrc: sustainableFinanceImg.src,
    },
];

export default function Home() {
    return (
        <div className="min-h-screen w-full text-slate-900">
            <Navbar />
            <main className="mx-auto w-full max-w-400 px-4 sm:px-5 md:px-6 lg:px-7">
                {/* Above-the-fold: pure server-rendered content (no client JS required). */}
                <HeroSection />

                {/* Recent ESG news ticker */}
                <NewsTicker />

                <MotionInView>
                    <Suspense
                        fallback={
                            <section className="full-bleed overflow-hidden rounded-3xl border border-emerald-900/10 bg-white/70 p-8 shadow-sm">
                                <div className="h-7 w-2/3 rounded-xl bg-emerald-900/10" />
                                <div className="mt-4 h-4 w-1/2 rounded-xl bg-emerald-900/10" />
                            </section>
                        }>
                        <VideoBandSection />
                    </Suspense>
                </MotionInView>

                <MotionInView className="mb-16" delayMs={25}>
                    <DataVizStaticSection />
                </MotionInView>

                <MotionInView className="mb-16 scroll-mt-24" delayMs={80}>
                    <PillarsSection cards={sliderCards} />
                </MotionInView>

                <MotionInView className="mb-16 scroll-mt-24" delayMs={80}>
                    <DeepDiveSection />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={35}>
                    <KickoffToReportingSection />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={45}>
                    <SocialProofSection />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={25}>
                    <BenefitsSection />
                </MotionInView>

                <MotionInView delayMs={60}>
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
                                    tailored to your sector.
                                </p>
                            </div>
                            <Link
                                href="/#cta"
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-8 py-3.5 text-center text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50">
                                Book a free demo
                            </Link>
                        </div>
                    </section>
                </MotionInView>

                <Suspense
                    fallback={
                        <footer className="mt-14 rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 section-bg backdrop-blur-sm sm:p-7 mb-6">
                            <div className="h-4 w-1/3 rounded bg-emerald-900/10" />
                            <div className="mt-3 h-3 w-2/3 rounded bg-emerald-900/10" />
                        </footer>
                    }>
                    <Footer />
                </Suspense>
            </main>
        </div>
    );
}
