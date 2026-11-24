// components/lwg/evidence/LwgEvidenceDrawer.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { uploadLwgFile } from "@/lib/lwg/api";
import { useCreateLwgEvidence } from "@/lib/lwg/hooks";
import {
    LWG_ALL_SECTIONS,
    LWG_DOCUMENT_TYPE_LABELS,
    type LwgDocumentType,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgEvidenceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialSection?: number;
}

function emptySubscribe() {
    return () => {};
}

export function LwgEvidenceDrawer({
    isOpen,
    onClose,
    initialSection,
}: LwgEvidenceDrawerProps) {
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
        <LwgEvidenceDrawerContent
            onClose={onClose}
            initialSection={initialSection}
        />,
        document.body,
    );
}

function LwgEvidenceDrawerContent({
    onClose,
    initialSection,
}: {
    onClose: () => void;
    initialSection?: number;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createMutation = useCreateLwgEvidence();

    const [sectionNumber, setSectionNumber] = useState(
        initialSection ? String(initialSection) : "4",
    );
    const [documentType, setDocumentType] = useState<LwgDocumentType>(
        Number(sectionNumber) === 4 ? "consent_to_operate" : "other",
    );
    const [periodFrom, setPeriodFrom] = useState("");
    const [periodTo, setPeriodTo] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [meterId, setMeterId] = useState("");
    const [notes, setNotes] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Rule check: Consent to Operate and Haz Waste Authorization mandate expiry date
    const requiresExpiryDate =
        documentType === "consent_to_operate" ||
        documentType === "hazardous_waste_authorisation";

    const sectionOptions = LWG_ALL_SECTIONS.map((s) => ({
        label: `Section ${s.sectionNumber}: ${s.title}${s.isCritical ? " (Critical)" : ""}`,
        value: String(s.sectionNumber),
    }));

    const documentTypeOptions: { label: string; value: LwgDocumentType }[] = [
        { label: LWG_DOCUMENT_TYPE_LABELS.consent_to_operate, value: "consent_to_operate" },
        {
            label: LWG_DOCUMENT_TYPE_LABELS.hazardous_waste_authorisation,
            value: "hazardous_waste_authorisation",
        },
        { label: LWG_DOCUMENT_TYPE_LABELS.electricity_bill, value: "electricity_bill" },
        { label: LWG_DOCUMENT_TYPE_LABELS.fuel_invoice, value: "fuel_invoice" },
        { label: LWG_DOCUMENT_TYPE_LABELS.meter_photo, value: "meter_photo" },
        { label: LWG_DOCUMENT_TYPE_LABELS.lab_report, value: "lab_report" },
        { label: LWG_DOCUMENT_TYPE_LABELS.other, value: "other" },
    ];

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!selectedFile) {
            setFormError("Please select a document file to upload.");
            return;
        }

        // Mandatory expiry check
        if (requiresExpiryDate && !expiryDate) {
            setFormError(
                `Statutory expiry date is mandatory for ${LWG_DOCUMENT_TYPE_LABELS[documentType]} per LWG Section 4 rules.`,
            );
            return;
        }

        try {
            setIsUploading(true);
            const fileKey = await uploadLwgFile(selectedFile);

            await createMutation.mutateAsync({
                fileKey,
                fileName: selectedFile.name,
                fileSizeBytes: selectedFile.size,
                mimeType: selectedFile.type || "application/octet-stream",
                lwgSection: Number(sectionNumber),
                documentType,
                periodFrom: periodFrom || null,
                periodTo: periodTo || null,
                expiryDate: expiryDate || null,
                meterId: meterId.trim() || null,
                notes: notes.trim() || null,
            });

            onClose();
        } catch (err) {
            console.error("Failed to upload evidence document", err);
            setFormError(
                err instanceof Error ? err.message : "Failed to upload evidence document.",
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog Card */}
            <div className="relative w-full max-w-xl rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl animate-fade-up max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                            <MaterialIcon name="file_present" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-primary">
                                Vault Evidence Document
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Upload statutory permits, utility bills, lab reports, or meter photos across Sections 1–17.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        aria-label="Close modal">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Error message */}
                    {formError && (
                        <div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}

                    {/* File Dropzone */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Document File <span className="text-error">*</span>
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors",
                                selectedFile
                                    ? "border-emerald-500 bg-emerald-50/40"
                                    : "border-outline-variant hover:border-purple-500 bg-surface",
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
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-sans text-xs font-semibold text-primary">
                                        Drag & drop or click to choose evidence document
                                    </p>
                                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                                        Supports PDF, scanned images (JPG, PNG), Excel, or Word (up to 25MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Target Protocol Section & Document Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Target LWG Section <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={sectionOptions}
                                value={sectionNumber}
                                onChange={(val) => setSectionNumber(val)}
                                isDisabled={isUploading}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Document Type Classification <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={documentTypeOptions}
                                value={documentType}
                                onChange={(val) => setDocumentType(val as LwgDocumentType)}
                                isDisabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Expiry Date (Highlighted when required) */}
                    <div
                        className={cn(
                            "rounded-xl border p-3.5 space-y-2 transition-colors",
                            requiresExpiryDate
                                ? "border-amber-300 bg-amber-50/50"
                                : "border-outline-variant/60 bg-surface",
                        )}>
                        <div className="flex items-center justify-between">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Statutory Permit Expiry Date{" "}
                                {requiresExpiryDate && (
                                    <span className="text-error font-bold">* (Mandatory for Permits)</span>
                                )}
                            </label>
                            {requiresExpiryDate && (
                                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-mono font-bold">
                                    Section 4 Requirement
                                </span>
                            )}
                        </div>

                        <Input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            disabled={isUploading}
                        />

                        <p className="font-sans text-[11px] text-on-surface-variant">
                            System will continuously track permit validity and flag amber warnings at &lt;60 days and red blocker alerts on expiry.
                        </p>
                    </div>

                    {/* Validity Period */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Covered Period From (Optional)
                            </label>
                            <Input
                                type="date"
                                value={periodFrom}
                                onChange={(e) => setPeriodFrom(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Covered Period To (Optional)
                            </label>
                            <Input
                                type="date"
                                value={periodTo}
                                onChange={(e) => setPeriodTo(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Meter ID (Optional) & Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Flow Meter / Device ID (Optional)
                            </label>
                            <Input
                                value={meterId}
                                onChange={(e) => setMeterId(e.target.value)}
                                placeholder="e.g., ETP-FLOW-01"
                                disabled={isUploading}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Reference / Tracking No (Optional)
                            </label>
                            <Input
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g., SPCB/CTO/2025/TN-881"
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Uploading & Vaulting...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="save" size="xs" />
                                    <span>Save Evidence</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
