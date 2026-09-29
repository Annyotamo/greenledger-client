"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import type { CBAMInstallationProfile, CBAMSourceStreamsSummary } from "@/lib/cbam/types";

interface CBAMKpiCardsProps {
    summary: CBAMSourceStreamsSummary | null;
    installation: CBAMInstallationProfile | null;
}

export function CBAMKpiCards({ summary, installation }: CBAMKpiCardsProps) {
    const totalEmissions = summary?.total_direct_co2_emissions ?? 0;
    const fossilEmissions = summary?.total_fossil_co2_emissions ?? 0;
    const bioEmissions = summary?.total_biomass_co2_emissions ?? 0;
    const totalEnergy = (summary?.total_fossil_energy_tj ?? 0) + (summary?.total_bio_energy_tj ?? 0);
    const streamCount = summary?.stream_count ?? 0;
    const combustionCount = summary?.combustion_stream_count ?? 0;
    const massBalanceCount = summary?.mass_balance_stream_count ?? 0;

    const goodsCount = installation?.goods?.length ?? 0;
    const processesCount = installation?.processes?.length ?? 0;

    const slotPercentage = Math.min(Math.round((streamCount / 75) * 100), 100);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Direct CO2 Emissions */}
            <Card className="p-4 border-outline-variant/60 shadow-2xs hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                            <MaterialIcon name="cloud" size="sm" className="!text-[16px]" />
                        </div>
                        <span className="font-sans text-[11px] font-semibold text-primary uppercase tracking-tight">
                            Total Direct Emissions
                        </span>
                    </div>
                    <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-sans text-[10px] font-bold text-emerald-800">
                        Sheet B
                    </span>
                </div>

                <div className="mt-3 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
                            {totalEmissions.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                        </span>
                        <span className="font-sans text-xs font-semibold text-on-surface-variant">t CO₂</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant pt-1 border-t border-outline-variant/30">
                        <span className="tabular-nums">Fossil: {fossilEmissions.toLocaleString("en-US", { maximumFractionDigits: 1 })} t</span>
                        <span className="tabular-nums text-emerald-700">Bio: {bioEmissions.toLocaleString("en-US", { maximumFractionDigits: 1 })} t</span>
                    </div>
                </div>
            </Card>

            {/* Card 2: Total Energy Content */}
            <Card className="p-4 border-outline-variant/60 shadow-2xs hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                            <MaterialIcon name="bolt" size="sm" className="!text-[16px]" />
                        </div>
                        <span className="font-sans text-[11px] font-semibold text-primary uppercase tracking-tight">
                            Energy Content
                        </span>
                    </div>
                    <span className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 font-sans text-[10px] font-bold text-blue-800">
                        Net NCV
                    </span>
                </div>

                <div className="mt-3 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
                            {totalEnergy.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                        </span>
                        <span className="font-sans text-xs font-semibold text-on-surface-variant">TJ</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant pt-1 border-t border-outline-variant/30">
                        <span className="tabular-nums">Fossil: {(summary?.total_fossil_energy_tj ?? 0).toLocaleString("en-US", { maximumFractionDigits: 1 })} TJ</span>
                        <span className="tabular-nums text-emerald-700">Bio: {(summary?.total_bio_energy_tj ?? 0).toLocaleString("en-US", { maximumFractionDigits: 1 })} TJ</span>
                    </div>
                </div>
            </Card>

            {/* Card 3: Source Stream Slots */}
            <Card className="p-4 border-outline-variant/60 shadow-2xs hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
                            <MaterialIcon name="tune" size="sm" className="!text-[16px]" />
                        </div>
                        <span className="font-sans text-[11px] font-semibold text-primary uppercase tracking-tight">
                            Source Streams
                        </span>
                    </div>
                    <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 font-sans text-[10px] font-bold text-amber-800 tabular-nums">
                        {streamCount} / 75 Slots
                    </span>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
                            {streamCount}
                        </span>
                        <span className="font-sans text-xs font-medium text-on-surface-variant">Active Streams</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(slotPercentage, 4)}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant pt-0.5">
                        <span>Combustion: {combustionCount}</span>
                        <span>Mass Balance: {massBalanceCount}</span>
                    </div>
                </div>
            </Card>

            {/* Card 4: Installation Profile & Goods */}
            <Card className="p-4 border-outline-variant/60 shadow-2xs hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600">
                            <MaterialIcon name="domain" size="sm" className="!text-[16px]" />
                        </div>
                        <span className="font-sans text-[11px] font-semibold text-primary uppercase tracking-tight">
                            Installation Scope
                        </span>
                    </div>
                    <span className="rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 font-sans text-[10px] font-bold text-indigo-800">
                        Sheet A
                    </span>
                </div>

                <div className="mt-3 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
                            {goodsCount}
                        </span>
                        <span className="font-sans text-xs font-medium text-on-surface-variant">Produced Goods (G1..G10)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant pt-1 border-t border-outline-variant/30">
                        <span>Processes: {processesCount} (P1..P10)</span>
                        <span className="text-emerald-700 font-semibold">{installation ? "Profile Configured" : "Needs Setup"}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
