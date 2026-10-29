"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import { EPA_2022_EXCHANGE_RATE } from "@/lib/scope3/category1/types";
import {
    Category2SpendEntry,
    CreateCategory2SpendPayload,
    AmendCategory2SpendPayload,
    DEFAULT_CATEGORY2_USEEIO_FACTORS,
} from "@/lib/scope3/category2/types";
import { useCategory2NaicsSectors, useCategory2Factors } from "@/lib/scope3/category2/hooks";
import { FormDocumentAttachmentField } from "@/components/scope3/documents/FormDocumentAttachmentField";
import { PendingDocumentAttachment } from "@/lib/scope3/documents/types";

interface Category2FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category2SpendEntry | null;
    onClose: () => void;
    onSubmit: (
        payload: CreateCategory2SpendPayload | AmendCategory2SpendPayload,
        pendingDocument?: PendingDocumentAttachment | null,
    ) => Promise<void>;
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
    const emissionSourcesQuery = useEmissionSources("supply_chain");
    const reportingPeriodsQuery = useReportingPeriods();

    const sources = useMemo(() => emissionSourcesQuery.data ?? [], [emissionSourcesQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);
    const periods = useMemo(() => reportingPeriodsQuery.data ?? [], [reportingPeriodsQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const defaultSourceId = "8578936a-9e7e-4b14-81c5-870c13a4a046";
    const [sourceId, setSourceId] = useState<string>(
        () => initialEntry?.factor?.source?.id || defaultSourceId,
    );

    // If sources load and sourceId is not set, default to first supply chain source
    useEffect(() => {
        if (!sourceId && sources.length > 0) {
            setSourceId(String(sources[0].id));
        }
    }, [sourceId, sources]);

    const selectedSourceId = sourceId || (sources[0]?.id ? String(sources[0].id) : defaultSourceId);

    // 1. Fetch dynamic NAICS sectors for selected source
    const sectorsQuery = useCategory2NaicsSectors(selectedSourceId);
    const sectors = useMemo(() => sectorsQuery.data ?? [], [sectorsQuery.data]);

    const [sectorCategory, setSectorCategory] = useState<string>(
        () => initialEntry?.factor?.naicsSectorCategory || "",
    );

    // Auto-select first sector if not set in create mode
    useEffect(() => {
        if (!isEditOrAmend && !sectorCategory && sectors.length > 0) {
            setSectorCategory(sectors[0]);
        }
    }, [isEditOrAmend, sectorCategory, sectors]);

    const sectorSelectOptions: CustomSelectOption[] = useMemo(() => {
        return sectors.map((sec) => ({
            label: sec,
            value: sec,
        }));
    }, [sectors]);

    // 2. Fetch dynamic factors for selected source & sector
    const factorsQuery = useCategory2Factors(selectedSourceId, sectorCategory || undefined);
    const rawFactors = useMemo(() => factorsQuery.data ?? [], [factorsQuery.data]);
    const factors = useMemo(
        () => (rawFactors.length > 0 ? rawFactors : DEFAULT_CATEGORY2_USEEIO_FACTORS),
        [rawFactors],
    );

    const [reportingPeriodId, setReportingPeriodId] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriodId || periods[0]?.id || "" : periods[0]?.id || ""),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [factorId, setFactorId] = useState<string>(
        () => (isEditOrAmend ? initialEntry?.scope3SpendEmissionFactorId || "" : ""),
    );
    const [spendDate, setSpendDate] = useState(
        () => (isEditOrAmend ? initialEntry?.spendDate || "2024-07-20" : "2024-07-20"),
    );
    const [spendInInr, setSpendInInr] = useState(
        () => (isEditOrAmend ? String(initialEntry?.spendInInr || "2490000") : "2490000"),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [pendingDocument, setPendingDocument] = useState<PendingDocumentAttachment | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-select first factor when factors load if none is selected
    useEffect(() => {
        if (factors.length > 0) {
            const exists = factors.some((f) => f.id === factorId);
            if (!factorId || !exists) {
                if (!isEditOrAmend || sectorCategory !== initialEntry?.factor?.naicsSectorCategory) {
                    setFactorId(factors[0].id);
                }
            }
        }
    }, [factors, factorId, isEditOrAmend, sectorCategory, initialEntry]);

    const selectedFactorId = factorId || factors[0]?.id || "";
    const selectedFactor = useMemo(() => {
        const found = factors.find((f) => f.id === selectedFactorId);
        if (found) return found;
        if (initialEntry?.factor && (initialEntry.factor.id === selectedFactorId || initialEntry.scope3SpendEmissionFactorId === selectedFactorId)) {
            return initialEntry.factor;
        }
        return factors[0];
    }, [factors, selectedFactorId, initialEntry]);

    const factorSelectOptions: CustomSelectOption[] = useMemo(
        () =>
            factors.map((f) => ({
                value: f.id,
                label: `NAICS ${f.naicsCode} - ${f.naicsTitle || f.commodityTitle} (${f.kgCo2ePerUsdWithMargins} kgCO₂e/$)`,
            })),
        [factors],
    );

    // Exchange rate is always the fixed EPA 2022 USD/INR baseline (78.60 INR/USD)
    const exchangeRate = EPA_2022_EXCHANGE_RATE;
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
            newErrors.factorId = "Please select a USEEIO capital goods emission factor.";
        }
        if (!spendDate) {
            newErrors.spendDate = "Spend date is required.";
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
            const basePayload: CreateCategory2SpendPayload = {
                reporting_period_id: reportingPeriodId || periods[0]?.id || null,
                facility_id: facilityId || null,
                scope3_spend_emission_factor_id: selectedFactorId,
                spend_date: spendDate,
                spend_in_inr: numSpendInr,
                status: "draft",
                notes: notes.trim() || null,
            };

            if (mode === "amend" && initialEntry) {
                const amendPayload: AmendCategory2SpendPayload = {
                    ...basePayload,
                    amended_from_id: initialEntry.id,
                };
                await onSubmit(amendPayload, pendingDocument);
            } else {
                await onSubmit(basePayload, pendingDocument);
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
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-sans text-xs font-bold">
                            2
                        </span>
                        <div>
                            <h3 className="font-display text-xl font-bold tracking-tight text-primary">
                                {mode === "create"
                                    ? "Log Category 2 Capital Goods Spend"
                                    : mode === "edit"
                                      ? "Edit Category 2 Spend Entry"
                                      : "Amend Verified Capital Goods Entry"}
                            </h3>
                            <p className="font-sans text-xs font-medium text-on-surface-variant">
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
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Reporting Period <span className="text-error">*</span>
                            </label>
                            <select
                                value={reportingPeriodId || (periods[0]?.id ?? "")}
                                onChange={(e) => setReportingPeriodId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                {periods.length === 0 && <option value="">Loading reporting periods...</option>}
                                {periods.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.reportingYear})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Facility (Optional)
                            </label>
                            <select
                                value={facilityId}
                                onChange={(e) => setFacilityId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary">
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
                        <label className="block font-sans text-xs font-semibold text-primary mb-1">
                            Emission Factor Source Standard <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={
                                sources.length > 0
                                    ? sources.map((s) => ({
                                          label: `${s.standard} ${s.version ? `v${s.version}` : ""}${s.data_year ? ` (${s.data_year})` : ""} - ${s.region || "US"} (${s.emission_unit || "kg"}/$)`,
                                          value: String(s.id),
                                      }))
                                    : [
                                          {
                                              label: "US EPA (USEEIO) v1.2 (2022) - US (kg/$)",
                                              value: "8578936a-9e7e-4b14-81c5-870c13a4a046",
                                          },
                                      ]
                            }
                            value={selectedSourceId}
                            onChange={(val) => {
                                setSourceId(val);
                                setSectorCategory("");
                                setFactorId("");
                            }}
                            placeholder={emissionSourcesQuery.isLoading ? "Loading emission sources..." : "Select Emission Source..."}
                            className="font-sans text-sm"
                            variant="form"
                            isLoading={emissionSourcesQuery.isLoading}
                        />
                    </div>

                    {/* CustomSelect NAICS Sector / Category Filter Dropdown */}
                    <div>
                        <label className="block font-sans text-xs font-semibold text-primary mb-1">
                            NAICS Sector <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={sectorSelectOptions}
                            value={sectorCategory}
                            onChange={(val) => {
                                setSectorCategory(val);
                                setFactorId("");
                            }}
                            placeholder={sectorsQuery.isLoading ? "Loading NAICS sectors..." : "Select NAICS Sector..."}
                            className="font-sans text-sm"
                            variant="form"
                            isSearchable={true}
                            isLoading={sectorsQuery.isLoading}
                        />
                    </div>

                    {/* Searchable Factor Select */}
                    <div>
                        <label className="block font-sans text-xs font-semibold text-primary mb-1">
                            Capital Equipment USEEIO Factor (NAICS Code Search) <span className="text-error">*</span>
                        </label>
                        <CustomSelect
                            options={factorSelectOptions}
                            value={selectedFactorId}
                            onChange={(val) => setFactorId(val)}
                            placeholder={
                                factorsQuery.isLoading
                                    ? "Loading machinery factors..."
                                    : !sectorCategory
                                    ? "Please choose a sector first..."
                                    : "Type to search NAICS machinery, equipment..."
                            }
                            className="font-sans text-sm"
                            variant="form"
                            isSearchable={true}
                            isLoading={factorsQuery.isLoading}
                            isDisabled={!sectorCategory}
                        />
                        {errors.factorId && <p className="mt-1 font-sans text-xs text-error">{errors.factorId}</p>}
                    </div>

                    {/* Spend Date — full width; year derived automatically by backend */}
                    <div>
                        <label className="block font-sans text-xs font-semibold text-primary mb-1">
                            Spend Date <span className="text-error">*</span>
                        </label>
                        <DatePicker
                            value={spendDate}
                            onChange={(dateStr) => setSpendDate(dateStr)}
                            className="font-sans text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-sans text-xs font-semibold text-primary mb-1">
                                Capital Expenditure in INR (₹) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={spendInInr}
                                onChange={(e) => setSpendInInr(e.target.value)}
                                placeholder="e.g. 2490000"
                                className="font-sans text-sm font-semibold tabular-nums"
                            />
                        </div>

                        <div className="rounded-lg bg-surface-container-low p-3 border border-outline-variant/40 space-y-1">
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                Calculated Live Preview
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-display text-base font-bold text-primary tabular-nums">
                                    ${numSpendUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                                </span>
                                <span className="font-display text-base font-bold text-secondary tabular-nums">
                                    {estimatedTCo2e.toFixed(4)} tCO₂e
                                </span>
                            </div>
                            <p className="font-sans text-xs text-on-surface-variant tabular-nums">
                                Ex. Rate: ₹{exchangeRate}/USD (EPA 2022) • Factor: {selectedFactor?.kgCo2ePerUsdWithMargins ?? 0} kg/USD
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block font-sans text-xs font-semibold text-primary mb-1">
                            Notes / Capital Asset Description
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter machinery specification, equipment serial number, asset tag, or PO reference..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <FormDocumentAttachmentField
                        value={pendingDocument}
                        onChange={setPendingDocument}
                        disabled={busy}
                        defaultDate={spendDate}
                    />

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={busy}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={busy}>
                            {busy
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
