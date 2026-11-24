// components/lwg/water/LwgWaterDrawer.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { uploadLwgFile } from "@/lib/lwg/api";
import { useLwgDepartments, useLwgProfile, useUpsertLwgWater } from "@/lib/lwg/hooks";
import {
    LWG_WATER_SOURCE_LABELS,
    type LwgWater,
    type LwgWaterSource,
} from "@/lib/lwg/types";
import { generate24MonthOptions } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";

interface LwgWaterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialMonth?: string;
    waterRecord?: LwgWater | null;
}

function emptySubscribe() {
    return () => {};
}

export function LwgWaterDrawer({
    isOpen,
    onClose,
    initialMonth,
    waterRecord,
}: LwgWaterDrawerProps) {
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
        <LwgWaterDrawerContent
            onClose={onClose}
            initialMonth={initialMonth}
            waterRecord={waterRecord}
        />,
        document.body,
    );
}

function LwgWaterDrawerContent({
    onClose,
    initialMonth,
    waterRecord,
}: {
    onClose: () => void;
    initialMonth?: string;
    waterRecord?: LwgWater | null;
}) {
    const isEditing = !!waterRecord;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: profile } = useLwgProfile();
    const { data: departments = [] } = useLwgDepartments();
    const upsertMutation = useUpsertLwgWater();

    const monthOptions = generate24MonthOptions(
        profile?.dataWindowStart,
        profile?.dataWindowEnd,
    );

    const defaultMonth =
        waterRecord?.month ||
        initialMonth ||
        monthOptions[monthOptions.length - 1]?.value ||
        "2026-01-01";

    const defaultSource: LwgWaterSource = waterRecord?.source || "borewell";

    const [month, setMonth] = useState(defaultMonth);
    const [source, setSource] = useState<LwgWaterSource>(defaultSource);
    const [volumeM3, setVolumeM3] = useState(
        waterRecord?.volumeM3 ? String(waterRecord.volumeM3) : "",
    );
    const [meterId, setMeterId] = useState(waterRecord?.meterId || "");
    const [departmentId, setDepartmentId] = useState<string>(
        waterRecord?.departmentId || "whole_site",
    );
    const [meterPhotoFileKey, setMeterPhotoFileKey] = useState<string | null>(
        waterRecord?.meterPhotoFileKey || null,
    );
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Rule checks
    const requiresMeterId = source === "borewell" || source === "municipal_supply";
    const requiresMeterPhoto = source === "borewell";

    const sourceOptions: { label: string; value: LwgWaterSource }[] = [
        { label: LWG_WATER_SOURCE_LABELS.borewell, value: "borewell" },
        { label: LWG_WATER_SOURCE_LABELS.municipal_supply, value: "municipal_supply" },
        { label: LWG_WATER_SOURCE_LABELS.tanker, value: "tanker" },
        { label: LWG_WATER_SOURCE_LABELS.rainwater_harvested, value: "rainwater_harvested" },
        { label: LWG_WATER_SOURCE_LABELS.recycled_own_etp, value: "recycled_own_etp" },
        { label: LWG_WATER_SOURCE_LABELS.recycled_cetp, value: "recycled_cetp" },
    ];

    const deptOptions = [
        { label: "Whole Site / General Intake", value: "whole_site" },
        ...departments.map((d) => ({
            label: `${d.name} (${d.stage.replace("_", " ").toUpperCase()})`,
            value: d.id,
        })),
    ];

    const handlePhotoUpload = async (file: File) => {
        try {
            setIsUploadingPhoto(true);
            setFormError(null);
            const key = await uploadLwgFile(file);
            setMeterPhotoFileKey(key);
            setUploadedFileName(file.name);
        } catch (err) {
            console.error("Failed to upload meter photo", err);
            setFormError("Photo upload failed. Please try again.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const vol = parseFloat(volumeM3);
        if (isNaN(vol) || vol < 0) {
            setFormError("Please enter a valid water volume in cubic meters (m³).");
            return;
        }

        // LWG Issue 7 Rule: Borewell and Municipal supply mandate meter ID
        if (requiresMeterId && !meterId.trim()) {
            setFormError(
                `Meter ID is mandatory for ${LWG_WATER_SOURCE_LABELS[source]} per LWG Section 11 audit requirements.`,
            );
            return;
        }

        // LWG Issue 7 Rule: Borewell groundwater extraction mandates photographic proof
        if (requiresMeterPhoto && !meterPhotoFileKey) {
            setFormError(
                "A clear meter reading photo is mandatory for Borewell groundwater extraction per Section 11 verification rules.",
            );
            return;
        }

        try {
            await upsertMutation.mutateAsync({
                month,
                source,
                volumeM3: vol,
                meterId: meterId.trim() || null,
                departmentId: departmentId === "whole_site" ? null : departmentId,
                meterPhotoFileKey: meterPhotoFileKey || null,
            });
            onClose();
        } catch (err) {
            console.error("Failed to upsert water record", err);
            setFormError(
                err instanceof Error ? err.message : "Failed to save water record.",
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
            <div className="relative w-full max-w-xl rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl animate-fade-up max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                            <MaterialIcon name="water_drop" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-primary">
                                {isEditing ? "Update Water Usage Record" : "Log Monthly Water Intake"}
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Section 11: Groundwater extraction, municipal intake, and recycled water.
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

                    {/* Month Picker & Water Source */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Audit Month <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={monthOptions.map((m) => ({ label: m.label, value: m.value }))}
                                value={month}
                                onChange={(val) => setMonth(val)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Water Intake Source <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={sourceOptions}
                                value={source}
                                onChange={(val) => setSource(val as LwgWaterSource)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Volume Input & Meter ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Volume Consumed (m³) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                value={volumeM3}
                                onChange={(e) => setVolumeM3(e.target.value)}
                                placeholder="e.g., 450.0"
                                disabled={upsertMutation.isPending}
                            />
                            <p className="font-sans text-[10px] text-on-surface-variant/70">
                                1 m³ = 1,000 Litres of water.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Flow Meter / Calibrated Device ID{" "}
                                {requiresMeterId && <span className="text-error font-bold">*</span>}
                            </label>
                            <Input
                                value={meterId}
                                onChange={(e) => setMeterId(e.target.value)}
                                placeholder="e.g., BW-METER-01, MUN-FLOW-02"
                                disabled={upsertMutation.isPending}
                            />
                            {requiresMeterId && (
                                <p className="font-sans text-[10px] text-amber-700 font-medium">
                                    Mandatory for {LWG_WATER_SOURCE_LABELS[source]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Department Allocation */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Factory Department / Subunit Allocation
                        </label>
                        <CustomSelect
                            options={deptOptions}
                            value={departmentId}
                            onChange={(val) => setDepartmentId(val)}
                            isDisabled={upsertMutation.isPending}
                        />
                    </div>

                    {/* Meter Photo Upload Dropzone */}
                    <div
                        className={cn(
                            "space-y-2 rounded-xl border p-4 transition-colors",
                            requiresMeterPhoto
                                ? "border-cyan-300 bg-cyan-50/40"
                                : "border-outline-variant bg-surface-container-low/50",
                        )}>
                        <div className="flex items-center justify-between">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Water Meter Reading Photo{" "}
                                {requiresMeterPhoto && (
                                    <span className="text-error font-bold">* (Mandatory for Borewell)</span>
                                )}
                            </label>
                            {meterPhotoFileKey && (
                                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    <MaterialIcon name="check" size="xs" />
                                    <span>Photo Attached</span>
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePhotoUpload(file);
                            }}
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant hover:border-cyan-500/80 bg-surface p-4 text-center cursor-pointer transition-colors">
                            <MaterialIcon
                                name={isUploadingPhoto ? "sync" : "photo_camera"}
                                size="sm"
                                className={cn(
                                    "text-on-surface-variant",
                                    isUploadingPhoto && "animate-spin text-cyan-600",
                                )}
                            />
                            <p className="font-sans text-xs font-medium text-primary">
                                {isUploadingPhoto
                                    ? "Uploading photo to audit vault..."
                                    : uploadedFileName || meterPhotoFileKey
                                    ? `Attached: ${uploadedFileName || "Meter Photo on File"}`
                                    : "Click to upload timestamped meter reading dial photo (JPG, PNG)"}
                            </p>
                            <p className="font-sans text-[10px] text-on-surface-variant">
                                Auditor requirement: Clear image of meter odometer display with date/time visible
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            disabled={upsertMutation.isPending || isUploadingPhoto}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={upsertMutation.isPending || isUploadingPhoto}>
                            {upsertMutation.isPending ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="save" size="xs" />
                                    <span>{isEditing ? "Update Water Entry" : "Save Water Entry"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
