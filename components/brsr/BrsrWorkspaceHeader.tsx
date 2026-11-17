"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReportingPeriod } from "@/lib/reportingPeriods/types";
import type { BRSRStatus } from "@/lib/brsr/types";

interface BrsrWorkspaceHeaderProps {
    periods: ReportingPeriod[];
    selectedPeriodId: string;
    onPeriodChange: (id: string) => void;
    status: BRSRStatus;
    completionPercentage: number;
    completedSectionsCount: number;
    totalSectionsCount: number;
    isSaving: boolean;
    onSaveDraft: () => void;
    onOpenPdfPreview: () => void;
    onExportPdf: () => void;
    onSubmitFiling: () => void;
    isSubmitting?: boolean;
}

export function BrsrWorkspaceHeader({
    periods,
    selectedPeriodId,
    onPeriodChange,
    status,
    completionPercentage,
    completedSectionsCount,
    totalSectionsCount,
    isSaving,
    onSaveDraft,
    onOpenPdfPreview,
    onExportPdf,
    onSubmitFiling,
    isSubmitting = false,
}: BrsrWorkspaceHeaderProps) {
    const statusVariantMap: Record<BRSRStatus, "positive" | "active" | "neutral" | "negative" | "tag"> = {
        draft: "neutral",
        submitted: "tag",
        verified: "active",
        approved: "positive",
        rejected: "negative",
    };

    return (
        <div className="sticky top-16 z-30 -mx-gutter -mt-6 mb-6 border-b border-outline-variant bg-surface/95 px-gutter py-4 backdrop-blur-md transition-all">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Title & Statutory Notice */}
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Badge variant="active" size="md" className="gap-1.5 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            SEBI BRSR Statutory Engine
                        </Badge>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                            <MaterialIcon name="verified_user" size="xs" className="text-primary text-[13px]" />
                            <span>Annexure II Statutory Framework • 41-Page Filing</span>
                        </span>
                        <Badge variant={statusVariantMap[status] || "neutral"} size="sm" className="uppercase font-mono text-[10px] tracking-wider">
                            Status: {status}
                        </Badge>
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-primary font-display sm:text-2xl">
                        Business Responsibility &amp; Sustainability Reporting (BRSR)
                    </h1>
                </div>

                {/* Right controls: Period Selector, Completion progress, Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Reporting Period Selector */}
                    <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-1.5 shadow-2xs">
                        <MaterialIcon name="calendar_today" size="sm" className="text-primary text-[16px]" />
                        <span className="font-sans text-[11px] font-medium text-on-surface-variant uppercase">Period:</span>
                        <select
                            value={selectedPeriodId}
                            onChange={(e) => onPeriodChange(e.target.value)}
                            className="bg-transparent font-sans text-xs font-semibold text-primary outline-none cursor-pointer">
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.reportingYear})
                                </option>
                            ))}
                            {periods.length === 0 && <option value="">No Reporting Periods</option>}
                        </select>
                    </div>

                    {/* Progress Indicator */}
                    <div className="hidden sm:flex flex-col gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 shadow-2xs min-w-[150px]">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="font-sans font-medium text-on-surface-variant">Filing Readiness</span>
                            <span className="font-display font-bold text-primary tabular-nums">{completionPercentage}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-on-surface-variant/70 font-mono">
                            {completedSectionsCount} of {totalSectionsCount} sections completed
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onSaveDraft}
                            disabled={isSaving}
                            className="gap-1.5 font-sans text-xs shadow-2xs"
                            title="Save current section draft">
                            <MaterialIcon name={isSaving ? "sync" : "save"} size="sm" className={isSaving ? "animate-spin" : ""} />
                            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onOpenPdfPreview}
                            className="gap-1.5 font-sans text-xs shadow-2xs"
                            title="Live preview of the 41-page statutory PDF">
                            <MaterialIcon name="visibility" size="sm" />
                            <span className="hidden md:inline">Live PDF</span>
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onExportPdf}
                            className="gap-1.5 font-sans text-xs shadow-2xs"
                            title="Download the full 41-page SEBI PDF packet">
                            <MaterialIcon name="download" size="sm" />
                            <span>Export PDF</span>
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={onSubmitFiling}
                            disabled={isSubmitting || status === "submitted" || status === "verified" || status === "approved"}
                            className="gap-1.5 font-sans text-xs"
                            title="Submit complete BRSR disclosure for statutory audit & verification">
                            <MaterialIcon name="check_circle" size="sm" />
                            <span>{status === "submitted" ? "Submitted" : isSubmitting ? "Submitting..." : "Submit Filing"}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
