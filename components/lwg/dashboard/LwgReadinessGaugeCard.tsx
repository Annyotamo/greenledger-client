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
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (readiness.overallPercent / 100) * circumference;

    const getStatusBadge = () => {
        if (isReady) {
            return (
                <Badge variant="positive" size="sm" className="gap-1">
                    <MaterialIcon name="check_circle" size="xs" />
                    <span>Audit Ready</span>
                </Badge>
            );
        }
        if (hasGaps) {
            return (
                <Badge variant="negative" size="sm" className="gap-1">
                    <MaterialIcon name="warning" size="xs" />
                    <span>Action Required: Gaps</span>
                </Badge>
            );
        }
        return (
            <Badge variant="neutral" size="sm" className="gap-1">
                <MaterialIcon name="pending" size="xs" />
                <span>Not Started</span>
            </Badge>
        );
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="fact_check" size="xs" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Audit Readiness
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                24-Month Protocol Completeness
                            </p>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>

            <CardBody className="space-y-5">
                {/* Gauge & Percentage Visual */}
                <div className="flex items-center justify-center gap-6 py-2">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-28 h-28 transform -rotate-90">
                            {/* Track */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className="text-surface-container-high stroke-current"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Progress */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className={cn(
                                    "stroke-current transition-all duration-1000 ease-out",
                                    isReady
                                        ? "text-emerald-500"
                                        : readiness.overallPercent >= 75
                                        ? "text-amber-500"
                                        : "text-rose-500",
                                )}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffset}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="font-mono text-2xl font-bold tracking-tight text-primary tabular-nums">
                                {readiness.overallPercent.toFixed(1)}%
                            </span>
                            <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                                Complete
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sub-bars: Production, Energy, Water */}
                <div className="space-y-2.5 border-t border-outline-variant/50 pt-3">
                    {/* Production Sub-bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[11px]">
                            <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Production (Sec 5)
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
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Energy (Sec 10)
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
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                Water (Sec 11)
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
