"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCOPE3_CATEGORIES, Scope3Category } from "@/lib/scope3/data";
import { cn } from "@/lib/utils/cn";

export function Scope3TrackedCategoriesTable() {
    const [filterTab, setFilterTab] = useState<"all" | "upstream" | "downstream" | "high_impact">("all");

    // Only active tracked categories
    const activeCategories = SCOPE3_CATEGORIES.filter((c) => c.isImplemented);

    // Sort by emissions contribution descending
    const sortedCategories = [...activeCategories].sort((a, b) => b.emissionsTco2e - a.emissionsTco2e);

    const filteredList = sortedCategories.filter((cat) => {
        if (filterTab === "upstream") return cat.type === "upstream";
        if (filterTab === "downstream") return cat.type === "downstream";
        if (filterTab === "high_impact") return cat.sharePercent >= 5.0;
        return true;
    });

    const getStatusBadge = (status: Scope3Category["status"]) => {
        switch (status) {
            case "Verified":
                return "bg-emerald-50 text-emerald-800 border-emerald-200";
            case "Audited":
                return "bg-blue-50 text-blue-800 border-blue-200";
            case "Estimated":
                return "bg-amber-50 text-amber-800 border-amber-200";
            default:
                return "bg-surface-container-high text-on-surface-variant border-outline-variant";
        }
    };

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="format_list_numbered" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Tracked Value Chain Categories & Contribution
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Ranked contribution across all 9 active Scope 3 protocol categories
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center rounded-lg bg-surface-container-high p-1 border border-outline-variant/40 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setFilterTab("all")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors",
                            filterTab === "all" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                        )}>
                        All Tracked ({activeCategories.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab("upstream")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors",
                            filterTab === "upstream" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                        )}>
                        Upstream (7)
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab("downstream")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors",
                            filterTab === "downstream" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                        )}>
                        Downstream (2)
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab("high_impact")}
                        className={cn(
                            "rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors",
                            filterTab === "high_impact" ? "bg-white text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                        )}>
                        High Impact (&gt;5%)
                    </button>
                </div>
            </div>

            {/* Contribution Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant">
                            <TableHead className="w-14 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Rank
                            </TableHead>
                            <TableHead className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Category & Protocol Code
                            </TableHead>
                            <TableHead className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Scope 3 Contribution
                            </TableHead>
                            <TableHead className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Methodology
                            </TableHead>
                            <TableHead className="text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Data Assurance
                            </TableHead>
                            <TableHead className="text-right font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Mapped Spend / Base
                            </TableHead>
                            <TableHead className="text-right font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredList.map((item, idx) => (
                            <TableRow key={item.id} className="hover:bg-surface-container-low/40 transition-colors border-b border-outline-variant/30">
                                {/* Rank */}
                                <TableCell className="text-center font-mono font-bold text-xs">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-container text-primary font-bold text-[11px]">
                                        #{idx + 1}
                                    </span>
                                </TableCell>

                                {/* Category details */}
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white font-bold"
                                            style={{ backgroundColor: item.color }}>
                                            <MaterialIcon name={item.icon} size="xs" className="!text-[15px]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                                                    {item.code}
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant">•</span>
                                                <span className="font-mono text-[9px] uppercase font-bold text-on-surface-variant">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/scope-3/${item.slug}`}
                                                className="font-sans font-bold text-primary text-xs hover:text-emerald-700 transition-colors">
                                                {item.name}
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Scope 3 Contribution (Progress Bar + tCO2e + %) */}
                                <TableCell className="min-w-[180px]">
                                    <div className="space-y-1">
                                        <div className="flex items-baseline justify-between font-mono text-xs">
                                            <span className="font-bold text-primary">
                                                {item.emissionsTco2e.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tCO2e
                                            </span>
                                            <span className="font-bold text-emerald-800 text-[11px]">
                                                {item.sharePercent.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, Math.max(1, item.sharePercent))}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Methodology */}
                                <TableCell>
                                    <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                                        {item.methodology}
                                    </span>
                                </TableCell>

                                {/* Data Assurance */}
                                <TableCell className="text-center">
                                    <span
                                        className={`inline-block font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                                            item.status,
                                        )}`}>
                                        {item.status}
                                    </span>
                                </TableCell>

                                {/* Mapped Spend */}
                                <TableCell className="text-right font-mono text-xs text-primary font-bold">
                                    ${(item.spendUsd / 1000000).toFixed(2)}M
                                </TableCell>

                                {/* Action link */}
                                <TableCell className="text-right">
                                    <Link
                                        href={`/scope-3/${item.slug}`}
                                        className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline">
                                        <span>Ledger</span>
                                        <MaterialIcon name="arrow_forward" size="xs" className="!text-[13px]" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
