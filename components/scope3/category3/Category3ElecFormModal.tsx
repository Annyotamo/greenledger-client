"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import {
    AmendElectricityTdPayload,
    CreateElectricityTdPayload,
    DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH,
    ElectricityTdActivityEntry,
} from "@/lib/scope3/category3/types";

interface Category3ElecFormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: ElectricityTdActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateElectricityTdPayload | AmendElectricityTdPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category3ElecFormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category3ElecFormModalProps) {
    const facilitiesQuery = useFacilities();
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [reportingPeriod, setReportingPeriod] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriod || "FY 2021-22" : "FY 2021-22"),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [activityDate, setActivityDate] = useState(
        () => (isEditOrAmend ? initialEntry?.activityDate || "2021-12-09" : "2021-12-09"),
    );
    const [electricityKwh, setElectricityKwh] = useState(
        () => (isEditOrAmend ? String(initialEntry?.electricityConsumedKwh || "10000") : "10000"),
    );
    const [tdLossRatePercent, setTdLossRatePercent] = useState(
        () => (isEditOrAmend ? String((initialEntry?.tdLossRate || 0.17) * 100) : "17.0"),
    );
    const [customGridFactor, setCustomGridFactor] = useState(
        () => (isEditOrAmend ? String(initialEntry?.gridKgCo2ePerKwh || DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH) : String(DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH)),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const numKwh = parseFloat(electricityKwh) || 0;
    const numLossRate = (parseFloat(tdLossRatePercent) || 17.0) / 100;
    const numGridFactor = parseFloat(customGridFactor) || DEFAULT_CEA_GRID_FACTOR_KG_PER_KWH;

    const estimatedKgCo2e = numKwh * numGridFactor * numLossRate;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        if (!reportingPeriod.trim()) {
            newErrors.reportingPeriod = "Reporting period is required (e.g. FY 2021-22).";
        }
        if (!activityDate) {
            newErrors.activityDate = "Activity date is required.";
        }
        if (!numKwh || numKwh <= 0) {
            newErrors.electricityKwh = "Electricity consumed in kWh must be greater than 0.";
        }
        if (numLossRate < 0 || numLossRate > 1) {
            newErrors.tdLossRatePercent = "T&D loss rate % must be between 0% and 100%.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const basePayload: CreateElectricityTdPayload = {
            reporting_period: reportingPeriod.trim(),
            facility_id: facilityId || null,
            electricity_emission_factor_id: null,
            activity_date: activityDate,
            electricity_consumed_kwh: numKwh,
            td_loss_rate: numLossRate,
            notes: notes.trim() || null,
        };

        if (mode === "amend" && initialEntry) {
            const amendPayload: AmendElectricityTdPayload = {
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
                            3.2
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Electricity T&D Losses Activity"
                                    : mode === "edit"
                                      ? "Edit T&D Losses Activity"
                                      : "Amend Verified T&D Losses Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3 Cat 3: Transmission & Distribution Grid Losses
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
                                Electricity Consumed (kWh) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={electricityKwh}
                                onChange={(e) => setElectricityKwh(e.target.value)}
                                placeholder="e.g. 10000"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                T&D Loss Rate (%) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={tdLossRatePercent}
                                onChange={(e) => setTdLossRatePercent(e.target.value)}
                                disabled={true}
                                placeholder="Default: 17.0%"
                                className="font-mono text-xs font-bold bg-surface-container-low text-on-surface-variant cursor-not-allowed border-outline-variant/60"
                            />
                            <p className="font-mono text-[10px] text-on-surface-variant mt-1">
                                Benchmark: 17.0% (India CEA Grid Loss Rate)
                            </p>
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Grid Factor (kgCO₂e/kWh)
                            </label>
                            <Input
                                type="number"
                                step="0.0001"
                                value={customGridFactor}
                                onChange={(e) => setCustomGridFactor(e.target.value)}
                                disabled={true}
                                placeholder="0.7160"
                                className="font-mono text-xs font-bold bg-surface-container-low text-on-surface-variant cursor-not-allowed border-outline-variant/60"
                            />
                            <p className="font-mono text-[10px] text-on-surface-variant mt-1">
                                CEA National Grid Average: 0.7160 kgCO₂e/kWh
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                            T&D Loss Upstream Calculation Preview
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xs font-bold text-primary">
                                {numKwh.toLocaleString()} kWh × {tdLossRatePercent}% Loss
                            </span>
                            <span className="font-mono text-xs font-bold text-secondary">
                                {estimatedTCo2e.toFixed(4)} tCO₂e
                            </span>
                        </div>
                        <p className="font-mono text-[10px] text-on-surface-variant">
                            Formula: {numKwh.toLocaleString()} kWh × {numGridFactor} kg/kWh × {numLossRate.toFixed(4)} = {estimatedKgCo2e.toFixed(2)} kgCO₂e
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
                            placeholder="Enter grid meter ID, utility bill period, or T&D loss calculation reference..."
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
                                  ? "Create T&D Loss Activity"
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
