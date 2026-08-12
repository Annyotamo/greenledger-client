"use client";

import React, { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { PILLARS, BEFORE_AFTER_ITEMS, PillarId } from "./before-after/beforeAfterData";
import BeforeAfterCard from "./before-after/BeforeAfterCard";
import BeforeAfterToggleView from "./before-after/BeforeAfterToggleView";
import { BeforeAfterIcon } from "./before-after/BeforeAfterIcons";

export default function BeforeAfterSection() {
    const [activePillarId, setActivePillarId] = useState<PillarId>("accuracy");
    const [viewMode, setViewMode] = useState<"grid" | "spotlight">("grid");

    const pillarItems = BEFORE_AFTER_ITEMS.filter((item) => item.pillarId === activePillarId);

    return (
        <LazyMotion features={domAnimation} strict>
            <section
                id="before-after"
                className="full-bleed scroll-mt-24 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/40 py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden"
            >
                <div className="max-w-6xl mx-auto">
                    {/* SECTION HEADER BLOCK */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200/80 select-none mb-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                <span>TRANSFORMATION ENGINE / OPERATIONAL IMPACT</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 uppercase font-mono leading-tight">
                                Before GreenLedger <span className="text-emerald-600">→</span> After GreenLedger
                            </h2>
                            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                                See how replacing manual spreadsheet workflows with GreenLedger&apos;s financial-grade data engine turns regulatory ESG overhead into direct economic returns for heavy industrial manufacturers.
                            </p>
                        </div>

                        {/* View Switcher Toggle (Grid vs Spotlight) */}
                        <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 p-1.5 rounded-xl shrink-0 self-start md:self-auto shadow-inner select-none">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                                    viewMode === "grid"
                                        ? "bg-emerald-900 text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <BeforeAfterIcon name="GridIcon" className="w-3.5 h-3.5" />
                                <span>Grid View</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("spotlight")}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                                    viewMode === "spotlight"
                                        ? "bg-emerald-900 text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <BeforeAfterIcon name="SlidersIcon" className="w-3.5 h-3.5" />
                                <span>Spotlight View</span>
                            </button>
                        </div>
                    </div>

                    {/* PILLAR SELECTION NAVIGATION TABS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {PILLARS.map((pillar) => {
                            const isActive = pillar.id === activePillarId;
                            return (
                                <button
                                    key={pillar.id}
                                    type="button"
                                    onClick={() => setActivePillarId(pillar.id)}
                                    className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                                        isActive
                                            ? "bg-white border-2 border-emerald-600 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-600/20 scale-[1.01]"
                                            : "bg-white/80 border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-xs"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2.5 rounded-xl border ${
                                            isActive
                                                ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                                                : "bg-slate-100 text-slate-600 border-slate-200/60"
                                        }`}>
                                            <BeforeAfterIcon name={pillar.iconName} className="w-4.5 h-4.5" />
                                        </div>
                                        <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                            isActive
                                                ? "bg-emerald-100/90 text-emerald-800 border border-emerald-300/60"
                                                : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {pillar.badgeText}
                                        </span>
                                    </div>
                                    <h3 className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-tight ${
                                        isActive ? "text-emerald-950 font-extrabold" : "text-slate-900"
                                    }`}>
                                        {pillar.label}
                                    </h3>
                                    <p className={`mt-1.5 text-[11px] sm:text-xs leading-relaxed ${
                                        isActive ? "text-slate-600" : "text-slate-500"
                                    }`}>
                                        {pillar.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* PILLAR CONTENT DISPLAY AREA */}
                    <AnimatePresence mode="wait">
                        <m.div
                            key={`${activePillarId}-${viewMode}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                        >
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pillarItems.map((item, index) => (
                                        <BeforeAfterCard key={item.id} item={item} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <BeforeAfterToggleView items={pillarItems} />
                            )}
                        </m.div>
                    </AnimatePresence>
                </div>
            </section>
        </LazyMotion>
    );
}
