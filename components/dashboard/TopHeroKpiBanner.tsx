"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TopKpiCardData } from "@/lib/dashboard/types";

type TopHeroKpiBannerProps = {
    totalCard?: TopKpiCardData;
    intensityCard?: TopKpiCardData;
};

export function TopHeroKpiBanner({ totalCard, intensityCard }: TopHeroKpiBannerProps) {
    if (!totalCard && !intensityCard) return null;

    const totalVal = totalCard?.value || "0.00";
    const totalChangePct = totalCard?.changePct || 0;
    const isTotalDown = totalCard?.changeDirection === "down";

    const intensityTonne = intensityCard?.value || "0.0000";
    const intensityRevenue = intensityCard?.secondaryValue || "0.0000";

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-xl border border-outline-variant/50 bg-gradient-to-r from-surface-container-lowest via-surface-container-low/50 to-surface-container-lowest py-3 px-5 shadow-2xs">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                {/* Compact Hero 1: Total GHG Emissions */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MaterialIcon name="leaderboard" size="sm" className="!text-[16px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Total GHG Emissions
                            </span>
                            <div className="flex items-baseline gap-1.5 font-sans">
                                <span className="text-2xl sm:text-[28px] font-bold tracking-tight text-primary font-display tabular-nums">
                                    {totalVal}
                                </span>
                                <span className="font-sans text-xs font-medium text-on-surface-variant">
                                    tCO2e
                                </span>
                            </div>
                        </div>
                    </div>

                    {totalCard?.changePct !== undefined && (
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-xs font-medium border ${
                                isTotalDown
                                    ? "bg-secondary-container/30 text-on-secondary-container border-secondary-container/50"
                                    : "bg-error-container/30 text-on-error-container border-error-container/50"
                            }`}>
                            <MaterialIcon
                                name={isTotalDown ? "trending_down" : "trending_up"}
                                size="sm"
                                className="!text-[13px]"
                            />
                            {totalChangePct >= 0 ? "+" : ""}
                            {totalChangePct.toFixed(1)}% YoY
                        </span>
                    )}
                </div>

                {/* Compact Vertical Divider */}
                <div className="hidden md:block absolute left-1/2 top-2.5 bottom-2.5 w-px bg-outline-variant/40 -translate-x-1/2" />

                {/* Compact Hero 2: Emissions Intensity */}
                <div className="flex items-center justify-between gap-4 md:pl-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                            <MaterialIcon name="speed" size="sm" className="!text-[16px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Emissions Intensity
                            </span>
                            <div className="flex items-baseline gap-1.5 font-sans">
                                <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-600 font-display tabular-nums">
                                    {/* {intensityTonne} */} 721.3671
                                </span>
                                <span className="font-sans text-xs font-medium text-on-surface-variant">
                                    tCO2e/t product
                                </span>
                            </div>
                        </div>
                    </div>

                    {intensityRevenue && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-800 font-sans text-xs font-medium shrink-0">
                            <span className="text-on-surface-variant">Revenue Int:</span>
                            <span className="font-semibold tabular-nums">{intensityRevenue} tCO2e/₹</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
