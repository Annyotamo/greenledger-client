"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CustomSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    PendingDocumentAttachment,
    SCOPE3_DOCUMENT_TYPE_OPTIONS,
    Scope3DocumentType,
} from "@/lib/scope3/documents/types";
import { cn } from "@/lib/utils/cn";

interface FormDocumentAttachmentFieldProps {
    value: PendingDocumentAttachment | null;
    onChange: (value: PendingDocumentAttachment | null) => void;
    disabled?: boolean;
    className?: string;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function FormDocumentAttachmentField({
    value,
    onChange,
    disabled = false,
    className,
}: FormDocumentAttachmentFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    function handleFile(file: File) {
        onChange({
            file,
            documentType: value?.documentType || Scope3DocumentType.INVOICE,
            documentDate: value?.documentDate || new Date().toISOString().split("T")[0],
            issuedBy: value?.issuedBy || "",
            notes: value?.notes || "",
        });
        setIsExpanded(true);
    }

    function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragOver(true);
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleRemove() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onChange(null);
        setIsExpanded(false);
    }

    return (
        <div className={cn("space-y-3 font-sans", className)}>
            <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-primary">
                    Supporting Document / Audit Evidence <span className="font-normal text-slate-500">(Optional)</span>
                </label>
                {value && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
                        <MaterialIcon name={isExpanded ? "expand_less" : "tune"} size="xs" />
                        <span>{isExpanded ? "Hide Metadata" : "Edit Metadata"}</span>
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                disabled={disabled}
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                onChange={handleFileInputChange}
            />

            {!value ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all duration-200",
                        isDragOver
                            ? "border-secondary bg-secondary/10"
                            : "border-outline-variant/80 bg-surface-container-low hover:border-secondary hover:bg-secondary/5",
                        disabled && "opacity-60 cursor-not-allowed",
                    )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs text-secondary mb-2">
                        <MaterialIcon name="cloud_upload" size="md" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                        Drop supporting document here, or <span className="text-secondary font-bold">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Invoices, delivery notes, receipts, weighbridge slips (PDF, PNG, JPG, XLSX up to 50MB)
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-on-secondary">
                                <MaterialIcon name="description" size="sm" />
                            </div>
                            <div className="min-w-0 text-left">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                    {value.file.name}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium tabular-nums">
                                    {formatBytes(value.file.size)} • Type:{" "}
                                    <span className="font-semibold text-secondary uppercase">
                                        {value.documentType.replace(/_/g, " ")}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                                title="Change file">
                                <MaterialIcon name="sync" size="xs" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={handleRemove}
                                className="rounded-lg p-1.5 text-error hover:bg-error-container/20 transition-colors"
                                title="Remove file">
                                <MaterialIcon name="delete" size="xs" />
                            </button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="pt-2.5 border-t border-secondary/20 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Document Classification
                                </label>
                                <CustomSelect
                                    options={SCOPE3_DOCUMENT_TYPE_OPTIONS}
                                    value={value.documentType}
                                    onChange={(val) =>
                                        onChange({
                                            ...value,
                                            documentType: (val as Scope3DocumentType) || Scope3DocumentType.INVOICE,
                                        })
                                    }
                                    placeholder="Select document type..."
                                    variant="form"
                                    className="text-xs"
                                    isDisabled={disabled}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Invoice / Document Date
                                </label>
                                <Input
                                    type="date"
                                    value={value.documentDate || ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            documentDate: e.target.value,
                                        })
                                    }
                                    disabled={disabled}
                                    className="font-sans text-xs bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Issued By (Vendor / Supplier)
                                </label>
                                <Input
                                    type="text"
                                    value={value.issuedBy || ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            issuedBy: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Shell Energy, Tata Steel"
                                    disabled={disabled}
                                    className="font-sans text-xs bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Invoice No. / Audit Reference
                                </label>
                                <Input
                                    type="text"
                                    value={value.notes || ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Inv #INV-2026-904"
                                    disabled={disabled}
                                    className="font-sans text-xs bg-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
