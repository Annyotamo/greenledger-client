"use client";

import React from "react";
import { m } from "framer-motion";
import type { BeforeAfterItem } from "./beforeAfterData";
import { BeforeAfterIcon } from "./BeforeAfterIcons";

interface BeforeAfterCardProps {
    item: BeforeAfterItem;
    index: number;
}

export default function BeforeAfterCard({ item, index }: BeforeAfterCardProps) {
    return (
        <m.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl"
        >
            {/* Top Header Strip */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3.5 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <BeforeAfterIcon name={item.iconName} className="h-4 w-4" />
                    </div>
                    <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-tight text-white">
                        {item.title}
                    </h3>
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
                    {item.metricBadge}
                </div>
            </div>

            {/* Main Comparative Content: Before vs After Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
                {/* BEFORE PANEL (Legacy / Problem state) */}
                <div className="relative p-5 bg-rose-50/40 group-hover:bg-rose-50/60 transition-colors duration-200">
                    <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="font-mono text-[10px] font-bold tracking-wider text-rose-800 uppercase bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200/60">
                            BEFORE GREENLEDGER
                        </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {item.before.headline}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {item.before.description}
                    </p>
                </div>

                {/* AFTER PANEL (GreenLedger / Solution state) */}
                <div className="relative p-5 bg-emerald-50/40 group-hover:bg-emerald-50/60 transition-colors duration-200">
                    <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                        <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-900 uppercase bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            AFTER GREENLEDGER
                        </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug flex items-center gap-1.5">
                        <span>{item.after.headline}</span>
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                        {item.after.description}
                    </p>
                </div>
            </div>

            {/* Economic Benefit Ribbon Footer */}
            <div className="border-t border-emerald-900 bg-emerald-950 px-5 py-3.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                    <div className="mt-0.5 sm:mt-0 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <BeforeAfterIcon name="BanknoteIcon" className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 block">
                            ECONOMIC BENEFIT
                        </span>
                        <span className="text-xs font-bold text-emerald-50 leading-snug block">
                            {item.benefit.headline}
                        </span>
                    </div>
                </div>

                {item.benefit.quantifiableImpact && (
                    <div className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full self-start sm:self-auto">
                        {item.benefit.quantifiableImpact}
                    </div>
                )}
            </div>
        </m.article>
    );
}
