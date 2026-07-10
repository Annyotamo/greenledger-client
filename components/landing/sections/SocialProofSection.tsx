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
    title: "Steel Emissions & Carbon Insights",
    description:
        "Explore key emission sources, production processes, and carbon accounting concepts relevant to the steel industry.",
},
{
    id: "cement",
    label: "Cement",
    icon: <LuLayers className="w-4 h-4" />,
    title: "Cement Manufacturing & Emissions",
    description:
        "Learn about calcination emissions, clinker production, alternative fuels, and sustainability considerations across cement operations.",
},
{
    id: "finance",
    label: "Finance",
    icon: <LuTrendingUp className="w-4 h-4" />,
    title: "Financed Emissions & Sustainable Finance",
    description:
        "Understand financed emissions, portfolio carbon exposure, and the principles behind climate-focused financial reporting.",
},
{
    id: "logistics",
    label: "Logistics",
    icon: <LuTruck className="w-4 h-4" />,
    title: "Freight & Transport Emissions",
    description:
        "Discover how freight operations contribute to emissions and explore common methodologies used to estimate transportation impacts.",
},
        ],
        [],
    );

    const [activeTab, setActiveTab] = useState<string>("steel");

    const currentIndustry = useMemo(() => {
        return industries.find((ind) => ind.id === activeTab) || industries[0];
    }, [activeTab, industries]);

    return (
        <section className="section-bg relative rounded-3xl border border-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8 md:p-10 overflow-hidden mt-15">
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
                    <div className="w-full p-2 relative overflow-hidden flex flex-col justify-between">
                        {/* Mock App Header */}
                        <div className="flex items-center justify-between px-2 pb-2 border-b border-emerald-900/5 mb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
                            </div>
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
