"use client";

import Link from "next/link";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import { CBAMNavbar } from "./CBAMNavbar";
import { CBAMGuidedCatalog } from "./CBAMGuidedCatalog";

export function CBAMCatalogView() {
    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12 font-sans">
            <CBAMNavbar />

            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-2 font-sans text-xs text-slate-500 font-medium">
                    <Link href="/cbam" className="hover:text-primary transition-colors">
                        EU CBAM Declaration
                    </Link>
                    <span>/</span>
                    <span className="text-secondary font-semibold">Master Catalog & CN Codes</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    Master Catalog & Guided CN Code Resolver
                </h1>
                <p className="font-sans text-xs text-slate-500 max-w-3xl leading-relaxed">
                    Explore the official EU Combined Nomenclature (CN) 8-digit codes across 6 aggregated sectors, resolve tariff specifications through 3-step cascading dropdowns, and browse standard IPCC fuel emission factors.
                </p>
            </div>

            {/* Guided Catalog Component */}
            <CBAMGuidedCatalog />

            <AiAssistantFAB />
        </div>
    );
}
