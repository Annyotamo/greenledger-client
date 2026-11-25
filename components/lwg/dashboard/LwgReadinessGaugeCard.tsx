// components/lwg/dashboard/LwgReadinessGaugeCard.tsx
"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { LwgReadinessTile } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgReadinessGaugeCardProps {
    readiness: LwgReadinessTile;
}

export function LwgReadinessGaugeCard({ readiness }: LwgReadinessGaugeCardProps) {
    const isReady = readiness.status === "ready";
    const hasGaps = readiness.status === "gaps";

    // SVG Circular Gauge calculation
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const boundedPercent = Math.min(Math.max(readiness.overallPercent, 0), 100);
    const progressOffset = circumference - (boundedPercent / 100) * circumference;

    const getStatusBadge = () => {
        if (isReady) {
            return (
                <Badge variant="positive" size="sm" className="gap-1 font-medium shrink-0">
                    <MaterialIcon name="check_circle" size="xs" />
                    <span>Audit Ready</span>
                </Badge>
            );
        }
        if (hasGaps) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 shrink-0 whitespace-nowrap">
                    <MaterialIcon name="warning" size="xs" className="text-amber-700" />
                    <span>Action Needed</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant/60 bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant shrink-0 whitespace-nowrap">
                <MaterialIcon name="pending" size="xs" />
                <span>Not Started</span>
            </span>
        );
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                            <MaterialIcon name="fact_check" size="xs" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary truncate">
                                Audit Readiness
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant truncate">
                                24-Month Completeness
                            </p>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>

            <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Crisp Circular Ring Gauge */}
                <div className="flex items-center justify-center py-1">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                            {/* Track */}
                            <circle
                                cx="48"
                                cy="48"
                                r={radius}
                                className="stroke-surface-container-high"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            {/* Progress Ring */}
                            {boundedPercent > 0 && (
                                <circle
                                    cx="48"
                                    cy="48"
                                    r={radius}
                                    className={cn(
                                        "transition-all duration-1000 ease-out",
                                        isReady
                                            ? "stroke-emerald-600"
                                            : boundedPercent >= 75
                                            ? "stroke-emerald-600"
                                            : "stroke-emerald-700",
                                    )}
                                    strokeWidth="6"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={progressOffset}
                                    strokeLinecap={boundedPercent > 4 ? "round" : "butt"}
                                    fill="transparent"
                                />
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                            <span className="font-mono text-xl font-bold tracking-tight text-primary tabular-nums">
                                {readiness.overallPercent.toFixed(1)}%
                            </span>
                            <span className="font-sans text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">
                                Complete
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sub-bars: Production, Energy, Water */}
                <div className="space-y-2 border-t border-outline-variant/40 pt-3">
                    {/* Production Sub-bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[11px]">
                            <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                <span>Production (Sec 5)</span>
                            </span>
                            <span className="font-mono font-semibold text-primary tabular-nums">
                                {readiness.productionPercent.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                style={{ width: `${Math.min(readiness.productionPercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Energy Sub-bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[11px]">
                            <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>Energy (Sec 10)</span>
                            </span>
                            <span className="font-mono font-semibold text-primary tabular-nums">
                                {readiness.energyPercent.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                style={{ width: `${Math.min(readiness.energyPercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Water Sub-bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[11px]">
                            <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                                <span>Water (Sec 11)</span>
                            </span>
                            <span className="font-mono font-semibold text-primary tabular-nums">
                                {readiness.waterPercent.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                                style={{ width: `${Math.min(readiness.waterPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
