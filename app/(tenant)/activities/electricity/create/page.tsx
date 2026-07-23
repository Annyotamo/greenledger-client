"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isAfter } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import { useFuelCategories, useFuels, useFuelUnits } from "@/lib/fuel/hooks";
import type { FuelQueryType } from "@/lib/fuel/api";
import {
    createElectricityActivity,
    uploadElectricityActivityDocument,
    uploadS3File,
    createFuelActivity,
    uploadFuelActivityDocument,
} from "@/lib/activity/api";
import { CustomSelect } from "@/components/ui/select";
import { ActivityDocumentsManager } from "@/components/activity/ActivityDocumentsManager";
import type { ActivityDocument } from "@/components/activity/ActivityDocumentsManager";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { getErrorMessage } from "@/lib/utils/error";

const activityTypeOptions = [
    { label: "Grid Import", value: "grid_import" },
    { label: "Renewable", value: "renewable" },
    { label: "Captive", value: "captive" },
    { label: "Other", value: "other" },
];

const sourceTypesByActivity: Record<string, { label: string; value: string }[]> = {
    grid_import: [
        { label: "National Grid", value: "national_grid" },
    ],
    renewable: [
        { label: "Solar", value: "solar" },
        { label: "Hydro", value: "hydro" },
        { label: "Wind", value: "wind" },
    ],
    captive: [
        { label: "WHRB", value: "whrb" },
        { label: "FBC", value: "fbc" },
    ],
    other: [
        { label: "Waste Fuel", value: "waste_fuel" },
    ],
};

const emissionTypeOptions = [
    { label: "Stationary", value: "stationary" },
    { label: "Mobile", value: "mobile" },
    { label: "Process", value: "process" },
    { label: "Fugitive", value: "fugitive" },
];

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
    });
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [fuelForm, setFuelForm] = useState({
        fuelCategory: "",
        fuelType: "",
        quantity: "",
        unit: "",
        emissionType: "stationary",
        cost: "",
        source: "ceea4ef9-1120-4c0f-9325-b5c5fca66400",
    });

    function handleFuelChange(field: string, value: string) {
        setFuelForm((current) => {
            const next = { ...current, [field]: value } as typeof fuelForm;
            if (field === "fuelCategory") {
                next.fuelType = "";
                next.unit = "";
            }
            if (field === "fuelType") {
                next.unit = "";
            }
            if (field === "emissionType") {
                next.fuelCategory = "";
                next.fuelType = "";
                next.unit = "";
            }
            return next;
        });
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    const fuelQueryType = useMemo<FuelQueryType>(() => {
        return fuelForm.emissionType === "process" || fuelForm.emissionType === "fugitive" ? "REFRIGERANT" : "FUEL";
    }, [fuelForm.emissionType]);

    const fuelCategoriesQuery = useFuelCategories(fuelQueryType);
    const fuelsQuery = useFuels(fuelQueryType, fuelForm.fuelCategory);
    const unitsQuery = useFuelUnits(fuelForm.fuelType);

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
        }
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const emissionSourcesQuery = useEmissionSources();

    useEffect(() => {
        if (emissionSourcesQuery.data && emissionSourcesQuery.data.length > 0) {
            const ceaSource = emissionSourcesQuery.data.find(
                (s: any) =>
                    s.standard.toLowerCase().includes("cea") ||
                    s.standard.toLowerCase().includes("central electricity authority")
            );
            if (ceaSource) {
                setForm((current) => ({ ...current, source: String(ceaSource.id) }));
            }
        }
    }, [emissionSourcesQuery.data]);

    function handleChange(field: string, value: string) {
        setForm((current) => ({ ...current, [field]: value }) as typeof form);
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleActivityTypeChange(value: string) {
        setForm((current) => ({
            ...current,
            electricityActivityType: value,
            sourceType: "",
        }));
        setErrors((current) => ({
            ...current,
            electricityActivityType: "",
            sourceType: "",
        }));
    }

    const sourceOptions = form.electricityActivityType
        ? sourceTypesByActivity[form.electricityActivityType] || []
        : [];

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

        if (form.electricityActivityType === "captive") {
            if (!fuelForm.fuelCategory) nextErrors.fuelCategory = "Fuel Category is required.";
            if (!fuelForm.fuelType) nextErrors.fuelType = "Fuel is required.";
            if (!fuelForm.quantity) nextErrors.quantity = "Quantity is required.";
            if (!fuelForm.unit) nextErrors.unit = "Unit is required.";
            if (!fuelForm.emissionType) nextErrors.emissionType = "Emission Type is required.";
            if (fuelForm.emissionType !== "fugitive" && !fuelForm.cost) {
                nextErrors.cost = "Price / Cost is required.";
            }
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

            let fuelActivityId: string | null = null;
            if (form.electricityActivityType === "captive") {
                const fuelPayload: Record<string, unknown> = {
                    reporting_period_id: form.reportingPeriod,
                    facility_id: form.facility,
                    source_id: fuelForm.source,
                    electricity_activity_id: activityId,
                    emission_type: fuelForm.emissionType,
                    fuel_id: fuelForm.fuelType,
                    quantity: fuelForm.quantity ? Number(fuelForm.quantity) : null,
                    quantity_unit_id: fuelForm.unit,
                    cost: fuelForm.emissionType !== "fugitive" && fuelForm.cost ? Number(fuelForm.cost) : null,
                    data_quality_tier: form.dataQualityTier,
                    activity_start_date: form.activityStartDate,
                    activity_end_date: form.activityEndDate,
                };
                const createFuelResponse = await createFuelActivity(fuelPayload);
                fuelActivityId = createFuelResponse?.data?.id ?? createFuelResponse?.id ?? createFuelResponse?.data?.data?.id ?? null;
                if (!fuelActivityId) throw new Error("Created fuel activity ID not returned from API.");
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

                await uploadElectricityActivityDocument(activityId, {
                    fuel_activity_id: null,
                    electricity_activity_id: activityId,
                    document_type: doc.documentType,
                    document_name: doc.documentName,
                    source_url: sourceUrl || undefined,
                    notes: doc.notes || null,
                    document_date: doc.documentDate || null,
                });

                if (form.electricityActivityType === "captive" && fuelActivityId) {
                    await uploadFuelActivityDocument(fuelActivityId, {
                        fuel_activity_id: fuelActivityId,
                        electricity_activity_id: null,
                        document_type: doc.documentType,
                        document_name: doc.documentName,
                        source_url: sourceUrl || undefined,
                        notes: doc.notes || null,
                        document_date: doc.documentDate || null,
                    });
                }
            }

            router.push("/activities/electricity");
        } catch (err) {
            console.error(err);
            const message = getErrorMessage(err, "Failed to submit activity. Please try again.");
            setErrors({ submit: message });
            setTimeout(() => {
                const element = document.getElementById("logElectricityForm");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
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

            <FormErrorSummary errors={errors} />

            <form id="logElectricityForm" onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
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
                        <div id="form-field-reportingPeriod">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Reporting Period <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={reportingPeriodsQuery.data?.map((p: any) => ({
                                    label: p.name,
                                    value: String(p.id)
                                })) || []}
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
                                options={facilitiesQuery.data?.map((f: any) => ({
                                    label: f.name,
                                    value: String(f.id)
                                })) || []}
                                value={form.facility}
                                onChange={(val) => handleChange("facility", val)}
                                error={Boolean(errors.facility)}
                                placeholder="Select facility..."
                            />
                            {errors.facility && <p className="mt-2 text-xs text-error">{errors.facility}</p>}
                        </div>
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
                            <Calendar date={selectedStartDate} onDateChange={handleStartDateChange} className={errors.activityStartDate ? "border-error" : ""} />
                            {errors.activityStartDate && (
                                <p className="mt-2 text-xs text-error w-full max-w-[340px]">{errors.activityStartDate}</p>
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
                            <Calendar date={selectedEndDate} onDateChange={handleEndDateChange} className={errors.activityEndDate ? "border-error" : ""} />
                            {errors.activityEndDate && (
                                <p className="mt-2 text-xs text-error w-full max-w-[340px]">{errors.activityEndDate}</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
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
                        <div id="form-field-electricityKwh">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Electricity <span className="text-error">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    step="0.001"
                                    value={form.electricityKwh}
                                    onChange={(e) => handleChange("electricityKwh", e.target.value)}
                                    className={`${formFieldClass(Boolean(errors.electricityKwh))} border border-outline-variant flex-1`}
                                    placeholder="0.00"
                                />
                                <CustomSelect
                                    options={[
                                        { label: "kWh", value: "kwh" },
                                        { label: "MWh", value: "mwh" },
                                    ]}
                                    value={form.electricityUnit}
                                    onChange={(val) => handleChange("electricityUnit", val)}
                                    error={Boolean(errors.electricityUnit)}
                                    placeholder="Unit"
                                    className="w-[110px]"
                                />
                            </div>
                            {errors.electricityKwh && (
                                <p className="mt-2 text-xs text-error">{errors.electricityKwh}</p>
                            )}
                            {errors.electricityUnit && (
                                <p className="mt-2 text-xs text-error">{errors.electricityUnit}</p>
                            )}
                        </div>
                        <div id="form-field-electricityActivityType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Activity Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={activityTypeOptions}
                                value={form.electricityActivityType}
                                onChange={handleActivityTypeChange}
                                error={Boolean(errors.electricityActivityType)}
                                placeholder="Select type..."
                            />
                            {errors.electricityActivityType && (
                                <p className="mt-2 text-xs text-error">{errors.electricityActivityType}</p>
                            )}
                        </div>
                        <div id="form-field-sourceType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Source Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={sourceOptions}
                                value={form.sourceType}
                                onChange={(val) => handleChange("sourceType", val)}
                                error={Boolean(errors.sourceType)}
                                placeholder={form.electricityActivityType ? "Select source type..." : "Select activity type first..."}
                                isDisabled={!form.electricityActivityType}
                            />
                            {errors.sourceType && <p className="mt-2 text-xs text-error">{errors.sourceType}</p>}
                        </div>
                        <div id="form-field-dataQualityTier">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Data Quality <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: "Measured", value: "measured" },
                                    { label: "Estimated", value: "estimated" },
                                ]}
                                value={form.dataQualityTier}
                                onChange={(val) => handleChange("dataQualityTier", val)}
                                error={Boolean(errors.dataQualityTier)}
                                placeholder="Select quality..."
                            />
                            {errors.dataQualityTier && (
                                <p className="mt-2 text-xs text-error">{errors.dataQualityTier}</p>
                            )}
                        </div>
                        <div id="form-field-notes" className="lg:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
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

                {form.electricityActivityType === "captive" && (
                    <section className="bg-white rounded-xl border border-outline-variant relative">
                        <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                    <MaterialIcon name="local_gas_station" size="sm" />
                                </div>
                                <div>
                                    <h2 className="text-headline-sm font-semibold text-primary">Captive Generation Fuel Details</h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Specify fuel consumption and cost details for the captive power source.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                            <div id="form-field-fuelCategory">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Fuel Category <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={fuelCategoriesQuery.data?.map((c: any) => ({
                                        label: c.name,
                                        value: String(c.id)
                                    })) || []}
                                    value={fuelForm.fuelCategory}
                                    onChange={(val) => handleFuelChange("fuelCategory", val)}
                                    error={Boolean(errors.fuelCategory)}
                                    placeholder={fuelCategoriesQuery.isLoading ? "Loading categories..." : "Select category..."}
                                    isLoading={fuelCategoriesQuery.isLoading}
                                    isDisabled={fuelCategoriesQuery.isLoading}
                                />
                                {errors.fuelCategory && (
                                    <p className="mt-2 text-xs text-error">{errors.fuelCategory}</p>
                                )}
                            </div>
                            <div id="form-field-fuelType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Fuel <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={fuelsQuery.data?.map((f: any) => ({
                                        label: f.name,
                                        value: String(f.id)
                                    })) || []}
                                    value={fuelForm.fuelType}
                                    onChange={(val) => handleFuelChange("fuelType", val)}
                                    error={Boolean(errors.fuelType)}
                                    placeholder={
                                        fuelsQuery.isLoading
                                            ? "Loading fuels..."
                                            : !fuelForm.fuelCategory
                                            ? "Select category first"
                                            : "Select fuel..."
                                    }
                                    isDisabled={
                                        !fuelForm.fuelCategory ||
                                        fuelsQuery.isLoading ||
                                        (Array.isArray(fuelsQuery.data) && fuelsQuery.data.length === 0)
                                    }
                                    isLoading={fuelsQuery.isLoading}
                                />
                                {errors.fuelType && <p className="mt-2 text-xs text-error">{errors.fuelType}</p>}
                            </div>
                            <div id="form-field-quantity">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Quantity <span className="text-error">*</span>
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={fuelForm.quantity}
                                    onChange={(event) => handleFuelChange("quantity", event.target.value)}
                                    className={`${formFieldClass(Boolean(errors.quantity))} border border-outline-variant`}
                                    placeholder="0.00"
                                />
                                {errors.quantity && <p className="mt-2 text-xs text-error">{errors.quantity}</p>}
                            </div>
                            {fuelForm.emissionType !== "fugitive" && (
                                <div id="form-field-cost">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Price / Cost <span className="text-error">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={fuelForm.cost}
                                        onChange={(event) => handleFuelChange("cost", event.target.value)}
                                        className={`${formFieldClass(Boolean(errors.cost))} border border-outline-variant`}
                                        placeholder="12000"
                                    />
                                    {errors.cost && <p className="mt-2 text-xs text-error">{errors.cost}</p>}
                                </div>
                            )}
                            <div id="form-field-unit">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Unit <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={unitsQuery.data?.map((u: any) => ({
                                        label: u.name,
                                        value: String(u.id)
                                    })) || []}
                                    value={fuelForm.unit}
                                    onChange={(val) => handleFuelChange("unit", val)}
                                    error={Boolean(errors.unit)}
                                    placeholder={
                                        unitsQuery.isLoading
                                            ? "Loading units..."
                                            : !fuelForm.fuelType
                                            ? "Select fuel first"
                                            : "Select unit..."
                                    }
                                    isDisabled={
                                        !fuelForm.fuelType ||
                                        unitsQuery.isLoading ||
                                        (Array.isArray(unitsQuery.data) && unitsQuery.data.length === 0)
                                    }
                                    isLoading={unitsQuery.isLoading}
                                />
                                {errors.unit && <p className="mt-2 text-xs text-error">{errors.unit}</p>}
                            </div>
                        </div>
                    </section>
                )}

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
                    <div className="p-card-padding">
                        <ActivityDocumentsManager
                            documents={documents}
                            onChange={setDocuments}
                            errors={errors}
                        />
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
