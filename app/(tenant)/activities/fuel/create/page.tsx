"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isAfter } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import { createFuelActivity, uploadFuelActivityDocument, uploadS3File } from "@/lib/activity/api";
import { ActivityDocumentsManager } from "@/components/activity/ActivityDocumentsManager";
import type { ActivityDocument } from "@/components/activity/ActivityDocumentsManager";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { getErrorMessage } from "@/lib/utils/error";
import { CustomFuelSection } from "@/components/activity/CustomFuelSection";
import { useCustomFuelUnits } from "@/lib/customFuel/hooks";

const emissionTypeOptions = [
    { label: "Stationary", value: "stationary" },
    { label: "Mobile", value: "mobile" },
    { label: "Process", value: "process" },
    { label: "Fugitive", value: "fugitive" },
];

const collectionTypeOptions = [
    { label: "Measured", value: "measured" },
    { label: "Estimated", value: "estimated" },
];

function formFieldClass(error?: boolean) {
    return `w-full rounded-lg border ${
        error ? "border-error" : "border-outline-variant"
    } bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`;
}

type FuelActivityFormState = {
    reportingPeriod: string;
    facility: string;
    activityStartDate: string;
    activityEndDate: string;
    fuelType: string;
    fuelCategory: string;
    customFuelId: string;
    source: string;
    meterId: string;
    quantity: string;
    unit: string;
    emissionType: string;
    collectionType: string;
    cost: string;
    isDraft: boolean;
    notes: string;
    estimationBasis: string;
};

const initialFormState: FuelActivityFormState = {
    reportingPeriod: "",
    facility: "",
    activityStartDate: "",
    activityEndDate: "",
    fuelType: "",
    fuelCategory: "",
    customFuelId: "",
    source: "",
    meterId: "",
    quantity: "",
    unit: "",
    emissionType: "stationary",
    collectionType: "",
    cost: "",
    isDraft: false,
    notes: "",
    estimationBasis: "",
};

const isDocEmpty = (doc: ActivityDocument) => {
    return (
        !doc.documentType &&
        !doc.documentName &&
        !doc.documentDate &&
        !doc.file &&
        !doc.attachmentName &&
        !doc.documentLink &&
        !doc.notes
    );
};

export default function LogFuelActivityPage() {
    const [form, setForm] = useState<FuelActivityFormState>(initialFormState);
    const [documents, setDocuments] = useState<ActivityDocument[]>([
        {
            id: "initial-doc",
            documentType: "",
            documentName: "",
            documentLink: "",
            documentDate: "",
            file: null,
            attachmentName: "",
            sourceMode: "upload",
            notes: "",
        },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const router = useRouter();
    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const emissionSourcesQuery = useEmissionSources("fuel");
    const customFuelUnitsQuery = useCustomFuelUnits(Boolean(form.customFuelId));

    // Default to first loaded emission source if none selected
    useEffect(() => {
        if (!form.source && emissionSourcesQuery.data && emissionSourcesQuery.data.length > 0) {
            setForm((current) => ({ ...current, source: emissionSourcesQuery.data[0].id }));
        }
    }, [form.source, emissionSourcesQuery.data]);

    function handleChange(field: string, value: string) {
        setForm((current) => {
            const next = { ...current, [field]: value } as FuelActivityFormState;

            if (field === "source") {
                next.fuelCategory = "";
                next.fuelType = "";
                next.customFuelId = "";
                next.unit = "";
            }

            if (field === "fuelCategory") {
                next.fuelType = "";
                next.unit = "";
            }

            if (field === "fuelType") {
                next.customFuelId = "";
                next.unit = "";
            }

            if (field === "emissionType") {
                next.fuelCategory = "";
                next.fuelType = "";
                next.customFuelId = "";
                next.unit = "";
            }

            if (field === "collectionType" && value !== "estimated") {
                next.estimationBasis = "";
            }

            return next;
        });
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleCustomFuelSelect(customFuelId: string) {
        setForm((current) => ({
            ...current,
            customFuelId,
            fuelType: customFuelId ? "" : current.fuelType,
            unit: "",
        }));
        setErrors((current) => ({ ...current, fuelType: "", customFuelId: "" }));
    }

    function handleStartDateChange(date: Date) {
        const nextEndDate = selectedEndDate && isAfter(date, selectedEndDate) ? date : selectedEndDate;
        setSelectedStartDate(date);
        if (nextEndDate && nextEndDate !== selectedEndDate) {
            setSelectedEndDate(nextEndDate);
        }

        setForm((current) => ({
            ...current,
            activityStartDate: format(date, "yyyy-MM-dd"),
            activityEndDate: nextEndDate ? format(nextEndDate, "yyyy-MM-dd") : current.activityEndDate,
        }));
        setErrors((current) => ({ ...current, activityStartDate: "", activityEndDate: "" }));
    }

    function handleEndDateChange(date: Date) {
        const nextStartDate = selectedStartDate && isAfter(selectedStartDate, date) ? date : selectedStartDate;
        setSelectedEndDate(date);
        if (nextStartDate && nextStartDate !== selectedStartDate) {
            setSelectedStartDate(nextStartDate);
        }

        setForm((current) => ({
            ...current,
            activityStartDate: nextStartDate ? format(nextStartDate, "yyyy-MM-dd") : current.activityStartDate,
            activityEndDate: format(date, "yyyy-MM-dd"),
        }));
        setErrors((current) => ({ ...current, activityEndDate: "" }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.reportingPeriod) nextErrors.reportingPeriod = "Reporting period is required.";
        if (!form.facility) nextErrors.facility = "Facility is required.";
        if (!form.source) nextErrors.source = "Emission standard / source is required.";
        if (!form.activityStartDate) nextErrors.activityStartDate = "Start date is required.";
        if (!form.activityEndDate) nextErrors.activityEndDate = "End date is required.";
        if (!form.emissionType) nextErrors.emissionType = "Emission type is required.";

        if (!form.customFuelId && !form.fuelType) {
            nextErrors.fuelType = "Fuel type or Custom Fuel is required.";
        }

        if (form.emissionType !== "fugitive" && !form.cost) nextErrors.cost = "Cost is required.";
        if (!form.collectionType) nextErrors.collectionType = "Collection type is required.";
        if (!form.quantity) nextErrors.quantity = "Quantity is required.";
        if (!form.unit) nextErrors.unit = "Unit is required.";
        if (form.collectionType === "estimated" && !form.estimationBasis) {
            nextErrors.estimationBasis = "Estimation basis is required for estimated collection type.";
        }

        // Validate each document in the documents list
        documents.forEach((doc) => {
            if (isDocEmpty(doc)) return;

            if (!doc.documentType) nextErrors[`doc-${doc.id}-type`] = "Document type is required.";
            if (!doc.documentName) nextErrors[`doc-${doc.id}-name`] = "Document name is required.";
            if (!doc.documentDate) nextErrors[`doc-${doc.id}-date`] = "Document date is required.";
            if (doc.sourceMode === "upload" && !doc.file && !doc.attachmentName) {
                nextErrors[`doc-${doc.id}-source`] = "A document file upload is required.";
            }
            if (doc.sourceMode === "link" && !doc.documentLink) {
                nextErrors[`doc-${doc.id}-source`] = "A document link is required.";
            }
        });

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            const firstErrorKey = Object.keys(nextErrors)[0];
            setTimeout(() => {
                const element = document.getElementById(`form-field-${firstErrorKey}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
            return;
        }

        setIsSubmitting(true);

        try {
            let finalQuantity = form.quantity ? Number(form.quantity) : null;
            let finalUnitId = form.unit;

            if (form.customFuelId && customFuelUnitsQuery.data && customFuelUnitsQuery.data.length > 0) {
                const unitsList = customFuelUnitsQuery.data;
                const kgUnit = unitsList.find(
                    (u) => u.symbol.toLowerCase() === "kg" || u.name.toLowerCase().includes("kilograms")
                );
                const tonneUnit = unitsList.find(
                    (u) =>
                        u.symbol.toLowerCase().includes("tonne") ||
                        u.symbol.toLowerCase() === "t" ||
                        u.name.toLowerCase().includes("tonne")
                );

                if (tonneUnit) {
                    // If user selected Kilograms, convert quantity from kg into tonnes
                    if (kgUnit && form.unit === kgUnit.id && finalQuantity !== null) {
                        finalQuantity = finalQuantity / 1000;
                    }
                    // Always send the Tonne unit ID for custom fuel
                    finalUnitId = tonneUnit.id;
                }
            }

            const payload: Record<string, unknown> = {
                reporting_period_id: form.reportingPeriod,
                facility_id: form.facility,
                source_id: form.source,
                status: form.isDraft ? "draft" : undefined,
                emission_type: form.emissionType,
                quantity: finalQuantity,
                quantity_unit_id: finalUnitId,
                cost: form.emissionType !== "fugitive" && form.cost ? Number(form.cost) : null,
                data_quality_tier: form.collectionType,
                estimation_basis: form.collectionType === "estimated" ? form.estimationBasis : undefined,
                activity_start_date: form.activityStartDate,
                activity_end_date: form.activityEndDate,
            };

            if (form.customFuelId) {
                payload.custom_fuel_id = form.customFuelId;
            } else {
                payload.fuel_id = form.fuelType;
            }

            if (form.meterId) {
                payload.meter_id = form.meterId;
            }

            const createResponse = await createFuelActivity(payload);
            const activityId = createResponse?.data?.id ?? createResponse?.id ?? createResponse?.data?.data?.id ?? null;

            if (!activityId) {
                throw new Error("Created activity ID not returned from API.");
            }

            // Upload all attached documents
            for (const doc of documents) {
                if (isDocEmpty(doc)) continue;

                let sourceUrl = "";
                if (doc.sourceMode === "upload" && doc.file) {
                    const uploadedUrl = await uploadS3File(doc.file);
                    sourceUrl = uploadedUrl || "";
                } else if (doc.sourceMode === "link") {
                    sourceUrl = doc.documentLink || "";
                }

                await uploadFuelActivityDocument(activityId, {
                    fuel_activity_id: activityId,
                    electricity_activity_id: null,
                    document_type: doc.documentType,
                    document_name: doc.documentName,
                    source_url: sourceUrl || undefined,
                    notes: doc.notes || null,
                    document_date: doc.documentDate || null,
                });
            }

            router.push("/activities/fuel");
        } catch (err) {
            console.error(err);
            const message = getErrorMessage(err, "Failed to submit activity. Please try again.");
            setErrors({ submit: message });
            setTimeout(() => {
                const element = document.getElementById("logFuelForm");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        } finally {
            setIsSubmitting(false);
        }
    }

    const emissionSourceOptions =
        emissionSourcesQuery.data?.map((s) => ({
            label: s.standard,
            value: String(s.id),
        })) || [];

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

            <FormErrorSummary errors={errors} />

            <form id="logFuelForm" onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="inventory_2" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Activity Context</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Select period, facility, source and activity dates.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding space-y-6">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div id="form-field-reportingPeriod">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Reporting Period <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={
                                        reportingPeriodsQuery.data?.map((p: { id: string; name: string }) => ({
                                            label: p.name,
                                            value: String(p.id),
                                        })) || []
                                    }
                                    value={form.reportingPeriod}
                                    onChange={(val) => handleChange("reportingPeriod", val)}
                                    error={Boolean(errors.reportingPeriod)}
                                    placeholder="Select period..."
                                />
                                {errors.reportingPeriod && (
                                    <p className="mt-2 text-xs text-error">{errors.reportingPeriod}</p>
                                )}
                            </div>
                            <div id="form-field-facility">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Facility <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={
                                        facilitiesQuery.data?.map((f: { id: string; name: string }) => ({
                                            label: f.name,
                                            value: String(f.id),
                                        })) || []
                                    }
                                    value={form.facility}
                                    onChange={(val) => handleChange("facility", val)}
                                    error={Boolean(errors.facility)}
                                    placeholder="Select facility..."
                                />
                                {errors.facility && <p className="mt-2 text-xs text-error">{errors.facility}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div id="form-field-emissionType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Emission Type <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={emissionTypeOptions}
                                    value={form.emissionType}
                                    onChange={(val) => handleChange("emissionType", val)}
                                    error={Boolean(errors.emissionType)}
                                    placeholder="Select emission type..."
                                />
                                {errors.emissionType && (
                                    <p className="mt-2 text-xs text-error">{errors.emissionType}</p>
                                )}
                            </div>

                            <div id="form-field-source">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Emission Standard / Source <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={emissionSourceOptions}
                                    value={form.source}
                                    onChange={(val) => handleChange("source", val)}
                                    error={Boolean(errors.source)}
                                    placeholder={
                                        emissionSourcesQuery.isLoading ? "Loading sources..." : "Select source..."
                                    }
                                    isLoading={emissionSourcesQuery.isLoading}
                                />
                                {errors.source && <p className="mt-2 text-xs text-error">{errors.source}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div id="form-field-activityStartDate" className="space-y-3 flex flex-col items-center">
                                <div className="flex items-center justify-between gap-2 w-full max-w-[340px]">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Activity Start Date <span className="text-error">*</span>
                                    </label>
                                    {selectedStartDate ? (
                                        <span className="text-xs text-on-surface-variant mb-2">
                                            {format(selectedStartDate, "PPP")}
                                        </span>
                                    ) : null}
                                </div>
                                <Calendar
                                    date={selectedStartDate}
                                    onDateChange={handleStartDateChange}
                                    className={errors.activityStartDate ? "border-error" : ""}
                                />
                                {errors.activityStartDate && (
                                    <p className="mt-2 text-xs text-error w-full max-w-[340px]">
                                        {errors.activityStartDate}
                                    </p>
                                )}
                            </div>
                            <div id="form-field-activityEndDate" className="space-y-3 flex flex-col items-center">
                                <div className="flex items-center justify-between gap-2 w-full max-w-[340px]">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Activity End Date <span className="text-error">*</span>
                                    </label>
                                    {selectedEndDate ? (
                                        <span className="text-xs text-on-surface-variant mb-2">
                                            {format(selectedEndDate, "PPP")}
                                        </span>
                                    ) : null}
                                </div>
                                <Calendar
                                    date={selectedEndDate}
                                    onDateChange={handleEndDateChange}
                                    className={errors.activityEndDate ? "border-error" : ""}
                                />
                                {errors.activityEndDate && (
                                    <p className="mt-2 text-xs text-error w-full max-w-[340px]">
                                        {errors.activityEndDate}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fuel Details Card (Standard & Custom Fuel Workflows) */}
                <CustomFuelSection
                    sourceId={form.source}
                    emissionType={form.emissionType}
                    fuelCategory={form.fuelCategory}
                    fuelType={form.fuelType}
                    quantity={form.quantity}
                    cost={form.cost}
                    unit={form.unit}
                    selectedCustomFuelId={form.customFuelId}
                    onFieldChange={handleChange}
                    onCustomFuelSelect={handleCustomFuelSelect}
                    errors={errors}
                />

                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
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
                        <div id="form-field-collectionType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Collection Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={collectionTypeOptions}
                                value={form.collectionType}
                                onChange={(val) => handleChange("collectionType", val)}
                                error={Boolean(errors.collectionType)}
                                placeholder="Select collection type..."
                            />
                            {errors.collectionType && (
                                <p className="mt-2 text-xs text-error">{errors.collectionType}</p>
                            )}
                        </div>
                        {form.collectionType === "estimated" && (
                            <div id="form-field-estimationBasis" className="lg:col-span-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Estimation Basis <span className="text-error">*</span>
                                </label>
                                <textarea
                                    value={form.estimationBasis}
                                    onChange={(event) => handleChange("estimationBasis", event.target.value)}
                                    className={`${formFieldClass(
                                        Boolean(errors.estimationBasis)
                                    )} min-h-[128px] border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`}
                                    placeholder="Describe the basis, methodology, or assumptions used for this estimation..."
                                />
                                {errors.estimationBasis && (
                                    <p className="mt-2 text-xs text-error">{errors.estimationBasis}</p>
                                )}
                            </div>
                        )}
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

                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
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
                    <div className="p-card-padding">
                        <ActivityDocumentsManager
                            documents={documents}
                            onChange={setDocuments}
                            errors={errors}
                        />
                    </div>
                </section>

                {/* Actions footer */}
                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => router.push("/activities/fuel")}
                        className="px-8 py-3 rounded-lg font-label-md text-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Activity"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
