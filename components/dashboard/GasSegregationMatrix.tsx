"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ParsedScopeGasSegregation, ParsedGasBreakdownItem } from "@/lib/dashboard/types";

type GasSegregationMatrixProps = {
    data: ParsedScopeGasSegregation;
    gasBreakdown?: ParsedGasBreakdownItem[];
};

type UnitMode = "tco2e" | "tonnes" | "kg";

export function GasSegregationMatrix({ data, gasBreakdown }: GasSegregationMatrixProps) {
    const [unitMode, setUnitMode] = useState<UnitMode>("tco2e");

    const overall = data.overall || data.total;
    const s1 = data.scope1;
    const s2 = data.scope2;
    const s3 = data.scope3;

    // Helper to format values according to unit mode
    const formatValue = (kg: number, t: number, tco2e: number) => {
        if (unitMode === "kg") {
            return `${kg.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
        }
        if (unitMode === "tonnes") {
            return `${t.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} t`;
        }
        return `${tco2e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e`;
    };

    const getRawVal = (kg: number, t: number, tco2e: number) => {
        if (unitMode === "kg") return kg;
        if (unitMode === "tonnes") return t;
        return tco2e;
    };

    const rows = [
        {
            key: "co2",
            name: "Carbon Dioxide",
            formula: "CO₂",
            badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
            dotColor: "bg-[#10b981]",
            gwp: "1.0",
            s1: { kg: s1.co2Kg, t: s1.co2T, tco2e: s1.co2Tco2e },
            s2: { kg: s2.co2Kg, t: s2.co2T, tco2e: s2.co2Tco2e },
            s3: { kg: s3.co2Kg, t: s3.co2T, tco2e: s3.co2Tco2e },
            total: { kg: overall.co2Kg, t: overall.co2T, tco2e: overall.co2Tco2e },
            sharePct: overall.totalTco2e > 0 ? (overall.co2Tco2e / overall.totalTco2e) * 100 : 0,
        },
        {
            key: "ch4",
            name: "Methane",
            formula: "CH₄",
            badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
            dotColor: "bg-[#60a5fa]",
            gwp: "~28.0 (AR5)",
            s1: { kg: s1.ch4Kg, t: s1.ch4T, tco2e: s1.ch4Tco2e },
            s2: { kg: s2.ch4Kg, t: s2.ch4T, tco2e: s2.ch4Tco2e },
            s3: { kg: s3.ch4Kg, t: s3.ch4T, tco2e: s3.ch4Tco2e },
            total: { kg: overall.ch4Kg, t: overall.ch4T, tco2e: overall.ch4Tco2e },
            sharePct: overall.totalTco2e > 0 ? (overall.ch4Tco2e / overall.totalTco2e) * 100 : 0,
        },
        {
            key: "n2o",
            name: "Nitrous Oxide",
            formula: "N₂O",
            badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
            dotColor: "bg-[#f97316]",
            gwp: "~265.0 (AR5)",
            s1: { kg: s1.n2oKg, t: s1.n2oT, tco2e: s1.n2oTco2e },
            s2: { kg: s2.n2oKg, t: s2.n2oT, tco2e: s2.n2oTco2e },
            s3: { kg: s3.n2oKg, t: s3.n2oT, tco2e: s3.n2oTco2e },
            total: { kg: overall.n2oKg, t: overall.n2oT, tco2e: overall.n2oTco2e },
            sharePct: overall.totalTco2e > 0 ? (overall.n2oTco2e / overall.totalTco2e) * 100 : 0,
        },
        {
            key: "bio",
            name: "Biogenic CO₂",
            formula: "Bio-CO₂",
            badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
            dotColor: "bg-[#a855f7]",
            gwp: "Reported Outside Scopes",
            s1: { kg: s1.biogenicCo2Kg, t: s1.biogenicCo2T, tco2e: 0 },
            s2: { kg: s2.biogenicCo2Kg, t: s2.biogenicCo2T, tco2e: 0 },
            s3: { kg: s3.biogenicCo2Kg, t: s3.biogenicCo2T, tco2e: 0 },
            total: { kg: overall.biogenicCo2Kg, t: overall.biogenicCo2T, tco2e: 0 },
            sharePct: 0,
        },
    ];

    const totalTco2eAll = overall.totalTco2e;

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="science" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                                GHG Gas Segregation Matrix
                            </h3>
                            <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary-container/60 uppercase">
                                CH₄ & N₂O Segregation
                            </span>
                        </div>
                        <p className="font-sans text-xs text-on-surface-variant">
                            Granular mass and GWP-equivalent breakdown across all protocol scopes
                        </p>
                    </div>
                </div>

                {/* Unit Mode Selector */}
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                    <button
                        type="button"
                        onClick={() => setUnitMode("tco2e")}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-medium transition-all cursor-pointer ${
                            unitMode === "tco2e"
                                ? "bg-white text-primary shadow-2xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        tCO₂e (GWP)
                    </button>
                    <button
                        type="button"
                        onClick={() => setUnitMode("tonnes")}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-medium transition-all cursor-pointer ${
                            unitMode === "tonnes"
                                ? "bg-white text-primary shadow-2xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        Mass (Tonnes)
                    </button>
                    <button
                        type="button"
                        onClick={() => setUnitMode("kg")}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-medium transition-all cursor-pointer ${
                            unitMode === "kg"
                                ? "bg-white text-primary shadow-2xs font-semibold"
                                : "text-on-surface-variant hover:text-on-surface"
                        }`}>
                        Mass (kg)
                    </button>
                </div>
            </div>

            {/* Top Quick Gas Metrics Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-container-low/40 border-b border-outline-variant/50">
                <div className="bg-white p-3 rounded-lg border border-outline-variant/40 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                            <span className="font-sans text-xs font-semibold text-primary">Carbon Dioxide (CO₂)</span>
                        </div>
                        <span className="font-sans text-[10px] text-on-surface-variant font-semibold">
                            {rows[0].sharePct.toFixed(1)}%
                        </span>
                    </div>
                    <div className="font-sans text-sm font-bold text-primary tabular-nums">
                        {formatValue(overall.co2Kg, overall.co2T, overall.co2Tco2e)}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-outline-variant/40 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                            <span className="font-sans text-xs font-semibold text-primary">Methane (CH₄)</span>
                        </div>
                        <span className="font-sans text-[10px] text-on-surface-variant font-semibold">
                            {rows[1].sharePct.toFixed(1)}%
                        </span>
                    </div>
                    <div className="font-sans text-sm font-bold text-primary tabular-nums">
                        {formatValue(overall.ch4Kg, overall.ch4T, overall.ch4Tco2e)}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-outline-variant/40 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                            <span className="font-sans text-xs font-semibold text-primary">Nitrous Oxide (N₂O)</span>
                        </div>
                        <span className="font-sans text-[10px] text-on-surface-variant font-semibold">
                            {rows[2].sharePct.toFixed(1)}%
                        </span>
                    </div>
                    <div className="font-sans text-sm font-bold text-primary tabular-nums">
                        {formatValue(overall.n2oKg, overall.n2oT, overall.n2oTco2e)}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-outline-variant/40 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                            <span className="font-sans text-xs font-semibold text-primary">Biogenic CO₂</span>
                        </div>
                        <span className="font-sans text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-semibold">
                            Bio
                        </span>
                    </div>
                    <div className="font-sans text-sm font-bold text-primary tabular-nums">
                        {unitMode === "kg"
                            ? `${overall.biogenicCo2Kg.toFixed(1)} kg`
                            : `${overall.biogenicCo2T.toFixed(3)} t`}
                    </div>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] uppercase tracking-wider text-on-surface-variant">
                            <th className="py-3 px-4 font-semibold">Greenhouse Gas</th>
                            <th className="py-3 px-4 font-semibold">GWP Factor</th>
                            <th className="py-3 px-4 font-semibold text-right text-orange-700 bg-orange-50/40">Scope 1 (Direct)</th>
                            <th className="py-3 px-4 font-semibold text-right text-blue-700 bg-blue-50/40">Scope 2 (Indirect)</th>
                            <th className="py-3 px-4 font-semibold text-right text-emerald-700 bg-emerald-50/40">Scope 3 (Value Chain)</th>
                            <th className="py-3 px-4 font-semibold text-right font-bold text-primary">Overall Total</th>
                            <th className="py-3 px-4 font-semibold text-right">Share (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                        {rows.map((row) => (
                            <tr key={row.key} className="hover:bg-surface-container-low/40 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${row.dotColor}`} />
                                        <span className="font-bold text-primary text-sm">{row.name}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${row.badgeColor}`}>
                                            {row.formula}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant">
                                    {row.gwp}
                                </td>
                                <td className="py-3 px-4 text-right tabular-nums font-medium text-on-surface bg-orange-50/20">
                                    {formatValue(row.s1.kg, row.s1.t, row.s1.tco2e)}
                                </td>
                                <td className="py-3 px-4 text-right tabular-nums font-medium text-on-surface bg-blue-50/20">
                                    {formatValue(row.s2.kg, row.s2.t, row.s2.tco2e)}
                                </td>
                                <td className="py-3 px-4 text-right tabular-nums font-medium text-on-surface bg-emerald-50/20">
                                    {formatValue(row.s3.kg, row.s3.t, row.s3.tco2e)}
                                </td>
                                <td className="py-3 px-4 text-right tabular-nums font-bold text-primary">
                                    {formatValue(row.total.kg, row.total.t, row.total.tco2e)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-12 bg-surface-container h-1.5 rounded-full overflow-hidden hidden sm:block">
                                            <div
                                                className={`h-full rounded-full ${row.dotColor}`}
                                                style={{ width: `${Math.min(100, Math.max(0, row.sharePct))}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-primary tabular-nums">{row.sharePct.toFixed(1)}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="bg-surface-container-low/70 border-t-2 border-outline-variant font-semibold">
                            <td className="py-3.5 px-4 font-bold text-primary text-sm flex items-center gap-2">
                                <MaterialIcon name="summarize" size="sm" className="text-primary text-[18px]" />
                                <span>Total Equivalent Emissions</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-on-surface-variant">
                                Combined CO₂e
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-orange-950 bg-orange-100/40">
                                {unitMode === "kg"
                                    ? `${(s1.co2Kg + s1.ch4Kg + s1.n2oKg).toLocaleString("en-US", { minimumFractionDigits: 1 })} kg`
                                    : unitMode === "tonnes"
                                    ? `${(s1.co2T + s1.ch4T + s1.n2oT).toFixed(3)} t`
                                    : `${s1.totalTco2e.toFixed(2)} tCO2e`}
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-blue-950 bg-blue-100/40">
                                {unitMode === "kg"
                                    ? `${(s2.co2Kg + s2.ch4Kg + s2.n2oKg).toLocaleString("en-US", { minimumFractionDigits: 1 })} kg`
                                    : unitMode === "tonnes"
                                    ? `${(s2.co2T + s2.ch4T + s2.n2oT).toFixed(3)} t`
                                    : `${s2.totalTco2e.toFixed(2)} tCO2e`}
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-emerald-950 bg-emerald-100/40">
                                {unitMode === "kg"
                                    ? `${(s3.co2Kg + s3.ch4Kg + s3.n2oKg).toLocaleString("en-US", { minimumFractionDigits: 1 })} kg`
                                    : unitMode === "tonnes"
                                    ? `${(s3.co2T + s3.ch4T + s3.n2oT).toFixed(3)} t`
                                    : `${s3.totalTco2e.toFixed(2)} tCO2e`}
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-base text-primary">
                                {unitMode === "kg"
                                    ? `${(overall.co2Kg + overall.ch4Kg + overall.n2oKg).toLocaleString("en-US", { minimumFractionDigits: 1 })} kg`
                                    : unitMode === "tonnes"
                                    ? `${(overall.co2T + overall.ch4T + overall.n2oT).toFixed(3)} t`
                                    : `${overall.totalTco2e.toFixed(2)} tCO2e`}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-primary">
                                100.0%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
