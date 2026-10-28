"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CustomSelect } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
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
    defaultDate?: string;
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
    defaultDate,
    className,
}: FormDocumentAttachmentFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const initialDate = defaultDate || new Date().toISOString().split("T")[0];

    const [docType, setDocType] = useState<string>(value?.documentType || Scope3DocumentType.INVOICE);
    const [docDate, setDocDate] = useState<string>(value?.documentDate || initialDate);
    const [issuedBy, setIssuedBy] = useState<string>(value?.issuedBy || "");
    const [notes, setNotes] = useState<string>(value?.notes || "");

    // Sync local state if an existing attachment is passed in or modified externally
    useEffect(() => {
        if (value) {
            if (value.documentType) setDocType(value.documentType);
            if (value.documentDate) setDocDate(value.documentDate);
            if (value.issuedBy !== undefined) setIssuedBy(value.issuedBy || "");
            if (value.notes !== undefined) setNotes(value.notes || "");
        }
    }, [value]);

    // Keep docDate in sync with defaultDate if the user hasn't explicitly set another date and no file is chosen
    useEffect(() => {
        if (!value && defaultDate) {
            setDocDate(defaultDate);
        }
    }, [defaultDate, value]);

    function handleFile(file: File) {
        onChange({
            file,
            documentType: docType || Scope3DocumentType.INVOICE,
            documentDate: docDate || initialDate,
            issuedBy,
            notes,
        });
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
    }

    function handleTypeChange(val: string) {
        const nextType = val || Scope3DocumentType.INVOICE;
        setDocType(nextType);
        if (value?.file) {
            onChange({
                ...value,
                documentType: nextType,
            });
        }
    }

    function handleDateChange(val: string) {
        setDocDate(val);
        if (value?.file) {
            onChange({
                ...value,
                documentDate: val,
            });
        }
    }

    function handleIssuedByChange(val: string) {
        setIssuedBy(val);
        if (value?.file) {
            onChange({
                ...value,
                issuedBy: val,
            });
        }
    }

    function handleNotesChange(val: string) {
        setNotes(val);
        if (value?.file) {
            onChange({
                ...value,
                notes: val,
            });
        }
    }

    return (
        <div className={cn("rounded-xl border border-outline-variant/60 bg-surface-container-low/40 p-4 space-y-3.5 font-sans", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/15 text-secondary">
                        <MaterialIcon name="attach_file" size="xs" />
                    </span>
                    <div>
                        <h5 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
                            Supporting Document / Audit Evidence
                        </h5>
                        <p className="font-sans text-[11px] text-on-surface-variant">
                            Attach invoice, delivery challan, weighbridge slip, or lab report with document date &amp; classification
                        </p>
                    </div>
                </div>

                {value?.file && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={disabled}
                        className="flex items-center gap-1 text-[11px] font-semibold text-error hover:underline transition-colors cursor-pointer">
                        <MaterialIcon name="delete" size="xs" />
                        <span>Remove File</span>
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                disabled={disabled}
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx"
                onChange={handleFileInputChange}
            />

            {/* File Drag & Drop or Active Attachment Card */}
            {!value?.file ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all duration-200 bg-white",
                        isDragOver
                            ? "border-secondary bg-secondary/10"
                            : "border-outline-variant/80 hover:border-secondary hover:bg-secondary/5",
                        disabled && "opacity-60 cursor-not-allowed",
                    )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high shadow-xs text-secondary mb-1.5">
                        <MaterialIcon name="cloud_upload" size="md" />
                    </div>
                    <p className="text-xs font-semibold text-primary">
                        Click to browse or drag &amp; drop document
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                        PDF, PNG, JPG, XLSX, CSV up to 50MB (Optional audit attachment)
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-secondary/30 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                            <MaterialIcon name="description" size="sm" />
                        </div>
                        <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-primary truncate max-w-xs sm:max-w-md" title={value.file.name}>
                                {value.file.name}
                            </p>
                            <p className="text-[11px] text-on-surface-variant font-medium tabular-nums">
                                {formatBytes(value.file.size)} • Ready to upload with entry
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer shadow-xs shrink-0">
                        <MaterialIcon name="sync" size="xs" />
                        <span>Change File</span>
                    </button>
                </div>
            )}

            {/* Document Metadata Form (Always Visible and Cleanly Organized) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-outline-variant/30 text-left">
                {/* Document Type Dropdown */}
                <div>
                    <label className="block font-sans text-xs font-semibold text-primary mb-1">
                        Document Type <span className="text-error">*</span>
                    </label>
                    <CustomSelect
                        options={SCOPE3_DOCUMENT_TYPE_OPTIONS}
                        value={docType}
                        onChange={handleTypeChange}
                        placeholder="Select document classification..."
                        className="font-sans text-xs bg-white"
                        isDisabled={disabled}
                    />
                </div>

                {/* Document Date Picker */}
                <div>
                    <label className="block font-sans text-xs font-semibold text-primary mb-1">
                        Document / Invoice Date
                    </label>
                    <DatePicker
                        value={docDate}
                        onChange={handleDateChange}
                        placeholder="YYYY-MM-DD"
                        className="font-sans text-xs bg-white"
                    />
                </div>

                {/* Issued By Field */}
                <div>
                    <label className="block font-sans text-xs font-semibold text-primary mb-1">
                        Issued By <span className="font-normal text-[11px] text-on-surface-variant">(Vendor / Supplier / Issuer)</span>
                    </label>
                    <Input
                        type="text"
                        value={issuedBy}
                        onChange={(e) => handleIssuedByChange(e.target.value)}
                        placeholder="e.g. Shell Energy, Tata Steel"
                        disabled={disabled}
                        className="font-sans text-xs bg-white"
                    />
                </div>

                {/* Document Notes / Reference Field */}
                <div>
                    <label className="block font-sans text-xs font-semibold text-primary mb-1">
                        Document / Invoice Reference <span className="font-normal text-[11px] text-on-surface-variant">(Optional)</span>
                    </label>
                    <Input
                        type="text"
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="e.g. Inv #INV-2026-904, PO #88921"
                        disabled={disabled}
                        className="font-sans text-xs bg-white"
                    />
                </div>
            </div>
        </div>
    );
}
