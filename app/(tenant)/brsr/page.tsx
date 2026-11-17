"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import {
    useBrsrConsolidatedDashboard,
    useBrsrSectionA,
    useBrsrSectionB,
    useBrsrSectionC,
    useSaveBrsrSectionA,
} from "@/lib/brsr/hooks";
import { getBrsrFullReportPdf } from "@/lib/brsr/api";
import { BrsrWorkspaceHeader } from "@/components/brsr/BrsrWorkspaceHeader";
import { BrsrFilingRail, type BrsrSectionKey } from "@/components/brsr/BrsrFilingRail";
import { BrsrOverviewTab } from "@/components/brsr/BrsrOverviewTab";
import { BrsrSectionATab } from "@/components/brsr/BrsrSectionATab";
import { BrsrSectionBTab } from "@/components/brsr/BrsrSectionBTab";
import { BrsrSectionCEnvTab, type EnvSubSection } from "@/components/brsr/BrsrSectionCEnvTab";
import { BrsrSectionCSgTab, type SgPrincipleKey } from "@/components/brsr/BrsrSectionCSgTab";
import { BrsrReviewExportTab } from "@/components/brsr/BrsrReviewExportTab";
import { BrsrLivePdfModal } from "@/components/brsr/BrsrLivePdfModal";
import type { BRSRStatus } from "@/lib/brsr/types";

function BrsrWorkspaceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Reporting Periods
    const { data: periods = [], isLoading: isLoadingPeriods } = useReportingPeriods();

    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    // Auto-select first period when loaded
    useEffect(() => {
        if (!selectedPeriodId && periods.length > 0) {
            const openPeriod = periods.find((p) => p.periodStatus === "open") || periods[0];
            setSelectedPeriodId(openPeriod.id);
        }
    }, [periods, selectedPeriodId]);

    const activePeriod = useMemo(() => {
        return periods.find((p) => p.id === selectedPeriodId) || periods[0] || null;
    }, [periods, selectedPeriodId]);

    const fyLabel = activePeriod?.name || "FY 2024-25";

    // 2. Active Section Navigation
    const sectionParam = searchParams.get("section") as BrsrSectionKey | null;
    const [activeSection, setActiveSection] = useState<BrsrSectionKey>(sectionParam || "overview");

    useEffect(() => {
        if (sectionParam) {
            setActiveSection(sectionParam);
        }
    }, [sectionParam]);

    const handleSelectSection = (key: BrsrSectionKey) => {
        setActiveSection(key);
        router.push(`/brsr?section=${encodeURIComponent(key)}`, { scroll: false });
    };

    // 3. Consolidated Dashboard Query & Section Data
    const dashboardQuery = useBrsrConsolidatedDashboard(selectedPeriodId);
    const sectionAQuery = useBrsrSectionA(selectedPeriodId);
    const sectionBQuery = useBrsrSectionB(selectedPeriodId);
    const sectionCQuery = useBrsrSectionC(selectedPeriodId);

    // 4. Status & Completion calculations
    const status: BRSRStatus =
        sectionAQuery.data?.status ||
        sectionBQuery.data?.status ||
        sectionCQuery.data?.status ||
        "draft";

    const completedMap: Partial<Record<BrsrSectionKey, boolean>> = useMemo(() => {
        const hasSectionA = !!sectionAQuery.data && !sectionAQuery.isLoading;
        const hasSectionB = !!sectionBQuery.data && !sectionBQuery.isLoading;
        const hasSectionC = !!sectionCQuery.data && !sectionCQuery.isLoading;

        return {
            overview: true,
            "section-a-entity": hasSectionA && !!sectionAQuery.data?.entity_details?.cin,
            "section-a-employees": hasSectionA && !!sectionAQuery.data?.employees?.permanent_employees?.total,
            "section-a-csr": hasSectionA && !!sectionAQuery.data?.csr_details,
            "section-b-policy": hasSectionB && (sectionBQuery.data?.policy_matrix?.length ?? 0) > 0,
            "section-b-governance": hasSectionB && !!sectionBQuery.data?.governance_leadership?.director_statement,
            "env-energy": true,
            "env-water": true,
            "env-air": true,
            "env-ghg": true,
            "env-waste": true,
            "env-ecology": true,
            "sg-p1": hasSectionC,
            "sg-p2": hasSectionC,
            "sg-p3": hasSectionC,
            "sg-p4": hasSectionC,
            "sg-p5": hasSectionC,
            "sg-p7": hasSectionC,
            "sg-p8": hasSectionC,
            "sg-p9": hasSectionC,
            "review-export": status === "submitted" || status === "verified",
        };
    }, [sectionAQuery.data, sectionBQuery.data, sectionCQuery.data, sectionAQuery.isLoading, sectionBQuery.isLoading, sectionCQuery.isLoading, status]);

    const totalSectionsCount = 18;
    const completedSectionsCount = Object.values(completedMap).filter(Boolean).length;
    const completionPercentage = Math.min(
        100,
        Math.max(10, Math.round((completedSectionsCount / totalSectionsCount) * 100)),
    );

    // 5. Global Action Handlers
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const saveSectionAMutation = useSaveBrsrSectionA();

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            if (sectionAQuery.data) {
                await saveSectionAMutation.mutateAsync({
                    ...sectionAQuery.data,
                    status: "draft",
                });
            }
            dashboardQuery.refetch();
        } catch (err) {
            console.error("Draft save error", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportMasterPdf = async () => {
        if (!selectedPeriodId) return;
        try {
            const blob = await getBrsrFullReportPdf(selectedPeriodId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BRSR_Full_Statutory_Report_${fyLabel.replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF export failed", err);
        }
    };

    const handleSubmitFiling = async () => {
        if (!window.confirm("Are you sure you want to submit the complete BRSR filing for statutory verification?")) {
            return;
        }
        setIsSubmitting(true);
        try {
            if (sectionAQuery.data) {
                await saveSectionAMutation.mutateAsync({
                    ...sectionAQuery.data,
                    status: "submitted",
                });
            }
            alert("BRSR filing submitted successfully for statutory verification.");
            dashboardQuery.refetch();
            sectionAQuery.refetch();
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine sub-section keys
    const envSubSectionMap: Record<string, EnvSubSection> = {
        "env-energy": "energy",
        "env-water": "water",
        "env-air": "air",
        "env-ghg": "ghg",
        "env-waste": "waste",
        "env-ecology": "ecology",
    };

    const isEnvSection = activeSection.startsWith("env-");
    const isSgSection = activeSection.startsWith("sg-");

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Persistent Header */}
            <BrsrWorkspaceHeader
                periods={periods}
                selectedPeriodId={selectedPeriodId}
                onPeriodChange={(id) => setSelectedPeriodId(id)}
                status={status}
                completionPercentage={completionPercentage}
                completedSectionsCount={completedSectionsCount}
                totalSectionsCount={totalSectionsCount}
                isSaving={isSaving}
                onSaveDraft={handleSaveDraft}
                onOpenPdfPreview={() => setIsPdfModalOpen(true)}
                onExportPdf={handleExportMasterPdf}
                onSubmitFiling={handleSubmitFiling}
                isSubmitting={isSubmitting}
            />

            {/* Two-Tier Layout: Filing Rail + Content Workspace */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Secondary Filing Rail */}
                <BrsrFilingRail
                    activeSection={activeSection}
                    onSelectSection={handleSelectSection}
                    completedMap={completedMap}
                />

                {/* Primary Content Panel */}
                <div className="flex-1 w-full min-w-0">
                    {activeSection === "overview" && (
                        <BrsrOverviewTab
                            dashboardData={dashboardQuery.data ?? null}
                            isLoading={dashboardQuery.isLoading}
                            onNavigateSection={handleSelectSection}
                            onExportPdf={handleExportMasterPdf}
                        />
                    )}

                    {activeSection.startsWith("section-a-") && (
                        <BrsrSectionATab
                            reportingPeriodId={selectedPeriodId}
                            financialYearLabel={fyLabel}
                            initialData={sectionAQuery.data ?? null}
                            initialSubSection={
                                activeSection === "section-a-employees"
                                    ? "employees"
                                    : activeSection === "section-a-csr"
                                    ? "csr"
                                    : "entity"
                            }
                            onSaved={() => {
                                sectionAQuery.refetch();
                                dashboardQuery.refetch();
                            }}
                        />
                    )}

                    {activeSection.startsWith("section-b-") && (
                        <BrsrSectionBTab
                            reportingPeriodId={selectedPeriodId}
                            financialYearLabel={fyLabel}
                            initialData={sectionBQuery.data ?? null}
                            initialSubSection={activeSection === "section-b-governance" ? "governance" : "policy"}
                            onSaved={() => {
                                sectionBQuery.refetch();
                                dashboardQuery.refetch();
                            }}
                        />
                    )}

                    {isEnvSection && (
                        <BrsrSectionCEnvTab
                            reportingPeriod={activePeriod}
                            initialSubSection={envSubSectionMap[activeSection] || "energy"}
                            onSaved={() => {
                                dashboardQuery.refetch();
                            }}
                        />
                    )}

                    {isSgSection && (
                        <BrsrSectionCSgTab
                            reportingPeriodId={selectedPeriodId}
                            financialYearLabel={fyLabel}
                            initialData={sectionCQuery.data ?? null}
                            initialPrinciple={activeSection as SgPrincipleKey}
                            onSaved={() => {
                                sectionCQuery.refetch();
                                dashboardQuery.refetch();
                            }}
                        />
                    )}

                    {activeSection === "review-export" && (
                        <BrsrReviewExportTab
                            reportingPeriodId={selectedPeriodId}
                            financialYearLabel={fyLabel}
                            status={status}
                            onSubmitFiling={handleSubmitFiling}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>

            {/* Quick Live PDF Modal */}
            <BrsrLivePdfModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                reportingPeriodId={selectedPeriodId}
                financialYearLabel={fyLabel}
            />
        </div>
    );
}

export default function BrsrPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-64 w-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="font-mono text-xs text-on-surface-variant">Loading BRSR Filing Engine...</p>
                    </div>
                </div>
            }>
            <BrsrWorkspaceContent />
        </Suspense>
    );
}

