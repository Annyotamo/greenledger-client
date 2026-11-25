// components/lwg/evidence/LwgEvidenceTable.tsx
"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useDeleteLwgEvidence } from "@/lib/lwg/hooks";
import {
    LWG_DOCUMENT_TYPE_LABELS,
    type LwgDocumentType,
    type LwgEvidence,
} from "@/lib/lwg/types";
import { getExpiryStatus } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";
import { LwgEvidenceDrawer } from "./LwgEvidenceDrawer";

interface LwgEvidenceTableProps {
    selectedSection: number | null;
    onSelectSection: (sec: number | null) => void;
    evidenceList: LwgEvidence[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function LwgEvidenceTable({
    selectedSection,
    onSelectSection,
    evidenceList,
    isLoading,
    isError,
    error,
}: LwgEvidenceTableProps) {
    const deleteMutation = useDeleteLwgEvidence();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter evidence records
    const filteredRecords = evidenceList.filter((ev) => {
        if (selectedSection !== null && ev.lwgSection !== selectedSection) return false;
        if (typeFilter !== "all" && ev.documentType !== typeFilter) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchName = ev.fileName.toLowerCase().includes(query);
            const matchNotes = ev.notes?.toLowerCase().includes(query);
            if (!matchName && !matchNotes) return false;
        }
        return true;
    });

    // Compute stats
    let totalStatutoryPermits = 0;
    let expiringCount = 0;
    let expiredCount = 0;

    evidenceList.forEach((ev) => {
        if (
            ev.documentType === "consent_to_operate" ||
            ev.documentType === "hazardous_waste_authorisation"
        ) {
            totalStatutoryPermits++;
        }
        if (ev.expiryDate) {
            const exp = getExpiryStatus(ev.expiryDate);
            if (exp.status === "expired") expiredCount++;
            else if (exp.status === "warning") expiringCount++;
        }
    });

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteMutation.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Failed to delete evidence", err);
        } finally {
            setDeletingId(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return "—";
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (mime: string, name: string) => {
        const lowerName = name.toLowerCase();
        if (mime.includes("pdf") || lowerName.endsWith(".pdf")) return "picture_as_pdf";
        if (mime.includes("image") || lowerName.match(/\.(jpg|jpeg|png|webp)$/)) return "image";
        if (lowerName.match(/\.(xlsx|xls|csv)$/)) return "table_view";
        return "description";
    };

    return (
        <div className="space-y-4">
            {/* Top Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3 sm:p-3.5 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Vaulted Documents
                    </span>
                    <p className="font-mono text-xl font-bold text-primary mt-0.5 tabular-nums">
                        {evidenceList.length}
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3 sm:p-3.5 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Statutory Permits
                    </span>
                    <p className="font-mono text-xl font-bold text-emerald-800 mt-0.5 tabular-nums">
                        {totalStatutoryPermits}
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3 sm:p-3.5 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Expiring (&lt; 60 Days)
                    </span>
                    <p className="font-mono text-xl font-bold text-amber-700 mt-0.5 tabular-nums">
                        {expiringCount}
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3 sm:p-3.5 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Expired Permits
                    </span>
                    <p className="font-mono text-xl font-bold text-rose-600 mt-0.5 tabular-nums">
                        {expiredCount}
                    </p>
                </div>
            </div>

            {/* Master Table Card */}
            <Card className="overflow-hidden">
                <CardHeader bordered tone="strip">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold tracking-tight text-primary">
                                {selectedSection !== null
                                    ? `Section ${selectedSection} Documents`
                                    : "All Protocol Evidence"}
                            </span>
                            <span className="rounded-md bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
                                {filteredRecords.length} files
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search documents..."
                                    className="rounded-lg border border-outline-variant bg-surface pl-7 pr-2.5 py-1 text-xs text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-36 sm:w-44"
                                />
                                <MaterialIcon
                                    name="search"
                                    size="xs"
                                    className="absolute left-2 top-2 text-on-surface-variant/60"
                                />
                            </div>

                            {/* Type filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-emerald-600">
                                <option value="all">All Types</option>
                                <option value="consent_to_operate">CTO Air/Water</option>
                                <option value="hazardous_waste_authorisation">Haz Waste</option>
                                <option value="electricity_bill">Electricity Bills</option>
                                <option value="fuel_invoice">Fuel Invoices</option>
                                <option value="meter_photo">Meter Photos</option>
                                <option value="lab_report">Lab Reports</option>
                            </select>

                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsDrawerOpen(true)}>
                                <MaterialIcon name="upload_file" size="xs" />
                                <span>Vault File</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    {/* Error message */}
                    {isError && (
                        <div className="m-4 flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>Failed to load evidence records: {error?.message}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                    <th className="py-2.5 px-4">Document File Name</th>
                                    <th className="py-2.5 px-4">Section</th>
                                    <th className="py-2.5 px-4">Type</th>
                                    <th className="py-2.5 px-4">Covered Period</th>
                                    <th className="py-2.5 px-4">Expiry Status</th>
                                    <th className="py-2.5 px-4 text-right">Size</th>
                                    <th className="py-2.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="py-3 px-4"><div className="h-4 w-40 rounded bg-surface-container-high" /></td>
                                            <td className="py-3 px-4"><div className="h-4 w-16 rounded bg-surface-container-high" /></td>
                                            <td className="py-3 px-4"><div className="h-4 w-28 rounded bg-surface-container-high" /></td>
                                            <td className="py-3 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MaterialIcon name="folder_open" size="lg" className="text-on-surface-variant/40" />
                                                <p className="font-semibold text-primary">No evidence documents found</p>
                                                <p className="text-xs text-on-surface-variant max-w-sm">
                                                    {selectedSection !== null
                                                        ? `No files uploaded for Section ${selectedSection}. Upload operating permits or test reports now.`
                                                        : "Your evidence vault is empty. Upload documents or attach them during monthly energy/water logging."}
                                                </p>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setIsDrawerOpen(true)}
                                                    className="mt-2">
                                                    <MaterialIcon name="upload" size="xs" />
                                                    Upload Document
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((ev) => {
                                        const expInfo = ev.expiryDate ? getExpiryStatus(ev.expiryDate) : null;

                                        return (
                                            <tr key={ev.id} className="hover:bg-surface-container-lowest/70 transition-colors">
                                                {/* File Name */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary border border-outline-variant/60">
                                                            <MaterialIcon
                                                                name={getFileIcon(ev.mimeType, ev.fileName)}
                                                                size="xs"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-primary truncate max-w-xs" title={ev.fileName}>
                                                                {ev.fileName}
                                                            </p>
                                                            {ev.notes && (
                                                                <p className="font-sans text-[11px] text-on-surface-variant truncate max-w-xs">
                                                                    {ev.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Section Badge */}
                                                <td className="py-3 px-4">
                                                    <span className="rounded-md bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                                                        Sec {ev.lwgSection}
                                                    </span>
                                                </td>

                                                {/* Type */}
                                                <td className="py-3 px-4 text-on-surface-variant">
                                                    {LWG_DOCUMENT_TYPE_LABELS[ev.documentType] || ev.documentType}
                                                </td>

                                                {/* Period */}
                                                <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant">
                                                    {ev.periodFrom && ev.periodTo
                                                        ? `${ev.periodFrom} to ${ev.periodTo}`
                                                        : ev.periodFrom || "—"}
                                                </td>

                                                {/* Expiry Countdown Alert */}
                                                <td className="py-3 px-4">
                                                    {expInfo ? (
                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border",
                                                                expInfo.status === "expired"
                                                                    ? "bg-rose-50 text-rose-700 border-rose-300"
                                                                    : expInfo.status === "warning"
                                                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                                                    : "bg-emerald-50 text-emerald-800 border-emerald-200",
                                                            )}>
                                                            <MaterialIcon
                                                                name={
                                                                    expInfo.status === "expired"
                                                                        ? "error"
                                                                        : expInfo.status === "warning"
                                                                        ? "warning"
                                                                        : "check_circle"
                                                                }
                                                                size="xs"
                                                            />
                                                            <span>
                                                                {ev.expiryDate} ({expInfo.label})
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-on-surface-variant/50">—</span>
                                                    )}
                                                </td>

                                                {/* File Size */}
                                                <td className="py-3 px-4 text-right font-mono text-[11px] text-on-surface-variant">
                                                    {formatFileSize(ev.fileSizeBytes)}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-4 text-right">
                                                    {confirmDeleteId === ev.id ? (
                                                        <div className="flex items-center justify-end gap-1.5 animate-fade-in">
                                                            <span className="text-[11px] text-error font-medium">Delete?</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(ev.id)}
                                                                disabled={deletingId === ev.id}
                                                                className="rounded px-2 py-1 text-[11px] font-bold bg-error text-white hover:bg-error/90 transition-colors">
                                                                {deletingId === ev.id ? "..." : "Yes"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="rounded px-2 py-1 text-[11px] font-medium bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors">
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* Download / Open Link */}
                                                            {ev.fileKey && (
                                                                <a
                                                                    href={ev.fileKey}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                                                                    title="Open / Download File">
                                                                    <MaterialIcon name="download" size="xs" />
                                                                </a>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmDeleteId(ev.id)}
                                                                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                                                                title="Delete file">
                                                                <MaterialIcon name="delete" size="xs" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Evidence Upload Drawer */}
            <LwgEvidenceDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                initialSection={selectedSection || undefined}
            />
        </div>
    );
}
