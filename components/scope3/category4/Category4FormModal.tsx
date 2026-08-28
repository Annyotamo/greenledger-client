"use client";

import { useState, useMemo, useRef } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { ANNUAL_USD_INR_EXCHANGE_RATES, DEFAULT_USEEIO_SPEND_FACTORS } from "@/lib/scope3/category1/types";
import {
    AmendCategory4SpendPayload,
    Category4SpendEntry,
    CreateCategory4SpendPayload,
} from "@/lib/scope3/category4/types";
import { useActiveEmissionFactorSources } from "@/lib/scope3/category1/hooks";
import { useCategory4SpendFactors } from "@/lib/scope3/category4/hooks";

interface Category4FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category4SpendEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateCategory4SpendPayload | AmendCategory4SpendPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category4FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category4FormModalProps) {
    const facilitiesQuery = useFacilities();
    const sourcesQuery = useActiveEmissionFactorSources("other");
    const reportingPeriodsQuery = useReportingPeriods();

    const sources = useMemo(() => sourcesQuery.data ?? [], [sourcesQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);
    const periods = useMemo(() => reportingPeriodsQuery.data ?? [], [reportingPeriodsQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const [sourceId, setSourceId] = useState<string>(
        () => initialEntry?.factor?.source?.id || sources[0]?.id || "ce689b2d-6882-4c9b-9cc5-45d65f21d42e",
    );

    const selectedSourceId = sourceId || sources[0]?.id || "ce689b2d-6882-4c9b-9cc5-45d65f21d42e";
    const factorsQuery = useCategory4SpendFactors(selectedSourceId);
    const rawFactors = useMemo(() => factorsQuery.data ?? [], [factorsQuery.data]);
    const factors = useMemo(
        () => (rawFactors.length > 0 ? rawFactors : DEFAULT_USEEIO_SPEND_FACTORS),
        [rawFactors],
    );

    const [sectorCategory, setSectorCategory] = useState<string>("");

    const sectorCategories = useMemo(() => {
        const set = new Set<string>();
        factors.forEach((f) => {
            const cat = f.naicsSectorCategory || f.category;
            if (cat) set.add(cat);
        });
        return Array.from(set);
    }, [factors]);

    const sectorSelectOptions: CustomSelectOption[] = useMemo(() => {
        const options: CustomSelectOption[] = [
            { label: `All NAICS Sectors & Categories (${factors.length} factors)`, value: "" },
        ];
        sectorCategories.forEach((cat) => {
            const count = factors.filter((f) => (f.naicsSectorCategory || f.category) === cat).length;
            options.push({ label: `${cat} (${count})`, value: cat });
        });
        return options;
    }, [factors, sectorCategories]);

    const filteredFactors = useMemo(() => {
        if (!sectorCategory) return factors;
        return factors.filter((f) => (f.naicsSectorCategory || f.category) === sectorCategory);
    }, [factors, sectorCategory]);

    const [reportingPeriodId, setReportingPeriodId] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriodId || periods[0]?.id || "" : periods[0]?.id || ""),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [factorId, setFactorId] = useState(
        () => (isEditOrAmend ? initialEntry?.scope3SpendEmissionFactorId || "" : ""),
    );
    const [spendDate, setSpendDate] = useState(
        () => (isEditOrAmend ? initialEntry?.spendDate || "2024-10-05" : "2024-10-05"),
    );
    const [spendYear, setSpendYear] = useState<number>(
        () => (isEditOrAmend ? initialEntry?.spendYear || 2024 : 2024),
    );
    const [spendInInr, setSpendInInr] = useState(
        () => (isEditOrAmend ? String(initialEntry?.spendInInr || "415000") : "415000"),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedFactorId = factorId || (filteredFactors[0]?.id ?? factors[0]?.id ?? "ca68b110-59ba-4c62-b841-270138cc06dd");
    const selectedFactor = useMemo(
        () => factors.find((f) => f.id === selectedFactorId) ?? factors[0],
        [factors, selectedFactorId],
    );

    const factorSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            filteredFactors.map((f) => ({
                value: f.id,
                label: `NAICS ${f.naicsCode} - ${f.naicsTitle || f.commodityTitle} (${f.kgCo2ePerUsdWithMargins} kgCO₂e/$)`,
            })),
        [filteredFactors],
    );

    function handleSpendDateChange(dateStr: string) {
        setSpendDate(dateStr);
        if (dateStr) {
            const parsedYear = new Date(dateStr).getFullYear();
            if (parsedYear >= 2020 && parsedYear <= 2025) {
                setSpendYear(parsedYear);
            }
        }
    }

    const exchangeRate = ANNUAL_USD_INR_EXCHANGE_RATES[spendYear] || 83.45;
    const numSpendInr = parseFloat(spendInInr) || 0;
    const numSpendUsd = numSpendInr > 0 ? numSpendInr / exchangeRate : 0;

    const estimatedKgCo2e = selectedFactor ? numSpendUsd * selectedFactor.kgCo2ePerUsdWithMargins : 0;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        const activePeriodId = reportingPeriodId || periods[0]?.id;
        if (!activePeriodId) {
            newErrors.reportingPeriodId = "Reporting period is required.";
        }
        if (!selectedFactorId) {
            newErrors.factorId = "Please select a USEEIO freight transport emission factor.";
        }
        if (!spendDate) {
            newErrors.spendDate = "Spend date is required.";
        } else {
            const dateYear = new Date(spendDate).getFullYear();
            if (dateYear !== spendYear) {
                newErrors.spendDate = `Spend date year (${dateYear}) must match Spend Year (${spendYear}).`;
            }
        }
        if (spendYear < 2020 || spendYear > 2025) {
            newErrors.spendYear = "Spend year must be between 2020 and 2025.";
        }
        if (!numSpendInr || numSpendInr <= 0) {
            newErrors.spendInInr = "Spend amount in INR must be greater than 0.";
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
            const basePayload: CreateCategory4SpendPayload = {
                reporting_period_id: reportingPeriodId || periods[0]?.id || null,
                facility_id: facilityId || null,
                scope3_spend_emission_factor_id: selectedFactorId,
                spend_date: spendDate,
                spend_in_inr: numSpendInr,
                spend_year: spendYear,
                status: "draft",
                notes: notes.trim() || null,
            };

            if (mode === "amend" && initialEntry) {
                const amendPayload: AmendCategory4SpendPayload = {
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
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[85vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            4
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Category 4 Freight Spend Entry"
                                    : mode === "edit"
                                      ? "Edit Category 4 Spend Entry"
                                      : "Amend Verified Freight Spend Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Upstream Transportation & Distribution (Freight Transport, Warehousing, 3PL)
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

                    {/* Source Standard Select */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Emission Factor Source Standard <span className="text-error">*</span>
                        </label>
                        <select
                            value={selectedSourceId}
                            onChange={(e) => {
                                setSourceId(e.target.value);
                                setSectorCategory("");
                            }}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            {sources.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.standard} v{s.version} ({s.data_year}) - {s.region} ({s.emission_unit}/$)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* NAICS Sector / Category Filter Dropdown */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            NAICS Sector / Category Filter
                        </label>
                        <CustomSelect
                            options={sectorSelectOptions}
                            value={sectorCategory}
                            onChange={(val) => {
                                setSectorCategory(val);
                                setFactorId("");
                            }}
                            placeholder="All NAICS Sectors & Categories..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    {/* Searchable Factor Select */}
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Freight Transportation Factor (NAICS Commodity Search) <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={factorSelectOptions}
                            value={selectedFactorId}
                            onChange={(val) => setFactorId(val)}
                            placeholder="Type to search NAICS trucking, rail, air, ocean freight..."
                            className="font-mono text-xs"
                            variant="form"
                            isSearchable={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Spend Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={spendDate}
                                onChange={handleSpendDateChange}
                                className="font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Spend Year (2020–2025) <span className="text-error">*</span>
                            </label>
                            <select
                                value={spendYear}
                                onChange={(e) => setSpendYear(Number(e.target.value))}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value={2020}>2020 (Ex. Rate: ₹74.13/USD)</option>
                                <option value={2021}>2021 (Ex. Rate: ₹73.92/USD)</option>
                                <option value={2022}>2022 (Ex. Rate: ₹78.60/USD)</option>
                                <option value={2023}>2023 (Ex. Rate: ₹82.58/USD)</option>
                                <option value={2024}>2024 (Ex. Rate: ₹83.45/USD)</option>
                                <option value={2025}>2025 (Ex. Rate: ₹84.20/USD)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Freight Spend Amount in INR (₹) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={spendInInr}
                                onChange={(e) => setSpendInInr(e.target.value)}
                                placeholder="e.g. 415000"
                                className="font-mono text-xs font-bold"
                            />
                        </div>

                        <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                            <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                                Calculated Live Preview
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-xs font-bold text-primary">
                                    ${numSpendUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                                </span>
                                <span className="font-mono text-xs font-bold text-secondary">
                                    {estimatedTCo2e.toFixed(4)} tCO₂e
                                </span>
                            </div>
                            <p className="font-mono text-[10px] text-on-surface-variant">
                                Ex. Rate: ₹{exchangeRate}/USD • Factor: {selectedFactor?.kgCo2ePerUsdWithMargins ?? 0} kg/USD
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Notes / Logistics Description
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter carrier name, bill of lading ID, freight route, or invoice details..."
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
                                  ? "Create Freight Spend Entry"
                                  : mode === "edit"
                                    ? "Update Entry"
                                    : "Save Amended Entry"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
