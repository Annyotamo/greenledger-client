// components/lwg/energy/LwgEnergyDrawer.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { uploadLwgFile } from "@/lib/lwg/api";
import { useLwgDepartments, useLwgProfile, useUpsertLwgEnergy } from "@/lib/lwg/hooks";
import {
    ALLOWED_UNITS_BY_SOURCE,
    ENERGY_GJ_FACTORS,
    LWG_ENERGY_SOURCE_LABELS,
    type LwgEnergy,
    type LwgEnergySource,
    type LwgEnergyUnit,
} from "@/lib/lwg/types";
import { calculateLiveGj, generate24MonthOptions } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";

interface LwgEnergyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialMonth?: string;
    energyRecord?: LwgEnergy | null;
}

function emptySubscribe() {
    return () => {};
}

export function LwgEnergyDrawer({
    isOpen,
    onClose,
    initialMonth,
    energyRecord,
}: LwgEnergyDrawerProps) {
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
        <LwgEnergyDrawerContent
            onClose={onClose}
            initialMonth={initialMonth}
            energyRecord={energyRecord}
        />,
        document.body,
    );
}

function LwgEnergyDrawerContent({
    onClose,
    initialMonth,
    energyRecord,
}: {
    onClose: () => void;
    initialMonth?: string;
    energyRecord?: LwgEnergy | null;
}) {
    const isEditing = !!energyRecord;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: profile } = useLwgProfile();
    const { data: departments = [] } = useLwgDepartments();
    const upsertMutation = useUpsertLwgEnergy();

    const monthOptions = generate24MonthOptions(
        profile?.dataWindowStart,
        profile?.dataWindowEnd,
    );

    const defaultMonth =
        energyRecord?.month ||
        initialMonth ||
        monthOptions[monthOptions.length - 1]?.value ||
        "2026-01-01";

    const defaultSource: LwgEnergySource = energyRecord?.source || "grid_electricity";
    const allowedUnits = ALLOWED_UNITS_BY_SOURCE[defaultSource];
    const defaultUnit = energyRecord?.unit || allowedUnits[0] || "kwh";

    const [month, setMonth] = useState(defaultMonth);
    const [source, setSource] = useState<LwgEnergySource>(defaultSource);
    const [quantity, setQuantity] = useState(
        energyRecord?.quantity ? String(energyRecord.quantity) : "",
    );
    const [unit, setUnit] = useState<string>(defaultUnit);
    const [departmentId, setDepartmentId] = useState<string>(
        energyRecord?.departmentId || "whole_site",
    );
    const [billProofFileKey, setBillProofFileKey] = useState<string | null>(
        energyRecord?.billProofFileKey || null,
    );
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Whenever source changes, ensure unit is compatible
    const handleSourceChange = (newSource: LwgEnergySource) => {
        setSource(newSource);
        const validUnits = ALLOWED_UNITS_BY_SOURCE[newSource];
        if (!validUnits.includes(unit as LwgEnergyUnit)) {
            setUnit(validUnits[0]);
        }
    };

    // Calculate live GJ
    const numericQty = parseFloat(quantity) || 0;
    const liveGj = calculateLiveGj(source, numericQty, unit);

    const sourceOptions: { label: string; value: LwgEnergySource }[] = [
        { label: LWG_ENERGY_SOURCE_LABELS.grid_electricity, value: "grid_electricity" },
        { label: LWG_ENERGY_SOURCE_LABELS.diesel_hsd, value: "diesel_hsd" },
        { label: LWG_ENERGY_SOURCE_LABELS.furnace_oil, value: "furnace_oil" },
        { label: LWG_ENERGY_SOURCE_LABELS.natural_gas_png, value: "natural_gas_png" },
        { label: LWG_ENERGY_SOURCE_LABELS.lpg, value: "lpg" },
        { label: LWG_ENERGY_SOURCE_LABELS.coal, value: "coal" },
        { label: LWG_ENERGY_SOURCE_LABELS.solar_onsite, value: "solar_onsite" },
        {
            label: LWG_ENERGY_SOURCE_LABELS.purchased_renewable_electricity,
            value: "purchased_renewable_electricity",
        },
        { label: LWG_ENERGY_SOURCE_LABELS.biomass_or_briquettes, value: "biomass_or_briquettes" },
    ];

    const currentAllowedUnits = ALLOWED_UNITS_BY_SOURCE[source];
    const unitOptions = currentAllowedUnits.map((u) => ({
        label: u.toUpperCase(),
        value: u,
    }));

    const deptOptions = [
        { label: "Whole Site / Site-wide Allocation", value: "whole_site" },
        ...departments.map((d) => ({
            label: `${d.name} (${d.stage.replace("_", " ").toUpperCase()})`,
            value: d.id,
        })),
    ];

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploadingFile(true);
            setFormError(null);
            const key = await uploadLwgFile(file);
            setBillProofFileKey(key);
            setUploadedFileName(file.name);
        } catch (err) {
            console.error("Failed to upload bill proof", err);
            setFormError("File upload failed. Please try again.");
        } finally {
            setIsUploadingFile(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty < 0) {
            setFormError("Please enter a valid energy consumption quantity.");
            return;
        }

        // LWG Issue 7 Rule: Purchased Renewable Power requires bill proof
        if (source === "purchased_renewable_electricity" && !billProofFileKey) {
            setFormError(
                "Proof of Purchase (PPA contract or green tariff bill) is mandatory for Purchased Renewable Power per Section 10 rules.",
            );
            return;
        }

        try {
            await upsertMutation.mutateAsync({
                month,
                source,
                quantity: qty,
                unit,
                departmentId: departmentId === "whole_site" ? null : departmentId,
                billProofFileKey: billProofFileKey || null,
            });
            onClose();
        } catch (err) {
            console.error("Failed to upsert energy record", err);
            setFormError(
                err instanceof Error ? err.message : "Failed to save energy record.",
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                            <MaterialIcon name="bolt" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-primary">
                                {isEditing ? "Update Energy Record" : "Log Monthly Energy Entry"}
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Section 10: Electricity, fossil fuels, renewable shares, and GJ conversions.
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

                    {/* Month Picker & Energy Source */}
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
                                Energy Source <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={sourceOptions}
                                value={source}
                                onChange={(val) => handleSourceChange(val as LwgEnergySource)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Quantity & Dynamic Unit */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Consumption Quantity <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="e.g., 10000"
                                disabled={upsertMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Unit <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={unitOptions}
                                value={unit}
                                onChange={(val) => setUnit(val)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Live GJ Preview Card */}
                    <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                                <MaterialIcon name="electric_meter" size="xs" />
                            </div>
                            <div>
                                <span className="font-sans text-[11px] font-semibold text-amber-950 uppercase tracking-wider">
                                    Normalized Energy Output
                                </span>
                                <p className="font-sans text-xs text-amber-900/80">
                                    Computed per Protocol Issue 7 standard conversion matrix
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="font-mono text-lg font-bold text-amber-950 tabular-nums">
                                {liveGj.toFixed(2)} GJ
                            </span>
                            <p className="font-sans text-[10px] text-amber-800/80">
                                {numericQty > 0
                                    ? `Factor: ${ENERGY_GJ_FACTORS[source]?.[unit.toLowerCase()] || "?"} GJ/${unit}`
                                    : "Enter quantity"}
                            </p>
                        </div>
                    </div>

                    {/* Department Allocation */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Factory Department / Metering Subunit Allocation
                        </label>
                        <CustomSelect
                            options={deptOptions}
                            value={departmentId}
                            onChange={(val) => setDepartmentId(val)}
                            isDisabled={upsertMutation.isPending}
                        />
                        <p className="font-sans text-[10px] text-on-surface-variant/70">
                            Allocate consumption directly to finishing lines, beamhouse drums, or the boiler room.
                        </p>
                    </div>

                    {/* Bill / Proof Document Upload Dropzone */}
                    <div className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-low/50 p-4">
                        <div className="flex items-center justify-between">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Utility Bill / Meter Proof Document{" "}
                                {source === "purchased_renewable_electricity" && (
                                    <span className="text-error font-bold">* (Mandatory for PPA)</span>
                                )}
                            </label>
                            {billProofFileKey && (
                                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    <MaterialIcon name="check" size="xs" />
                                    <span>Proof Attached</span>
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                            }}
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant hover:border-amber-500/80 bg-surface p-4 text-center cursor-pointer transition-colors">
                            <MaterialIcon
                                name={isUploadingFile ? "sync" : "cloud_upload"}
                                size="sm"
                                className={cn(
                                    "text-on-surface-variant",
                                    isUploadingFile && "animate-spin text-amber-600",
                                )}
                            />
                            <p className="font-sans text-xs font-medium text-primary">
                                {isUploadingFile
                                    ? "Uploading to secure audit storage..."
                                    : uploadedFileName || billProofFileKey
                                    ? `Selected: ${uploadedFileName || "Existing Bill Attached"}`
                                    : "Click to upload electricity bill or delivery challan (PDF, JPG, PNG)"}
                            </p>
                            <p className="font-sans text-[10px] text-on-surface-variant">
                                Supports invoices, PPA agreements, or utility meter receipts up to 15MB
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
                            disabled={upsertMutation.isPending || isUploadingFile}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={upsertMutation.isPending || isUploadingFile}>
                            {upsertMutation.isPending ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="save" size="xs" />
                                    <span>{isEditing ? "Update Energy Entry" : "Save Energy Entry"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
