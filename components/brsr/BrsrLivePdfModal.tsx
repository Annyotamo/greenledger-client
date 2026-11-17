"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { getBrsrFullReportPdf } from "@/lib/brsr/api";

interface BrsrLivePdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportingPeriodId: string;
    financialYearLabel: string;
}

export function BrsrLivePdfModal({
    isOpen,
    onClose,
    reportingPeriodId,
    financialYearLabel,
}: BrsrLivePdfModalProps) {
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !reportingPeriodId) return;

        let active = true;
        setIsLoading(true);
        setError(null);

        (async () => {
            try {
                const blob = await getBrsrFullReportPdf(reportingPeriodId);
                if (active) {
                    const url = window.URL.createObjectURL(blob);
                    setPdfBlobUrl(url);
                }
            } catch (err: any) {
                if (active) {
                    setError(err?.message || "Failed to generate live PDF preview.");
                }
            } finally {
                if (active) setIsLoading(false);
            }
        })();

        return () => {
            active = false;
            if (pdfBlobUrl) {
                window.URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [isOpen, reportingPeriodId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-outline-variant">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container-lowest">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MaterialIcon name="picture_as_pdf" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Live PDF Preview • SEBI BRSR Annexure II (41-Page Packet)
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Reporting Period: {financialYearLabel}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {pdfBlobUrl && (
                            <a
                                href={pdfBlobUrl}
                                download={`BRSR_Statutory_Report_${financialYearLabel.replace(/\s+/g, "_")}.pdf`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors shadow-2xs">
                                <MaterialIcon name="download" size="xs" />
                                <span>Download</span>
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface cursor-pointer"
                            aria-label="Close modal">
                            <MaterialIcon name="close" size="sm" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Body */}
                <div className="flex-1 bg-slate-100 relative">
                    {isLoading ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-primary">
                            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                            <p className="font-sans text-xs font-medium text-on-surface-variant">
                                Generating 41-page statutory report binary stream...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                            <MaterialIcon name="error_outline" size="lg" className="text-error" />
                            <p className="text-xs font-semibold text-error">{error}</p>
                            <Button variant="secondary" size="sm" onClick={() => onClose()} className="text-xs">
                                Close
                            </Button>
                        </div>
                    ) : pdfBlobUrl ? (
                        <iframe
                            src={pdfBlobUrl}
                            title="SEBI BRSR Live Report Preview"
                            className="h-full w-full border-0"
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

