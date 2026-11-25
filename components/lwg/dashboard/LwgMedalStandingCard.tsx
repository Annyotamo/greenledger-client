// components/lwg/dashboard/LwgMedalStandingCard.tsx
"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { LWG_MEDAL_CONFIG, type LwgMedalRating, type LwgMedalStatus } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgMedalStandingCardProps {
    medalStatus: LwgMedalStatus;
}

export function LwgMedalStandingCard({ medalStatus }: LwgMedalStandingCardProps) {
    const overallMedal = medalStatus.overallMedal;
    const medalMeta = LWG_MEDAL_CONFIG[overallMedal] ?? LWG_MEDAL_CONFIG.fail;
    const hasHoldingDown = medalStatus.holdingDownSections.length > 0;

    const getMedalVisual = (medal: LwgMedalRating) => {
        switch (medal) {
            case "gold":
                return {
                    bg: "bg-amber-50/60",
                    border: "border-amber-300",
                    text: "text-amber-950",
                    iconColor: "text-amber-600",
                    badge: "bg-amber-100 text-amber-900 border-amber-300",
                };
            case "silver":
                return {
                    bg: "bg-slate-50",
                    border: "border-slate-300",
                    text: "text-slate-900",
                    iconColor: "text-slate-600",
                    badge: "bg-slate-100 text-slate-800 border-slate-300",
                };
            case "bronze":
                return {
                    bg: "bg-amber-50/40",
                    border: "border-amber-200",
                    text: "text-amber-950",
                    iconColor: "text-amber-700",
                    badge: "bg-amber-100 text-orange-900 border-orange-200",
                };
            case "audited":
                return {
                    bg: "bg-sky-50/60",
                    border: "border-sky-200",
                    text: "text-sky-950",
                    iconColor: "text-sky-600",
                    badge: "bg-sky-100 text-sky-900 border-sky-200",
                };
            case "fail":
            default:
                return {
                    bg: "bg-surface-container-low/70",
                    border: "border-outline-variant/60",
                    text: "text-primary",
                    iconColor: "text-on-surface-variant",
                    badge: "bg-surface-container-high text-on-surface-variant border-outline-variant/60",
                };
        }
    };

    const visual = getMedalVisual(overallMedal);

    return (
        <Card className="h-full flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
                <CardHeader bordered tone="strip">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                            <MaterialIcon name="military_tech" size="xs" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Predicted Audit Medal Standing
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Protocol Issue 7.x Rating with Holding-Down Rule
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4 space-y-3.5 flex-1 flex flex-col justify-start">
                    {/* Master Medal Crest */}
                    <div
                        className={cn(
                            "flex items-center justify-between rounded-lg border p-3.5 shadow-2xs",
                            visual.bg,
                            visual.border,
                        )}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest shadow-2xs border border-outline-variant/50 shrink-0">
                                <MaterialIcon
                                    name="workspace_premium"
                                    size="md"
                                    className={visual.iconColor}
                                />
                            </div>
                            <div>
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border",
                                        visual.badge,
                                    )}>
                                    Rating: {overallMedal === "fail" ? "Pending" : medalMeta.label}
                                </span>
                                <h4 className={cn("font-display text-base font-bold mt-0.5", visual.text)}>
                                    {overallMedal === "fail" ? "Under Evaluation" : `${medalMeta.label} Medal`}
                                </h4>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <span className="font-mono text-[11px] text-on-surface-variant">Min Target</span>
                            <p className="font-mono text-base font-bold text-primary">
                                {medalMeta.minScore.toFixed(0)}%
                            </p>
                        </div>
                    </div>

                    {/* Critical Bottleneck / Holding-Down Alert */}
                    {hasHoldingDown && (
                        <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 p-2.5 sm:p-3 text-xs text-amber-900 animate-fade-in space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                <MaterialIcon name="warning" size="xs" className="text-amber-700 shrink-0" />
                                <span>Protocol Holding-Down Rule Applied</span>
                            </div>
                            <p className="font-sans text-[11px] text-amber-900/90 leading-snug">
                                Overall medal is capped at <strong className="font-bold uppercase">{medalMeta.label}</strong> because Critical Section {medalStatus.holdingDownSections.join(", ")} scored below higher thresholds.
                            </p>
                            <p className="font-sans text-[10px] text-amber-800/70 italic">
                                Facility medal cannot exceed the lowest score achieved by any single critical section.
                            </p>
                        </div>
                    )}

                    {/* Tracked Section Ratings: 4-Column Matrix */}
                    {medalStatus.sectionRatings && Object.keys(medalStatus.sectionRatings).length > 0 && (
                        <div className="space-y-2 border-t border-outline-variant/50 pt-2.5">
                            <div className="flex items-center justify-between">
                                <p className="font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                    Tracked Critical Section Ratings
                                </p>
                                <span className="font-mono text-[10px] text-on-surface-variant/80">
                                    {Object.keys(medalStatus.sectionRatings).length} Sections Evaluated
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {Object.entries(medalStatus.sectionRatings).map(([sectionNum, rating]) => {
                                    const sectionRatingMeta = LWG_MEDAL_CONFIG[rating] ?? LWG_MEDAL_CONFIG.fail;
                                    const isBottleneck = medalStatus.holdingDownSections.includes(Number(sectionNum));

                                    return (
                                        <div
                                            key={sectionNum}
                                            className={cn(
                                                "flex items-center justify-between rounded-md border px-2 py-1.5 text-xs transition-colors",
                                                isBottleneck
                                                    ? "border-amber-400 bg-amber-50/80 ring-1 ring-amber-400/50"
                                                    : "border-outline-variant/60 bg-surface-container-lowest",
                                            )}>
                                            <span className="font-medium text-primary flex items-center gap-1 text-[11px]">
                                                {isBottleneck && (
                                                    <MaterialIcon
                                                        name="arrow_downward"
                                                        size="xs"
                                                        className="text-amber-600 shrink-0"
                                                    />
                                                )}
                                                <span className="font-mono font-semibold">#{sectionNum}</span>
                                            </span>
                                            <span
                                                className={cn(
                                                    "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase",
                                                    rating === "gold"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : rating === "silver"
                                                        ? "bg-slate-100 text-slate-800"
                                                        : rating === "bronze"
                                                        ? "bg-orange-100 text-orange-900 font-bold"
                                                        : "bg-surface-container-high text-on-surface-variant",
                                                )}>
                                                {sectionRatingMeta.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </CardBody>
            </div>

            {/* Subtle Footer Bar matching left card */}
            <div className="px-3.5 py-2.5 border-t border-outline-variant/50 bg-surface-container-low/40 flex items-center justify-between text-xs text-on-surface-variant shrink-0">
                <span className="font-sans text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
                    <MaterialIcon name="verified" size="xs" className="text-emerald-700" />
                    <span>Leather Protocol Issue 7.x Rating Engine</span>
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant/80">
                    Min Score: <strong className="font-bold text-primary">{medalMeta.minScore}%</strong>
                </span>
            </div>
        </Card>
    );
}
