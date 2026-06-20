import type { Metadata } from "next";
import MotionInView from "@/components/landing/MotionInView";

// CBAM Section Components
import CBAMHero from "@/components/landing/sections/cbam/CBAMHero";
import CBAMGovernance from "@/components/landing/sections/cbam/CBAMGovernance";
import CBAMEmissionsTracking from "@/components/landing/sections/cbam/CBAMEmissionsTracking";
import CBAMRegulations from "@/components/landing/sections/cbam/CBAMRegulations";
import CBAMSupplyChain from "@/components/landing/sections/cbam/CBAMSupplyChain";
import CBAMExposure from "@/components/landing/sections/cbam/CBAMExposure";
import CBAMCTA from "@/components/landing/sections/cbam/CBAMCTA";

export const metadata: Metadata = {
    title: "CBAM Technical Deep-Dive | GreenLedger",
    description:
        "Navigate the Carbon Border Adjustment Mechanism with precision. Automate emissions calculations, manage registry compliance, and trace carbon footprint across overseas supplier nodes.",
};

export default function CBAMPage() {
    return (
        <main className="w-full text-slate-900 font-[var(--font-hanken),Inter,system-ui,sans-serif]">
            {/* Hero Section containing back-to-home button */}
            <CBAMHero />

            {/* Sub-hero page content container */}
            <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 mt-12 pb-24">
                <MotionInView className="mb-16" delayMs={50}>
                    <CBAMGovernance />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50}>
                    <CBAMEmissionsTracking />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50}>
                    <CBAMRegulations />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50}>
                    <CBAMSupplyChain />
                </MotionInView>

                <MotionInView className="mb-16" delayMs={50}>
                    <CBAMExposure />
                </MotionInView>

                <MotionInView className="mb-8" delayMs={50}>
                    <CBAMCTA />
                </MotionInView>
            </div>
        </main>
    );
}
