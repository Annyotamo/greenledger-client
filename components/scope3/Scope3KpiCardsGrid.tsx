"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import { SCOPE3_SUMMARY } from "@/lib/scope3/data";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function Scope3KpiCardsGrid() {
    return (
        <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show">
            {/* Card 1: Upstream Supply Chain */}
            <motion.div variants={cardVariants}>
                <Card className="p-4 border-outline-variant/60 hover:border-emerald-500/50 transition-colors shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                                <MaterialIcon name="arrow_circle_up" size="sm" className="!text-[16px]" />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-primary uppercase tracking-tight">
                                Upstream Supply Chain
                            </span>
                        </div>
                        <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-800">
                            {SCOPE3_SUMMARY.upstreamSharePercent}% Share
                        </span>
                    </div>

                    <div className="mt-3 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                                {SCOPE3_SUMMARY.upstreamEmissionsTco2e.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="font-mono text-xs font-semibold text-on-surface-variant">tCO2e</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-1 border-t border-outline-variant/30">
                            <span>7 Categories Active (Cat 1–7)</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Card 2: Downstream Logistics & Finance */}
            <motion.div variants={cardVariants}>
                <Card className="p-4 border-outline-variant/60 hover:border-blue-500/50 transition-colors shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                                <MaterialIcon name="arrow_circle_down" size="sm" className="!text-[16px]" />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-primary uppercase tracking-tight">
                                Downstream Logistics & Finance
                            </span>
                        </div>
                        <span className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-800">
                            {SCOPE3_SUMMARY.downstreamSharePercent}% Share
                        </span>
                    </div>

                    <div className="mt-3 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                                {SCOPE3_SUMMARY.downstreamEmissionsTco2e.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="font-mono text-xs font-semibold text-on-surface-variant">tCO2e</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-1 border-t border-outline-variant/30">
                            <span>2 Categories Active (Cat 9, 15)</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Card 3: Dominant Value Chain Driver */}
            <motion.div variants={cardVariants}>
                <Card className="p-4 border-outline-variant/60 hover:border-amber-500/50 transition-colors shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
                                <MaterialIcon name="shopping_cart" size="sm" className="!text-[16px]" />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-primary uppercase tracking-tight">
                                Dominant Category
                            </span>
                        </div>
                        <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                            Cat 1 Driver
                        </span>
                    </div>

                    <div className="mt-3 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                                18,420.5
                            </span>
                            <span className="font-mono text-xs font-semibold text-on-surface-variant">tCO2e</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-1 border-t border-outline-variant/30">
                            <span>Purchased Goods & Services</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Card 4: Supplier Verification & Tiers */}
            <motion.div variants={cardVariants}>
                <Card className="p-4 border-outline-variant/60 hover:border-teal-500/50 transition-colors shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/10 text-teal-600">
                                <MaterialIcon name="verified_user" size="sm" className="!text-[16px]" />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-primary uppercase tracking-tight">
                                Supplier Engagement Tier
                            </span>
                        </div>
                        <span className="rounded bg-teal-50 border border-teal-200 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal-800">
                            Tier 1 Verified
                        </span>
                    </div>

                    <div className="mt-3 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                                84.6%
                            </span>
                            <span className="font-mono text-xs font-semibold text-on-surface-variant">Tier-1 Primary</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-1 border-t border-outline-variant/30">
                            <span>128 Active Supplier Returns</span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
