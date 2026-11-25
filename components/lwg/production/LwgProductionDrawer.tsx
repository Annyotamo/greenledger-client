// components/lwg/production/LwgProductionDrawer.tsx
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { useLwgProfile, useUpsertLwgProduction } from "@/lib/lwg/hooks";
import {
    LWG_INPUT_MATERIAL_LABELS,
    LWG_STAGE_LABELS,
    type LwgInputMaterial,
    type LwgProduction,
    type LwgStage,
} from "@/lib/lwg/types";
import { generate24MonthOptions, m2ToSqft, sqftToM2 } from "@/lib/lwg/utils";

interface LwgProductionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialMonth?: string;
    productionRecord?: LwgProduction | null;
}

function emptySubscribe() {
    return () => {};
}

export function LwgProductionDrawer({
    isOpen,
    onClose,
    initialMonth,
    productionRecord,
}: LwgProductionDrawerProps) {
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
        <LwgProductionDrawerContent
            onClose={onClose}
            initialMonth={initialMonth}
            productionRecord={productionRecord}
        />,
        document.body,
    );
}

function LwgProductionDrawerContent({
    onClose,
    initialMonth,
    productionRecord,
}: {
    onClose: () => void;
    initialMonth?: string;
    productionRecord?: LwgProduction | null;
}) {
    const isEditing = !!productionRecord;
    const { data: profile } = useLwgProfile();
    const upsertMutation = useUpsertLwgProduction();

    const outputUnit = profile?.outputUnit || "sq_ft";
    const monthOptions = generate24MonthOptions(
        profile?.dataWindowStart,
        profile?.dataWindowEnd,
    );

    const defaultMonth =
        productionRecord?.month ||
        initialMonth ||
        monthOptions[monthOptions.length - 1]?.value ||
        "2026-01-01";

    const defaultStage =
        productionRecord?.stage ||
        profile?.stagesRun?.[0] ||
        "stage_3_crust_to_finish";

    const [month, setMonth] = useState(defaultMonth);
    const [stage, setStage] = useState<LwgStage>(defaultStage);
    const [inputQuantityTonnes, setInputQuantityTonnes] = useState(
        productionRecord?.inputQuantityTonnes ? String(productionRecord.inputQuantityTonnes) : "",
    );
    const [inputMaterial, setInputMaterial] = useState<LwgInputMaterial>(
        productionRecord?.inputMaterial || "crust",
    );
    const [outputQuantity, setOutputQuantity] = useState(
        productionRecord
            ? String(outputUnit === "sq_ft" ? productionRecord.outputQuantitySqft : productionRecord.outputQuantityM2)
            : "",
    );
    const [soldAtStage, setSoldAtStage] = useState(
        productionRecord?.soldAtStageM2
            ? String(outputUnit === "sq_ft" ? productionRecord.soldAtStageSqft : productionRecord.soldAtStageM2)
            : "",
    );
    const [notes, setNotes] = useState(productionRecord?.notes || "");
    const [formError, setFormError] = useState<string | null>(null);

    // Derived area conversion helper text
    const numericOutput = parseFloat(outputQuantity) || 0;
    const convertedAreaText =
        outputUnit === "sq_ft"
            ? `≈ ${sqftToM2(numericOutput).toLocaleString()} m²`
            : `≈ ${m2ToSqft(numericOutput).toLocaleString()} sq ft`;

    // Filter stage options to user's configured stages if available
    const availableStages = profile?.stagesRun?.length
        ? profile.stagesRun
        : ([
              "stage_1_raw_to_wetblue",
              "stage_2_wetblue_to_crust",
              "stage_3_crust_to_finish",
              "stage_1_to_3_raw_to_finish",
              "stage_2_to_3_wetblue_to_finish",
          ] as LwgStage[]);

    const stageSelectOptions = availableStages.map((stg) => ({
        label: LWG_STAGE_LABELS[stg] || stg,
        value: stg,
    }));

    const materialOptions: { label: string; value: LwgInputMaterial }[] = [
        { label: LWG_INPUT_MATERIAL_LABELS.raw_hide_skin, value: "raw_hide_skin" },
        { label: LWG_INPUT_MATERIAL_LABELS.wet_blue, value: "wet_blue" },
        { label: LWG_INPUT_MATERIAL_LABELS.wet_white, value: "wet_white" },
        { label: LWG_INPUT_MATERIAL_LABELS.crust, value: "crust" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const inputTonnes = parseFloat(inputQuantityTonnes);
        if (isNaN(inputTonnes) || inputTonnes < 0) {
            setFormError("Please enter a valid raw material input quantity (Tonnes).");
            return;
        }

        const outQty = parseFloat(outputQuantity);
        if (isNaN(outQty) || outQty < 0) {
            setFormError(`Please enter a valid leather output quantity in ${outputUnit === "sq_ft" ? "sq ft" : "m²"}.`);
            return;
        }

        const soldQty = soldAtStage ? parseFloat(soldAtStage) : 0;

        try {
            await upsertMutation.mutateAsync({
                month,
                stage,
                inputQuantityTonnes: inputTonnes,
                inputMaterial,
                outputQuantity: outQty,
                soldAtStage: soldQty > 0 ? soldQty : undefined,
                notes: notes.trim() || null,
            });
            onClose();
        } catch (err) {
            console.error("Failed to upsert production record", err);
            setFormError(
                err instanceof Error ? err.message : "Failed to save production record.",
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                            <MaterialIcon name="inventory_2" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-primary">
                                {isEditing ? "Update Monthly Production" : "Log Monthly Production Entry"}
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Leather Protocol Section 5: Monthly material throughput & area output.
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

                    {/* Month Picker & Stage Selection */}
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
                            <p className="font-sans text-[10px] text-on-surface-variant/70">
                                Restricted to active 24-month audit window.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Production Stage <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={stageSelectOptions}
                                value={stage}
                                onChange={(val) => setStage(val as LwgStage)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Input Material & Input Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Input Material Classification <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={materialOptions}
                                value={inputMaterial}
                                onChange={(val) => setInputMaterial(val as LwgInputMaterial)}
                                isDisabled={upsertMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Input Quantity (Tonnes) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={inputQuantityTonnes}
                                onChange={(e) => setInputQuantityTonnes(e.target.value)}
                                placeholder="e.g., 12.50"
                                disabled={upsertMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Output Quantity with Live Area Conversion */}
                    <div className="rounded-xl border border-outline-variant bg-surface-container-low/50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Finished Leather Output ({outputUnit === "sq_ft" ? "sq ft" : "m²"}){" "}
                                <span className="text-error">*</span>
                            </label>
                            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {convertedAreaText}
                            </span>
                        </div>

                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            value={outputQuantity}
                            onChange={(e) => setOutputQuantity(e.target.value)}
                            placeholder={outputUnit === "sq_ft" ? "e.g., 100000" : "e.g., 9290.3"}
                            disabled={upsertMutation.isPending}
                        />

                        <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                            Area is normalized using standard leather audit factor (1 m² = 10.7639 sq ft). Both metric and imperial figures are stored for auditor verification.
                        </p>
                    </div>

                    {/* Sold at this Stage (Optional) */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Sold at this Stage ({outputUnit === "sq_ft" ? "sq ft" : "m²"}) (Optional)
                        </label>
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            value={soldAtStage}
                            onChange={(e) => setSoldAtStage(e.target.value)}
                            placeholder="Leather dispatched before next processing stage"
                            disabled={upsertMutation.isPending}
                        />
                    </div>

                    {/* Notes / Lot Batch Identifier */}
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Notes / Lot Tracking ID (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., January bovine crust export lot #B-104"
                            rows={2}
                            disabled={upsertMutation.isPending}
                            className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2 font-sans text-xs text-primary placeholder:text-on-surface-variant/50 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        />
                    </div>

                    {/* Upsert Information Callout */}
                    <div className="flex items-center gap-2 rounded-xl bg-surface-container-high/60 p-3 text-[11px] text-on-surface-variant">
                        <MaterialIcon name="info" size="xs" className="text-blue-600 shrink-0" />
                        <span>
                            Seamless Upsert: Re-submitting the same Month & Stage automatically updates the existing record without creating duplicates.
                        </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            disabled={upsertMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="save" size="xs" />
                                    <span>{isEditing ? "Update Entry" : "Save Production Entry"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
