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
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MaterialIcon name="leaderboard" size="sm" className="!text-[15px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Total GHG Emissions
                            </span>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">
                                    {totalVal}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                                    tCO2e
                                </span>
                            </div>
                        </div>
                    </div>

                    {totalCard?.changePct !== undefined && (
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                                isTotalDown
                                    ? "bg-secondary-container/30 text-on-secondary-container border-secondary-container/50"
                                    : "bg-error-container/30 text-on-error-container border-error-container/50"
                            }`}>
                            <MaterialIcon
                                name={isTotalDown ? "trending_down" : "trending_up"}
                                size="sm"
                                className="!text-[12px]"
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
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                            <MaterialIcon name="speed" size="sm" className="!text-[15px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Emissions Intensity
                            </span>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-sky-600">
                                    {intensityTonne}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                                    tCO2e/t product
                                </span>
                            </div>
                        </div>
                    </div>

                    {intensityRevenue && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-800 font-mono text-[10px] font-bold shrink-0">
                            <span className="text-on-surface-variant font-medium">Revenue Int:</span>
                            <span>{intensityRevenue} tCO2e/₹</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
