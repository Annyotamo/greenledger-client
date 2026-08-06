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

export function BrsrDocumentUploadSection() {
    const [sourceType, setSourceType] = useState<string>("");
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
                <MaterialIcon name="attach_file" size="sm" className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                    Source Document & Verification
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Source Type Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant block">
                        Source Type
                    </label>
                    <select
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                    >
                        {SOURCE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Document Upload Input & Dropzone */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant block">
                        Supporting Document Upload
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="brsr-document-file-input"
                    />

                    {isSuccess && uploadedFileName ? (
                        <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-50/50 px-3 py-2 text-[12px]">
                            <div className="flex items-center gap-2 text-emerald-800 font-medium truncate max-w-[80%]">
                                <MaterialIcon name="check_circle" size="sm" className="text-emerald-600 shrink-0" />
                                <span className="truncate">{uploadedFileName}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="text-on-surface-variant hover:text-error text-xs font-semibold underline shrink-0 cursor-pointer"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className={`w-full flex items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-[12px] font-medium transition duration-150 cursor-pointer ${
                                isDragging
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-outline-variant bg-white hover:bg-surface-container-low text-on-surface"
                            } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span>Uploading document...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="cloud_upload" size="sm" className="text-primary shrink-0" />
                                    <span className="truncate">
                                        {selectedFile ? selectedFile.name : "Choose or drag file to upload"}
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
