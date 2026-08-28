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
import {
    AmendCategory15InvestmentPayload,
    AssetClassEnum,
    Category15InvestmentEntry,
    CreateCategory15InvestmentPayload,
} from "@/lib/scope3/category15/types";
import { useAssetClasses } from "@/lib/scope3/category15/hooks";

interface Category15FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: Category15InvestmentEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateCategory15InvestmentPayload | AmendCategory15InvestmentPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category15FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category15FormModalProps) {
    const facilitiesQuery = useFacilities();
    const assetClassesQuery = useAssetClasses();
    const reportingPeriodsQuery = useReportingPeriods();

    const assetClasses = useMemo(() => assetClassesQuery.data ?? [], [assetClassesQuery.data]);
    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);
    const periods = useMemo(() => reportingPeriodsQuery.data ?? [], [reportingPeriodsQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const [reportingPeriodId, setReportingPeriodId] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriodId || periods[0]?.id || "" : periods[0]?.id || ""),
    );
    const [activityDate, setActivityDate] = useState(
        () => (isEditOrAmend ? initialEntry?.activityDate || "2024-06-15" : "2024-06-15"),
    );
    const [whatYouFinanced, setWhatYouFinanced] = useState(
        () => (isEditOrAmend ? initialEntry?.whatYouFinanced || "" : ""),
    );
    const [assetClass, setAssetClass] = useState<AssetClassEnum>(
        () => (isEditOrAmend ? initialEntry?.assetClass || "listed_shares_or_corporate_bonds" : "listed_shares_or_corporate_bonds"),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [outstandingAmount, setOutstandingAmount] = useState(
        () => (isEditOrAmend ? String(initialEntry?.outstandingAmountCrores || "250") : "250"),
    );
    const [totalCompanyWorth, setTotalCompanyWorth] = useState(
        () => (isEditOrAmend ? String(initialEntry?.totalCompanyWorthCrores || "2500") : "2500"),
    );
    const [companyScope1, setCompanyScope1] = useState(
        () => (isEditOrAmend ? String(initialEntry?.companyScope1Emissions || "1000") : "1000"),
    );
    const [companyScope2, setCompanyScope2] = useState(
        () => (isEditOrAmend ? String(initialEntry?.companyScope2Emissions || "100") : "100"),
    );
    const [companyScope3, setCompanyScope3] = useState(
        () => (isEditOrAmend ? String(initialEntry?.companyScope3Emissions || "2000") : "2000"),
    );
    const [notes, setNotes] = useState(
        () => (isEditOrAmend ? initialEntry?.notes || "" : ""),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const assetClassOptions: CustomSelectOption[] = useMemo(
        () =>
            assetClasses.map((a) => ({
                value: a.asset_class,
                label: `[PCAF Class #${a.asset_class_no}] ${a.name}`,
            })),
        [assetClasses],
    );

    const numOutstanding = parseFloat(outstandingAmount) || 0;
    const numWorth = parseFloat(totalCompanyWorth) || 0;
    const numScope1 = parseFloat(companyScope1) || 0;
    const numScope2 = parseFloat(companyScope2) || 0;
    const numScope3 = parseFloat(companyScope3) || 0;

    const attributionFactor = numWorth > 0 ? numOutstanding / numWorth : 0;
    const attributionPct = attributionFactor * 100;

    const financedScope1 = attributionFactor * numScope1;
    const financedScope2 = attributionFactor * numScope2;
    const financedScope3 = attributionFactor * numScope3;
    const totalFinancedEmissionsTco2e = financedScope1 + financedScope2 + financedScope3;

    function validate() {
        const newErrors: Record<string, string> = {};

        const activePeriodId = reportingPeriodId || periods[0]?.id;
        if (!activePeriodId) {
            newErrors.reportingPeriodId = "Reporting period is required.";
        }
        if (!whatYouFinanced.trim()) {
            newErrors.whatYouFinanced = "Financed asset / investment description is required.";
        }
        if (!activityDate) {
            newErrors.activityDate = "Valuation / Activity date is required.";
        }
        if (numOutstanding < 0) {
            newErrors.outstandingAmount = "Outstanding investment amount must be >= 0.";
        }
        if (numWorth <= 0) {
            newErrors.totalCompanyWorth = "Total company / asset worth must be > 0.";
        }
        if (numOutstanding > numWorth) {
            newErrors.outstandingAmount = "Outstanding amount cannot exceed total company worth.";
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
            const matchedAssetClass = assetClasses.find((a) => a.asset_class === assetClass);

            const basePayload: CreateCategory15InvestmentPayload = {
                reporting_period_id: reportingPeriodId || periods[0]?.id || null,
                activity_date: activityDate,
                what_you_financed: whatYouFinanced.trim(),
                asset_class: assetClass,
                asset_class_no: matchedAssetClass?.asset_class_no || 1,
                outstanding_amount: numOutstanding,
                total_company_worth: numWorth,
                currency: "INR_CRORES",
                company_scope1_emissions: numScope1,
                company_scope2_emissions: numScope2,
                company_scope3_emissions: numScope3,
                facility_id: facilityId || null,
                status: "draft",
                notes: notes.trim() || null,
            };

            if (mode === "amend" && initialEntry) {
                const amendPayload: AmendCategory15InvestmentPayload = {
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

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            15
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Investment Activity (PCAF Standard)"
                                    : mode === "edit"
                                      ? "Edit Investment Activity"
                                      : "Amend Verified Investment Activity"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Category 15 Investments & Financed Emissions (PCAF Attribution Standard)
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
                                Financed Asset Description <span className="text-error">*</span>
                            </label>
                            <Input
                                value={whatYouFinanced}
                                onChange={(e) => setWhatYouFinanced(e.target.value)}
                                placeholder="e.g. Listed cement company shares"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                PCAF Asset Class <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={assetClassOptions}
                                value={assetClass}
                                onChange={(val) => setAssetClass(val as AssetClassEnum)}
                                placeholder="Select PCAF asset class..."
                                className="font-mono text-xs"
                                variant="form"
                                isSearchable={true}
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Valuation Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={activityDate}
                                onChange={setActivityDate}
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Facility / Portfolio Site
                            </label>
                            <select
                                value={facilityId}
                                onChange={(e) => setFacilityId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value="">No facility (Corporate)</option>
                                {facilities.map((fac) => (
                                    <option key={fac.id} value={fac.id}>
                                        {fac.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Outstanding (₹ Crores) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={outstandingAmount}
                                onChange={(e) => setOutstandingAmount(e.target.value)}
                                placeholder="e.g. 250"
                                className="font-mono text-xs font-bold"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Company Worth (₹ Cr) <span className="text-error">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={totalCompanyWorth}
                                onChange={(e) => setTotalCompanyWorth(e.target.value)}
                                placeholder="e.g. 2500"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    {/* Company Total Emissions Inputs (tCO2e) */}
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/60 space-y-3">
                        <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block">
                            Investee Company Total GHG Emissions (tCO₂e)
                        </span>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div>
                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-1">
                                    Company Scope 1 (tCO₂e)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={companyScope1}
                                    onChange={(e) => setCompanyScope1(e.target.value)}
                                    placeholder="e.g. 1000"
                                    className="font-mono text-xs h-8"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-1">
                                    Company Scope 2 (tCO₂e)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={companyScope2}
                                    onChange={(e) => setCompanyScope2(e.target.value)}
                                    placeholder="e.g. 100"
                                    className="font-mono text-xs h-8"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-1">
                                    Company Scope 3 (tCO₂e)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={companyScope3}
                                    onChange={(e) => setCompanyScope3(e.target.value)}
                                    placeholder="e.g. 2000"
                                    className="font-mono text-xs h-8"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PCAF Calculation Live Preview Box */}
                    <div className="rounded-lg bg-surface-container-low p-3.5 border border-outline-variant/40 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant">
                                Live PCAF Financed Emissions Preview
                            </span>
                            <span className="font-mono text-xs font-bold text-secondary">
                                Attribution: {attributionPct.toFixed(2)}% ({attributionFactor.toFixed(4)})
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 font-mono text-xs border-t border-outline-variant/30 pt-2">
                            <div>
                                <span className="text-on-surface-variant">Financed Scope 1:</span>{" "}
                                <span className="font-bold text-primary">{financedScope1.toFixed(2)} t</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant">Financed Scope 2:</span>{" "}
                                <span className="font-bold text-primary">{financedScope2.toFixed(2)} t</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant">Financed Scope 3:</span>{" "}
                                <span className="font-bold text-primary">{financedScope3.toFixed(2)} t</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant font-bold">Total Financed:</span>{" "}
                                <span className="font-bold text-secondary">{totalFinancedEmissionsTco2e.toFixed(4)} tCO₂e</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Notes / Audited Valuation Remarks
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter portfolio valuation report reference, equity share details, or PCAF data quality scores..."
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
                                  ? "Create Investment Activity"
                                  : mode === "edit"
                                    ? "Update Activity"
                                    : "Save Amended Record"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
