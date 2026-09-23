"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { formatInrSpend, SCOPE3_SUMMARY } from "@/lib/scope3/data";

export function Scope3TopHeroBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-xl border border-outline-variant/50 bg-gradient-to-r from-surface-container-lowest via-surface-container-low/50 to-surface-container-lowest py-3.5 px-5 shadow-2xs">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
                {/* Hero 1: Total Scope 3 Value Chain Footprint (5 cols) */}
                <div className="lg:col-span-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700">
                            <MaterialIcon name="hub" size="sm" className="!text-[18px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Scope 3 Total Emissions Footprint
                            </span>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">
                                    {SCOPE3_SUMMARY.totalEmissionsTco2e.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                                    tCO2e
                                </span>
                            </div>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border bg-error-container/30 text-on-error-container border-error-container/50 shrink-0">
                        <MaterialIcon name="trending_up" size="sm" className="!text-[12px]" />
                        +{SCOPE3_SUMMARY.yoyChangePercent}% YoY
                    </span>
                </div>

                {/* Vertical Divider for desktop */}
                <div className="hidden lg:block lg:col-span-1 flex justify-center">
                    <div className="h-9 w-px bg-outline-variant/40 mx-auto" />
                </div>

                {/* Hero 2: Carbon Intensity & Verified Spend (6 cols) */}
                <div className="lg:col-span-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                            <MaterialIcon name="speed" size="sm" className="!text-[18px]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Supply Chain Carbon Intensity
                            </span>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-sky-700">
                                    {SCOPE3_SUMMARY.carbonIntensityPerSpend.toFixed(3)}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                                    kgCO2e / ₹ spend
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high border border-outline-variant/50 text-primary font-mono text-[10px] font-bold">
                            <MaterialIcon name="payments" size="xs" className="text-on-surface-variant" />
                            <span>{formatInrSpend(SCOPE3_SUMMARY.verifiedSpendInr)} Mapped Spend</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">
                            <MaterialIcon name="verified" size="xs" className="text-emerald-600" />
                            <span>{SCOPE3_SUMMARY.overallCoveragePercent}% Coverage</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
