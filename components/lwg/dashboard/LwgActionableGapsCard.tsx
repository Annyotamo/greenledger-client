// components/lwg/dashboard/LwgActionableGapsCard.tsx
"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { LwgGapItem } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgActionableGapsCardProps {
    gapList: LwgGapItem[];
}

export function LwgActionableGapsCard({ gapList }: LwgActionableGapsCardProps) {
    const criticalGaps = gapList.filter((g) => g.severity === "red");
    const warningGaps = gapList.filter((g) => g.severity === "amber");

    // Normalizes backend "/tenant/lwg/..." URL to client App Router route "/lwg/..."
    const normalizeUrl = (url: string) => {
        if (url.startsWith("/tenant/lwg")) {
            return url.replace("/tenant/lwg", "/lwg");
        }
        return url;
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg border",
                                gapList.length > 0
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200",
                            )}>
                            <MaterialIcon
                                name={gapList.length > 0 ? "report_problem" : "verified"}
                                size="xs"
                            />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Actionable Audit Gaps
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Compliance deficiencies identified across the 24-month audit window
                            </p>
                        </div>
                    </div>

                    {gapList.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                            {criticalGaps.length > 0 && (
                                <Badge variant="negative" size="sm">
                                    {criticalGaps.length} Critical
                                </Badge>
                            )}
                            {warningGaps.length > 0 && (
                                <Badge variant="active" size="sm">
                                    {warningGaps.length} Warning
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <Badge variant="positive" size="sm">
                            0 Gaps Detected
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardBody className="p-0">
                {gapList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2.5 p-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                            <MaterialIcon name="check_circle" size="md" />
                        </div>
                        <div>
                            <p className="font-display text-sm font-bold text-primary">
                                All Data Streams Fully Satisfied
                            </p>
                            <p className="font-sans text-xs text-on-surface-variant max-w-sm mt-1">
                                Zero compliance gaps detected across the 24-month audit window. Your production throughput, energy, water intake, and statutory permits satisfy LWG Issue 7.x criteria.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-outline-variant/40 max-h-[380px] overflow-y-auto">
                        {gapList.map((gap, idx) => {
                            const isCritical = gap.severity === "red";
                            const linkHref = normalizeUrl(gap.fixUrl);

                            return (
                                <div
                                    key={`${gap.checkCode}-${gap.sectionNumber}-${gap.month || "all"}-${idx}`}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-surface-container-low/40 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs",
                                                isCritical
                                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200",
                                            )}>
                                            <MaterialIcon
                                                name={isCritical ? "error" : "warning"}
                                                size="xs"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                                                        isCritical
                                                            ? "bg-rose-100 text-rose-800"
                                                            : "bg-amber-100 text-amber-800",
                                                    )}>
                                                    {isCritical ? "Critical Blocker" : "Warning"}
                                                </span>
                                                <span className="rounded-md bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                                                    Section {gap.sectionNumber}
                                                </span>
                                                {gap.month && (
                                                    <span className="font-mono text-[10px] text-on-surface-variant">
                                                        Month: {gap.month}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-sans text-xs font-semibold text-primary">
                                                {gap.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 sm:self-center">
                                        <Link
                                            href={linkHref}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-outline-variant px-3 py-1.5 font-sans text-xs font-semibold text-primary hover:bg-surface-container-high hover:border-emerald-600 transition-all shadow-2xs">
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
        </Card>
    );
}
