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
                    bg: "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-yellow-500/5",
                    border: "border-amber-300",
                    text: "text-amber-800",
                    iconColor: "text-amber-600",
                    badge: "bg-amber-100 text-amber-900 border-amber-300",
                };
            case "silver":
                return {
                    bg: "bg-gradient-to-br from-slate-300/30 via-slate-200/15 to-gray-200/5",
                    border: "border-slate-300",
                    text: "text-slate-800",
                    iconColor: "text-slate-600",
                    badge: "bg-slate-100 text-slate-800 border-slate-300",
                };
            case "bronze":
                return {
                    bg: "bg-gradient-to-br from-orange-400/20 via-amber-700/10 to-stone-300/5",
                    border: "border-orange-300",
                    text: "text-orange-950",
                    iconColor: "text-amber-700",
                    badge: "bg-orange-100 text-orange-900 border-orange-300",
                };
            case "audited":
                return {
                    bg: "bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-blue-200/5",
                    border: "border-blue-300",
                    text: "text-blue-950",
                    iconColor: "text-blue-600",
                    badge: "bg-blue-100 text-blue-900 border-blue-300",
                };
            case "fail":
            default:
                return {
                    bg: "bg-gradient-to-br from-rose-500/15 via-red-400/10 to-red-100/5",
                    border: "border-rose-300",
                    text: "text-rose-950",
                    iconColor: "text-rose-600",
                    badge: "bg-rose-100 text-rose-900 border-rose-300",
                };
        }
    };

    const visual = getMedalVisual(overallMedal);

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
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

            <CardBody className="space-y-4">
                {/* Master Medal Crest */}
                <div
                    className={cn(
                        "flex items-center justify-between rounded-2xl border p-4 shadow-sm",
                        visual.bg,
                        visual.border,
                    )}>
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-xs border border-white">
                            <MaterialIcon
                                name="workspace_premium"
                                size="lg"
                                className={visual.iconColor}
                            />
                        </div>
                        <div>
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border",
                                    visual.badge,
                                )}>
                                Rating: {medalMeta.label}
                            </span>
                            <h4 className={cn("font-display text-xl font-extrabold uppercase mt-0.5", visual.text)}>
                                {overallMedal === "fail" ? "Non-Compliant" : `${medalMeta.label} Medal`}
                            </h4>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="font-mono text-xs text-on-surface-variant">Min Threshold</span>
                        <p className="font-mono text-base font-bold text-primary">
                            {medalMeta.minScore.toFixed(0)}%
                        </p>
                    </div>
                </div>

                {/* Critical Bottleneck / Holding-Down Alert */}
                {hasHoldingDown && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-900 animate-fade-in space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                            <MaterialIcon name="warning" size="xs" className="text-amber-700 shrink-0" />
                            <span>LWG Holding-Down Rule Enforced</span>
                        </div>
                        <p className="font-sans text-[11px] text-amber-900/90 leading-relaxed">
                            {medalStatus.message ||
                                `Overall tannery medal is capped at ${medalMeta.label} because Critical Section ${medalStatus.holdingDownSections.join(", ")} scored below higher thresholds.`}
                        </p>
                        <p className="font-sans text-[10px] text-amber-800/70 italic">
                            Rule: The facility medal cannot exceed the lowest score of any single critical section.
                        </p>
                    </div>
                )}

                {/* Tracked Section Ratings Breakdown */}
                {medalStatus.sectionRatings && Object.keys(medalStatus.sectionRatings).length > 0 && (
                    <div className="space-y-2 border-t border-outline-variant/50 pt-3">
                        <p className="font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                            Tracked Critical Section Ratings
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(medalStatus.sectionRatings).map(([sectionNum, rating]) => {
                                const sectionRatingMeta = LWG_MEDAL_CONFIG[rating] ?? LWG_MEDAL_CONFIG.fail;
                                const isBottleneck = medalStatus.holdingDownSections.includes(Number(sectionNum));

                                return (
                                    <div
                                        key={sectionNum}
                                        className={cn(
                                            "flex items-center justify-between rounded-lg border p-2 text-xs",
                                            isBottleneck
                                                ? "border-amber-400 bg-amber-50/60"
                                                : "border-outline-variant/60 bg-surface",
                                        )}>
                                        <span className="font-medium text-primary flex items-center gap-1.5">
                                            {isBottleneck && (
                                                <MaterialIcon
                                                    name="arrow_downward"
                                                    size="xs"
                                                    className="text-amber-600"
                                                />
                                            )}
                                            Sec {sectionNum}
                                        </span>
                                        <span
                                            className={cn(
                                                "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                                                rating === "gold"
                                                    ? "bg-amber-100 text-amber-800"
                                                    : rating === "silver"
                                                    ? "bg-slate-100 text-slate-800"
                                                    : rating === "bronze"
                                                    ? "bg-orange-100 text-orange-900"
                                                    : "bg-rose-100 text-rose-800",
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
        </Card>
    );
}
