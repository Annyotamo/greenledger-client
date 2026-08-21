"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";

type DetailedSourceBreakdownsProps = {
    data: {
        scope1: {
            stationaryCombustion: number;
            mobileCombustion: number;
            processEmissions: number;
            fugitiveEmissions: number;
            total: number;
        };
        scope2: {
            purchasedElectricity: number;
            purchasedSteam: number;
            purchasedHeatCooling: number;
            locationBased: number;
            marketBased: number;
            total: number;
        };
        scope3: {
            categories: { categoryCode: string; categoryName: string; tco2e: number; sharePct: number }[];
            total: number;
        };
    };
};

export function DetailedSourceBreakdowns({ data }: DetailedSourceBreakdownsProps) {
    const s1 = data.scope1;
    const s2 = data.scope2;
    const s3 = data.scope3;

    const formatTco2e = (val: number) =>
        val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="account_tree" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Emissions by Sub-Source & Protocol Categories
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Granular breakdown across Scope 1 direct, Scope 2 energy, and Scope 3 categories
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-card-padding">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scope 1 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="factory" size="sm" className="text-orange-600 text-[18px]" />
                                <h4 className="font-headline-sm text-[15px] font-bold text-primary">Scope 1 (Direct)</h4>
                            </div>
                            <span className="font-mono text-[11px] font-bold text-orange-700 bg-white border border-orange-200 px-2 py-0.5 rounded">
                                {formatTco2e(s1.total)} t
                            </span>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Stationary Combustion</span>
                                <span className="font-bold text-primary">{formatTco2e(s1.stationaryCombustion)} t</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Mobile Combustion</span>
                                <span className="font-bold text-primary">{formatTco2e(s1.mobileCombustion)} t</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Process Emissions</span>
                                <span className="font-bold text-primary">{formatTco2e(s1.processEmissions)} t</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Fugitive Emissions</span>
                                <span className="font-bold text-primary">{formatTco2e(s1.fugitiveEmissions)} t</span>
                            </div>
                        </div>
                    </div>

                    {/* Scope 2 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="bolt" size="sm" className="text-blue-600 text-[18px]" />
                                <h4 className="font-headline-sm text-[15px] font-bold text-primary">Scope 2 (Energy)</h4>
                            </div>
                            <span className="font-mono text-[11px] font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded">
                                {formatTco2e(s2.total)} t
                            </span>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Purchased Electricity</span>
                                <span className="font-bold text-primary">{formatTco2e(s2.purchasedElectricity)} t</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Purchased Steam</span>
                                <span className="font-bold text-primary">{formatTco2e(s2.purchasedSteam)} t</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                <span className="font-sans font-semibold text-on-surface text-[12px]">Heat & Cooling</span>
                                <span className="font-bold text-primary">{formatTco2e(s2.purchasedHeatCooling)} t</span>
                            </div>

                            <div className="pt-2 border-t border-outline-variant/40 space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Location-Based:</span>
                                    <span className="font-bold text-primary">{formatTco2e(s2.locationBased)} t</span>
                                </div>
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Market-Based:</span>
                                    <span className="font-bold text-primary">{formatTco2e(s2.marketBased)} t</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scope 3 Detailed Card */}
                    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low/30 p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="hub" size="sm" className="text-emerald-600 text-[18px]" />
                                <h4 className="font-headline-sm text-[15px] font-bold text-primary">Scope 3 (Value Chain)</h4>
                            </div>
                            <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded">
                                {formatTco2e(s3.total)} t
                            </span>
                        </div>

                        <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                            {s3.categories && s3.categories.length > 0 ? (
                                s3.categories.map((cat, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded border border-outline-variant/40 shadow-2xs">
                                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                                            <span className="font-mono text-[10px] font-bold uppercase shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                {cat.categoryCode}
                                            </span>
                                            <span className="font-sans font-semibold text-on-surface text-[11px] truncate" title={cat.categoryName}>
                                                {cat.categoryName}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-primary">{formatTco2e(cat.tco2e)} t</div>
                                            <div className="text-[10px] text-on-surface-variant">{cat.sharePct.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-on-surface-variant text-[11px] font-mono italic">
                                    No Scope 3 category data recorded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
