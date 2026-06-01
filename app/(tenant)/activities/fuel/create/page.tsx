"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Input } from "@/components/ui/input";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useFuelCategories, useFuels, useFuelUnits } from "@/lib/fuel/hooks";
import { createFuelActivity, uploadFuelActivityDocument, uploadS3File } from "@/lib/activity/api";

const reportingPeriods = ["Jan - Mar 2025", "Apr - Jun 2025", "Jul - Sep 2025"];
const facilities = ["Central Power Plant", "Manufacturing Hub B", "EU Logistics Hub"];
const documentTypeOptions = [
    { label: "Invoice", value: "invoice" },
    { label: "Meter Read", value: "meter_read" },
    { label: "Delivery Note", value: "delivery_note" },
    { label: "Estimation Basis", value: "estimation_basis" },
    { label: "Audit Report", value: "audit_report" },
    { label: "Internal Report", value: "internal_report" },
    { label: "Other", value: "other" },
];
const collectionTypeOptions = [
    { label: "Measured", value: "measured" },
    { label: "Calculated", value: "calculated" },
    { label: "Estimated", value: "estimated" },
];

function formFieldClass(error?: boolean) {
    return `w-full rounded-lg border ${error ? "border-error" : "border-outline-variant"} bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`;
}

export default function LogFuelActivityPage() {
    const [form, setForm] = useState({
        reportingPeriod: "",
        facility: "",
        activityStartDate: "",
        activityEndDate: "",
        fuelType: "",
        fuelCategory: "",
        source: "ceea4ef9-1120-4c0f-9325-b5c5fca66400",
        meterId: "",
        quantity: "",
        unit: "",
        usageType: "direct_combustion",
        collectionType: "",
        generatorEfficiency: "",
        isDraft: false,
        documentType: "",
        documentName: "",
        documentLink: "",
        documentDate: "",
        notes: "",
        attachmentName: "",
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const fuelCategoriesQuery = useFuelCategories();
    const fuelsQuery = useFuels(form.fuelCategory);
    const unitsQuery = useFuelUnits(form.fuelType);

    function handleChange(field: string, value: string) {
        setForm((current) => {
            const next = { ...current, [field]: value } as typeof form;
            // reset dependent fields
            if (field === "fuelCategory") {
                next.fuelType = "";
                next.unit = "";
            }
            if (field === "fuelType") {
                next.unit = "";
            }
            return next;
        });
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleDocumentLinkChange(value: string) {
        setDocumentFile(null);
        setForm((current) => ({ ...current, documentLink: value, attachmentName: "" }));
        setErrors((current) => ({ ...current, documentLink: "" }));
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        setDocumentFile(file);
        setForm((current) => ({
            ...current,
            documentLink: "",
            attachmentName: file?.name ?? "",
        }));
        setErrors((current) => ({ ...current, documentLink: "", documentType: "", documentName: "" }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.reportingPeriod) nextErrors.reportingPeriod = "Reporting period is required.";
        if (!form.facility) nextErrors.facility = "Facility is required.";
        if (!form.activityStartDate) nextErrors.activityStartDate = "Start date is required.";
        if (!form.activityEndDate) nextErrors.activityEndDate = "End date is required.";
        if (!form.fuelType) nextErrors.fuelType = "Fuel type is required.";
        if (!form.collectionType) nextErrors.collectionType = "Collection type is required.";
        if (!form.quantity) nextErrors.quantity = "Quantity is required.";
        if (!form.unit) nextErrors.unit = "Unit is required.";
        if (!form.documentType) nextErrors.documentType = "Document type is required.";
        if (!form.documentName) nextErrors.documentName = "Document name is required.";
        if (!documentFile && !form.documentLink) nextErrors.documentLink = "A document URL or file upload is required.";

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            const payload: Record<string, unknown> = {
                reporting_period_id: form.reportingPeriod,
                facility_id: form.facility,
                source_id: form.source,
                status: form.isDraft ? "draft" : undefined,
                usage_type: form.usageType,
                generator_efficiency:
                    form.usageType === "electricity_generation" || form.usageType === "steam_generation"
                        ? Number(form.generatorEfficiency)
                        : null,
                emission_type: "stationary",
                fuel_id: form.fuelType,
                quantity: form.quantity ? Number(form.quantity) : null,
                quantity_unit_id: form.unit,
                data_quality_tier: form.collectionType,
                activity_start_date: form.activityStartDate,
                activity_end_date: form.activityEndDate,
            };

            if (form.meterId) {
                payload.meter_id = form.meterId;
            }

            const createResponse = await createFuelActivity(payload);
            const activityId = createResponse?.data?.id ?? createResponse?.id ?? createResponse?.data?.data?.id ?? null;

            if (!activityId) {
                throw new Error("Created activity ID not returned from API.");
            }

            let sourceUrl = form.documentLink;
            if (documentFile) {
                sourceUrl = await uploadS3File(documentFile);
            }

            await uploadFuelActivityDocument(activityId, {
                fuel_activity_id: activityId,
                electricity_activity_id: null,
                document_type: form.documentType,
                document_name: form.documentName,
                source_url: sourceUrl,
                notes: form.notes || null,
                document_date: form.documentDate || null,
            });

            router.push("/activities/fuel");
        } catch (err) {
            console.error(err);
            setErrors({ submit: "Failed to submit activity. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/activities/fuel" className="hover:text-primary">
                    Activities
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-semibold">Log Fuel Activity</span>
            </div>

            <header className="mb-10">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Log Fuel Activity</h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Record a new fuel activity entry for scope 1 emissions with supporting evidence.
                </p>
            </header>

            <form id="logFuelForm" onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="inventory_2" size="sm" />
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
                                onChange={(event) => handleChange("reportingPeriod", event.target.value)}
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
                                onChange={(event) => handleChange("facility", event.target.value)}
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
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Activity Start Date
                            </label>
                            <input
                                type="date"
                                value={form.activityStartDate}
                                onChange={(event) => handleChange("activityStartDate", event.target.value)}
                                className={formFieldClass(Boolean(errors.activityStartDate))}
                            />
                            {errors.activityStartDate && (
                                <p className="mt-2 text-xs text-error">{errors.activityStartDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Activity End Date
                            </label>
                            <input
                                type="date"
                                value={form.activityEndDate}
                                onChange={(event) => handleChange("activityEndDate", event.target.value)}
                                className={formFieldClass(Boolean(errors.activityEndDate))}
                            />
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
                                <MaterialIcon name="local_gas_station" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Fuel Details</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Choose fuel type, quantity and measurement unit.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Fuel Category
                            </label>
                            <select
                                value={form.fuelCategory}
                                onChange={(event) => handleChange("fuelCategory", event.target.value)}
                                className={formFieldClass(Boolean(errors.fuelType))}>
                                <option value="">Select category...</option>
                                {fuelCategoriesQuery.isLoading && <option value="">Loading categories...</option>}
                                {Array.isArray(fuelCategoriesQuery.data) && fuelCategoriesQuery.data.length === 0 && (
                                    <option value="" disabled>
                                        No categories available
                                    </option>
                                )}
                                {fuelCategoriesQuery.data?.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {!fuelCategoriesQuery.isLoading &&
                                Array.isArray(fuelCategoriesQuery.data) &&
                                fuelCategoriesQuery.data.length === 0 && (
                                    <p className="mt-2 text-xs text-on-surface-variant">
                                        No fuel categories configured for this tenant.
                                    </p>
                                )}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Fuel
                            </label>
                            <select
                                value={form.fuelType}
                                onChange={(event) => handleChange("fuelType", event.target.value)}
                                className={formFieldClass(Boolean(errors.fuelType))}
                                disabled={
                                    !form.fuelCategory ||
                                    fuelsQuery.isLoading ||
                                    (Array.isArray(fuelsQuery.data) && fuelsQuery.data.length === 0)
                                }>
                                <option value="">
                                    {!form.fuelCategory ? "Select category first" : "Select fuel..."}
                                </option>
                                {fuelsQuery.isLoading && <option value="">Loading fuels...</option>}
                                {Array.isArray(fuelsQuery.data) && fuelsQuery.data.length === 0 && (
                                    <option value="" disabled>
                                        No fuels for selected category
                                    </option>
                                )}
                                {fuelsQuery.data?.map((f: any) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                            {errors.fuelType && <p className="mt-2 text-xs text-error">{errors.fuelType}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Quantity
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.quantity}
                                onChange={(event) => handleChange("quantity", event.target.value)}
                                className={`${formFieldClass(Boolean(errors.quantity))} border border-outline-variant`}
                                placeholder="0.00"
                            />
                            {errors.quantity && <p className="mt-2 text-xs text-error">{errors.quantity}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Unit
                            </label>
                            <select
                                value={form.unit}
                                onChange={(event) => handleChange("unit", event.target.value)}
                                className={formFieldClass(Boolean(errors.unit))}
                                disabled={
                                    !form.fuelType ||
                                    unitsQuery.isLoading ||
                                    (Array.isArray(unitsQuery.data) && unitsQuery.data.length === 0)
                                }>
                                <option value="">{!form.fuelType ? "Select fuel first" : "Select unit..."}</option>
                                {unitsQuery.isLoading && <option value="">Loading units...</option>}
                                {Array.isArray(unitsQuery.data) && unitsQuery.data.length === 0 && (
                                    <option value="" disabled>
                                        No units available for selected fuel
                                    </option>
                                )}
                                {unitsQuery.data?.map((u: any) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                            {errors.unit && <p className="mt-2 text-xs text-error">{errors.unit}</p>}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="insights" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Data Quality</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Specify how the activity data was collected or measured.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Collection Type
                            </label>
                            <select
                                value={form.collectionType}
                                onChange={(event) => handleChange("collectionType", event.target.value)}
                                className={formFieldClass(Boolean(errors.collectionType))}>
                                <option value="">Select collection type...</option>
                                {collectionTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.collectionType && (
                                <p className="mt-2 text-xs text-error">{errors.collectionType}</p>
                            )}
                        </div>
                        <div className="lg:col-span-2 flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container p-4">
                            <input
                                id="isDraft"
                                type="checkbox"
                                checked={form.isDraft}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, isDraft: event.target.checked }))
                                }
                                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                            />
                            <label htmlFor="isDraft" className="text-sm text-on-surface">
                                Save as draft. When selected, status will be sent as{" "}
                                <span className="font-semibold">draft</span>.
                            </label>
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
                                onChange={(event) => handleChange("documentType", event.target.value)}
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
                                onChange={(event) => handleChange("documentName", event.target.value)}
                                className={`${formFieldClass()} border border-outline-variant`}
                                placeholder="e.g. Q1_Diesel_Invoice_NorthHub"
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
                                onChange={(event) => handleDocumentLinkChange(event.target.value)}
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
                                onChange={(event) => handleChange("documentDate", event.target.value)}
                                className={`${formFieldClass()} border border-outline-variant`}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                                Notes
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={(event) => handleChange("notes", event.target.value)}
                                className="min-h-[128px] w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add any clarifying remarks..."
                            />
                        </div>
                    </div>
                </section>

                {/* Actions footer */}
                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => router.push("/activities/fuel")}
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
