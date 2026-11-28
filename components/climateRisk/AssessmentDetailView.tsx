"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { approveAssessment, createNewVersion, exportAssessmentCsv, reopenAssessment, submitAssessment } from "@/lib/climateRisk/api";
import { useRiskAccess, useRiskAction, useRiskAssessment } from "@/lib/climateRisk/hooks";
import { ErrorNote, formatDateTime, StatusBadge, StatusSteps } from "./RiskUi";
import { SetupTab } from "./SetupTab";
import { PhysicalTab } from "./PhysicalTab";
import { TransitionTab } from "./TransitionTab";
import { ReportTab } from "./ReportTab";

const TABS = [
    { key: "setup", label: "Setup", icon: "tune" },
    { key: "physical", label: "Physical risk", icon: "flood" },
    { key: "transition", label: "Transition risk", icon: "payments" },
    { key: "report", label: "Summary & report", icon: "summarize" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function AssessmentDetailView({ id }: { id: string }) {
    const router = useRouter();
    const access = useRiskAccess();
    const { data, isPending, error } = useRiskAssessment(id);
    const action = useRiskAction();
    const [picked, setPicked] = useState<TabKey | null>(null);
    const [exporting, setExporting] = useState(false);

    if (isPending) return <p className="py-16 text-center text-on-surface-variant">Loading assessment…</p>;
    if (!data) {
        return (
            <div className="space-y-4">
                <BackLink />
                <ErrorNote error={error ?? new Error("Assessment not found.")} />
            </div>
        );
    }

    const a = data.assessment;
    const locked = a.status === "approved";
    // History is newest first. Only the newest version of a year can change; older ones are read-only (server-enforced).
    const newer = data.history[0] && data.history[0].version > a.version ? data.history[0] : undefined;
    const canAct = access.canWrite && !newer;
    // Only a draft is editable: the server freezes an assessment once it is submitted.
    const canEdit = canAct && a.status === "draft";
    // Read-only users (client view) only get the report.
    const tabs = access.canWrite ? TABS : TABS.filter((t) => t.key === "report");
    const defaultTab: TabKey = !canEdit ? "report" : !a.physical_run_at ? "setup" : "report";
    const tab = tabs.some((t) => t.key === picked) ? (picked as TabKey) : defaultTab;
    const supersedes = data.history.find((h) => h.id === a.supersedes_id);

    const download = async () => {
        setExporting(true);
        try {
            const csv = await exportAssessmentCsv(id);
            // BOM so Excel opens ₹ and › correctly.
            const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
            const link = Object.assign(document.createElement("a"), { href: url, download: `climate-risk_FY${a.reporting_year}_v${a.version}.csv` });
            link.click();
            URL.revokeObjectURL(url);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <BackLink />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                                FY {a.reporting_year} assessment
                            </h2>
                            <span className="text-headline-md font-normal text-on-surface-variant">v{a.version}</span>
                            <StatusBadge status={a.status} />
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                            {data.company.name} · Ruleset{" "}
                            <span className={data.ruleset.label === "DEV" ? "font-semibold text-[#9a5b00]" : "font-semibold"}>
                                {data.ruleset.label} v{data.ruleset.version}
                            </span>
                            {supersedes && (
                                <>
                                    {" "}
                                    · Supersedes{" "}
                                    <Link href={`/risk-assessment/${supersedes.id}`} className="underline underline-offset-2">
                                        v{supersedes.version}
                                    </Link>
                                </>
                            )}
                        </p>
                        <StatusSteps status={a.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" onClick={download} disabled={exporting}>
                            <MaterialIcon name="download" size="sm" />
                            {exporting ? "Exporting…" : "Export CSV"}
                        </Button>
                        {canAct && a.status === "draft" && (
                            <Button
                                onClick={() => action.mutate(() => submitAssessment(id))}
                                disabled={action.isPending || !a.physical_run_at || !a.transition_run_at}
                                title={!a.physical_run_at || !a.transition_run_at ? "Run the physical and transition steps first" : undefined}>
                                <MaterialIcon name="send" size="sm" />
                                Submit for review
                            </Button>
                        )}
                        {canAct && a.status === "in_review" && (
                            <Button variant="secondary" onClick={() => action.mutate(() => reopenAssessment(id))} disabled={action.isPending}>
                                <MaterialIcon name="undo" size="sm" />
                                Reopen as draft
                            </Button>
                        )}
                        {access.canApprove && !newer && a.status === "in_review" && (
                            <Button onClick={() => action.mutate(() => approveAssessment(id))} disabled={action.isPending}>
                                <MaterialIcon name="verified" size="sm" />
                                Approve and lock
                            </Button>
                        )}
                        {canAct && locked && (
                            <Button
                                onClick={() => action.mutate(async () => router.push(`/risk-assessment/${(await createNewVersion(id)).id}`))}
                                disabled={action.isPending}>
                                <MaterialIcon name="content_copy" size="sm" />
                                Create new version
                            </Button>
                        )}
                    </div>
                </div>
                <ErrorNote error={action.error} />

                <div className="flex flex-wrap items-center justify-end gap-3">
                    {data.history.length > 1 && (
                        <nav aria-label="Versions" className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                            <span className="mr-1">Versions:</span>
                            {data.history.map((h) => (
                                <Link
                                    key={h.id}
                                    href={`/risk-assessment/${h.id}`}
                                    aria-current={h.id === a.id ? "page" : undefined}
                                    className={cn(
                                        "rounded px-1.5 py-0.5",
                                        h.id === a.id ? "bg-on-surface text-white" : "hover:bg-surface-container-high",
                                    )}>
                                    v{h.version}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {locked && (
                    <div className="flex items-center gap-2 rounded-lg border border-secondary/25 bg-secondary/5 px-3 py-2 text-[12px] text-on-surface">
                        <MaterialIcon name="lock" size="sm" className="text-secondary" />
                        Approved by {a.approved_by} on {formatDateTime(a.approved_at)}. This version is locked; any change creates a new version.
                    </div>
                )}
                {newer && (
                    <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-[12px] text-on-surface-variant">
                        <MaterialIcon name="history" size="sm" />
                        This is an older version and is read-only.
                        <Link href={`/risk-assessment/${newer.id}`} className="font-semibold text-on-surface underline underline-offset-2">
                            Open v{newer.version}
                        </Link>
                        to make changes.
                    </div>
                )}
                {a.status === "in_review" && canAct && (
                    <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-[12px] text-on-surface-variant">
                        <MaterialIcon name="rate_review" size="sm" />
                        In review and frozen. {access.canApprove ? "Approve it, or reopen it to make changes." : "An approver signs it off; reopen it to make changes."} Nothing
                        reaches the client until it is approved.
                    </div>
                )}
            </div>

            <div role="tablist" aria-label="Assessment sections" className="flex gap-1 overflow-x-auto border-b border-outline-variant">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        role="tab"
                        type="button"
                        aria-selected={tab === t.key}
                        onClick={() => setPicked(t.key)}
                        className={cn(
                            "-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors cursor-pointer",
                            tab === t.key ? "border-on-surface text-on-surface" : "border-transparent text-on-surface-variant hover:text-on-surface",
                        )}>
                        <MaterialIcon name={t.icon} size="sm" />
                        {t.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel">
                {tab === "setup" && <SetupTab data={data} canEdit={canEdit} />}
                {tab === "physical" && <PhysicalTab data={data} canEdit={canEdit} />}
                {tab === "transition" && <TransitionTab data={data} canEdit={canEdit} />}
                {tab === "report" && <ReportTab data={data} canEdit={canEdit} />}
            </div>
        </div>
    );
}

function BackLink() {
    return (
        <Link href="/risk-assessment" className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant hover:text-on-surface">
            <MaterialIcon name="arrow_back" size="sm" />
            All assessments
        </Link>
    );
}
