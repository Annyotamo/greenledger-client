"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { BeforeAfterItem } from "./beforeAfterData";
import { BeforeAfterIcon } from "./BeforeAfterIcons";

interface BeforeAfterToggleViewProps {
    items: BeforeAfterItem[];
}

export default function BeforeAfterToggleView({ items }: BeforeAfterToggleViewProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const activeItem = items[selectedIndex] || items[0];

    return (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-5 sm:p-7 md:p-8">
            {/* Quick Item Switcher Bar */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200/80 pb-4">
                {items.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIndex(idx)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                                isSelected
                                    ? "bg-emerald-900 text-white border-emerald-800 shadow-md"
                                    : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40"
                            }`}
                        >
                            <BeforeAfterIcon name={item.iconName} className="w-3.5 h-3.5" />
                            <span>{item.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Spotlight Interactive Comparison Canvas */}
            <AnimatePresence mode="wait">
                <m.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                    {/* Left: BEFORE STATE (5 cols) */}
                    <div className="lg:col-span-5 rounded-2xl border border-rose-200/80 bg-rose-50/40 p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-rose-600 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                            LEGACY PROCESS
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-rose-800">
                                <BeforeAfterIcon name="AlertTriangleIcon" className="w-4 h-4 shrink-0" />
                                <span className="font-mono text-xs font-bold uppercase tracking-wider">BEFORE GREENLEDGER</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                {activeItem.before.headline}
                            </h3>
                            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {activeItem.before.description}
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-rose-200/80 font-mono text-[10px] text-rose-800 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <span>HIGH REWORK COST & RISK</span>
                        </div>
                    </div>

                    {/* Middle: ENGINE TRANSFORMATION BEAM (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center py-5 lg:py-0 bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 text-center shadow-md">
                        <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
                            TRANSFORMATION
                        </div>
                        <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-400/30 mb-2">
                            <BeforeAfterIcon name="SparklesIcon" className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200">
                            GreenLedger Engine
                        </span>
                        <div className="mt-3 font-mono text-[9px] text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700/60 uppercase tracking-wider">
                            {activeItem.metricBadge}
                        </div>
                    </div>

                    {/* Right: AFTER STATE (5 cols) */}
                    <div className="lg:col-span-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-emerald-800 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                            AUTOMATED DISCLOSURE
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-emerald-900">
                                <BeforeAfterIcon name="CheckIcon" className="w-4 h-4 shrink-0 text-emerald-600" />
                                <span className="font-mono text-xs font-bold uppercase tracking-wider">AFTER GREENLEDGER</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                                {activeItem.after.headline}
                            </h3>
                            <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {activeItem.after.description}
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-emerald-200/80 font-mono text-[10px] text-emerald-950 font-bold uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                AUDIT-READY DISCLOSURE
                            </span>
                            {activeItem.benefit.quantifiableImpact && (
                                <span className="bg-emerald-900 text-amber-300 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                                    {activeItem.benefit.quantifiableImpact}
                                </span>
                            )}
                        </div>
                    </div>
                </m.div>
            </AnimatePresence>

            {/* Bottom Financial Return Banner */}
            <div className="mt-6 rounded-2xl border border-emerald-900 bg-emerald-950 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                        <BeforeAfterIcon name="BanknoteIcon" className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            DIRECT ECONOMIC BENEFIT
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                            {activeItem.benefit.headline}
                        </h4>
                        <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
                            {activeItem.benefit.description}
                        </p>
                    </div>
                </div>

                {activeItem.benefit.quantifiableImpact && (
                    <div className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full uppercase tracking-wider shrink-0 self-start md:self-center">
                        {activeItem.benefit.quantifiableImpact}
                    </div>
                )}
            </div>
        </div>
    );
}
