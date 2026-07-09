"use client";

import { useState, useMemo } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { LuFlame, LuLayers, LuTrendingUp, LuTruck } from "react-icons/lu";
import DecorativeVideo from "@/components/landing/DecorativeVideo";

interface Industry {
    id: string;
    label: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function SocialProofSection() {
    const industries: Industry[] = useMemo(
        () => [
            {
                id: "steel",
                label: "Steel",
                icon: <LuFlame className="w-4 h-4" />,
                title: "Steel Carbon Accounting",
                description:
                    "Track direct furnace emissions and coal inputs with real-time sensor integration and CBAM-ready declaration logging.",
            },
            {
                id: "cement",
                label: "Cement",
                icon: <LuLayers className="w-4 h-4" />,
                title: "Cement & Minerals Calcination",
                description:
                    "Model raw meal stoichiometry and optimize clinker ratios. Validate alternative biomass fuels with trace-to-laboratory validation.",
            },
            {
                id: "finance",
                label: "Finance",
                icon: <LuTrendingUp className="w-4 h-4" />,
                title: "PCAF Financed Emissions",
                description:
                    "Bridge investments with carbon impact. Reconcile loan books with actual, audit-proven borrower data instead of estimates.",
            },
            {
                id: "logistics",
                label: "Logistics",
                icon: <LuTruck className="w-4 h-4" />,
                title: "Carrier & Freight GHG Ledger",
                description:
                    "Automate Scope 3 shipping calculations. Ingest telematics and fuel card invoices for precise well-to-wheel analytics.",
            },
        ],
        [],
    );

    const [activeTab, setActiveTab] = useState<string>("steel");

    const currentIndustry = useMemo(() => {
        return industries.find((ind) => ind.id === activeTab) || industries[0];
    }, [activeTab, industries]);

    return (
        <section className="section-bg relative rounded-3xl border border-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8 md:p-10 overflow-hidden">
            {/* Ambient glows behind layout to feel high-end */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-teal-400/8 blur-3xl" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Column: Crisp Info & Tabs */}
                <div className="md:col-span-5 flex flex-col justify-between h-full">
                    <div>
                        {/* Minimal Tag */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/60 mb-2 block">
                            Industries We Serve
                        </span>

                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl leading-tight">
                            Trusted by teams moving from compliance to advantage
                        </h2>

                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            GreenLedger streamlines emissions tracking and carbon accounting for key industrial sectors, ensuring defensible audit trails from operations to disclosures.
                        </p>
                    </div>

                    {/* Active Industry Panel Card (Borderless, inline transition) */}
                    <div className="mt-8 min-h-[120px] flex flex-col justify-start">
                        <LazyMotion features={domAnimation} strict>
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={currentIndustry.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="flex flex-col gap-1.5"
                                >
                                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-base sm:text-lg">
                                        <span className="text-emerald-700">
                                            {currentIndustry.icon}
                                        </span>
                                        <h3>{currentIndustry.title}</h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {currentIndustry.description}
                                    </p>
                                </m.div>
                            </AnimatePresence>
                        </LazyMotion>
                    </div>

                    {/* Industry Selector Tabs (Clean & Sleek) */}
                    <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-slate-100 pt-6">
                        {industries.map((ind) => {
                            const isActive = ind.id === activeTab;
                            return (
                                <button
                                    key={ind.id}
                                    onClick={() => setActiveTab(ind.id)}
                                    className={`relative flex h-11 flex-col items-center justify-center rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? "bg-emerald-950 text-white shadow-sm"
                                            : "text-slate-500 hover:text-emerald-950 hover:bg-slate-50/50"
                                    }`}
                                >
                                    <span>{ind.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Larger Mock Loop Video Frame */}
                <div className="md:col-span-7 flex items-center justify-center">
                    <div className="w-full rounded-2xl border border-white/90 bg-white/45 p-2 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between ring-1 ring-emerald-950/10">
                        {/* Mock App Header */}
                        <div className="flex items-center justify-between px-2 pb-2 border-b border-emerald-900/5 mb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                                live_industry_data_simulation
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                                <span className="w-1 h-1 rounded-full bg-emerald-600 animate-ping" />
                                STREAMING
                            </span>
                        </div>

                        {/* Video Element */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-955 shadow-inner">
                            <DecorativeVideo
                                src="/api/media/industry-animation"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
