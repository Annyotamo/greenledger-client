import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import MotionInView from "@/components/landing/MotionInView";

// Informative CBAM Page Components
import CBAMHero from "@/components/landing/sections/cbam/CBAMHero";
import CBAMGovernance from "@/components/landing/sections/cbam/CBAMGovernance";
import CBAMEmissionsTracking from "@/components/landing/sections/cbam/CBAMEmissionsTracking";
import CBAMRegulations from "@/components/landing/sections/cbam/CBAMRegulations";
import CBAMSupplyChain from "@/components/landing/sections/cbam/CBAMSupplyChain";
import CBAMExposure from "@/components/landing/sections/cbam/CBAMExposure";
import CBAMCTA from "@/components/landing/sections/cbam/CBAMCTA";

export const metadata: Metadata = {
    title: "EU CBAM Exporter Compliance & Embedded Emissions | GreenLedger",
    description:
        "Installation-level embedded-emissions data for your EU buyers — verified and audit-ready, so your shipments aren't priced on punitive default values.",
};

export default function PublicCBAMPage() {
    return (
        <main className="w-full text-slate-900 font-[var(--font-hanken),Inter,system-ui,sans-serif]">
            {/* Video Hero Section */}
            <CBAMHero />

            {/* Main Sub-Hero Informative Content */}
            <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 mt-12 pb-24">
                <MotionInView className="mb-16" delayMs={50} id="governance">
                    <CBAMGovernance />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50} id="tracking">
                    <CBAMEmissionsTracking />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50} id="regulations">
                    <CBAMRegulations />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50} id="supply-chain">
                    <CBAMSupplyChain />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50} id="exposure">
                    <CBAMExposure />
                </MotionInView>

                <MotionInView className="mb-8" delayMs={50}>
                    <CBAMCTA />
                </MotionInView>
            </div>

            {/* Footer */}
            <div className="mx-6">
                <Suspense fallback={<div>Loading Footer...</div>}>
                    <Footer />
                </Suspense>
            </div>
        </main>
    );
}
