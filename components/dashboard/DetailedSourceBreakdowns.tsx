"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ParsedDetailedSourceBreakdowns } from "@/lib/dashboard/types";

type DetailedSourceBreakdownsProps = {
    data: ParsedDetailedSourceBreakdowns;
};

export function DetailedSourceBreakdowns({ data }: DetailedSourceBreakdownsProps) {
    const [viewMode, setViewMode] = useState<"sources" | "gases">("sources");

    const s1 = data.scope1;
    const s2 = data.scope2;
    const s3 = data.scope3;

    const formatTco2e = (val: number) =>
        val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="account_tree" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                            Emissions by Sub-Source & Gas Composition
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant">
                            Granular breakdown across Scope 1 direct, Scope 2 energy, Scope 3 categories, and CH₄ / N₂O gases
                        </p>
                    </div>
                </div>

                {/* Switcher */}
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                    <button
                        type="button"
                        onClick={() => setViewMode("sources")}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                            viewMode === "sources"
                                ? "bg-white text-primary shadow-2xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        Sub-Sources
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("gases")}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-medium transition-all select-none cursor-pointer ${
                            viewMode === "gases"
                                ? "bg-white text-primary shadow-2xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        Gas Segregation (CO₂ / CH₄ / N₂O)
                    </button>
                </div>
            </div>

            <div className="p-card-padding">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scope 1 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="factory" size="sm" className="text-orange-600 text-[18px]" />
                                    <h4 className="font-headline-sm text-sm font-bold text-primary">Scope 1 (Direct)</h4>
                                </div>
                                <span className="font-sans text-xs font-semibold text-orange-700 bg-white border border-orange-200 px-2 py-0.5 rounded-md tabular-nums">
                                    {formatTco2e(s1.total)} tCO₂e
                                </span>
                            </div>

                            {viewMode === "sources" ? (
                                <div className="space-y-2 font-sans text-xs mt-3">
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Stationary Combustion</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s1.stationaryCombustion)} t</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Mobile Combustion</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s1.mobileCombustion)} t</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Process Emissions</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s1.processEmissions)} t</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Fugitive Emissions</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s1.fugitiveEmissions)} t</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 font-sans text-xs mt-3">
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                                            <span className="font-medium text-on-surface text-xs">CO₂ (Carbon Dioxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s1.co2Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s1.co2Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                                            <span className="font-medium text-on-surface text-xs">CH₄ (Methane)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s1.ch4Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s1.ch4Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                                            <span className="font-medium text-on-surface text-xs">N₂O (Nitrous Oxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s1.n2oTco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s1.n2oKg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                                            <span className="font-medium text-on-surface text-xs">Biogenic CO₂</span>
                                        </div>
                                        <div className="text-right font-bold text-primary tabular-nums">
                                            {s1.biogenicCo2Kg.toLocaleString()} kg
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Gas Ratio Pill Strip */}
                        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
                            <span>Gas Segregation:</span>
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className="text-emerald-700 font-bold">CO₂: {s1.co2Tco2e.toFixed(2)}t</span>
                                <span className="text-blue-700 font-bold">CH₄: {s1.ch4Tco2e.toFixed(2)}t</span>
                                <span className="text-orange-700 font-bold">N₂O: {s1.n2oTco2e.toFixed(2)}t</span>
                            </div>
                        </div>
                    </div>

                    {/* Scope 2 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="bolt" size="sm" className="text-blue-600 text-[18px]" />
                                    <h4 className="font-headline-sm text-sm font-bold text-primary">Scope 2 (Energy)</h4>
                                </div>
                                <span className="font-sans text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md tabular-nums">
                                    {formatTco2e(s2.total)} tCO₂e
                                </span>
                            </div>

                            {viewMode === "sources" ? (
                                <div className="space-y-2 font-sans text-xs mt-3">
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Purchased Electricity</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s2.purchasedElectricity)} t</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Purchased Steam</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s2.purchasedSteam)} t</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <span className="font-medium text-on-surface text-xs">Heat & Cooling</span>
                                        <span className="font-bold text-primary tabular-nums">{formatTco2e(s2.purchasedHeatCooling)} t</span>
                                    </div>

                                    <div className="pt-2 border-t border-outline-variant/40 space-y-1 font-sans text-xs">
                                        <div className="flex justify-between text-on-surface-variant">
                                            <span>Location-Based:</span>
                                            <span className="font-bold text-primary tabular-nums">{formatTco2e(s2.locationBased)} t</span>
                                        </div>
                                        <div className="flex justify-between text-on-surface-variant">
                                            <span>Market-Based:</span>
                                            <span className="font-bold text-primary tabular-nums">{formatTco2e(s2.marketBased)} t</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 font-sans text-xs mt-3">
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                                            <span className="font-medium text-on-surface text-xs">CO₂ (Carbon Dioxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s2.co2Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s2.co2Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                                            <span className="font-medium text-on-surface text-xs">CH₄ (Methane)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s2.ch4Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s2.ch4Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                                            <span className="font-medium text-on-surface text-xs">N₂O (Nitrous Oxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s2.n2oTco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s2.n2oKg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Gas Ratio Pill Strip */}
                        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
                            <span>Gas Segregation:</span>
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className="text-emerald-700 font-bold">CO₂: {s2.co2Tco2e.toFixed(2)}t</span>
                                <span className="text-blue-700 font-bold">CH₄: {s2.ch4Tco2e.toFixed(2)}t</span>
                                <span className="text-orange-700 font-bold">N₂O: {s2.n2oTco2e.toFixed(2)}t</span>
                            </div>
                        </div>
                    </div>

                    {/* Scope 3 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="hub" size="sm" className="text-emerald-600 text-[18px]" />
                                    <h4 className="font-headline-sm text-sm font-bold text-primary">Scope 3 (Value Chain)</h4>
                                </div>
                                <span className="font-sans text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md tabular-nums">
                                    {formatTco2e(s3.total)} tCO₂e
                                </span>
                            </div>

                            {viewMode === "sources" ? (
                                <div className="space-y-2 font-sans text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar mt-3">
                                    {s3.categories && s3.categories.length > 0 ? (
                                        s3.categories.map((cat, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                                <div className="flex items-center gap-2 overflow-hidden pr-2">
                                                    <span className="font-sans text-[10px] font-bold uppercase shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                        {cat.categoryCode}
                                                    </span>
                                                    <span className="font-sans font-medium text-on-surface text-xs truncate" title={cat.categoryName}>
                                                        {cat.categoryName}
                                                    </span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="font-bold text-primary tabular-nums">{formatTco2e(cat.tco2e)} t</div>
                                                    <div className="text-[11px] text-on-surface-variant tabular-nums">{cat.sharePct.toFixed(1)}%</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-on-surface-variant text-xs italic">
                                            No Scope 3 category data recorded.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2 font-sans text-xs mt-3">
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                                            <span className="font-medium text-on-surface text-xs">CO₂ (Carbon Dioxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s3.co2Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s3.co2Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                                            <span className="font-medium text-on-surface text-xs">CH₄ (Methane)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s3.ch4Tco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s3.ch4Kg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                                            <span className="font-medium text-on-surface text-xs">N₂O (Nitrous Oxide)</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary tabular-nums">{formatTco2e(s3.n2oTco2e)} tCO₂e</div>
                                            <div className="text-[10px] text-on-surface-variant font-mono">{s3.n2oKg.toLocaleString()} kg</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Gas Ratio Pill Strip */}
                        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
                            <span>Gas Segregation:</span>
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className="text-emerald-700 font-bold">CO₂: {s3.co2Tco2e.toFixed(2)}t</span>
                                <span className="text-blue-700 font-bold">CH₄: {s3.ch4Tco2e.toFixed(2)}t</span>
                                <span className="text-orange-700 font-bold">N₂O: {s3.n2oTco2e.toFixed(2)}t</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

