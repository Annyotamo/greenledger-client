"use client";

import { useState, useMemo, useRef } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import {
    useFreightingGoodsCategories,
    useFreightingGoodsFactors,
    useFreightingGoodsTypes,
} from "@/lib/scope3/freighting-goods/hooks";
import {
    AmendCategory9TransportPayload,
    Category9TransportActivityEntry,
    CreateCategory9TransportPayload,
} from "@/lib/scope3/category9/types";
import { DEFAULT_FREIGHTING_FACTORS, FreightingGoodsFactor, GasEmissionsDto } from "@/lib/scope3/freighting-goods/types";

interface Category9FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category9TransportActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateCategory9TransportPayload | AmendCategory9TransportPayload) => Promise<void>;
    isSubmitting: boolean;
}

const KNOWN_FACTOR_KEYS = [
    "diesel",
    "petrol",
    "cng",
    "lpg",
    "unknown",
    "plug_in_hybrid_electric_vehicle",
    "battery_electric_vehicle",
    "zero_percent_laden",
    "0_percent_laden",
    "fifty_percent_laden",
    "50_percent_laden",
    "hundred_percent_laden",
    "100_percent_laden",
    "average_laden",
    "with_rf",
    "without_rf",
    "general",
];

const FACTOR_GROUP_LABELS: Record<string, string> = {
    diesel: "Diesel",
    petrol: "Petrol",
    cng: "Compressed Natural Gas (CNG)",
    lpg: "Liquefied Petroleum Gas (LPG)",
    unknown: "Unknown Powertrain (Fleet Average)",
    plug_in_hybrid_electric_vehicle: "Plug-in Hybrid Electric (PHEV)",
    battery_electric_vehicle: "Battery Electric (BEV - Zero Direct Emissions)",
    zero_percent_laden: "0% Laden (Unladen / Empty)",
    "0_percent_laden": "0% Laden (Unladen / Empty)",
    fifty_percent_laden: "50% Laden (Half Loaded)",
    "50_percent_laden": "50% Laden (Half Loaded)",
    hundred_percent_laden: "100% Laden (Fully Loaded)",
    "100_percent_laden": "100% Laden (Fully Loaded)",
    average_laden: "Average Laden (Fleet Average)",
    with_rf: "With Radiative Forcing (Flight Atmospheric Effect)",
    without_rf: "Without Radiative Forcing",
    general: "General Freight Standard",
};

function extractUnitSymbol(f?: unknown): string {
    if (!f || typeof f !== "object") return "tonne.km";
    const raw = f as Record<string, unknown>;
    if (typeof raw.unit_symbol === "string" && raw.unit_symbol.trim()) return raw.unit_symbol;
    if (typeof raw.unit_code === "string" && raw.unit_code.trim()) return raw.unit_code;
    if (typeof raw.unit_name === "string" && raw.unit_name.trim()) return raw.unit_name;
    if (raw.unit && typeof raw.unit === "object") {
        const u = raw.unit as Record<string, unknown>;
        if (typeof u.symbol === "string" && u.symbol.trim()) return u.symbol;
        if (typeof u.unit_symbol === "string" && u.unit_symbol.trim()) return u.unit_symbol;
        if (typeof u.name === "string" && u.name.trim()) return u.name;
        if (typeof u.code === "string" && u.code.trim()) return u.code;
    }
    if (typeof raw.unit === "string" && raw.unit.trim()) return raw.unit;
    return "tonne.km";
}

function extractActiveFactorsMap(selectedFactor: unknown): Record<string, GasEmissionsDto> {
    if (!selectedFactor || typeof selectedFactor !== "object") return {};
    const raw = selectedFactor as Record<string, unknown>;
    const result: Record<string, GasEmissionsDto> = {};

    // 1. Check nested dictionary f.factors
    if (raw.factors && typeof raw.factors === "object") {
        const dict = raw.factors as Record<string, unknown>;
        for (const [k, v] of Object.entries(dict)) {
            if (v && typeof v === "object" && ("kg_co2e" in (v as object) || "t_co2e" in (v as object))) {
                result[k] = v as GasEmissionsDto;
            }
        }
    }

    // 2. Check nested dictionary f.emission_factors
    if (raw.emission_factors && typeof raw.emission_factors === "object") {
        const dict = raw.emission_factors as Record<string, unknown>;
        for (const [k, v] of Object.entries(dict)) {
            if (v && typeof v === "object" && ("kg_co2e" in (v as object) || "t_co2e" in (v as object))) {
                result[k] = v as GasEmissionsDto;
            }
        }
    }

    // 3. Check top-level keys on selectedFactor object directly (from real backend API payload!)
    for (const key of KNOWN_FACTOR_KEYS) {
        if (key in raw && raw[key] && typeof raw[key] === "object") {
            const val = raw[key] as Record<string, unknown>;
            if ("kg_co2e" in val || "t_co2e" in val) {
                result[key] = val as unknown as GasEmissionsDto;
            }
        }
    }

    return result;
}

export function Category9FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category9FormModalProps) {
    const reportingPeriodsQuery = useReportingPeriods();
    const periods = useMemo(() => reportingPeriodsQuery.data ?? [], [reportingPeriodsQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    // Step 1: Category
    const categoriesQuery = useFreightingGoodsCategories();
    const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.activityCategory || "Vans" : "Vans"),
    );

    const activeCategory = selectedCategory || categories[0] || "Vans";

    // Step 2: Types filtered by category
    const typesQuery = useFreightingGoodsTypes(activeCategory);
    const types = useMemo(() => typesQuery.data ?? [], [typesQuery.data]);
    const [selectedTypeId, setSelectedTypeId] = useState<string>("");

    const activeTypeId = selectedTypeId && types.some((t) => t.id === selectedTypeId)
        ? selectedTypeId
        : (types[0]?.id ?? "7ca648b2-4d1a-4638-b7eb-6c1c38547432");

    // Step 3: Factors filtered by type ID
    const factorsQuery = useFreightingGoodsFactors(activeTypeId);
    const rawFactors = useMemo(() => factorsQuery.data ?? [], [factorsQuery.data]);
    const factors = useMemo(
        () => (rawFactors.length > 0 ? rawFactors : DEFAULT_FREIGHTING_FACTORS),
        [rawFactors],
    );

    const [selectedFactorId, setSelectedFactorId] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.freightingGoodsEmissionFactorId || "" : ""),
    );

    const activeFactorId = selectedFactorId && factors.some((f: FreightingGoodsFactor) => f.id === selectedFactorId)
        ? selectedFactorId
        : (factors[0]?.id ?? "18f8e02d-05e8-4a94-916c-03d36b801a61");

    const selectedFactor: FreightingGoodsFactor | undefined = useMemo(
        () => factors.find((f: FreightingGoodsFactor) => f.id === activeFactorId) ?? factors[0],
        [factors, activeFactorId],
    );

    const activeUnitSymbol = extractUnitSymbol(selectedFactor);

    // Step 4: Dynamic Factor Group safely mapped
    const activeFactorsMap = useMemo<Record<string, GasEmissionsDto>>(() => {
        return extractActiveFactorsMap(selectedFactor);
    }, [selectedFactor]);

    const availableGroups = useMemo(() => {
        const keys = Object.keys(activeFactorsMap);
        if (keys.length > 0) return keys;
        return ["diesel"];
    }, [activeFactorsMap]);

    const [selectedFactorGroup, setSelectedFactorGroup] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.factorGroup || "diesel" : "diesel"),
    );

    const activeFactorGroup = selectedFactorGroup && availableGroups.includes(selectedFactorGroup)
        ? selectedFactorGroup
        : (availableGroups[0] ?? "diesel");

    const activeEmissionsDetail = useMemo(() => {
        if (!activeFactorsMap) return null;
        return activeFactorsMap[activeFactorGroup] ?? Object.values(activeFactorsMap)[0] ?? null;
    }, [activeFactorsMap, activeFactorGroup]);

    // Form inputs
    const [reportingPeriodId, setReportingPeriodId] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriodId || periods[0]?.id || "" : periods[0]?.id || ""),
    );
    const [activityDate, setActivityDate] = useState(
        () => (isEditOrAmend ? initialEntry?.activityDate || "2025-07-10" : "2025-07-10"),
    );
    const [activityValue, setActivityValue] = useState(
        () => (isEditOrAmend ? String(initialEntry?.activityValue || "3200") : "3200"),
    );
    const [description, setDescription] = useState(
        () => (isEditOrAmend ? initialEntry?.description || "" : ""),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Dropdown Select Options
    const categorySelectOptions: CustomSelectOption[] = useMemo(
        () => categories.map((cat) => ({ value: cat, label: cat })),
        [categories],
    );

    const typeSelectOptions: CustomSelectOption[] = useMemo(
        () => types.map((t) => ({ value: t.id, label: t.name })),
        [types],
    );

    const unitSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            factors.map((f: FreightingGoodsFactor) => ({
                value: f.id,
                label: extractUnitSymbol(f),
            })),
        [factors],
    );

    const groupSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            availableGroups.map((grp) => ({
                value: grp,
                label: FACTOR_GROUP_LABELS[grp] || grp,
            })),
        [availableGroups],
    );

    const numValue = parseFloat(activityValue) || 0;
    const kgFactorRate = Number(activeEmissionsDetail?.kg_co2e || 0);
    const estimatedKgCo2e = numValue > 0 ? numValue * kgFactorRate : 0;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        const activePeriodId = reportingPeriodId || periods[0]?.id;
        if (!activePeriodId) {
            newErrors.reportingPeriodId = "Reporting period is required.";
        }
        if (!activeFactorId) {
            newErrors.freightingGoodsFactorId = "Please select a valid freighting goods emission factor.";
        }
        if (!activeFactorGroup) {
            newErrors.factorGroup = "Please select a vehicle factor group / powertrain / lading.";
        }
        if (!activityDate) {
            newErrors.activityDate = "Activity date is required.";
        }
        if (!numValue || numValue <= 0) {
            newErrors.activityValue = `Activity quantity in ${activeUnitSymbol} must be greater than 0.`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submittingRef.current || isSubmitting || submitting) return;

        if (!validate()) return;

        submittingRef.current = true;
        setSubmitting(true);

        try {
            const activePeriodId = reportingPeriodId || periods[0]?.id || "";

            const basePayload: CreateCategory9TransportPayload = {
                reporting_period_id: activePeriodId,
                facility_id: null,
                freighting_goods_emission_factor_id: activeFactorId,
                factor_group: activeFactorGroup,
                activity_date: activityDate,
                activity_value: numValue,
                description: description.trim() || null,
                status: "draft",
                notes: notes.trim() || null,
            };

            if (mode === "amend" && initialEntry) {
                const amendPayload: AmendCategory9TransportPayload = {
                    ...basePayload,
                    amended_from_id: initialEntry.id,
                };
                await onSubmit(amendPayload);
            } else {
                await onSubmit(basePayload);
            }
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    const busy = isSubmitting || submitting;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            9
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Category 9 Downstream Transport Activity"
                                    : mode === "edit"
                                      ? "Edit Category 9 Transport Activity"
                                      : "Amend Verified Downstream Transport Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                DEFRA Freighting Goods Distance / Weight-Distance Protocol
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

                    {/* Reporting Period */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Reporting Period <span className="text-error">*</span>
                        </label>
                        <select
                            value={reportingPeriodId || (periods[0]?.id ?? "")}
                            onChange={(e) => setReportingPeriodId(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            {periods.length === 0 && <option value="">Loading reporting periods...</option>}
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.reportingYear})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4-Step Cascade Selector */}
                    <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 space-y-4">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
                            <MaterialIcon name="filter_alt" size="sm" className="text-secondary" />
                            <span>DEFRA Freighting Goods 4-Step Factor Cascade</span>
                        </div>

                        {/* Step 1: Category */}
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Step 1: Select Transportation Mode Category <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={categorySelectOptions}
                                value={activeCategory}
                                onChange={(val) => {
                                    setSelectedCategory(val);
                                    setSelectedTypeId("");
                                    setSelectedFactorId("");
                                }}
                                placeholder="Select category (Vans, HGV, Air, Rail, Sea)..."
                                className="font-mono text-xs"
                                variant="form"
                                isSearchable={true}
                            />
                        </div>

                        {/* Step 2: Vehicle Type */}
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Step 2: Select Vehicle / Vessel Classification <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={typeSelectOptions}
                                value={activeTypeId}
                                onChange={(val) => {
                                    setSelectedTypeId(val);
                                    setSelectedFactorId("");
                                }}
                                placeholder="Select vehicle / vessel classification..."
                                className="font-mono text-xs"
                                variant="form"
                                isSearchable={true}
                            />
                        </div>

                        {/* Step 3: Measurement Unit */}
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Step 3: Select Measurement Unit <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={unitSelectOptions}
                                value={activeFactorId}
                                onChange={(val) => setSelectedFactorId(val)}
                                placeholder="Select measurement unit..."
                                className="font-mono text-xs"
                                variant="form"
                                isSearchable={false}
                            />
                        </div>

                        {/* Step 4: Factor Group / Powertrain / Lading */}
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Step 4: Select Factor Group / Powertrain / Lading <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={groupSelectOptions}
                                value={activeFactorGroup}
                                onChange={(val) => setSelectedFactorGroup(val)}
                                placeholder="Select factor group..."
                                className="font-mono text-xs"
                                variant="form"
                                isSearchable={false}
                            />
                        </div>
                    </div>

                    {/* Transport Route Description */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Cargo & Route Description (Optional)
                        </label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Outbound last-mile product delivery to retail outlets"
                            className="font-mono text-xs"
                        />
                    </div>

                    {/* Activity Date & Quantity */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Activity Date <span className="text-error">*</span>
                            </label>
                            <DatePicker value={activityDate} onChange={setActivityDate} className="font-mono text-xs" />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Activity Quantity ({activeUnitSymbol}) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={activityValue}
                                onChange={(e) => setActivityValue(e.target.value)}
                                placeholder={`e.g. 3200 ${activeUnitSymbol}`}
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                            Downstream Transport Emission Calculation Preview
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xs font-bold text-primary">
                                {numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} {activeUnitSymbol} ({activeCategory} - {FACTOR_GROUP_LABELS[activeFactorGroup] || activeFactorGroup})
                            </span>
                            <span className="font-mono text-xs font-bold text-secondary">
                                {estimatedTCo2e.toFixed(4)} tCO₂e ({estimatedKgCo2e.toFixed(2)} kgCO₂e)
                            </span>
                        </div>
                        <p className="font-mono text-[10px] text-on-surface-variant">
                            Applied Factor Rate: {kgFactorRate.toFixed(5)} kgCO₂e / {activeUnitSymbol} [DEFRA Standard]
                        </p>
                    </div>

                    {/* Internal Notes */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Notes & Dispatch Invoice Remarks
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter dispatch invoices, customer receipts, distribution partner notes..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={busy}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={busy}>
                            {busy
                                ? "Saving..."
                                : mode === "create"
                                  ? "Create Transport Activity"
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
