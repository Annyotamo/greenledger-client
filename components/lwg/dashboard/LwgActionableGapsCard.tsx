// components/lwg/dashboard/LwgActionableGapsCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { LwgGapItem } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgActionableGapsCardProps {
    gapList: LwgGapItem[];
}

const ITEMS_PER_PAGE = 5;

export function LwgActionableGapsCard({ gapList }: LwgActionableGapsCardProps) {
    const [selectedFilter, setSelectedFilter] = useState<"all" | "critical" | "sec5" | "sec10" | "sec11">("all");
    const [currentPage, setCurrentPage] = useState(1);

    const criticalGaps = gapList.filter((g) => g.severity === "red");
    const warningGaps = gapList.filter((g) => g.severity === "amber");
    const sec5Count = gapList.filter((g) => g.sectionNumber === 5).length;
    const sec10Count = gapList.filter((g) => g.sectionNumber === 10).length;
    const sec11Count = gapList.filter((g) => g.sectionNumber === 11).length;

    const handleFilterChange = (filter: "all" | "critical" | "sec5" | "sec10" | "sec11") => {
        setSelectedFilter(filter);
        setCurrentPage(1);
    };

    const filteredGaps = gapList.filter((g) => {
        if (selectedFilter === "critical") return g.severity === "red";
        if (selectedFilter === "sec5") return g.sectionNumber === 5;
        if (selectedFilter === "sec10") return g.sectionNumber === 10;
        if (selectedFilter === "sec11") return g.sectionNumber === 11;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredGaps.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredGaps.length);
    const paginatedGaps = filteredGaps.slice(startIndex, endIndex);

    // Normalizes backend "/tenant/lwg/..." URL to client App Router route "/lwg/..."
    const normalizeUrl = (url: string) => {
        if (url.startsWith("/tenant/lwg")) {
            return url.replace("/tenant/lwg", "/lwg");
        }
        return url;
    };

    return (
        <Card className="h-full flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
                <CardHeader bordered tone="strip">
                    <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg border shrink-0",
                                    gapList.length > 0
                                        ? "bg-amber-50 text-amber-800 border-amber-200/80"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200/60",
                                )}>
                                <MaterialIcon
                                    name={gapList.length > 0 ? "warning" : "verified"}
                                    size="xs"
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary truncate">
                                    Actionable Audit Gaps
                                </h3>
                                <p className="font-sans text-[11px] text-on-surface-variant truncate">
                                    Protocol deficiencies across 24-month audit window
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            {criticalGaps.length > 0 && (
                                <Badge variant="negative" size="sm" className="font-medium">
                                    {criticalGaps.length} Critical
                                </Badge>
                            )}
                            {warningGaps.length > 0 && (
                                <span className="inline-flex items-center rounded-full border border-amber-300/80 bg-amber-50 px-2 py-0.5 font-sans text-[11px] font-medium text-amber-800">
                                    {warningGaps.length} Warning
                                </span>
                            )}
                            {gapList.length === 0 && (
                                <Badge variant="positive" size="sm" className="font-medium">
                                    0 Gaps Detected
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {/* Quick Filter Strip */}
                {gapList.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-outline-variant/50 bg-surface-container-low/50 overflow-x-auto gl-dashboard-scroll shrink-0">
                        <button
                            type="button"
                            onClick={() => handleFilterChange("all")}
                            className={cn(
                                "px-2.5 py-1 rounded-md text-xs font-sans transition-all whitespace-nowrap cursor-pointer",
                                selectedFilter === "all"
                                    ? "bg-surface-container-lowest text-primary font-semibold shadow-2xs border border-outline-variant/60"
                                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60",
                            )}>
                            All ({gapList.length})
                        </button>
                        {criticalGaps.length > 0 && (
                            <button
                                type="button"
                                onClick={() => handleFilterChange("critical")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-sans transition-all whitespace-nowrap cursor-pointer",
                                    selectedFilter === "critical"
                                        ? "bg-rose-50 text-rose-800 font-semibold border border-rose-200"
                                        : "text-on-surface-variant hover:text-rose-700 hover:bg-rose-50/50",
                                )}>
                                Critical ({criticalGaps.length})
                            </button>
                        )}
                        {sec5Count > 0 && (
                            <button
                                type="button"
                                onClick={() => handleFilterChange("sec5")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-sans transition-all whitespace-nowrap cursor-pointer",
                                    selectedFilter === "sec5"
                                        ? "bg-blue-50 text-blue-800 font-semibold border border-blue-200"
                                        : "text-on-surface-variant hover:text-blue-700 hover:bg-blue-50/50",
                                )}>
                                Sec 5: Production ({sec5Count})
                            </button>
                        )}
                        {sec10Count > 0 && (
                            <button
                                type="button"
                                onClick={() => handleFilterChange("sec10")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-sans transition-all whitespace-nowrap cursor-pointer",
                                    selectedFilter === "sec10"
                                        ? "bg-amber-50 text-amber-800 font-semibold border border-amber-200"
                                        : "text-on-surface-variant hover:text-amber-700 hover:bg-amber-50/50",
                                )}>
                                Sec 10: Energy ({sec10Count})
                            </button>
                        )}
                        {sec11Count > 0 && (
                            <button
                                type="button"
                                onClick={() => handleFilterChange("sec11")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-sans transition-all whitespace-nowrap cursor-pointer",
                                    selectedFilter === "sec11"
                                        ? "bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200"
                                        : "text-on-surface-variant hover:text-cyan-700 hover:bg-cyan-50/50",
                                )}>
                                Sec 11: Water ({sec11Count})
                            </button>
                        )}
                    </div>
                )}

                {/* Paginated List Body */}
                <CardBody className="p-0 flex-1 flex flex-col justify-start">
                    {filteredGaps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center my-auto min-h-[290px]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                <MaterialIcon name="check_circle" size="sm" />
                            </div>
                            <p className="font-display text-sm font-semibold text-primary">
                                {gapList.length === 0
                                    ? "All Data Streams Fully Satisfied"
                                    : "No Gaps for Selected Filter"}
                            </p>
                            <p className="font-sans text-xs text-on-surface-variant max-w-sm">
                                {gapList.length === 0
                                    ? "Zero compliance gaps detected across the 24-month audit window. Your production throughput, energy, water intake, and statutory permits satisfy LWG Issue 7.x criteria."
                                    : "All compliance parameters in this specific category are currently satisfied."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-outline-variant/40 min-h-[290px]">
                            {paginatedGaps.map((gap, idx) => {
                                const isCritical = gap.severity === "red";
                                const linkHref = normalizeUrl(gap.fixUrl);

                                return (
                                    <div
                                        key={`${gap.checkCode}-${gap.sectionNumber}-${gap.month || "all"}-${idx}`}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 p-3 sm:px-4 hover:bg-surface-container-low/40 transition-colors">
                                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                            <div
                                                className={cn(
                                                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs",
                                                    isCritical
                                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200",
                                                )}>
                                                <MaterialIcon
                                                    name={isCritical ? "error" : "warning"}
                                                    size="xs"
                                                />
                                            </div>

                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span
                                                        className={cn(
                                                            "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                                                            isCritical
                                                                ? "bg-rose-100 text-rose-800"
                                                                : "bg-amber-100 text-amber-800",
                                                        )}>
                                                        {isCritical ? "Critical" : "Warning"}
                                                    </span>
                                                    <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                                                        Section {gap.sectionNumber}
                                                    </span>
                                                    {gap.month && (
                                                        <span className="rounded bg-surface-container-low px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant border border-outline-variant/40">
                                                            {gap.month}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-sans text-xs font-medium text-primary leading-tight">
                                                    {gap.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 sm:self-center">
                                            <Link
                                                href={linkHref}
                                                className="inline-flex items-center gap-1 rounded-md bg-surface-container-lowest border border-outline-variant/70 px-2.5 py-1 font-sans text-xs font-semibold text-primary hover:bg-surface-container-low hover:border-emerald-600 transition-all shadow-2xs">
                                                <span>Resolve Now</span>
                                                <MaterialIcon name="arrow_forward" size="xs" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardBody>
            </div>

            {/* Clean, Minimal Pagination Footer */}
            <div className="px-3.5 py-2.5 border-t border-outline-variant/50 bg-surface-container-low/40 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant shrink-0">
                <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                    Showing{" "}
                    <strong className="font-mono text-primary font-bold">
                        {filteredGaps.length === 0 ? 0 : startIndex + 1}–{endIndex}
                    </strong>{" "}
                    of <strong className="font-mono text-primary font-bold">{filteredGaps.length}</strong> gaps
                </span>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="inline-flex items-center gap-0.5 px-2.5 py-1 text-xs rounded-md border border-outline-variant/60 bg-surface-container-lowest text-primary hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all select-none font-medium cursor-pointer">
                            <MaterialIcon name="chevron_left" size="xs" />
                            <span>Prev</span>
                        </button>

                        <span className="px-1.5 font-mono text-[11px] font-semibold text-primary">
                            {safePage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="inline-flex items-center gap-0.5 px-2.5 py-1 text-xs rounded-md border border-outline-variant/60 bg-surface-container-lowest text-primary hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all select-none font-medium cursor-pointer">
                            <span>Next</span>
                            <MaterialIcon name="chevron_right" size="xs" />
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}
