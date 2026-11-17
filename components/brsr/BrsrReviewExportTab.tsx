"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { getBrsrFullReportPdf, getBrsrPrinciple6Pdf } from "@/lib/brsr/api";
import type { BRSRStatus } from "@/lib/brsr/types";

interface BrsrReviewExportTabProps {
    reportingPeriodId: string;
    financialYearLabel: string;
    status: BRSRStatus;
    onSubmitFiling: () => void;
    isSubmitting?: boolean;
}

export function BrsrReviewExportTab({
    reportingPeriodId,
    financialYearLabel,
    status,
    onSubmitFiling,
    isSubmitting = false,
}: BrsrReviewExportTabProps) {
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [isDownloadingFull, setIsDownloadingFull] = useState(false);
    const [isDownloadingP6, setIsDownloadingP6] = useState(false);

    const loadPdfPreview = async () => {
        if (!reportingPeriodId) return;
        setIsLoadingPdf(true);
        setPdfError(null);
        try {
            const blob = await getBrsrFullReportPdf(reportingPeriodId);
            const url = window.URL.createObjectURL(blob);
            setPdfBlobUrl(url);
        } catch (err: any) {
            console.error("Failed to load PDF stream", err);
            setPdfError(err?.message || "Failed to generate live PDF preview.");
        } finally {
            setIsLoadingPdf(false);
        }
    };

    useEffect(() => {
        loadPdfPreview();
        return () => {
            if (pdfBlobUrl) {
                window.URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [reportingPeriodId]);

    const handleDownloadFullReport = async () => {
        setIsDownloadingFull(true);
        try {
            const blob = await getBrsrFullReportPdf(reportingPeriodId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BRSR_Full_Statutory_Report_${financialYearLabel.replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Full PDF download failed", err);
        } finally {
            setIsDownloadingFull(false);
        }
    };

    const handleDownloadPrinciple6 = async () => {
        setIsDownloadingP6(true);
        try {
            const blob = await getBrsrPrinciple6Pdf(reportingPeriodId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BRSR_Principle_6_Environmental_${financialYearLabel.replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Principle 6 PDF download failed", err);
        } finally {
            setIsDownloadingP6(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Strip */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="sm">
                            SEBI BRSR Annexure II • 41-Page Packet
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">Statutory Filing Review</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary font-display mt-1">
                        Master Statutory Filing Review &amp; Live PDF Stream
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={loadPdfPreview}
                        disabled={isLoadingPdf}
                        className="text-xs gap-1.5 shadow-2xs">
                        <MaterialIcon name={isLoadingPdf ? "sync" : "refresh"} size="sm" className={isLoadingPdf ? "animate-spin" : ""} />
                        <span>Refresh Live PDF</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadPrinciple6}
                        disabled={isDownloadingP6}
                        className="text-xs gap-1.5 shadow-2xs">
                        <MaterialIcon name="eco" size="sm" />
                        <span>{isDownloadingP6 ? "Exporting..." : "P6 Environmental PDF"}</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDownloadFullReport}
                        disabled={isDownloadingFull}
                        className="text-xs gap-1.5 shadow-2xs">
                        <MaterialIcon name="download" size="sm" />
                        <span>{isDownloadingFull ? "Generating..." : "Download Master 41-Page PDF"}</span>
                    </Button>
                </div>
            </div>

            {/* Side-by-side or Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 4 Cols: Statutory Filing Checklist & Submission Sign-off */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Checklist Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-4 py-3 bg-surface-container-lowest">
                            <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-wide">
                                Statutory Verification Checklist
                            </h3>
                            <MaterialIcon name="checklist" size="sm" className="text-primary" />
                        </CardHeader>
                        <CardBody className="p-4 space-y-3">
                            <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2">
                                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-primary">Cover Page &amp; Regulatory Notice</p>
                                        <p className="text-[11px] text-on-surface-variant">Conforming to SEBI Annexure II format</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-primary">Section A: General Disclosures (pp. 1–14)</p>
                                        <p className="text-[11px] text-on-surface-variant">CIN, Operations, Gender Diversity &amp; CSR</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-primary">Section B: Management &amp; Process (pp. 15–18)</p>
                                        <p className="text-[11px] text-on-surface-variant">P1–P9 Policy Matrix &amp; Board Governance</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-primary">Section C: Environmental (pp. 19–30)</p>
                                        <p className="text-[11px] text-on-surface-variant">Energy, Water, Air, GHG, Waste &amp; Ecology</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-primary">Section C: Social &amp; Governance (pp. 31–41)</p>
                                        <p className="text-[11px] text-on-surface-variant">Principles 1 to 5, 7, 8 &amp; 9</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Submission Sign-off Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-4 py-3 bg-surface-container-lowest">
                            <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-wide">
                                Filing Status &amp; Sign-off
                            </h3>
                            <Badge variant={status === "submitted" || status === "verified" ? "active" : "neutral"} size="sm">
                                {status.toUpperCase()}
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-4 space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Once verified, submitting the filing locks the draft and prepares the final statutory declaration packet for Board approval and regulatory filing with stock exchanges.
                            </p>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={onSubmitFiling}
                                disabled={isSubmitting || status === "submitted" || status === "verified" || status === "approved"}
                                className="w-full gap-2 text-xs font-semibold justify-center">
                                <MaterialIcon name="verified_user" size="sm" />
                                <span>{status === "submitted" ? "Filing Already Submitted" : isSubmitting ? "Submitting..." : "Submit for Verification"}</span>
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Right 8 Cols: Live PDF Viewer Embed */}
                <div className="lg:col-span-8">
                    <Card className="bg-white shadow-2xs overflow-hidden">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="visibility" size="sm" className="text-primary" />
                                <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-wide">
                                    Official 41-Page PDF Preview (Binary Stream)
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant">SEBI Annexure II Format</span>
                        </CardHeader>
                        <CardBody className="p-0">
                            {isLoadingPdf ? (
                                <div className="flex h-[720px] w-full flex-col items-center justify-center gap-3 bg-slate-50 text-primary">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <p className="font-sans text-xs font-medium text-on-surface-variant">
                                        Rendering 41-page statutory PDF engine stream...
                                    </p>
                                </div>
                            ) : pdfError ? (
                                <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 p-6 text-center bg-slate-50">
                                    <MaterialIcon name="error_outline" size="lg" className="text-error" />
                                    <p className="text-xs font-semibold text-error">{pdfError}</p>
                                    <Button variant="secondary" size="sm" onClick={loadPdfPreview} className="text-xs gap-1">
                                        <MaterialIcon name="refresh" size="xs" />
                                        <span>Retry PDF Generation</span>
                                    </Button>
                                </div>
                            ) : pdfBlobUrl ? (
                                <iframe
                                    src={pdfBlobUrl}
                                    title="SEBI BRSR 41-Page Statutory Report Preview"
                                    className="h-[750px] w-full border-0"
                                />
                            ) : null}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

