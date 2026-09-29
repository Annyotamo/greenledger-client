"use client";

import { useState, useEffect, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { CBAMIPCCFuelPickerModal } from "./CBAMIPCCFuelPickerModal";
import type {
    CBAMActivityUnit,
    CBAMEmissionFactorUnit,
    CBAMIPCCFuel,
    CBAMSourceStream,
    CBAMStreamMethod,
    CreateCBAMSourceStreamPayload,
} from "@/lib/cbam/types";

interface CBAMSourceStreamModalProps {
    isOpen: boolean;
    streamToEdit?: CBAMSourceStream | null;
    onClose: () => void;
    onSubmit: (payload: CreateCBAMSourceStreamPayload) => Promise<void>;
    isSubmitting?: boolean;
}

export function CBAMSourceStreamModal({
    isOpen,
    streamToEdit,
    onClose,
    onSubmit,
    isSubmitting = false,
}: CBAMSourceStreamModalProps) {
    const isEdit = Boolean(streamToEdit);

    // Form fields
    const [method, setMethod] = useState<CBAMStreamMethod>("Combustion");
    const [name, setName] = useState("");
    const [slotNumber, setSlotNumber] = useState<number | undefined>(undefined);
    const [activityData, setActivityData] = useState<string>("");
    const [activityUnit, setActivityUnit] = useState<CBAMActivityUnit>("t");
    const [biomassFraction, setBiomassFraction] = useState<string>("0");

    // Combustion fields
    const [ncv, setNcv] = useState<string>("");
    const [emissionFactor, setEmissionFactor] = useState<string>("");
    const [emissionFactorUnit, setEmissionFactorUnit] = useState<CBAMEmissionFactorUnit>("tCO2/TJ");
    const [oxidationFactor, setOxidationFactor] = useState<string>("100");
    const [selectedIpccFuel, setSelectedIpccFuel] = useState<CBAMIPCCFuel | null>(null);

    // Mass balance fields
    const [carbonContent, setCarbonContent] = useState<string>("");

    // Modals & validation
    const [isIpccModalOpen, setIsIpccModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (streamToEdit) {
            setMethod(streamToEdit.method);
            setName(streamToEdit.name);
            setSlotNumber(streamToEdit.slot_number);
            setActivityData(String(streamToEdit.activity_data));
            setActivityUnit(streamToEdit.activity_unit);
            setBiomassFraction(String(streamToEdit.biomass_fraction ?? 0));
            setNcv(streamToEdit.ncv !== null && streamToEdit.ncv !== undefined ? String(streamToEdit.ncv) : "");
            setEmissionFactor(
                streamToEdit.emission_factor !== null && streamToEdit.emission_factor !== undefined
                    ? String(streamToEdit.emission_factor)
                    : "",
            );
            setEmissionFactorUnit(streamToEdit.emission_factor_unit || "tCO2/TJ");
            setOxidationFactor(
                streamToEdit.oxidation_factor !== null && streamToEdit.oxidation_factor !== undefined
                    ? String(streamToEdit.oxidation_factor)
                    : "100",
            );
            setCarbonContent(
                streamToEdit.carbon_content !== null && streamToEdit.carbon_content !== undefined
                    ? String(streamToEdit.carbon_content)
                    : "",
            );
        } else {
            // Reset defaults
            setMethod("Combustion");
            setName("");
            setSlotNumber(undefined);
            setActivityData("");
            setActivityUnit("t");
            setBiomassFraction("0");
            setNcv("");
            setEmissionFactor("");
            setEmissionFactorUnit("tCO2/TJ");
            setOxidationFactor("100");
            setSelectedIpccFuel(null);
            setCarbonContent("");
            setErrors({});
        }
    }, [streamToEdit, isOpen]);

    function handleSelectIpccFuel(fuel: CBAMIPCCFuel) {
        setSelectedIpccFuel(fuel);
        setName(fuel.fuel_name);
        setEmissionFactor(String(fuel.default_ef_tco2_per_unit));
        setEmissionFactorUnit("tCO2/t");
        setOxidationFactor("100");
        setBiomassFraction("0");
        if (fuel.unit_symbol.toLowerCase().includes("nm3") || fuel.unit_symbol.toLowerCase().includes("m3")) {
            setActivityUnit("1000 Nm3");
        } else {
            setActivityUnit("t");
        }
    }

    // Client-side deterministic calculation preview
    const previewCalculations = useMemo(() => {
        const actVal = parseFloat(activityData) || 0;
        const bioPercent = parseFloat(biomassFraction) || 0;
        const bioFrac = bioPercent / 100;
        const fossilFrac = 1 - bioFrac;

        if (method === "Combustion") {
            const efVal = parseFloat(emissionFactor) || 0;
            const ncvVal = parseFloat(ncv) || 0;
            const oxVal = (parseFloat(oxidationFactor) || 100) / 100;

            let totalEmissions = 0;
            if (emissionFactorUnit === "tCO2/TJ") {
                totalEmissions = actVal * (ncvVal / 1000) * efVal * oxVal;
            } else {
                totalEmissions = actVal * efVal * oxVal;
            }

            const fossilCo2 = totalEmissions * fossilFrac;
            const bioCo2 = totalEmissions * bioFrac;
            const fossilTj = actVal * (ncvVal / 1000) * fossilFrac;
            const bioTj = actVal * (ncvVal / 1000) * bioFrac;

            return {
                fossilCo2,
                bioCo2,
                totalCo2: fossilCo2 + bioCo2,
                fossilTj,
                bioTj,
                totalTj: fossilTj + bioTj,
            };
        } else {
            // Mass Balance: Stoichiometric factor 3.664 (44.01 / 12.011)
            const cContent = parseFloat(carbonContent) || 0;
            const totalEmissions = actVal * cContent * 3.664;
            const fossilCo2 = totalEmissions * fossilFrac;
            const bioCo2 = totalEmissions * bioFrac;

            return {
                fossilCo2,
                bioCo2,
                totalCo2: fossilCo2 + bioCo2,
                fossilTj: 0,
                bioTj: 0,
                totalTj: 0,
            };
        }
    }, [method, activityData, emissionFactor, emissionFactorUnit, ncv, oxidationFactor, biomassFraction, carbonContent]);

    function validate(): boolean {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "Stream name is required.";
        }

        const actVal = parseFloat(activityData);
        if (isNaN(actVal) || actVal === 0) {
            newErrors.activityData = "Activity data must be a valid non-zero number.";
        }

        if (method === "Combustion") {
            if (actVal < 0) {
                newErrors.activityData = "Activity data for combustion fuels must be positive (> 0).";
            }
            const efVal = parseFloat(emissionFactor);
            if (isNaN(efVal) || efVal <= 0) {
                newErrors.emissionFactor = "Emission factor must be greater than 0.";
            }
            if (emissionFactorUnit === "tCO2/TJ") {
                const ncvVal = parseFloat(ncv);
                if (isNaN(ncvVal) || ncvVal <= 0) {
                    newErrors.ncv = "Net Calorific Value (NCV) is required when EF unit is tCO2/TJ.";
                }
            }
        } else {
            // Mass balance
            const cContent = parseFloat(carbonContent);
            if (isNaN(cContent) || cContent <= 0) {
                newErrors.carbonContent = "Carbon content (tC/t) is required for mass balance methodology.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateCBAMSourceStreamPayload = {
            slot_number: slotNumber,
            method,
            name: name.trim(),
            activity_data: parseFloat(activityData),
            activity_unit: activityUnit,
            biomass_fraction: parseFloat(biomassFraction) || 0,
            ipcc_fuel_id: selectedIpccFuel?.id || null,
        };

        if (method === "Combustion") {
            payload.ncv = ncv ? parseFloat(ncv) : null;
            payload.emission_factor = parseFloat(emissionFactor);
            payload.emission_factor_unit = emissionFactorUnit;
            payload.oxidation_factor = parseFloat(oxidationFactor) || 100;
            payload.carbon_content = null;
        } else {
            payload.carbon_content = parseFloat(carbonContent);
            payload.ncv = null;
            payload.emission_factor = null;
            payload.emission_factor_unit = null;
            payload.oxidation_factor = null;
        }

        await onSubmit(payload);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-sans">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                            <MaterialIcon name="tune" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-slate-900">
                                {isEdit ? `Edit Source Stream (Slot #${streamToEdit?.slot_number})` : "Configure New Source Stream (Sheet B_EmInst)"}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Direct installation emission calculation under EU CBAM rules.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Method Selector Tabs */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Calculation Methodology
                        </label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setMethod("Combustion")}
                                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                                    method === "Combustion"
                                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}>
                                <MaterialIcon name="local_fire_department" size="xs" className="text-blue-600" />
                                <span>Combustion Method</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMethod("Mass balance")}
                                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                                    method === "Mass balance"
                                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}>
                                <MaterialIcon name="balance" size="xs" className="text-amber-600" />
                                <span>Mass Balance Method</span>
                            </button>
                        </div>
                    </div>

                    {/* Stream Name & IPCC Fallback Picker */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Source Stream Name <span className="text-rose-500">*</span>
                            </label>
                            {method === "Combustion" && (
                                <button
                                    type="button"
                                    onClick={() => setIsIpccModalOpen(true)}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline">
                                    <MaterialIcon name="search" size="xs" className="!text-[14px]" />
                                    <span>Pick from IPCC Default Fuels</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={
                                method === "Combustion"
                                    ? "e.g. Heavy fuel oil (Boiler 1) or Natural gas"
                                    : "e.g. Coking Coal Input or Crude Steel Output"
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                    </div>

                    {/* Activity Data & Unit */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Activity Data (Quantity) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={activityData}
                                onChange={(e) => setActivityData(e.target.value)}
                                placeholder={
                                    method === "Combustion"
                                        ? "e.g. 252000"
                                        : "e.g. 50000 (input) or -1808226 (output)"
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                            />
                            {errors.activityData && (
                                <p className="text-[11px] text-rose-500 font-medium">{errors.activityData}</p>
                            )}
                            {method === "Mass balance" && (
                                <p className="text-[10px] text-amber-700 font-medium">
                                    💡 Tip: Use positive values for carbon inputs, and negative values (-) for carbon bound in exported products.
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Activity Unit
                            </label>
                            <select
                                value={activityUnit}
                                onChange={(e) => setActivityUnit(e.target.value as CBAMActivityUnit)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                                <option value="t">Tonnes (t)</option>
                                <option value="1000 Nm3">Thousand Normal Cubic Metres (1000 Nm3)</option>
                            </select>
                        </div>
                    </div>

                    {/* Method Specific Fields */}
                    {method === "Combustion" ? (
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                                Combustion Emission Factor & Parameters
                            </span>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Emission Factor Unit
                                    </label>
                                    <select
                                        value={emissionFactorUnit}
                                        onChange={(e) => setEmissionFactorUnit(e.target.value as CBAMEmissionFactorUnit)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                                        <option value="tCO2/TJ">t CO₂ / TJ (Energy-based factor)</option>
                                        <option value="tCO2/t">t CO₂ / t (Direct fuel factor)</option>
                                        <option value="tCO2/1000Nm3">t CO₂ / 1000 Nm3 (Gas volume factor)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Emission Factor Value <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={emissionFactor}
                                        onChange={(e) => setEmissionFactor(e.target.value)}
                                        placeholder="e.g. 73.0 (for tCO2/TJ) or 2.75"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                    {errors.emissionFactor && (
                                        <p className="text-[11px] text-rose-500 font-medium">{errors.emissionFactor}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Net Calorific Value (GJ/t) {emissionFactorUnit === "tCO2/TJ" && <span className="text-rose-500">*</span>}
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={ncv}
                                        onChange={(e) => setNcv(e.target.value)}
                                        placeholder="e.g. 45.0"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                    {errors.ncv && (
                                        <p className="text-[11px] text-rose-500 font-medium">{errors.ncv}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Oxidation Factor (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={oxidationFactor}
                                        onChange={(e) => setOxidationFactor(e.target.value)}
                                        placeholder="100"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Biomass Fraction (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={biomassFraction}
                                        onChange={(e) => setBiomassFraction(e.target.value)}
                                        placeholder="0"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                                Mass Balance Carbon Content & Stoichiometry
                            </span>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Carbon Content (Fraction or tC/t) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={carbonContent}
                                        onChange={(e) => setCarbonContent(e.target.value)}
                                        placeholder="e.g. 0.85 (for 85%) or 0.00388"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                    {errors.carbonContent && (
                                        <p className="text-[11px] text-rose-500 font-medium">{errors.carbonContent}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Biomass Fraction (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={biomassFraction}
                                        onChange={(e) => setBiomassFraction(e.target.value)}
                                        placeholder="0"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500">
                                ℹ️ Formula: <code className="font-mono text-emerald-800 font-semibold">Emissions = ActivityData × CarbonContent × 3.664</code> (Stoichiometric constant 44.01/12.011).
                            </p>
                        </div>
                    )}

                    {/* Live Preview Calculation Banner */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2">
                            <span className="flex items-center gap-1.5 font-display text-xs font-bold text-emerald-950">
                                <MaterialIcon name="calculate" size="xs" className="text-emerald-700" />
                                Real-Time Calculated Emissions Preview
                            </span>
                            <span className="rounded bg-emerald-200/70 px-1.5 py-0.2 text-[10px] font-bold text-emerald-900">
                                Live Formula
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-sans text-xs">
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-emerald-800">Fossil CO₂</span>
                                <span className="font-display text-base font-bold text-emerald-950 tabular-nums">
                                    {previewCalculations.fossilCo2.toLocaleString("en-US", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-[11px] font-medium font-sans">t</span>
                                </span>
                            </div>

                            <div>
                                <span className="block text-[10px] uppercase font-bold text-emerald-800">Biomass CO₂</span>
                                <span className="font-display text-base font-bold text-emerald-950 tabular-nums">
                                    {previewCalculations.bioCo2.toLocaleString("en-US", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-[11px] font-medium font-sans">t</span>
                                </span>
                            </div>

                            <div>
                                <span className="block text-[10px] uppercase font-bold text-emerald-800">Total CO₂</span>
                                <span className="font-display text-base font-bold text-emerald-950 tabular-nums">
                                    {previewCalculations.totalCo2.toLocaleString("en-US", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-[11px] font-medium font-sans">t</span>
                                </span>
                            </div>

                            <div>
                                <span className="block text-[10px] uppercase font-bold text-emerald-800">Energy Content</span>
                                <span className="font-display text-base font-bold text-emerald-950 tabular-nums">
                                    {previewCalculations.totalTj.toLocaleString("en-US", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-[11px] font-medium font-sans">TJ</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} className="font-sans text-xs">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={isSubmitting}
                            className="gap-2 font-sans text-xs font-semibold">
                            <MaterialIcon name={isEdit ? "check" : "add"} size="xs" />
                            <span>{isSubmitting ? "Calculating & Saving..." : isEdit ? "Update Source Stream" : "Save Source Stream"}</span>
                        </Button>
                    </div>
                </form>
            </div>

            {/* IPCC Fuels Fallback Modal */}
            <CBAMIPCCFuelPickerModal
                isOpen={isIpccModalOpen}
                onClose={() => setIsIpccModalOpen(false)}
                onSelectFuel={handleSelectIpccFuel}
            />
        </div>
    );
}
