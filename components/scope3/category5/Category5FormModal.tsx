"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import {
    AmendCategory5WastePayload,
    Category5WasteActivityEntry,
    CreateCategory5WastePayload,
    TREATMENT_METHOD_LABELS,
    WasteTreatmentFactorDetail,
    WasteTreatmentMethodEnum,
} from "@/lib/scope3/category5/types";
import { useWasteTypes } from "@/lib/scope3/category5/hooks";

interface Category5FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category5WasteActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateCategory5WastePayload | AmendCategory5WastePayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category5FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category5FormModalProps) {
    const facilitiesQuery = useFacilities();
    const wasteTypesQuery = useWasteTypes();

    const wasteTypes = useMemo(() => wasteTypesQuery.data ?? [], [wasteTypesQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [wasteCategory, setWasteCategory] = useState<string>("");

    const wasteCategories = useMemo(() => {
        const set = new Set<string>();
        wasteTypes.forEach((w) => {
            if (w.category_name) set.add(w.category_name);
        });
        return Array.from(set);
    }, [wasteTypes]);

    const categorySelectOptions: CustomSelectOption[] = useMemo(() => {
        const options: CustomSelectOption[] = [
            { label: `All Waste Categories (${wasteTypes.length} materials)`, value: "" },
        ];
        wasteCategories.forEach((cat) => {
            const count = wasteTypes.filter((w) => w.category_name === cat).length;
            options.push({ label: `${cat} (${count} materials)`, value: cat });
        });
        return options;
    }, [wasteTypes, wasteCategories]);

    const filteredWasteTypes = useMemo(() => {
        if (!wasteCategory) return wasteTypes;
        return wasteTypes.filter((w) => w.category_name === wasteCategory);
    }, [wasteTypes, wasteCategory]);

    const [wasteTypeId, setWasteTypeId] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.wasteTypeId || "" : ""),
    );

    const activeWasteTypeId = wasteTypeId && filteredWasteTypes.some((w) => w.waste_type_id === wasteTypeId)
        ? wasteTypeId
        : (filteredWasteTypes[0]?.waste_type_id ?? wasteTypes[0]?.waste_type_id ?? "faa2ea7e-1fe8-46e4-a349-68562c882cf8");

    const selectedWasteType = useMemo(
        () => wasteTypes.find((w) => w.waste_type_id === activeWasteTypeId) ?? wasteTypes[0],
        [wasteTypes, activeWasteTypeId],
    );

    // Extract supported treatment methods for the selected waste type
    const supportedMethods = useMemo(() => {
        if (!selectedWasteType || !selectedWasteType.treatment_methods) {
            return [
                {
                    method: "landfill" as WasteTreatmentMethodEnum,
                    method_label: "Landfill Disposal",
                    kg_co2e: 925.34348,
                    t_co2e: 0.92534348,
                },
            ];
        }

        const methodsRaw = selectedWasteType.treatment_methods;
        if (Array.isArray(methodsRaw)) {
            return methodsRaw as WasteTreatmentFactorDetail[];
        }

        const list: WasteTreatmentFactorDetail[] = [];
        Object.entries(methodsRaw).forEach(([key, val]) => {
            const methodKey = key as WasteTreatmentMethodEnum;
            const kg = typeof val === "number" ? val : Number((val as { kg_co2e?: number })?.kg_co2e || 0);
            const t = kg / 1000;
            list.push({
                method: methodKey,
                method_label: TREATMENT_METHOD_LABELS[methodKey] || key,
                kg_co2e: kg,
                t_co2e: t,
            });
        });
        return list;
    }, [selectedWasteType]);

    const [treatmentMethod, setTreatmentMethod] = useState<WasteTreatmentMethodEnum>(
        () => (isEditOrAmend ? initialEntry?.treatmentMethod || "landfill" : "landfill"),
    );

    const activeTreatmentMethod = treatmentMethod && supportedMethods.some((m) => m.method === treatmentMethod)
        ? treatmentMethod
        : (supportedMethods[0]?.method ?? "landfill");

    const selectedMethodDetail = useMemo(
        () => supportedMethods.find((m) => m.method === activeTreatmentMethod) ?? supportedMethods[0],
        [supportedMethods, activeTreatmentMethod],
    );

    const [reportingPeriod, setReportingPeriod] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriod || "FY 2021-22" : "FY 2021-22"),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [activityDate, setActivityDate] = useState(
        () => (isEditOrAmend ? initialEntry?.activityDate || "2021-12-09" : "2021-12-09"),
    );
    const [wasteTonnes, setWasteTonnes] = useState(
        () => (isEditOrAmend ? String(initialEntry?.wasteGeneratedTonnes || "10.5") : "10.5"),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const wasteTypeSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            filteredWasteTypes.map((w) => ({
                value: w.waste_type_id,
                label: w.waste_type_name,
            })),
        [filteredWasteTypes],
    );

    const methodSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            supportedMethods.map((m) => {
                const kgVal = Number(m.kg_co2e || 0);
                return {
                    value: m.method,
                    label: `${m.method_label} (${kgVal.toFixed(2)} kgCO₂e/tonne)`,
                };
            }),
        [supportedMethods],
    );

    const numTonnes = parseFloat(wasteTonnes) || 0;
    const kgPerTonne = Number(selectedMethodDetail?.kg_co2e ?? 925.34348);
    const validKgPerTonne = isNaN(kgPerTonne) ? 925.34348 : kgPerTonne;
    const estimatedKgCo2e = numTonnes > 0 ? numTonnes * validKgPerTonne : 0;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        if (!reportingPeriod.trim()) {
            newErrors.reportingPeriod = "Reporting period is required (e.g. FY 2021-22).";
        }
        if (!activeWasteTypeId) {
            newErrors.wasteTypeId = "Please select a valid operational waste material.";
        }
        if (!activeTreatmentMethod) {
            newErrors.treatmentMethod = "Please select a supported treatment / disposal method.";
        }
        if (!activityDate) {
            newErrors.activityDate = "Activity date is required.";
        }
        if (!numTonnes || numTonnes <= 0) {
            newErrors.wasteTonnes = "Waste generated in tonnes must be greater than 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const basePayload: CreateCategory5WastePayload = {
            reporting_period: reportingPeriod.trim(),
            facility_id: facilityId || null,
            waste_type_id: activeWasteTypeId,
            treatment_method: activeTreatmentMethod,
            activity_date: activityDate,
            waste_generated_tonnes: numTonnes,
            notes: notes.trim() || null,
        };

        if (mode === "amend" && initialEntry) {
            const amendPayload: AmendCategory5WastePayload = {
                ...basePayload,
                amended_from_id: initialEntry.id,
            };
            await onSubmit(amendPayload);
        } else {
            await onSubmit(basePayload);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[85vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            5
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Category 5 Waste Activity"
                                    : mode === "edit"
                                      ? "Edit Category 5 Waste Activity"
                                      : "Amend Verified Operational Waste Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Waste Generated in Operations (Disposal & Treatment Model)
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
                    <FormErrorSummary errors={errors} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Reporting Period <span className="text-error">*</span>
                            </label>
                            <Input
                                value={reportingPeriod}
                                onChange={(e) => setReportingPeriod(e.target.value)}
                                placeholder="e.g. FY 2021-22"
                                className="font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Facility (Optional)
                            </label>
                            <select
                                value={facilityId}
                                onChange={(e) => setFacilityId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value="">No specific facility (Corporate level)</option>
                                {facilities.map((fac) => (
                                    <option key={fac.id} value={fac.id}>
                                        {fac.name} ({fac.facilityCode})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Waste Category Filter Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Waste Category Filter
                        </label>
                        <CustomSelect
                            options={categorySelectOptions}
                            value={wasteCategory}
                            onChange={(val) => {
                                setWasteCategory(val);
                                setWasteTypeId("");
                            }}
                            placeholder="All Waste Categories..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    {/* Waste Material Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Waste Material Type <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={wasteTypeSelectOptions}
                            value={activeWasteTypeId}
                            onChange={(val) => setWasteTypeId(val)}
                            placeholder="Select waste material..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    {/* Supported Treatment Method Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Treatment & Disposal Method <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={methodSelectOptions}
                            value={activeTreatmentMethod}
                            onChange={(val) => setTreatmentMethod(val as WasteTreatmentMethodEnum)}
                            placeholder="Select treatment method..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={false}
                        />
                    </div>

                    {/* Activity Date & Tonnes Quantity */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Activity Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={activityDate}
                                onChange={setActivityDate}
                                className="font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Waste Generated (Tonnes) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={wasteTonnes}
                                onChange={(e) => setWasteTonnes(e.target.value)}
                                placeholder="e.g. 10.5"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                            Treatment & Disposal Emissions Preview
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xs font-bold text-primary">
                                {numTonnes.toLocaleString(undefined, { minimumFractionDigits: 2 })} tonnes ({selectedMethodDetail?.method_label || "Treatment"})
                            </span>
                            <span className="font-mono text-xs font-bold text-secondary">
                                {estimatedTCo2e.toFixed(4)} tCO₂e
                            </span>
                        </div>
                        <p className="font-mono text-[10px] text-on-surface-variant">
                            Factor: {validKgPerTonne.toFixed(2)} kgCO₂e / tonne (Ref: {selectedMethodDetail?.source_reference_code || "DEFRA Waste Model"})
                        </p>
                    </div>

                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Notes / Disposal Manifest Remarks
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter waste disposal manifest numbers, contractor names, landfill tickets, or recycling receipts..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : mode === "create"
                                  ? "Create Waste Activity"
                                  : mode === "edit"
                                    ? "Update Activity"
                                    : "Save Amended Entry"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
