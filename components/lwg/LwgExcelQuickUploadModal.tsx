// components/lwg/LwgExcelQuickUploadModal.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { downloadLwgExcelTemplate, uploadLwgExcelFile } from "@/lib/lwg/api";
import { useUploadLwgExcel } from "@/lib/lwg/hooks";
import type { LwgExcelImportSummary } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgExcelQuickUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function emptySubscribe() {
    return () => {};
}

export function LwgExcelQuickUploadModal({
    isOpen,
    onClose,
}: LwgExcelQuickUploadModalProps) {
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    // Prevent body scroll when open
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Keyboard ESC listener
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !isMounted) return null;

    return createPortal(
        <LwgExcelQuickUploadModalContent onClose={onClose} />,
        document.body,
    );
}

function LwgExcelQuickUploadModalContent({ onClose }: { onClose: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [summaryResult, setSummaryResult] = useState<LwgExcelImportSummary | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadMutation = useUploadLwgExcel();

    const handleDownloadTemplate = async () => {
        try {
            setIsDownloadingTemplate(true);
            const blob = await downloadLwgExcelTemplate();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "LWG_Bulk_Back_Data_Template.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to download template", err);
            setUploadError("Unable to download template. Please try again.");
        } finally {
            setIsDownloadingTemplate(false);
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file.name.toLowerCase().endsWith(".xlsx")) {
            setUploadError("Invalid file type. Please upload an Excel workbook (.xlsx).");
            return;
        }
        setUploadError(null);
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploadError(null);
        setSummaryResult(null);

        try {
            const summary = await uploadMutation.mutateAsync(selectedFile);
            setSummaryResult(summary);
        } catch (err) {
            console.error("Excel upload failed", err);
            setUploadError(
                err instanceof Error ? err.message : "Failed to process Excel file.",
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

            <div
                className="relative z-[101] flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-outline-variant bg-white shadow-2xl font-sans overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-modal-title">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <MaterialIcon name="table_chart" size="sm" />
                        </div>
                        <div>
                            <h3 id="upload-modal-title" className="font-display text-base font-bold text-primary">
                                Bulk Excel 24-Month Ingestion
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Ingest historic Production, Energy, and Water records via .xlsx workbook
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                        aria-label="Close dialog">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Body */}
                <div className="gl-dashboard-scroll flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Error Banner */}
                    {uploadError && (
                        <div className="flex items-start gap-3 rounded-lg border border-error/30 bg-error/5 p-4 text-xs text-error">
                            <MaterialIcon name="error" size="sm" className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold uppercase tracking-wider text-[11px]">Upload Failed</p>
                                <p className="mt-0.5">{uploadError}</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Download Template */}
                    <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4 className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
                                    Step 1: Download Template
                                </h4>
                                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                                    Pre-formatted 3-sheet workbook: Production, Energy, and Water.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                onClick={handleDownloadTemplate}
                                disabled={isDownloadingTemplate}
                                className="shrink-0">
                                <MaterialIcon name="download" size="xs" />
                                {isDownloadingTemplate ? "Downloading..." : "Download (.xlsx)"}
                            </Button>
                        </div>
                    </div>

                    {/* Step 2: Drag and drop */}
                    <div>
                        <h4 className="font-sans text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                            Step 2: Upload Filled Workbook
                        </h4>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
                                isDragging
                                    ? "border-emerald-600 bg-emerald-50/50"
                                    : selectedFile
                                    ? "border-emerald-600/60 bg-emerald-50/20"
                                    : "border-outline-variant bg-surface hover:bg-surface-container-low hover:border-primary/50",
                            )}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                            />

                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                                <MaterialIcon name="cloud_upload" size="md" />
                            </div>

                            {selectedFile ? (
                                <div>
                                    <p className="font-sans text-sm font-semibold text-primary">{selectedFile.name}</p>
                                    <p className="font-mono text-xs text-on-surface-variant mt-1">
                                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready to process
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-sans text-sm font-medium text-primary">
                                        Click to browse or drag and drop your workbook here
                                    </p>
                                    <p className="font-sans text-xs text-on-surface-variant mt-1">
                                        Supports Microsoft Excel (.xlsx) files
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results & Error Diagnostic Drawer */}
                    {summaryResult && (
                        <div className="space-y-4 rounded-xl border border-outline-variant bg-surface p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                                    Ingestion Summary
                                </h4>
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                                        summaryResult.success
                                            ? "bg-secondary-container/30 text-on-secondary-container border border-secondary/20"
                                            : "bg-error/10 text-error border border-error/20",
                                    )}>
                                    {summaryResult.totalImported} Imported • {summaryResult.totalFailed} Failed
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-lg bg-white p-3 border border-outline-variant/60">
                                    <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Production</p>
                                    <p className="text-lg font-bold text-primary font-display tabular-nums">
                                        {summaryResult.productionRowsImported}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-3 border border-outline-variant/60">
                                    <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Energy</p>
                                    <p className="text-lg font-bold text-primary font-display tabular-nums">
                                        {summaryResult.energyRowsImported}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-3 border border-outline-variant/60">
                                    <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Water</p>
                                    <p className="text-lg font-bold text-primary font-display tabular-nums">
                                        {summaryResult.waterRowsImported}
                                    </p>
                                </div>
                            </div>

                            {summaryResult.errors.length > 0 && (
                                <div className="space-y-2">
                                    <p className="font-sans text-xs font-semibold text-error">
                                        Row-Level Errors Detected ({summaryResult.errors.length})
                                    </p>
                                    <div className="max-h-48 overflow-y-auto rounded-lg border border-error/20 bg-white">
                                        <table className="w-full text-left text-xs">
                                            <thead className="border-b border-error/10 bg-error/5 text-[11px] uppercase font-semibold text-error">
                                                <tr>
                                                    <th className="p-2">Sheet</th>
                                                    <th className="p-2">Row</th>
                                                    <th className="p-2">Field</th>
                                                    <th className="p-2">Error Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-error/10">
                                                {summaryResult.errors.map((err, idx) => (
                                                    <tr key={`${err.sheetName}-${err.rowNumber}-${err.field}-${idx}`} className="hover:bg-error/5">
                                                        <td className="p-2 font-semibold text-slate-900">{err.sheetName}</td>
                                                        <td className="p-2 font-mono">{err.rowNumber}</td>
                                                        <td className="p-2 font-mono text-slate-700">{err.field}</td>
                                                        <td className="p-2 text-error">{err.errorMessage}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-outline-variant bg-surface px-6 py-4">
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        type="button"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}>
                        <MaterialIcon name="upload" size="xs" />
                        {uploadMutation.isPending ? "Processing Workbook..." : "Upload & Ingest"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
