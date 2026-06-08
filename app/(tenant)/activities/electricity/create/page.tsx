"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isAfter } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import { createElectricityActivity, uploadElectricityActivityDocument, uploadS3File } from "@/lib/activity/api";

const documentTypeOptions = [
    { label: "Invoice", value: "invoice" },
    { label: "Meter Read", value: "meter_read" },
    { label: "Delivery Note", value: "delivery_note" },
    { label: "Audit Report", value: "audit_report" },
    { label: "Internal Report", value: "internal_report" },
    { label: "Other", value: "other" },
];

function formFieldClass(error?: boolean) {
    return `w-full rounded-lg border ${error ? "border-error" : "border-outline-variant"} bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`;
}

export default function LogElectricityActivityPage() {
    const [form, setForm] = useState({
        reportingPeriod: "",
        facility: "",
        source: "",
        electricityKwh: "",
        electricityUnit: "kwh",
        electricityActivityType: "",
        sourceType: "",
        dataQualityTier: "",
        activityStartDate: "",
        activityEndDate: "",
        notes: "",
        documentType: "",
        documentName: "",
        documentLink: "",
        documentDate: "",
        attachmentName: "",
    });
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const emissionSourcesQuery = useEmissionSources();

    function handleChange(field: string, value: string) {
        setForm((current) => ({ ...current, [field]: value }) as typeof form);
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleDocumentLinkChange(value: string) {
        setDocumentFile(null);
        setForm((current) => ({ ...current, documentLink: value, attachmentName: "" }));
        setErrors((current) => ({ ...current, documentLink: "" }));
    }

    function handleStartDateChange(date: Date) {
        const nextEndDate = selectedEndDate && isAfter(date, selectedEndDate) ? date : selectedEndDate;
        setSelectedStartDate(date);
        setSelectedEndDate(nextEndDate);
        setForm((current) => ({
            ...current,
            activityStartDate: format(date, "yyyy-MM-dd"),
            activityEndDate: nextEndDate ? format(nextEndDate, "yyyy-MM-dd") : current.activityEndDate,
        }));
        setErrors((current) => ({ ...current, activityStartDate: "", activityEndDate: "" }));
    }

    function handleEndDateChange(date: Date) {
        const nextStartDate = selectedStartDate ? (isAfter(selectedStartDate, date) ? date : selectedStartDate) : date;
        setSelectedEndDate(date);
        setSelectedStartDate(nextStartDate);
        setForm((current) => ({
            ...current,
            activityStartDate: format(nextStartDate, "yyyy-MM-dd"),
            activityEndDate: format(date, "yyyy-MM-dd"),
        }));
        setErrors((current) => ({ ...current, activityEndDate: "" }));
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        setDocumentFile(file);
        setForm((current) => ({ ...current, documentLink: "", attachmentName: file?.name ?? "" }));
        setErrors((current) => ({ ...current, documentLink: "", documentType: "", documentName: "" }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.reportingPeriod) nextErrors.reportingPeriod = "Reporting period is required.";
        if (!form.facility) nextErrors.facility = "Facility is required.";
        if (!form.activityStartDate) nextErrors.activityStartDate = "Start date is required.";
        if (!form.activityEndDate) nextErrors.activityEndDate = "End date is required.";
        if (!form.electricityKwh) nextErrors.electricityKwh = "Electricity amount is required.";
        if (!form.electricityUnit) nextErrors.electricityUnit = "Unit is required.";
        if (!form.electricityActivityType) nextErrors.electricityActivityType = "Activity type is required.";
        if (!form.sourceType) nextErrors.sourceType = "Source type is required.";
        if (!form.dataQualityTier) nextErrors.dataQualityTier = "Data quality is required.";
        if (!form.documentType) nextErrors.documentType = "Document type is required.";
        if (!form.documentName) nextErrors.documentName = "Document name is required.";
        if (!documentFile && !form.documentLink) nextErrors.documentLink = "A document URL or file upload is required.";

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            // convert based on selected unit and send both kWh and MWh
            const amount = Number(form.electricityKwh);
            const unit = form.electricityUnit?.toLowerCase();
            const kwh = unit === "mwh" ? amount * 1000 : amount;
            const mwh = unit === "kwh" ? amount / 1000 : amount;

            const payload: Record<string, unknown> = {
                reporting_period_id: form.reportingPeriod,
                facility_id: form.facility,
                source_id: form.source || undefined,
                electricity_kwh: isFinite(kwh) ? String(kwh) : undefined,
                electricity_mwh: isFinite(mwh) ? String(mwh) : undefined,
                electricity_activity_type: form.electricityActivityType,
                source_type: form.sourceType,
                data_quality_tier: form.dataQualityTier,
                activity_start_date: form.activityStartDate,
                activity_end_date: form.activityEndDate,
                notes: form.notes || undefined,
            };

            const createResponse = await createElectricityActivity(payload);
            const activityId = createResponse?.data?.id ?? createResponse?.id ?? createResponse?.data?.data?.id ?? null;

            if (!activityId) throw new Error("Created activity ID not returned from API.");

            let sourceUrl = form.documentLink;
            if (documentFile) {
                sourceUrl = await uploadS3File(documentFile);
            }

            await uploadElectricityActivityDocument(activityId, {
                fuel_activity_id: null,
                electricity_activity_id: activityId,
                document_type: form.documentType,
                document_name: form.documentName,
                source_url: sourceUrl,
                notes: form.notes || null,
                document_date: form.documentDate || null,
            });

            router.push("/activities/electricity");
        } catch (err) {
            console.error(err);
            setErrors({ submit: "Failed to submit activity. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/activities/electricity" className="hover:text-primary">
                    Activities
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-semibold">Log Electricity Activity</span>
            </div>

            <header className="mb-10">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Log Electricity Activity</h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Record electricity import or self-generated entries with supporting evidence.
                </p>
            </header>

            <form id="logElectricityForm" onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="bolt" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Activity Context</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Select period, facility and activity dates.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Reporting Period
                            </label>
                            <select
                                value={form.reportingPeriod}
                                onChange={(e) => handleChange("reportingPeriod", e.target.value)}
                                className={formFieldClass(Boolean(errors.reportingPeriod))}>
                                <option value="">Select period...</option>
                                {reportingPeriodsQuery.data?.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {errors.reportingPeriod && (
                                <p className="mt-2 text-xs text-error">{errors.reportingPeriod}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Facility
                            </label>
                            <select
                                value={form.facility}
                                onChange={(e) => handleChange("facility", e.target.value)}
                                className={formFieldClass(Boolean(errors.facility))}>
                                <option value="">Select facility...</option>
                                {facilitiesQuery.data?.map((f: any) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                            {errors.facility && <p className="mt-2 text-xs text-error">{errors.facility}</p>}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                    Activity Start Date
                                </label>
                                {selectedStartDate ? (
                                    <span className="text-xs text-on-surface-variant">
                                        {format(selectedStartDate, "PPP")}
                                    </span>
                                ) : null}
                            </div>
                            <Calendar date={selectedStartDate} onDateChange={handleStartDateChange} />
                            {errors.activityStartDate && (
                                <p className="mt-2 text-xs text-error">{errors.activityStartDate}</p>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                    Activity End Date
                                </label>
                                {selectedEndDate ? (
                                    <span className="text-xs text-on-surface-variant">
                                        {format(selectedEndDate, "PPP")}
                                    </span>
                                ) : null}
                            </div>
                            <Calendar date={selectedEndDate} onDateChange={handleEndDateChange} />
                            {errors.activityEndDate && (
                                <p className="mt-2 text-xs text-error">{errors.activityEndDate}</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="bolt" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Electricity Details</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Enter electricity quantity and source details.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Source
                            </label>
                            <select
                                value={form.source}
                                onChange={(e) => handleChange("source", e.target.value)}
                                className={formFieldClass(Boolean(errors.source))}>
                                <option value="">Select source...</option>
                                {emissionSourcesQuery.data?.map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.standard} {s.version ? `(${s.version})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Electricity
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    step="0.001"
                                    value={form.electricityKwh}
                                    onChange={(e) => handleChange("electricityKwh", e.target.value)}
                                    className={`${formFieldClass(Boolean(errors.electricityKwh))} border border-outline-variant`}
                                    placeholder="0.00"
                                />
                                <select
                                    value={form.electricityUnit}
                                    onChange={(e) => handleChange("electricityUnit", e.target.value)}
                                    className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface">
                                    <option value="kwh">kWh</option>
                                    <option value="mwh">MWh</option>
                                </select>
                            </div>
                            {errors.electricityKwh && (
                                <p className="mt-2 text-xs text-error">{errors.electricityKwh}</p>
                            )}
                            {errors.electricityUnit && (
                                <p className="mt-2 text-xs text-error">{errors.electricityUnit}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Activity Type
                            </label>
                            <select
                                value={form.electricityActivityType}
                                onChange={(e) => handleChange("electricityActivityType", e.target.value)}
                                className={formFieldClass(Boolean(errors.electricityActivityType))}>
                                <option value="">Select type...</option>
                                <option value="grid_import">Grid Import</option>
                                <option value="self_generated">Self Generated</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.electricityActivityType && (
                                <p className="mt-2 text-xs text-error">{errors.electricityActivityType}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Source Type
                            </label>
                            <select
                                value={form.sourceType}
                                onChange={(e) => handleChange("sourceType", e.target.value)}
                                className={formFieldClass(Boolean(errors.sourceType))}>
                                <option value="">Select source type...</option>
                                <option value="national_grid">National Grid</option>
                                <option value="other_generator">Other Generator</option>
                                <option value="solar">Solar</option>
                                <option value="wind">Wind</option>
                            </select>
                            {errors.sourceType && <p className="mt-2 text-xs text-error">{errors.sourceType}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Data Quality
                            </label>
                            <select
                                value={form.dataQualityTier}
                                onChange={(e) => handleChange("dataQualityTier", e.target.value)}
                                className={formFieldClass(Boolean(errors.dataQualityTier))}>
                                <option value="">Select quality...</option>
                                <option value="measured">Measured</option>
                                <option value="estimated">Estimated</option>
                            </select>
                            {errors.dataQualityTier && (
                                <p className="mt-2 text-xs text-error">{errors.dataQualityTier}</p>
                            )}
                        </div>
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Notes
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                className="min-h-[128px] w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add any clarifying remarks..."
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="attach_file" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">
                                    Attach Supporting Evidence
                                </h2>
                                <p className="text-xs text-on-surface-variant">
                                    Upload invoice, report or evidence documentation.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Document Type
                            </label>
                            <select
                                value={form.documentType}
                                onChange={(e) => handleChange("documentType", e.target.value)}
                                className={formFieldClass(Boolean(errors.documentType))}>
                                <option value="">Select type...</option>
                                {documentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.documentType && <p className="mt-2 text-xs text-error">{errors.documentType}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Document Name
                            </label>
                            <Input
                                type="text"
                                value={form.documentName}
                                onChange={(e) => handleChange("documentName", e.target.value)}
                                className={`${formFieldClass()} border border-outline-variant`}
                                placeholder="e.g. Q1_Electricity_Invoice"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Upload Supporting Evidence
                            </label>
                            <label className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container text-center text-on-surface-variant transition-colors hover:border-primary">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                                    <MaterialIcon name="cloud_upload" size="sm" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-primary">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-on-surface-variant">PDF, PNG, JPG or CSV (max 10MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                                {form.attachmentName && (
                                    <p className="text-xs text-on-surface-variant">{form.attachmentName}</p>
                                )}
                            </label>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Documentation Link
                            </label>
                            <Input
                                type="text"
                                value={form.documentLink}
                                onChange={(e) => handleDocumentLinkChange(e.target.value)}
                                className={`${formFieldClass(Boolean(errors.documentLink))} border border-outline-variant`}
                                placeholder={
                                    documentFile ? "Upload file to provide link" : "https://sharepoint.com/doc..."
                                }
                                disabled={Boolean(documentFile)}
                            />
                            {documentFile && (
                                <p className="mt-2 text-xs text-on-surface-variant">
                                    Document URL is disabled because a file upload is selected.
                                </p>
                            )}
                            {errors.documentLink && <p className="mt-2 text-xs text-error">{errors.documentLink}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Document Date
                            </label>
                            <Input
                                type="date"
                                value={form.documentDate}
                                onChange={(e) => handleChange("documentDate", e.target.value)}
                                className={`${formFieldClass()} border border-outline-variant`}
                            />
                        </div>
                    </div>
                </section>

                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => router.push("/activities/electricity")}
                        className="px-8 py-3 rounded-lg font-label-md text-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                        disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Activity"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
