"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import { ANNUAL_USD_INR_EXCHANGE_RATES } from "@/lib/scope3/category1/types";
import {
    Category2SpendEntry,
    CreateCategory2SpendPayload,
    AmendCategory2SpendPayload,
} from "@/lib/scope3/category2/types";
import { useActiveEmissionFactorSources } from "@/lib/scope3/category1/hooks";
import { useCategory2SpendFactors } from "@/lib/scope3/category2/hooks";

interface Category2FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category2SpendEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateCategory2SpendPayload | AmendCategory2SpendPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category2FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category2FormModalProps) {
    const facilitiesQuery = useFacilities();
    const sourcesQuery = useActiveEmissionFactorSources("other");

    const sources = useMemo(() => sourcesQuery.data ?? [], [sourcesQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [sourceId, setSourceId] = useState<string>(
        () => initialEntry?.factor?.source?.id || sources[0]?.id || "ce689b2d-6882-4c9b-9cc5-45d65f21d42e",
    );

    const selectedSourceId = sourceId || sources[0]?.id || "ce689b2d-6882-4c9b-9cc5-45d65f21d42e";
    const factorsQuery = useCategory2SpendFactors(selectedSourceId);
    const factors = useMemo(() => factorsQuery.data ?? [], [factorsQuery.data]);

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

    const [reportingPeriod, setReportingPeriod] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriod || "FY 2021-22" : "FY 2021-22"),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [factorId, setFactorId] = useState(
        () => (isEditOrAmend ? initialEntry?.scope3SpendEmissionFactorId || "" : ""),
    );
    const [spendDate, setSpendDate] = useState(
        () => (isEditOrAmend ? initialEntry?.spendDate || "2021-12-09" : "2021-12-09"),
    );
    const [spendYear, setSpendYear] = useState<number>(
        () => (isEditOrAmend ? initialEntry?.spendYear || 2021 : 2021),
    );
    const [spendInInr, setSpendInInr] = useState(
        () => (isEditOrAmend ? String(initialEntry?.spendInInr || "200000") : "200000"),
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

    const exchangeRate = ANNUAL_USD_INR_EXCHANGE_RATES[spendYear] || 73.92;
    const numSpendInr = parseFloat(spendInInr) || 0;
    const numSpendUsd = numSpendInr > 0 ? numSpendInr / exchangeRate : 0;

    const estimatedKgCo2e = selectedFactor ? numSpendUsd * selectedFactor.kgCo2ePerUsdWithMargins : 0;
    const estimatedTCo2e = estimatedKgCo2e / 1000;

    function validate() {
        const newErrors: Record<string, string> = {};

        if (!reportingPeriod.trim()) {
            newErrors.reportingPeriod = "Reporting period is required (e.g. FY 2021-22).";
        }
        if (!selectedFactorId) {
            newErrors.factorId = "Please select a USEEIO capital goods emission factor.";
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
        if (!validate()) return;

        const basePayload: CreateCategory2SpendPayload = {
            reporting_period: reportingPeriod.trim(),
            facility_id: facilityId || null,
            scope3_spend_emission_factor_id: selectedFactorId,
            spend_date: spendDate,
            spend_in_inr: numSpendInr,
            spend_year: spendYear,
            notes: notes.trim() || null,
        };

        if (mode === "amend" && initialEntry) {
            const amendPayload: AmendCategory2SpendPayload = {
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
            {/* Full-screen Backdrop Blur Overlay */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog Box */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[85vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            2
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Category 2 Capital Goods Spend"
                                    : mode === "edit"
                                      ? "Edit Category 2 Spend Entry"
                                      : "Amend Verified Capital Goods Entry"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Capital Goods (Equipment, Machinery, Buildings, Vehicles)
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

                    {/* CustomSelect NAICS Sector / Category Filter Dropdown */}
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
                            Capital Equipment USEEIO Factor (NAICS Code Search) <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={factorSelectOptions}
                            value={selectedFactorId}
                            onChange={(val) => setFactorId(val)}
                            placeholder="Type to search NAICS machinery, equipment..."
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
                                Capital Expenditure in INR (₹) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={spendInInr}
                                onChange={(e) => setSpendInInr(e.target.value)}
                                placeholder="e.g. 200000"
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
                            Notes / Capital Asset Description
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter machinery specification, equipment serial number, asset tag, or PO reference..."
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
                                  ? "Create Capital Spend Entry"
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
