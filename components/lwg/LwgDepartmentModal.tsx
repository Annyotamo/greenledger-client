// components/lwg/LwgDepartmentModal.tsx
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { useCreateLwgDepartment, useUpdateLwgDepartment } from "@/lib/lwg/hooks";
import {
    LWG_DEPARTMENT_STAGE_LABELS,
    type LwgDepartment,
    type LwgDepartmentStage,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department?: LwgDepartment | null;
}

function emptySubscribe() {
    return () => {};
}

export function LwgDepartmentModal({
    isOpen,
    onClose,
    department,
}: LwgDepartmentModalProps) {
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
        <LwgDepartmentModalContent
            onClose={onClose}
            department={department}
        />,
        document.body,
    );
}

function LwgDepartmentModalContent({
    onClose,
    department,
}: {
    onClose: () => void;
    department?: LwgDepartment | null;
}) {
    const isEditing = !!department;
    const createMutation = useCreateLwgDepartment();
    const updateMutation = useUpdateLwgDepartment();

    const [name, setName] = useState(department?.name ?? "");
    const [stage, setStage] = useState<LwgDepartmentStage>(
        department?.stage ?? "stage_1",
    );
    const [description, setDescription] = useState(department?.description ?? "");
    const [isActive, setIsActive] = useState(department?.isActive ?? true);
    const [formError, setFormError] = useState<string | null>(null);

    const isPending = createMutation.isPending || updateMutation.isPending;

    const stageOptions: { label: string; value: LwgDepartmentStage }[] = [
        { label: LWG_DEPARTMENT_STAGE_LABELS.stage_1, value: "stage_1" },
        { label: LWG_DEPARTMENT_STAGE_LABELS.stage_2, value: "stage_2" },
        { label: LWG_DEPARTMENT_STAGE_LABELS.stage_3, value: "stage_3" },
        { label: LWG_DEPARTMENT_STAGE_LABELS.common, value: "common" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            setFormError("Department name is required.");
            return;
        }

        try {
            if (isEditing && department) {
                await updateMutation.mutateAsync({
                    id: department.id,
                    payload: {
                        name: trimmedName,
                        stage,
                        description: description.trim() || null,
                        isActive,
                    },
                });
            } else {
                await createMutation.mutateAsync({
                    name: trimmedName,
                    stage,
                    description: description.trim() || null,
                });
            }
            onClose();
        } catch (err) {
            console.error("Failed to save department", err);
            setFormError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while saving the department.",
            );
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
            <div className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl animate-fade-up">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="meeting_room" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-primary">
                                {isEditing ? "Edit Factory Department" : "Add Factory Department"}
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Subunits for energy meters, fuel logs, and water allocations.
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

                    {/* Department Name */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Department Name <span className="text-error">*</span>
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Beamhouse & Liming, Finishing Line A"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {/* Stage Allocation */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Manufacturing Stage Allocation <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={stageOptions}
                            value={stage}
                            onChange={(val) => setStage(val as LwgDepartmentStage)}
                            isDisabled={isPending}
                        />
                        <p className="font-sans text-[11px] text-on-surface-variant/70">
                            Associates this subunit with specific audit energy & water intensity calculations.
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Description / Metering Scope (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Covers drums 1-8, unhairing paddles, and primary wash lines."
                            rows={3}
                            disabled={isPending}
                            className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2 font-sans text-xs text-primary placeholder:text-on-surface-variant/50 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                    </div>

                    {/* Status Toggle (only in edit mode) */}
                    {isEditing && (
                        <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low/60 p-3.5">
                            <div>
                                <p className="font-sans text-xs font-semibold text-primary">Active Status</p>
                                <p className="font-sans text-[11px] text-on-surface-variant">
                                    Inactive departments cannot be assigned to new monthly meter logs.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    disabled={isPending}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isPending}>
                            {isPending ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="check" size="xs" />
                                    <span>{isEditing ? "Update Department" : "Create Department"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
