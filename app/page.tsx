import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/components/designs/SoftAurora.css";
import HeroSection from "@/components/landing/sections/HeroSection";
import DataVizStaticSection from "@/components/landing/sections/DataVizStaticSection";
import PillarsSection from "@/components/landing/sections/PillarsSection";
import DeepDiveSection from "@/components/landing/sections/DeepDiveSection";
import KickoffToReportingSection from "@/components/landing/sections/KickoffToReportingSection";
import SocialProofSection from "@/components/landing/sections/SocialProofSection";
import BenefitsSection from "@/components/landing/sections/BenefitsSection";
import PricingSection from "@/components/landing/sections/PricingSection";
import MotionInView from "@/components/landing/MotionInView";
import NewsTicker from "@/components/landing/NewsTicker";
import esgReportingImg from "@/assets/landing-images/esg-reporting.jpg";
import opsImg from "@/assets/landing-images/746569-848x441.jpg";
import heroMosaic from "@/assets/landing-images/esg_main.960_0_1.jpg";
import sustainableFinanceImg from "@/assets/landing-images/ESG-Courses-Sustainable-Finance-1600x900-1.jpg";
import type { SliderCard } from "@/components/landing/FeatureSlider";
import SoftAurora from "@/components/designs/SoftAurora";
import AuroraCarousel from "@/components/landing/AuroraCarousel";

const sliderCards: SliderCard[] = [
    {
        id: "esg",
        eyebrow: "ESG reporting",
        title: "ESG reporting & GHG accounting liveand defensible",
        description:
            "Capture activity-level data, validate it, and produce audit ready disclosures with versioned evidence and traceable transformations.",
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
        title: "Immutable logging & evidence first workflows",
        description:
            "Every submission carries verifiable attachments and tamper-evident logs so auditors see the provenance and reviewers see who signed off when.",
        bullets: [
            "Append only logs and exportable audit trails",
            "Evidence attachments tied to activity records",
            "Verification states and auditor-friendly exports",
        ],
        accent: "#315a43",
        imageSrc: opsImg.src,
    },
    {
        id: "roles",
        eyebrow: "Permissions & approvals",
        title: "Role based auth with activity submission approval",
        description:
            "Segregate duties and manage approval queues: submitters, reviewers, and approvers with clear audit stamps and notifications.",
        bullets: [
            "Role based access controls and scoped permissions",
            "Approval workflows for fuel/electricity/energy activities",
            "Activity-level comments, rejections, and resubmissions",
        ],
        accent: "#2d6b4e",
        imageSrc: heroMosaic.src,
    },
    {
        id: "activities",
        eyebrow: "Fuel & Electricity",
        title: "Fuel, electricity and energy activities measured right",
        description:
            "Ingest meters, invoices and manual entries. Normalize units, flag anomalies, and reconcile against contracts so operational teams can trust the numbers.",
        bullets: [
            "Meter level ingestion and invoice reconciliation",
            "Unit normalization and conversion chains",
            "Activity validation rules and exception reporting",
        ],
        accent: "#1f7a3f",
        imageSrc: sustainableFinanceImg.src,
    },
];

export default function Home() {
    return (
        /* Removed overflow-x: hidden from main to keep page calculations clean */
        <main className="w-full text-slate-900 font-[var(--font-hanken),Inter,system-ui,sans-serif]">
            <div className="mx-auto w-full max-w-400 px-4 sm:px-5 md:px-6 lg:px-7 h-full">
                <HeroSection />
            </div>

            <div className="min-h-screen lg:h-[125vh] w-full overflow-hidden bg-greenledger-blend">
                <SoftAurora
                    speed={1}
                    scale={2.5}
                    brightness={0.95}
                    color1="#00C897"
                    color2="#094d3d"
                    noiseFrequency={2.5}
                    noiseAmplitude={3}
                    bandHeight={0.5}
                    bandSpread={1}
                    octaveDecay={0.5}
                    layerOffset={2}
                    colorSpeed={1.5}
                    enableMouseInteraction
                    mouseInfluence={0.3}>
                    <AuroraCarousel />
                </SoftAurora>
            </div>

            <Navbar />
            <div className="mx-6">
                <NewsTicker />
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
                <MotionInView className="mb-16 scroll-mt-24" delayMs={35}>
                    <PricingSection />
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
                                className="inline-flex shrink-0 items-center justify-center rounded-md bg-white px-8 py-3.5 text-center text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50">
                                Book a free demo
                            </Link>
                        </div>
                    </section>
                </MotionInView>
                <Suspense fallback={<div>Loading Footer...</div>}>
                    <Footer />
                </Suspense>
            </div>
        </main>
    );
}
