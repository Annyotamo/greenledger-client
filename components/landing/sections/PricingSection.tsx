"use client";

import { useState } from "react";
import { LuCheck, LuArrowRight, LuRefreshCw, LuSparkles } from "react-icons/lu";

interface FeatureDetail {
    title: string;
    desc: string;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    featuresFront: string[];
    featuresBack: FeatureDetail[];
    ctaText: string;
    ctaLink: string;
    isPopular?: boolean;
}

const plans: Plan[] = [
    {
        id: "eco-core",
        name: "Eco-Core",
        description: "For teams starting their carbon accounting and basic ESG reporting journey.",
        featuresFront: [
            "Up to 10 team members",
            "Up to 5 facilities",
            "Scope 1 & 2 Emissions Inventory",
            "Role-based auth & permissions",
            "Append-only activity audit trail",
        ],
        featuresBack: [
            { title: "10 Team Members", desc: "Collaborative input with submitter & viewer role controls." },
            { title: "5 Facilities", desc: "Track fuel & electricity inputs at up to 5 physical sites." },
            { title: "Scope 1 Inventory", desc: "Direct emissions tracking from boilers, fuel, & mobile combustion." },
            { title: "Scope 2 Inventory", desc: "Indirect emissions from purchased electricity, steam, & cooling." },
            { title: "Append-Only Logging", desc: "Tamper-evident system log of all record submissions and edits." },
            { title: "Document Uploads", desc: "Attach energy utility files & invoices (up to 50 uploads/month)." },
            { title: "PDF Report Exports", desc: "One-click generation of basic carbon audit-ready summaries." },
            { title: "Email Support", desc: "Standard 24-hour response window for team inquiries." },
        ],
        ctaText: "Start Eco-Core Trial",
        ctaLink: "/#cta",
    },
    {
        id: "net-zero-pro",
        name: "Net-Zero Pro",
        description: "For scaling companies requiring full scope emissions inventory and automated validation.",
        isPopular: true,
        featuresFront: [
            "Up to 50 team members",
            "Up to 20 facilities",
            "Complete Scope 1, 2 & 3 reporting",
            "OCR Invoice ingestion & utility APIs",
            "Reviewer & Approver workflow gates",
        ],
        featuresBack: [
            { title: "50 Team Members", desc: "Multiple authorization tiers (Submitter, Reviewer, Approver)." },
            { title: "20 Facilities", desc: "Geographic grouping with automatic localized grid factors." },
            { title: "Scope 3 Inventory", desc: "Full supply chain, employee commuting, and corporate travel tracking." },
            { title: "Approval Workflows", desc: "Segregation of duties with sign-off logs and return comments." },
            { title: "Cryptographic Hashing", desc: "Every approved record is hashed to prevent quiet modifications." },
            { title: "OCR Document Parsing", desc: "AI-driven automatic data extraction from uploaded energy utility bills." },
            { title: "Utility API Integrations", desc: "Sync directly with electricity & gas providers for zero-key entry." },
            { title: "CSRD & ESRS Disclosures", desc: "Compliance templates formatted for European regulatory submissions." },
            { title: "Priority Email & Chat", desc: "Dedicated support team with a guaranteed 8-hour SLA response." },
        ],
        ctaText: "Get Started with Pro",
        ctaLink: "/#cta",
    },
    {
        id: "climate-enterprise",
        name: "Climate Enterprise",
        description: "For global enterprises needing absolute assurance, supply chain traceability, and SSO.",
        featuresFront: [
            "Unlimited members & facilities",
            "Scope 1-3 + Supply Chain Traceability",
            "Blockchain-anchored audit ledger",
            "Dedicated ESG analyst & custom factors",
            "SSO (SAML/OIDC) & granular IAM",
        ],
        featuresBack: [
            { title: "Unlimited Everything", desc: "Infinite users, entities, facilities, and document uploads globally." },
            { title: "Product Carbon Footprints", desc: "Lifecycle emissions analysis mapped to individual product SKUs." },
            { title: "Supply Chain Traceability", desc: "Collect Primary Scope 3 data directly from tier-1 suppliers." },
            { title: "Blockchain Verification", desc: "Immutable anchoring of public environmental ESG claims." },
            { title: "Dedicated ESG Analyst", desc: "Ongoing consulting, audit support, and custom library mapping." },
            { title: "Custom Emission Factors", desc: "Custom libraries matching unique machinery & industrial processes." },
            { title: "Enterprise Identity & IAM", desc: "SSO integrations (SAML, OIDC, Active Directory) & strict permissions." },
            { title: "IoT Data Pipelines", desc: "Connect real-time smart meters and facility sensors via Webhooks." },
            { title: "Dedicated SLA Support", desc: "24/7/365 phone & Slack access with a 2-hour priority SLA." },
        ],
        ctaText: "Request Enterprise Demo",
        ctaLink: "/#cta",
    },
];

export default function PricingSection() {
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

    const toggleFlip = (id: string) => {
        setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCardClick = (e: React.MouseEvent, id: string) => {
        const target = e.target as HTMLElement;
        // Do not flip if clicking buttons, links, or their children
        if (target.closest("button") || target.closest("a") || target.closest("input")) {
            return;
        }
        toggleFlip(id);
    };

    return (
        <section id="pricing" className="scroll-mt-24 py-8">
            <div className="mx-auto flex flex-col items-center text-center mb-12 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/50 mb-3">
                    <LuSparkles className="w-3.5 h-3.5" />
                    <span>Audit-Ready Platform Editions</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
                    Scale GreenLedger to Your Operations
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base max-w-2xl">
                    Explore our capability editions designed for every stage of your greenhouse gas accounting and 
                    sustainability journey. Find the perfect fit for your organizational complexity.
                </p>
            </div>

            {/* Plan Cards Grid with horizontal dotted connector line */}
            <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0">
                {/* Center horizontal dark green dotted line connecting the 3 cards */}
                <div 
                    className="absolute top-1/2 left-6 right-6 h-0.5 border-t-2 border-dotted border-emerald-900/35 -translate-y-1/2 z-0 hidden md:block" 
                    aria-hidden="true"
                />

                <div className="relative z-10 grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => {
                        const isFlipped = !!flippedCards[plan.id];

                        return (
                            <div
                                key={plan.id}
                                className="w-full h-[460px] [perspective:1200px] cursor-pointer group"
                                onClick={(e) => handleCardClick(e, plan.id)}>
                                <div
                                    className="relative w-full h-full [transform-style:preserve-3d] select-none"
                                    style={{
                                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                        transition: "transform 1.1s cubic-bezier(0.25, 1, 0.5, 1)",
                                    }}>
                                    {/* FRONT FACE */}
                                    <div
                                        className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border shadow-sm transition-all duration-300 ${
                                            plan.isPopular
                                                ? "bg-gradient-to-br from-[#094d3d] to-[#04261d] text-white border-emerald-800/40 shadow-emerald-950/20 group-hover:shadow-lg group-hover:shadow-emerald-950/30 group-hover:scale-[1.01]"
                                                : "bg-white/80 border-slate-200/80 text-emerald-950 backdrop-blur-md shadow-slate-100 group-hover:shadow-md group-hover:scale-[1.01] group-hover:border-emerald-600/35"
                                        }`}
                                        style={{
                                            backfaceVisibility: "hidden",
                                            WebkitBackfaceVisibility: "hidden",
                                            transform: "rotateY(0deg)",
                                            zIndex: isFlipped ? 0 : 2,
                                        }}>
                                        <div>
                                            {/* Tier Tag/Popular badge */}
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-[0.7rem] font-bold uppercase tracking-[0.15em] font-[var(--font-jetbrains)] ${
                                                        plan.isPopular ? "text-emerald-400" : "text-emerald-800"
                                                    }`}>
                                                    {plan.id === "eco-core" ? "Tier 1" : plan.id === "net-zero-pro" ? "Tier 2" : "Tier 3"}
                                                </span>
                                                {plan.isPopular && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                                                        Most Popular
                                                    </span>
                                                )}
                                            </div>

                                            {/* Plan Name & Desc */}
                                            <h3 className="text-2xl font-bold mt-4 tracking-tight">{plan.name}</h3>
                                            <p
                                                className={`text-xs mt-2 leading-relaxed ${
                                                    plan.isPopular ? "text-emerald-100/80" : "text-slate-600"
                                                }`}>
                                                {plan.description}
                                            </p>

                                            {/* Feature Highlights List */}
                                            <ul className="mt-8 space-y-3 border-t pt-6 border-slate-200/20">
                                                {plan.featuresFront.map((feat, index) => (
                                                    <li key={index} className="flex items-start gap-2.5 text-xs">
                                                        <LuCheck
                                                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                                                                plan.isPopular ? "text-emerald-400" : "text-emerald-700"
                                                            }`}
                                                        />
                                                        <span className="leading-normal">{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-auto pt-4 flex flex-col gap-3">
                                            <a
                                                href={plan.ctaLink}
                                                className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold transition-colors shadow-sm ${
                                                    plan.isPopular
                                                        ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-emerald-950/30"
                                                        : "bg-emerald-800 text-white hover:bg-emerald-900"
                                                }`}>
                                                {plan.ctaText}
                                            </a>
                                            <button
                                                onClick={() => toggleFlip(plan.id)}
                                                className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 transition-colors border-0 bg-transparent ${
                                                    plan.isPopular
                                                        ? "text-emerald-300 hover:text-emerald-200"
                                                        : "text-emerald-800 hover:text-emerald-900"
                                                }`}>
                                                <LuRefreshCw className="w-3.5 h-3.5" />
                                                <span>Detailed Features & Specs</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* BACK FACE */}
                                    <div
                                        className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border shadow-sm ${
                                            plan.isPopular
                                                ? "bg-gradient-to-br from-[#0b382d] to-[#051c16] text-white border-emerald-800/40"
                                                : "bg-white/95 border-slate-200/80 text-emerald-950 backdrop-blur-md shadow-slate-100"
                                        }`}
                                        style={{
                                            backfaceVisibility: "hidden",
                                            WebkitBackfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                            zIndex: isFlipped ? 2 : 0,
                                        }}>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-[0.7rem] font-bold uppercase tracking-[0.15em] font-[var(--font-jetbrains)] ${
                                                        plan.isPopular ? "text-emerald-400" : "text-emerald-800"
                                                    }`}>
                                                    {plan.name} Details
                                                </span>
                                                <button
                                                    onClick={() => toggleFlip(plan.id)}
                                                    className={`inline-flex items-center gap-1 text-[0.68rem] font-semibold bg-transparent border-0 px-2 py-1 rounded-md transition-colors ${
                                                        plan.isPopular
                                                            ? "text-emerald-300 hover:bg-white/5"
                                                            : "text-emerald-800 hover:bg-emerald-55"
                                                    }`}>
                                                    <LuArrowRight className="w-3 h-3 rotate-180" />
                                                    <span>Overview</span>
                                                </button>
                                            </div>

                                            <h4 className="text-lg font-bold mt-3 border-b border-slate-200/20 pb-2.5">
                                                Full Capabilities List
                                            </h4>

                                            {/* Scrollable specs list */}
                                            <div className="mt-3 space-y-3 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
                                                {plan.featuresBack.map((detail, index) => (
                                                    <div key={index} className="flex flex-col gap-0.5 border-b border-slate-200/10 pb-2 last:border-0 last:pb-0">
                                                        <span className="text-xs font-bold flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                                plan.isPopular ? "bg-emerald-400" : "bg-emerald-700"
                                                            }`} />
                                                            {detail.title}
                                                        </span>
                                                        <span
                                                            className={`text-[0.68rem] leading-relaxed pl-3 ${
                                                                plan.isPopular ? "text-emerald-100/60" : "text-slate-600"
                                                            }`}>
                                                            {detail.desc}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-auto pt-4 flex flex-col gap-3">
                                            <a
                                                href={plan.ctaLink}
                                                className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold transition-colors shadow-sm ${
                                                    plan.isPopular
                                                        ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-emerald-950/30"
                                                        : "bg-emerald-800 text-white hover:bg-emerald-900"
                                                }`}>
                                                {plan.ctaText}
                                            </a>
                                            <button
                                                onClick={() => toggleFlip(plan.id)}
                                                className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 transition-colors border-0 bg-transparent ${
                                                    plan.isPopular
                                                        ? "text-emerald-300 hover:text-emerald-200"
                                                        : "text-emerald-800 hover:text-emerald-900"
                                                }`}>
                                                <LuArrowRight className="w-3.5 h-3.5" style={{ transform: "rotateY(180deg)" }} />
                                                <span>Return to Overview</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
