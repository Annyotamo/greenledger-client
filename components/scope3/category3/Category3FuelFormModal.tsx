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
    AmendWttFuelPayload,
    CreateWttFuelPayload,
    WttFuelActivityEntry,
} from "@/lib/scope3/category3/types";
import { useWttFuelUnits, useWttFuels } from "@/lib/scope3/category3/hooks";

interface Category3FuelFormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: WttFuelActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateWttFuelPayload | AmendWttFuelPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category3FuelFormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category3FuelFormModalProps) {
    const facilitiesQuery = useFacilities();
    const fuelsQuery = useWttFuels();

    const fuels = useMemo(() => fuelsQuery.data ?? [], [fuelsQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [fuelCategory, setFuelCategory] = useState<string>("");

    const fuelCategories = useMemo(() => {
        const set = new Set<string>();
        fuels.forEach((f) => {
            if (f.category_name) set.add(f.category_name);
        });
        return Array.from(set);
    }, [fuels]);

    const categorySelectOptions: CustomSelectOption[] = useMemo(() => {
        const options: CustomSelectOption[] = [
            { label: `All Fuel Categories (${fuels.length} fuels)`, value: "" },
        ];
        fuelCategories.forEach((cat) => {
            const count = fuels.filter((f) => f.category_name === cat).length;
            options.push({ label: `${cat} (${count} fuels)`, value: cat });
        });
        return options;
    }, [fuels, fuelCategories]);

    const filteredFuels = useMemo(() => {
        if (!fuelCategory) return fuels;
        return fuels.filter((f) => f.category_name === fuelCategory);
    }, [fuels, fuelCategory]);

    const [fuelId, setFuelId] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.fuelId || "" : ""),
    );

    const activeFuelId = fuelId && filteredFuels.some((f) => f.fuel_id === fuelId)
        ? fuelId
        : (filteredFuels[0]?.fuel_id ?? fuels[0]?.fuel_id ?? "3fa85f64-5717-4562-b3fc-2c963f66afa6");

    const unitsQuery = useWttFuelUnits(activeFuelId);
    const units = useMemo(() => unitsQuery.data ?? [], [unitsQuery.data]);

    const [unitId, setUnitId] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.unitId || "" : ""),
    );

    const activeUnitId = unitId && units.some((u) => u.unit_id === unitId)
        ? unitId
        : (units[0]?.unit_id ?? "");

    const selectedUnit = useMemo(
        () => units.find((u) => u.unit_id === activeUnitId) ?? units[0],
        [units, activeUnitId],
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
    const [fuelQuantity, setFuelQuantity] = useState(
        () => (isEditOrAmend ? String(initialEntry?.fuelQuantity || "100.5") : "100.5"),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fuelSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            filteredFuels.map((f) => ({
                value: f.fuel_id,
                label: f.fuel_name,
            })),
        [filteredFuels],
    );

    const unitSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            units.map((u) => {
                const displayName = u.unit_name ? `${u.unit_name} [${u.unit_symbol}]` : u.unit_symbol;
                const kgVal = typeof u.kg_co2e === "number" ? u.kg_co2e : parseFloat(String(u.kg_co2e) || "0");
                const formattedKg = isNaN(kgVal) ? "0" : kgVal.toFixed(5);
                return {
                    value: u.unit_id,
                    label: `${displayName} (${formattedKg} kgCO₂e/${u.unit_symbol})`,
                };
            }),
        [units],
    );

    const numQuantity = parseFloat(fuelQuantity) || 0;
    const kgPerUnit = Number(selectedUnit?.kg_co2e ?? 418.14964);
    const validKgPerUnit = isNaN(kgPerUnit) ? 418.14964 : kgPerUnit;
    const estimatedKgCo2e = numQuantity > 0 ? numQuantity * validKgPerUnit : 0;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        if (!reportingPeriod.trim()) {
            newErrors.reportingPeriod = "Reporting period is required (e.g. FY 2021-22).";
        }
        if (!activeFuelId) {
            newErrors.fuelId = "Please select a WTT supported fuel.";
        }
        if (!activeUnitId || !selectedUnit?.wtt_emission_factor_id) {
            newErrors.unitId = "Please select a valid fuel measurement unit.";
        }
        if (!activityDate) {
            newErrors.activityDate = "Activity date is required.";
        }
        if (!numQuantity || numQuantity <= 0) {
            newErrors.fuelQuantity = "Fuel quantity must be greater than 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const factorIdToUse = selectedUnit?.wtt_emission_factor_id || "a1b2c3d4-5678-90ab-cdef-1234567890ab";

        const basePayload: CreateWttFuelPayload = {
            reporting_period: reportingPeriod.trim(),
            facility_id: facilityId || null,
            wtt_fuel_emission_factor_id: factorIdToUse,
            fuel_id: activeFuelId,
            unit_id: activeUnitId,
            activity_date: activityDate,
            fuel_quantity: numQuantity,
            notes: notes.trim() || null,
        };

        if (mode === "amend" && initialEntry) {
            const amendPayload: AmendWttFuelPayload = {
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
                            3.1
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Upstream WTT Fuel Activity"
                                    : mode === "edit"
                                      ? "Edit WTT Fuel Activity"
                                      : "Amend Verified WTT Fuel Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3 Cat 3: Well-To-Tank (WTT) Upstream Fuel Emissions
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

                    {/* Fuel Category Filter Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Fuel Category Filter
                        </label>
                        <CustomSelect
                            options={categorySelectOptions}
                            value={fuelCategory}
                            onChange={(val) => {
                                setFuelCategory(val);
                                setFuelId("");
                                setUnitId("");
                            }}
                            placeholder="All Fuel Categories..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    {/* WTT Fuel Type Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            WTT Fuel Type <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={fuelSelectOptions}
                            value={activeFuelId}
                            onChange={(val) => {
                                setFuelId(val);
                                setUnitId("");
                            }}
                            placeholder="Select fuel type..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    {/* WTT Measurement Unit Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Measurement Unit & WTT Factor <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={unitSelectOptions}
                            value={activeUnitId}
                            onChange={(val) => setUnitId(val)}
                            placeholder="Select fuel measurement unit..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={false}
                        />
                    </div>

                    {/* Activity Date & Fuel Quantity */}
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
                                Fuel Quantity ({selectedUnit?.unit_symbol || "units"}) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={fuelQuantity}
                                onChange={(e) => setFuelQuantity(e.target.value)}
                                placeholder="e.g. 100.5"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    {/* Calculated Live WTT Emissions Preview Box */}
                    <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                            WTT Upstream Emissions Preview
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xs font-bold text-primary">
                                {numQuantity.toLocaleString()} {selectedUnit?.unit_symbol || "units"}
                            </span>
                            <span className="font-mono text-xs font-bold text-secondary">
                                {estimatedTCo2e.toFixed(4)} tCO₂e
                            </span>
                        </div>
                        <p className="font-mono text-[10px] text-on-surface-variant">
                            Factor: {validKgPerUnit.toFixed(5)} kgCO₂e / {selectedUnit?.unit_symbol || "unit"} (Ref: {selectedUnit?.source_reference_code || "DEFRA WTT"})
                        </p>
                    </div>

                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Notes / Activity Remarks
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter fuel invoice references, boiler logs, or meter receipts..."
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
                                  ? "Create WTT Activity"
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
