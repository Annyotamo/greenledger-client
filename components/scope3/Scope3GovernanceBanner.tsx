"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function Scope3GovernanceBanner() {
    return (
        <div className="rounded-xl border border-outline-variant/60 bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-5 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="verified_user" size="sm" className="text-emerald-700 !text-[18px]" />
                        <h4 className="font-headline-sm text-[14px] font-bold text-primary">
                            SEBI BRSR Core & GHG Protocol Scope 3 Compliance
                        </h4>
                    </div>
                    <p className="font-mono text-[11px] text-on-surface-variant max-w-2xl">
                        Calculations adhere to SEBI BRSR Core Value Chain Disclosures & GHG Protocol Corporate Value Chain Standard with Central Electricity Authority (CEA) Grid Factors and verified supplier data.
                    </p>
                </div>

                {/* Data Quality Tier distribution */}
                <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant/50 pt-3 lg:pt-0 lg:pl-6">
                    <div className="space-y-0.5">
                        <span className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Tier 1 Primary Supplier Data
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-emerald-800">42.5%</span>
                            <span className="font-mono text-[10px] text-on-surface-variant">Verified</span>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <span className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Tier 2 Hybrid Activity Data
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-blue-800">38.2%</span>
                            <span className="font-mono text-[10px] text-on-surface-variant">Audited</span>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <span className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Tier 3 Spend-Based Benchmarks
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-amber-800">19.3%</span>
                            <span className="font-mono text-[10px] text-on-surface-variant">Estimated</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
