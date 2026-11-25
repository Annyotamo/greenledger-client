// components/lwg/excel/LwgExcelToolsView.tsx
"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { downloadLwgAuditorPack, downloadLwgExcelTemplate } from "@/lib/lwg/api";
import { useUploadLwgExcel } from "@/lib/lwg/hooks";
import type { LwgExcelImportSummary } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

export function LwgExcelToolsView() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [isExportingPack, setIsExportingPack] = useState(false);
    const [importSummary, setImportSummary] = useState<LwgExcelImportSummary | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [packDownloadError, setPackDownloadError] = useState<string | null>(null);

    const uploadMutation = useUploadLwgExcel();

    // 1. Download Blank 3-Sheet Template
    const handleDownloadTemplate = async () => {
        try {
            setErrorMessage(null);
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
            setErrorMessage("Unable to download Excel template. Please try again.");
        } finally {
            setIsDownloadingTemplate(false);
        }
    };

    // 2. Export 6-Sheet Auditor Data Pack
    const handleExportAuditorPack = async () => {
        try {
            setPackDownloadError(null);
            setIsExportingPack(true);
            const { blob, filename } = await downloadLwgAuditorPack();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || "LWG_Auditor_Data_Pack.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to export auditor pack", err);
            setPackDownloadError("Unable to export Auditor Data Pack. Please try again.");
        } finally {
            setIsExportingPack(false);
        }
    };

    // 3. Handle File Drag & Selection
    const handleFileSelect = (file: File) => {
        if (!file.name.toLowerCase().endsWith(".xlsx")) {
            setErrorMessage("Invalid file format. Please upload an Excel workbook (.xlsx).");
            return;
        }
        setErrorMessage(null);
        setSelectedFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    // 4. Submit Bulk Workbook
    const handleUploadWorkbook = async () => {
        if (!selectedFile) return;
        setErrorMessage(null);
        setImportSummary(null);

        try {
            const summary = await uploadMutation.mutateAsync(selectedFile);
            setImportSummary(summary);
            setSelectedFile(null);
        } catch (err) {
            console.error("Failed to import Excel workbook", err);
            setErrorMessage(
                err instanceof Error ? err.message : "Failed to process Excel workbook.",
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Overview Card */}
            <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs shrink-0">
                            <MaterialIcon name="table_view" size="sm" />
                        </div>
                        <div>
                            <h2 className="font-display text-base font-bold text-primary tracking-tight">
                                Excel Bulk Ingestion & Official Auditor Pack
                            </h2>
                            <p className="font-sans text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
                                Seamlessly ingest up to 2 years (24 months) of production, energy, and water back-data in one upload, or generate the official 6-sheet audit compilation pack for your leather accreditation audit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Panel 1: Bulk Ingestion Wizard (Col 7) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card>
                        <CardHeader bordered tone="strip">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <MaterialIcon name="upload_file" size="xs" />
                                </div>
                                <div>
                                    <h3 className="font-display text-sm font-bold text-primary">
                                        Bulk 24-Month Back-Data Ingestion
                                    </h3>
                                    <p className="font-sans text-[11px] text-on-surface-variant">
                                        Fast-track historic data entry across Production, Energy, and Water.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="space-y-5">
                            {/* Step 1: Download Empty Template */}
                            <div className="rounded-xl border border-outline-variant bg-surface-container-low/50 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                                            1
                                        </span>
                                        Download Official Blank Template
                                    </span>
                                    <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] text-on-surface-variant">
                                        3 Sheets
                                    </span>
                                </div>

                                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                                    Pre-formatted workbook with validation headers:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                                    <div className="rounded-lg border border-outline-variant/60 bg-surface p-2 text-center">
                                        <p className="font-bold text-primary">Sheet 1: Production</p>
                                        <p className="text-[10px] text-on-surface-variant">Month, Stage, Material, Area</p>
                                    </div>
                                    <div className="rounded-lg border border-outline-variant/60 bg-surface p-2 text-center">
                                        <p className="font-bold text-primary">Sheet 2: Energy</p>
                                        <p className="text-[10px] text-on-surface-variant">Month, Source, Qty, Unit, Dept</p>
                                    </div>
                                    <div className="rounded-lg border border-outline-variant/60 bg-surface p-2 text-center">
                                        <p className="font-bold text-primary">Sheet 3: Water</p>
                                        <p className="text-[10px] text-on-surface-variant">Month, Source, Volume, Meter ID</p>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleDownloadTemplate}
                                    disabled={isDownloadingTemplate}
                                    className="w-full sm:w-auto">
                                    <MaterialIcon
                                        name={isDownloadingTemplate ? "sync" : "download"}
                                        size="xs"
                                        className={isDownloadingTemplate ? "animate-spin" : ""}
                                    />
                                    <span>
                                        {isDownloadingTemplate
                                            ? "Downloading Template..."
                                            : "Download 3-Sheet Excel Template (.xlsx)"}
                                    </span>
                                </Button>
                            </div>

                            {/* Step 2: Upload Filled Template */}
                            <div className="rounded-xl border border-outline-variant bg-surface-container-low/50 p-4 space-y-3">
                                <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                                        2
                                    </span>
                                    Upload Completed Workbook
                                </span>

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

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                                        isDragging
                                            ? "border-emerald-600 bg-emerald-50/50"
                                            : selectedFile
                                            ? "border-emerald-500 bg-emerald-50/30"
                                            : "border-outline-variant bg-surface hover:border-emerald-500",
                                    )}>
                                    <MaterialIcon
                                        name={selectedFile ? "task_alt" : "cloud_upload"}
                                        size="md"
                                        className={selectedFile ? "text-emerald-600" : "text-on-surface-variant"}
                                    />
                                    {selectedFile ? (
                                        <div>
                                            <p className="font-sans text-xs font-bold text-primary">
                                                {selectedFile.name}
                                            </p>
                                            <p className="font-mono text-[11px] text-on-surface-variant">
                                                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for validation
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-sans text-xs font-semibold text-primary">
                                                Drop your filled workbook here or click to browse
                                            </p>
                                            <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                                                Supports .xlsx workbooks with up to 100 rows per sheet
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {errorMessage && (
                                    <div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                                        <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    {selectedFile && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSelectedFile(null)}
                                            disabled={uploadMutation.isPending}>
                                            Clear File
                                        </Button>
                                    )}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleUploadWorkbook}
                                        disabled={!selectedFile || uploadMutation.isPending}>
                                        <MaterialIcon
                                            name={uploadMutation.isPending ? "sync" : "check_circle"}
                                            size="xs"
                                            className={uploadMutation.isPending ? "animate-spin" : ""}
                                        />
                                        <span>
                                            {uploadMutation.isPending
                                                ? "Validating & Ingesting..."
                                                : "Process & Import Workbook"}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Step 3: Diagnostic Results & Row-Level Error Summary */}
                            {importSummary && (
                                <div className="space-y-4 border-t border-outline-variant/60 pt-4 animate-fade-in">
                                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                                            3
                                        </span>
                                        Ingestion Diagnostic Report
                                    </span>

                                    {/* Success Tile */}
                                    <div
                                        className={cn(
                                            "rounded-xl border p-4 shadow-2xs space-y-2",
                                            importSummary.success
                                                ? "border-emerald-300 bg-emerald-50/80 text-emerald-950"
                                                : "border-amber-300 bg-amber-50/80 text-amber-950",
                                        )}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                <MaterialIcon
                                                    name={importSummary.success ? "check_circle" : "warning"}
                                                    size="sm"
                                                    className={importSummary.success ? "text-emerald-600" : "text-amber-700"}
                                                />
                                                <span>
                                                    {importSummary.success
                                                        ? "Workbook Processed Successfully"
                                                        : "Import Completed with Partial Validation Errors"}
                                                </span>
                                            </div>
                                            <span className="font-mono text-xs font-bold">
                                                {importSummary.totalImported} imported / {importSummary.totalFailed} failed
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
                                            <div className="rounded-lg bg-white/70 p-2 text-center border border-white/60">
                                                <span className="text-[10px] text-on-surface-variant uppercase">Production</span>
                                                <p className="font-bold text-primary">{importSummary.productionRowsImported} rows</p>
                                            </div>
                                            <div className="rounded-lg bg-white/70 p-2 text-center border border-white/60">
                                                <span className="text-[10px] text-on-surface-variant uppercase">Energy</span>
                                                <p className="font-bold text-primary">{importSummary.energyRowsImported} rows</p>
                                            </div>
                                            <div className="rounded-lg bg-white/70 p-2 text-center border border-white/60">
                                                <span className="text-[10px] text-on-surface-variant uppercase">Water</span>
                                                <p className="font-bold text-primary">{importSummary.waterRowsImported} rows</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row-Level Errors Table */}
                                    {importSummary.errors.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                                                    <MaterialIcon name="error" size="xs" />
                                                    {importSummary.errors.length} Row Validation Issues Detected
                                                </span>
                                                <span className="text-on-surface-variant text-[11px]">
                                                    Fix these in Excel and re-upload
                                                </span>
                                            </div>

                                            <div className="rounded-xl border border-rose-200 overflow-hidden">
                                                <table className="w-full text-left text-xs">
                                                    <thead>
                                                        <tr className="border-b border-rose-200 bg-rose-50/70 text-rose-950 font-semibold">
                                                            <th className="py-2 px-3">Sheet</th>
                                                            <th className="py-2 px-3 text-center">Row #</th>
                                                            <th className="py-2 px-3">Field</th>
                                                            <th className="py-2 px-3">Diagnostic Reason</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-rose-100 bg-surface">
                                                        {importSummary.errors.map((err, idx) => (
                                                            <tr key={`${err.sheetName}-${err.rowNumber}-${err.field}-${idx}`} className="hover:bg-rose-50/30">
                                                                <td className="py-2 px-3 font-mono font-bold text-primary">
                                                                    {err.sheetName}
                                                                </td>
                                                                <td className="py-2 px-3 text-center font-mono">
                                                                    {err.rowNumber}
                                                                </td>
                                                                <td className="py-2 px-3 font-mono text-on-surface-variant">
                                                                    {err.field}
                                                                </td>
                                                                <td className="py-2 px-3 text-rose-800 font-medium">
                                                                    {err.errorMessage}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Panel 2: Official Auditor Data Pack Export (Col 5) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="h-full flex flex-col justify-between">
                        <CardHeader bordered tone="strip">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                    <MaterialIcon name="verified" size="xs" />
                                </div>
                                <div>
                                    <h3 className="font-display text-sm font-bold text-primary">
                                        Official Auditor Data Pack Export
                                    </h3>
                                    <p className="font-sans text-[11px] text-on-surface-variant">
                                        Leather Environmental Audit Protocol Issue 7.x Package
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="space-y-5">
                            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                                Generates an official, publication-ready multi-sheet Microsoft Excel workbook formatted per official leather auditor requirements for on-site or digital verification.
                            </p>

                            {/* 6 Official Sheets Overview */}
                            <div className="space-y-2">
                                <span className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                    6 Comprehensive Audit Sheets Included
                                </span>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            1
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Tannery Profile & URN</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Facility metadata, registered stages, effluent setup, and 24-month audit window bounds.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            2
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Executive Audit Summary</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Readiness %, energy/water intensity benchmarks (L12 vs P12), and YoY gains.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            3
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Production 24-Month Throughput</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Raw material inputs (tonnes) and normalized output area in both m² and sq ft.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            4
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Energy 24-Month Breakdown</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Grid electricity, fossil fuels, renewable shares, and normalized Gigajoule (GJ) metrics.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            5
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Water 24-Month Balance</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Borewell extraction, municipal supply, recycling ratio, and flow meter register.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-2.5 text-xs">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                            6
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">Evidence Vault Document Index</p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                Statutory CTO, Haz Waste authorizations, utility invoices, and expiry status logs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {packDownloadError && (
                                <div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                                    <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                                    <span>{packDownloadError}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleExportAuditorPack}
                                    disabled={isExportingPack}
                                    className="w-full">
                                    <MaterialIcon
                                        name={isExportingPack ? "sync" : "download"}
                                        size="sm"
                                        className={isExportingPack ? "animate-spin" : ""}
                                    />
                                    <span>
                                        {isExportingPack
                                            ? "Generating Official Auditor Pack..."
                                            : "Export Official Auditor Pack (.xlsx)"}
                                    </span>
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
