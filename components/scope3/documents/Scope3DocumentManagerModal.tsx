"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Scope3DocumentsSection } from "./Scope3DocumentsSection";
import { formatScope3CategoryLabel } from "@/lib/scope3/documents/types";

interface Scope3DocumentManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string | number;
    activityId: string | null;
    activityTitle?: string;
    readOnly?: boolean;
}

export function Scope3DocumentManagerModal({
    isOpen,
    onClose,
    category,
    activityId,
    activityTitle,
    readOnly = false,
}: Scope3DocumentManagerModalProps) {
    if (!isOpen || !activityId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-6 my-auto max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-secondary/15 px-2 py-0.5 font-sans text-[11px] font-semibold text-secondary uppercase tracking-wider">
                                {formatScope3CategoryLabel(category)}
                            </span>
                            <span className="rounded bg-surface-container-high px-2 py-0.5 font-sans text-[11px] font-semibold text-primary uppercase tracking-wider">
                                Supporting Evidence
                            </span>
                        </div>
                        <h3 className="font-display text-xl font-bold tracking-tight text-primary truncate max-w-xl">
                            {activityTitle || "Activity Evidence Documents"}
                        </h3>
                        <p className="font-sans text-xs font-medium text-on-surface-variant">
                            Manage audit certificates, vendor invoices, delivery challans, and meter readings.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto pr-1">
                    <Scope3DocumentsSection
                        category={category}
                        activityId={activityId}
                        activityTitle={activityTitle}
                        readOnly={readOnly}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-3 border-t border-outline-variant/40">
                    <Button variant="secondary" size="md" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

