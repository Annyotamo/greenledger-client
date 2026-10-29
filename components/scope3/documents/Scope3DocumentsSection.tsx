"use client";

import { useState, useRef } from "react";
import { isAxiosError } from "axios";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect } from "@/components/ui/select";
import {
    useScope3Documents,
    useUploadScope3Document,
    useDeleteScope3Document,
} from "@/lib/scope3/documents/hooks";
import {
    downloadScope3Document,
    openScope3DocumentView,
} from "@/lib/scope3/documents/api";
import {
    formatScope3CategoryLabel,
    formatScope3DocumentType,
    normalizeScope3Category,
    SCOPE3_DOCUMENT_TYPE_OPTIONS,
    Scope3Document,
    Scope3DocumentType,
} from "@/lib/scope3/documents/types";

interface Scope3DocumentsSectionProps {
    category: string | number;
    activityId: string;
    activityTitle?: string;
    readOnly?: boolean;
}

export function Scope3DocumentsSection({
    category,
    activityId,
    activityTitle,
    readOnly = false,
}: Scope3DocumentsSectionProps) {
    const normalizedCategory = normalizeScope3Category(category);
    const { data: documents = [], isLoading, refetch } = useScope3Documents(
        normalizedCategory,
        activityId,
    );
    const uploadMutation = useUploadScope3Document(normalizedCategory, activityId);
    const deleteMutation = useDeleteScope3Document(normalizedCategory, activityId);

    // Form state
    const [isUploadingOpen, setIsUploadingOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState("");
    const [documentType, setDocumentType] = useState<string>(Scope3DocumentType.INVOICE_BILL);
    const [documentDate, setDocumentDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [issuedBy, setIssuedBy] = useState("");
    const [notes, setNotes] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!documentName) {
                setDocumentName(file.name);
            }
            setFormError(null);
        }
    }

    function resetUploadForm() {
        setSelectedFile(null);
        setDocumentName("");
        setDocumentType(Scope3DocumentType.INVOICE_BILL);
        setDocumentDate(new Date().toISOString().split("T")[0]);
        setIssuedBy("");
        setNotes("");
        setFormError(null);
        setIsUploadingOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleUploadSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedFile) {
            setFormError("Please select a file to upload as supporting evidence.");
            return;
        }

        setFormError(null);
        try {
            await uploadMutation.mutateAsync({
                file: selectedFile,
                document_name: documentName.trim() || selectedFile.name,
                document_type: documentType,
                document_date: documentDate || undefined,
                issued_by: issuedBy.trim() || undefined,
                notes: notes.trim() || undefined,
            });

            resetUploadForm();
            refetch();
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const code = err.response?.data?.error?.error_code || err.response?.data?.error_code;
                if (code === "SCOPE3_DOCUMENT_ACTIVITY_NOT_FOUND") {
                    setFormError("Activity record not found in this category. Verify tenant and category assignment.");
                    return;
                }
                if (code === "SCOPE3_DOCUMENT_SOURCE_REQUIRED") {
                    setFormError("A binary file attachment is required for upload.");
                    return;
                }
                const msg = err.response?.data?.error?.message || err.response?.data?.message;
                if (msg) {
                    setFormError(msg);
                    return;
                }
            }
            setFormError(err instanceof Error ? err.message : "Failed to upload document.");
        }
    }

    async function handleDeleteDoc(doc: Scope3Document) {
        if (!confirm(`Are you sure you want to remove the document "${doc.documentName}"?`)) {
            return;
        }

        setDeletingId(doc.id);
        try {
            await deleteMutation.mutateAsync(doc.id);
            refetch();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to delete document.");
        } finally {
            setDeletingId(null);
        }
    }

    function getFileIcon(extension: string) {
        const ext = extension.toLowerCase();
        if (ext.includes("pdf")) return { icon: "picture_as_pdf", color: "text-red-500 bg-red-500/10 border-red-500/20" };
        if (ext.includes("xls") || ext.includes("csv")) return { icon: "table_view", color: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20" };
        if (ext.includes("jpg") || ext.includes("png") || ext.includes("jpeg")) return { icon: "image", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
        return { icon: "description", color: "text-primary bg-primary/10 border-primary/20" };
    }

    return (
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/60 pb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary text-xs">
                            <MaterialIcon name="attach_file" size="xs" />
                        </span>
                        <h4 className="font-display text-sm font-bold tracking-tight text-primary">
                            Attached Supporting Documents ({documents.length})
                        </h4>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                        Invoices, delivery notes, meter readings &amp; audit evidence ({formatScope3CategoryLabel(category)})
                    </p>
                </div>

                {!readOnly && (
                    <Button
                        type="button"
                        variant={isUploadingOpen ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => setIsUploadingOpen((prev) => !prev)}
                        className="gap-1.5 h-8 text-xs font-semibold">
                        <MaterialIcon name={isUploadingOpen ? "close" : "add"} size="xs" />
                        <span>{isUploadingOpen ? "Cancel Upload" : "Upload Document"}</span>
                    </Button>
                )}
            </div>

            {/* Inline Upload Drawer / Form */}
            {isUploadingOpen && !readOnly && (
                <form
                    onSubmit={handleUploadSubmit}
                    className="rounded-xl border border-secondary/30 bg-surface-container-low/70 p-4 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-secondary">
                            Attach New Scope 3 Evidence
                        </span>
                        {activityTitle && (
                            <span className="font-sans text-[11px] text-on-surface-variant truncate max-w-xs">
                                For: {activityTitle}
                            </span>
                        )}
                    </div>

                    {formError && (
                        <div className="flex items-center gap-2 rounded-lg bg-error-container/20 border border-error/30 p-2.5 text-xs text-error font-sans font-medium">
                            <MaterialIcon name="error" size="xs" />
                            <span>{formError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* File Selection Box */}
                        <div className="sm:col-span-2">
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                File Attachment <span className="text-error">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx"
                                    className="hidden"
                                    id={`scope3-file-input-${activityId}`}
                                />
                                <label
                                    htmlFor={`scope3-file-input-${activityId}`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer shadow-xs">
                                    <MaterialIcon name="cloud_upload" size="xs" className="text-secondary" />
                                    <span>Choose File...</span>
                                </label>
                                {selectedFile ? (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-sans text-xs font-semibold text-primary truncate max-w-xs">
                                            {selectedFile.name}
                                        </span>
                                        <span className="rounded bg-slate-200 px-1.5 py-0.5 font-sans text-[10px] text-slate-700 tabular-nums shrink-0">
                                            {(selectedFile.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-sans text-xs text-on-surface-variant italic">
                                        No file chosen yet (PDF, PNG, JPG, XLSX up to 25MB)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Document Name / Title */}
                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Document Title
                            </label>
                            <Input
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                placeholder="e.g. Shell_Fuel_Invoice_May2026.pdf"
                                className="font-sans text-xs"
                            />
                        </div>

                        {/* Document Type Dropdown */}
                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Document Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={SCOPE3_DOCUMENT_TYPE_OPTIONS}
                                value={documentType}
                                onChange={(val) => setDocumentType(val)}
                                placeholder="Select document classification..."
                                className="font-sans text-xs"
                            />
                        </div>

                        {/* Document Date */}
                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Document / Invoice Date
                            </label>
                            <DatePicker
                                value={documentDate}
                                onChange={(val) => setDocumentDate(val)}
                                className="font-sans text-xs"
                            />
                        </div>

                        {/* Issued By */}
                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Issued By (Vendor / Issuer / Auditor)
                            </label>
                            <Input
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)}
                                placeholder="e.g. Shell Energy, Tata Steel, Bureau Veritas"
                                className="font-sans text-xs"
                            />
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Audit Notes / Cross-Reference
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Enter PO reference, invoice voucher number, or calculation basis..."
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={resetUploadForm}
                            disabled={uploadMutation.isPending}
                            className="h-8 text-xs">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={uploadMutation.isPending || !selectedFile}
                            className="gap-1.5 h-8 text-xs">
                            <MaterialIcon name="cloud_upload" size="xs" />
                            <span>{uploadMutation.isPending ? "Uploading..." : "Save Document"}</span>
                        </Button>
                    </div>
                </form>
            )}

            {/* Documents List */}
            {isLoading ? (
                <div className="py-6 text-center font-sans text-xs text-on-surface-variant italic animate-pulse">
                    Syncing attached documents...
                </div>
            ) : documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {documents.map((doc) => {
                        const style = getFileIcon(doc.fileExtension || doc.fileName);
                        const isDeleting = deletingId === doc.id;

                        return (
                            <div
                                key={doc.id}
                                className="rounded-xl border border-outline-variant/70 bg-surface-container-lowest p-3.5 flex flex-col justify-between gap-3 hover:border-outline-variant transition-colors shadow-xs">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${style.color}`}>
                                        <MaterialIcon name={style.icon} size="sm" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="font-sans text-xs font-bold text-primary truncate"
                                            title={doc.documentName}>
                                            {doc.documentName}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                            <span className="rounded bg-secondary/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">
                                                {formatScope3DocumentType(doc.documentType)}
                                            </span>

                                            {doc.documentDate && (
                                                <span className="font-sans text-[10px] text-on-surface-variant tabular-nums">
                                                    • {doc.documentDate}
                                                </span>
                                            )}

                                            {doc.issuedBy && (
                                                <span className="font-sans text-[10px] text-on-surface-variant truncate max-w-[120px]">
                                                    • {doc.issuedBy}
                                                </span>
                                            )}
                                        </div>

                                        {doc.notes && (
                                            <p className="font-sans text-[11px] text-on-surface-variant/80 mt-1 line-clamp-1 italic">
                                                &quot;{doc.notes}&quot;
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="flex items-center justify-end gap-1.5 border-t border-outline-variant/30 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => openScope3DocumentView(doc, category, activityId)}
                                        className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant bg-white text-[11px] font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer shadow-xs"
                                        title="View in browser">
                                        <MaterialIcon name="visibility" size="xs" className="text-secondary" />
                                        <span>View</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => downloadScope3Document(doc, category, activityId)}
                                        className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant bg-white text-[11px] font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer shadow-xs"
                                        title="Download document">
                                        <MaterialIcon name="download" size="xs" />
                                        <span>Download</span>
                                    </button>

                                    {!readOnly && (
                                        <button
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={() => handleDeleteDoc(doc)}
                                            className="flex items-center justify-center h-6 w-6 rounded text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer ml-1"
                                            title="Delete document">
                                            <MaterialIcon name="delete" size="xs" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-6 text-center rounded-xl border border-dashed border-outline-variant/80 bg-surface-container-low/40 px-4 space-y-1">
                    <MaterialIcon name="folder_open" size="md" className="text-on-surface-variant/60 mx-auto" />
                    <p className="font-sans text-xs font-semibold text-primary">
                        No supporting evidence attached
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant max-w-sm mx-auto">
                        Attach invoices, weighbridge slips, supplier utility bills, or third-party audits to support this Scope 3 emission activity.
                    </p>
                </div>
            )}
        </section>
    );
}

