"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export interface ActivityDocument {
    id: string;
    documentType: string;
    documentName: string;
    documentLink: string;
    documentDate: string;
    file: File | null;
    attachmentName: string;
    sourceMode: "upload" | "link";
    notes: string;
}

interface ActivityDocumentsManagerProps {
    documents: ActivityDocument[];
    onChange: (documents: ActivityDocument[]) => void;
    documentTypeOptions: CustomSelectOption[];
    errors: Record<string, string>;
}

export function ActivityDocumentsManager({
    documents,
    onChange,
    documentTypeOptions,
    errors,
}: ActivityDocumentsManagerProps) {
    function handleUpdateDoc(id: string, field: keyof ActivityDocument, value: any) {
        handleUpdateDocFields(id, { [field]: value });
    }

    function handleUpdateDocFields(id: string, updates: Partial<ActivityDocument>) {
        const next = documents.map((doc) => {
            if (doc.id === id) {
                const updated = { ...doc, ...updates } as ActivityDocument;

                // Reset alternate source values when switching mode
                if ("sourceMode" in updates) {
                    if (updates.sourceMode === "upload") {
                        updated.documentLink = "";
                    } else {
                        updated.file = null;
                        updated.attachmentName = "";
                    }
                }
                return updated;
            }
            return doc;
        });
        onChange(next);
    }

    function handleAddDocument() {
        const nextDoc: ActivityDocument = {
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            documentType: "",
            documentName: "",
            documentLink: "",
            documentDate: "",
            file: null,
            attachmentName: "",
            sourceMode: "upload",
            notes: "",
        };
        onChange([...documents, nextDoc]);
    }

    function handleRemoveDocument(id: string) {
        if (documents.length <= 1) return;
        onChange(documents.filter((doc) => doc.id !== id));
    }

    return (
        <div className="space-y-6">
            {documents.map((doc, index) => (
                <div
                    key={doc.id}
                    className="border border-outline-variant rounded-xl p-5 bg-surface-container-lowest relative space-y-4 shadow-sm"
                >
                    <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-primary">Supporting Evidence Document</span>
                        </div>
                        {documents.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-error transition cursor-pointer font-medium"
                            >
                                <MaterialIcon name="delete" size="sm" className="text-error" />
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Document Type
                            </label>
                            <CustomSelect
                                options={documentTypeOptions}
                                value={doc.documentType}
                                onChange={(val) => handleUpdateDoc(doc.id, "documentType", val)}
                                error={Boolean(errors[`doc-${doc.id}-type`])}
                                placeholder="Select type..."
                            />
                            {errors[`doc-${doc.id}-type`] && (
                                <p className="mt-1.5 text-xs text-error">{errors[`doc-${doc.id}-type`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Document Name
                            </label>
                            <Input
                                type="text"
                                value={doc.documentName}
                                onChange={(e) => handleUpdateDoc(doc.id, "documentName", e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="e.g. Q1_Invoice"
                            />
                            {errors[`doc-${doc.id}-name`] && (
                                <p className="mt-1.5 text-xs text-error">{errors[`doc-${doc.id}-name`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Document Date
                            </label>
                            <DatePicker
                                value={doc.documentDate}
                                onChange={(dateStr) => handleUpdateDoc(doc.id, "documentDate", dateStr)}
                                error={Boolean(errors[`doc-${doc.id}-date`])}
                            />
                            {errors[`doc-${doc.id}-date`] && (
                                <p className="mt-1.5 text-xs text-error">{errors[`doc-${doc.id}-date`]}</p>
                            )}
                        </div>

                        <div className="flex flex-col justify-end">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Evidence Mode
                            </label>
                            <div className="flex rounded-lg border border-outline-variant bg-surface-container-low p-1 w-fit">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateDoc(doc.id, "sourceMode", "upload")}
                                    className={cn(
                                        "px-4 py-1.5 text-xs! block font-label-md text-label-md text-on-surface-variant rounded-md transition cursor-pointer",
                                        doc.sourceMode === "upload"
                                            ? "bg-secondary text-on-secondary shadow-sm"
                                            : "text-on-surface-variant hover:text-on-surface"
                                    )}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateDoc(doc.id, "sourceMode", "link")}
                                    className={cn(
                                        "px-4 py-1.5 text-xs! block font-label-md text-label-md text-on-surface-variant font-semibold rounded-md transition cursor-pointer",
                                        doc.sourceMode === "link"
                                            ? "bg-secondary text-on-secondary shadow-sm"
                                            : "text-on-surface-variant hover:text-on-surface"
                                    )}
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {doc.sourceMode === "upload" ? (
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Upload File
                                    </label>
                                    {doc.attachmentName ? (
                                        <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container p-3">
                                            <div className="flex items-center gap-2 text-sm text-on-surface font-medium truncate">
                                                <MaterialIcon name="description" size="sm" className="text-primary" />
                                                <span className="truncate">{doc.attachmentName}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleUpdateDocFields(doc.id, {
                                                        file: null,
                                                        attachmentName: "",
                                                    });
                                                }}
                                                className="text-on-surface-variant hover:text-error transition cursor-pointer"
                                            >
                                                <MaterialIcon name="close" size="sm" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline-variant bg-white text-center text-on-surface-variant transition-colors hover:border-primary cursor-pointer p-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                                                <MaterialIcon name="cloud_upload" size="sm" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary">Click to upload files</p>
                                                <p className="text-xs text-on-surface-variant">PDF, PNG, JPG or CSV (max 10MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null;
                                                    const updates: Partial<ActivityDocument> = {
                                                        file,
                                                        attachmentName: file?.name ?? "",
                                                    };
                                                    
                                                    // Auto fill document name if empty
                                                    if (file && !doc.documentName) {
                                                        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                                                        updates.documentName = nameWithoutExt;
                                                    }
                                                    
                                                    handleUpdateDocFields(doc.id, updates);
                                                }}
                                            />
                                        </label>
                                    )}
                                    {errors[`doc-${doc.id}-source`] && (
                                        <p className="mt-1 text-xs text-error">{errors[`doc-${doc.id}-source`]}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Documentation Link
                                    </label>
                                    <Input
                                        type="text"
                                        value={doc.documentLink}
                                        onChange={(e) => handleUpdateDoc(doc.id, "documentLink", e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="https://sharepoint.com/doc..."
                                    />
                                    {errors[`doc-${doc.id}-source`] && (
                                        <p className="mt-1 text-xs text-error">{errors[`doc-${doc.id}-source`]}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Notes / Remarks (Optional)
                            </label>
                            <textarea
                                value={doc.notes}
                                onChange={(e) => handleUpdateDoc(doc.id, "notes", e.target.value)}
                                className="min-h-[80px] w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add clarifying notes..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddDocument}
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-outline-variant hover:border-primary rounded-xl block font-label-md text-label-md text-on-surface-variant mb-2 text-sm transition duration-150  bg-surface-container-low cursor-pointer"
            >
                <MaterialIcon name="add" size="sm" />
                Add Another Document
            </button>
        </div>
    );
}
