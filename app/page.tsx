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
        title: "From raw data to audit-ready disclosures",
        description:
            "Regulators especially in Europe expect consistent, evidence-backed reporting on environmental and social impact. GreenLedger centralizes collection, validation, and narrative so teams ship CSRD- and ESRS-aligned outputs without spreadsheet chaos.",
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
            "Treat carbon like a ledger: every activity rolls up to totals you can defend in the boardroom. Built-in GHG Protocol thinking, activity data imports, and uncertainty flags help you improve data quality over time not just once a year.",
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
        title: "From supplier to QR proof consumers can trust",
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
            "Reporting, accounting, and traceability share the same master data. When a supplier updates a factor or a loan book shifts, every dependent view updates so your ESG story stays coherent end to end.",
        bullets: [
            "Role-based access for sustainability, finance, and procurement",
            "API-friendly exports for data warehouses and BI tools",
            "Implementation paths: start with reporting, expand to Scope 3, add traceability",
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
                <div className="mb-12">
                    <HeroSection />
                </div>

                <MotionInView className="mb-16">
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

                <MotionInView className="mb-14" delayMs={50}>
                    <MetricsStripSection />
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

                <MotionInView className="mb-16 scroll-mt-24" delayMs={40}>
                    <TraceabilityExplainerSection />
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
