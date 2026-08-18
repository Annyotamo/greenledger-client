"use client";

import { useState, useRef, DragEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { uploadS3File } from "@/lib/activity/api";

const SOURCE_TYPE_OPTIONS = [
    { value: "", label: "Select Source Type..." },
    { value: "log_book", label: "Log Book" },
    { value: "bills", label: "Bills / Invoices" },
    { value: "listing", label: "Listing / Manifest" },
    { value: "lab_report", label: "Lab Report" },
    { value: "others", label: "Others" },
];

type BrsrDocumentUploadSectionProps = {
    reportNumber?: string;
    onReportNumberChange?: (val: string) => void;
    sourceType?: string;
    onSourceTypeChange?: (val: string) => void;
    title?: string;
};

export function BrsrDocumentUploadSection({
    reportNumber = "",
    onReportNumberChange,
    sourceType: initialSourceType = "",
    onSourceTypeChange,
    title = "Source Document & Verification",
}: BrsrDocumentUploadSectionProps) {
    const [sourceType, setSourceType] = useState<string>(initialSourceType);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFileUpload = async (file: File) => {
        setSelectedFile(file);
        setUploadError(null);
        setIsSuccess(false);
        setIsUploading(true);

        try {
            await uploadS3File(file);
            setUploadedFileName(file.name);
            setIsSuccess(true);
        } catch (err) {
            console.error("BRSR document upload error:", err);
            setUploadError(err instanceof Error ? err.message : "Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFileUpload(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFileUpload(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadedFileName(null);
        setIsSuccess(false);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-t border-outline-variant/60 pt-4 space-y-3">
            <div className="flex items-center gap-2">
                <MaterialIcon name="verified_user" size="sm" className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                    {title}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-start">
                {/* Report Number / Test Report ID */}
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant block">
                        Test Report / Verification No.
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. TR-2025-STACK-01"
                        value={reportNumber}
                        onChange={(e) => onReportNumberChange?.(e.target.value)}
                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    />
                </div>

                {/* Source Type Dropdown */}
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant block">
                        Source Document Type
                    </label>
                    <select
                        value={sourceType}
                        onChange={(e) => {
                            setSourceType(e.target.value);
                            onSourceTypeChange?.(e.target.value);
                        }}
                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs">
                        {SOURCE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Document Upload Input & Dropzone */}
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant block">
                        Supporting Document File
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {isSuccess && uploadedFileName ? (
                        <div className="flex h-8.5 items-center justify-between rounded-lg border border-secondary/40 bg-secondary/10 px-2.5 text-[11px]">
                            <div className="flex items-center gap-1.5 text-secondary font-medium truncate max-w-[80%]">
                                <MaterialIcon name="check_circle" size="sm" className="text-secondary shrink-0 !text-[14px]" />
                                <span className="truncate">{uploadedFileName}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="text-on-surface-variant hover:text-error text-[10px] font-semibold underline shrink-0 cursor-pointer">
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className={`w-full flex h-8.5 items-center justify-center gap-1.5 rounded-lg border border-dashed px-2.5 text-[11px] font-medium transition duration-150 cursor-pointer ${
                                isDragging
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-outline-variant bg-white hover:bg-surface-container-low text-on-surface-variant"
                            } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
                            {isUploading ? (
                                <>
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="cloud_upload" size="sm" className="text-primary shrink-0 !text-[15px]" />
                                    <span className="truncate">
                                        {selectedFile ? selectedFile.name : "Choose or drag report file"}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {uploadError && (
                <p className="text-[11px] font-medium text-error flex items-center gap-1">
                    <MaterialIcon name="error" size="xs" />
                    {uploadError}
                </p>
            )}
        </div>
    );
}
