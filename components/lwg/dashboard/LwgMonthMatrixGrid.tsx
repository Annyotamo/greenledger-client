// components/lwg/dashboard/LwgMonthMatrixGrid.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { LwgMonthGridItem } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgMonthMatrixGridProps {
    monthGrid: LwgMonthGridItem[];
}

export function LwgMonthMatrixGrid({ monthGrid }: LwgMonthMatrixGridProps) {
    const [selectedMonth, setSelectedMonth] = useState<LwgMonthGridItem | null>(null);

    // Split 24 months into P12 (first 12) and L12 (last 12)
    const p12Months = monthGrid.slice(0, 12);
    const l12Months = monthGrid.slice(12, 24);

    const p12CompleteCount = p12Months.filter((m) => m.isFullyComplete).length;
    const l12CompleteCount = l12Months.filter((m) => m.isFullyComplete).length;

    return (
        <Card className="overflow-hidden">
            <CardHeader bordered tone="strip">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                            <MaterialIcon name="grid_view" size="xs" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                24-Month Audit Data Matrix
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Monthly completeness across Production, Energy, and Water parameters
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1 text-[11px] font-mono border border-outline-variant/60">
                            <span className="text-on-surface-variant font-medium">P12:</span>
                            <span className="font-bold text-primary">{p12CompleteCount}/12</span>
                            <span className="text-outline-variant">•</span>
                            <span className="text-on-surface-variant font-medium">L12:</span>
                            <span className="font-bold text-emerald-700">{l12CompleteCount}/12</span>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                                <span>Logged</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-surface-container-high border border-outline-variant/50" />
                                <span>Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-5">
                {/* 1. Previous 12 Months (P12) Block */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                                Previous 12 Months (P12)
                            </span>
                            <span className="font-sans text-[11px] text-on-surface-variant/70 hidden sm:inline">
                                Baseline benchmarking period
                            </span>
                        </div>
                        <span className="font-mono text-[11px] font-medium text-on-surface-variant">
                            {p12CompleteCount}/12 Months Complete
                        </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                        {p12Months.map((item) => (
                            <MonthCell
                                key={item.month}
                                item={item}
                                isSelected={selectedMonth?.month === item.month}
                                onClick={() =>
                                    setSelectedMonth(selectedMonth?.month === item.month ? null : item)
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* 2. Latest 12 Months (L12) Block */}
                <div className="space-y-2 border-t border-outline-variant/50 pt-4">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-emerald-100/70 text-emerald-800 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                                Latest 12 Months (L12)
                            </span>
                            <span className="font-sans text-[11px] text-on-surface-variant/70 hidden sm:inline">
                                Active audit evaluation period
                            </span>
                        </div>
                        <span className="font-mono text-[11px] font-medium text-emerald-800">
                            {l12CompleteCount}/12 Months Complete
                        </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                        {l12Months.map((item) => (
                            <MonthCell
                                key={item.month}
                                item={item}
                                isSelected={selectedMonth?.month === item.month}
                                onClick={() =>
                                    setSelectedMonth(selectedMonth?.month === item.month ? null : item)
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Selected Month Quick Action Flyout */}
                {selectedMonth && (
                    <div className="rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-4 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200/70 shrink-0">
                                    <MaterialIcon name="calendar_month" size="sm" />
                                </div>
                                <div>
                                    <h4 className="font-display text-sm font-bold text-primary">
                                        {selectedMonth.monthLabel} Audit Record
                                    </h4>
                                    <p className="font-sans text-[11px] text-on-surface-variant">
                                        Status:{" "}
                                        {selectedMonth.isFullyComplete ? (
                                            <span className="font-medium text-emerald-700">
                                                All 3 data streams complete
                                            </span>
                                        ) : (
                                            <span className="font-medium text-amber-800">
                                                Missing required monthly parameters
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Link to Production */}
                                <Link
                                    href={`/lwg/production?month=${selectedMonth.month}`}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-all",
                                        selectedMonth.productionComplete
                                            ? "bg-surface-container-lowest text-primary border-outline-variant/60 hover:bg-surface-container-low"
                                            : "bg-amber-50 text-amber-900 border-amber-300/80 hover:bg-amber-100/70",
                                    )}>
                                    <MaterialIcon
                                        name={selectedMonth.productionComplete ? "check_circle" : "add_circle"}
                                        size="xs"
                                        className={selectedMonth.productionComplete ? "text-emerald-600" : "text-amber-700"}
                                    />
                                    <span>Production</span>
                                </Link>

                                {/* Link to Energy */}
                                <Link
                                    href={`/lwg/energy?month=${selectedMonth.month}`}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-all",
                                        selectedMonth.energyComplete
                                            ? "bg-surface-container-lowest text-primary border-outline-variant/60 hover:bg-surface-container-low"
                                            : "bg-amber-50 text-amber-900 border-amber-300/80 hover:bg-amber-100/70",
                                    )}>
                                    <MaterialIcon
                                        name={selectedMonth.energyComplete ? "check_circle" : "add_circle"}
                                        size="xs"
                                        className={selectedMonth.energyComplete ? "text-emerald-600" : "text-amber-700"}
                                    />
                                    <span>Energy</span>
                                </Link>

                                {/* Link to Water */}
                                <Link
                                    href={`/lwg/water?month=${selectedMonth.month}`}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-all",
                                        selectedMonth.waterComplete
                                            ? "bg-surface-container-lowest text-primary border-outline-variant/60 hover:bg-surface-container-low"
                                            : "bg-amber-50 text-amber-900 border-amber-300/80 hover:bg-amber-100/70",
                                    )}>
                                    <MaterialIcon
                                        name={selectedMonth.waterComplete ? "check_circle" : "add_circle"}
                                        size="xs"
                                        className={selectedMonth.waterComplete ? "text-emerald-600" : "text-amber-700"}
                                    />
                                    <span>Water</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setSelectedMonth(null)}
                                    className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container-high ml-1">
                                    <MaterialIcon name="close" size="xs" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

function MonthCell({
    item,
    isSelected,
    onClick,
}: {
    item: LwgMonthGridItem;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center justify-between rounded-lg border p-2 text-center transition-all select-none cursor-pointer",
                isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 shadow-2xs"
                    : item.isFullyComplete
                    ? "border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50/40"
                    : "border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant hover:bg-surface-container-low/50",
            )}>
            {/* Month Label */}
            <span className="font-mono text-[11px] font-semibold text-primary truncate w-full">
                {item.monthLabel}
            </span>

            {/* 3 Status Indicators: Production, Energy, Water */}
            <div className="flex items-center justify-center gap-1 my-1.5">
                {/* Dot 1: Production (P) */}
                <span
                    title={`Production: ${item.productionComplete ? "Complete" : "Pending"}`}
                    className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-mono font-bold transition-colors",
                        item.productionComplete
                            ? "bg-emerald-600 text-white"
                            : "bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/50",
                    )}>
                    P
                </span>

                {/* Dot 2: Energy (E) */}
                <span
                    title={`Energy: ${item.energyComplete ? "Complete" : "Pending"}`}
                    className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-mono font-bold transition-colors",
                        item.energyComplete
                            ? "bg-emerald-600 text-white"
                            : "bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/50",
                    )}>
                    E
                </span>

                {/* Dot 3: Water (W) */}
                <span
                    title={`Water: ${item.waterComplete ? "Complete" : "Pending"}`}
                    className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-mono font-bold transition-colors",
                        item.waterComplete
                            ? "bg-emerald-600 text-white"
                            : "bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/50",
                    )}>
                    W
                </span>
            </div>

            {/* Status Footer */}
            <span
                className={cn(
                    "text-[9px] font-medium leading-none",
                    item.isFullyComplete ? "text-emerald-700 font-semibold" : "text-on-surface-variant/80",
                )}>
                {item.isFullyComplete ? "Complete" : "Pending"}
            </span>
        </button>
    );
}
