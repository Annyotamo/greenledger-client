"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { uploadS3File } from "@/lib/activity/api";
import { useFuelCategories, useFuels, useFuelUnits } from "@/lib/fuel/hooks";
import { useCustomFuels, useCreateCustomFuel, useUpdateCustomFuel, useCustomFuelUnits } from "@/lib/customFuel/hooks";
import type { CustomFuelDto, CreateCustomFuelPayload } from "@/lib/customFuel/api";
import { getErrorMessage } from "@/lib/utils/error";
import { useEmissionSources } from "@/lib/emissionSource/hooks";

interface CustomFuelSectionProps {
    sourceId: string;
    emissionType: string;
    fuelCategory: string;
    fuelType: string;
    quantity: string;
    cost: string;
    unit: string;
    selectedCustomFuelId: string;
    onFieldChange: (field: string, value: string) => void;
    onCustomFuelSelect: (customFuelId: string, defaultFuelId?: string) => void;
    errors: Record<string, string>;
}

type CustomFuelFormState = {
    name: string;
    category_id: string;
    description: string;
    gcv: string;
    ncv: string;
    heat_content_unit: string;
    hydrogen_percentage: string;
    moisture_percentage: string;
    oxidation_factor: string;
    carbon_percentage: string;
    carbon_content: string;
    carbon_content_unit: string;
    as_received_basis: string;
    dry_basis: string;
    total_moisture_percentage: string;
    labReportUrl: string;
};

const initialCustomFuelFormState: CustomFuelFormState = {
    name: "",
    category_id: "",
    description: "",
    gcv: "",
    ncv: "",
    heat_content_unit: "KCAL/kg",
    hydrogen_percentage: "",
    moisture_percentage: "",
    oxidation_factor: "0.96",
    carbon_percentage: "",
    carbon_content: "",
    carbon_content_unit: "",
    as_received_basis: "",
    dry_basis: "",
    total_moisture_percentage: "",
    labReportUrl: "",
};

const HEAT_CONTENT_UNIT_OPTIONS = [
    { label: "KCAL/kg", value: "KCAL/kg" },
    { label: "MJ/kg", value: "MJ/kg" },
    { label: "GJ/Tonne", value: "GJ/Tonne" },
];

const CARBON_CONTENT_UNIT_OPTIONS = [
    { label: "kg/GJ", value: "kg/GJ" },
];


function formFieldClass(error?: boolean, disabled?: boolean) {
    return `w-full rounded-lg border ${
        error ? "border-error" : "border-outline-variant"
    } ${
        disabled ? "bg-surface-container-low text-on-surface-variant cursor-not-allowed opacity-75" : "bg-white text-on-surface"
    } px-3 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors`;
}

export function CustomFuelSection({
    sourceId,
    emissionType,
    fuelCategory,
    fuelType,
    quantity,
    cost,
    unit,
    selectedCustomFuelId,
    onFieldChange,
    onCustomFuelSelect,
    errors,
}: CustomFuelSectionProps) {
    const [useCustomFuel, setUseCustomFuel] = useState<boolean>(Boolean(selectedCustomFuelId));
    const [customMode, setCustomMode] = useState<"create" | "view_edit">("create");
    const [isEditing, setIsEditing] = useState<boolean>(true);

    const [customForm, setCustomForm] = useState<CustomFuelFormState>(initialCustomFuelFormState);
    const [customFormErrors, setCustomFormErrors] = useState<Record<string, string>>({});
    const [labReportFile, setLabReportFile] = useState<File | null>(null);
    const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
    const [isSubmittingCustom, setIsSubmittingCustom] = useState<boolean>(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);
    const [hasFormChangedSinceSave, setHasFormChangedSinceSave] = useState<boolean>(true);

    // Queries
    const fuelQueryType = emissionType === "process" || emissionType === "fugitive" ? "REFRIGERANT" : "FUEL";
    const emissionSourcesQuery = useEmissionSources("fuel");
    const currentSource = emissionSourcesQuery.data?.find((s) => String(s.id) === String(sourceId));
    const isIpccSource = currentSource ? currentSource.standard.toUpperCase().includes("IPCC") : true;

    // Fetch categories specifically for IPCC source for custom fuels
    const ipccSource = emissionSourcesQuery.data?.find((s) => s.standard.toUpperCase().includes("IPCC"));
    const ipccSourceId = ipccSource ? String(ipccSource.id) : sourceId;
    const ipccFuelCategoriesQuery = useFuelCategories(fuelQueryType, ipccSourceId);

    const fuelCategoriesQuery = useFuelCategories(fuelQueryType, sourceId);
    const fuelsQuery = useFuels(fuelQueryType, fuelCategory, sourceId);

    // Use units query based on selected standard fuel OR custom fuel API /user/custom-fuels/units
    const customFuelsQuery = useCustomFuels(sourceId);
    const selectedCustomFuel = customFuelsQuery.data?.find((cf) => cf.id === selectedCustomFuelId);
    const activeFuelIdForUnits = useCustomFuel ? (selectedCustomFuel?.default_fuel_id || fuelType) : fuelType;
    const standardUnitsQuery = useFuelUnits(activeFuelIdForUnits);
    const customFuelUnitsQuery = useCustomFuelUnits(useCustomFuel);
    const unitsQuery = useCustomFuel ? customFuelUnitsQuery : standardUnitsQuery;

    const fuelCategoryLabel = fuelQueryType === "REFRIGERANT" ? "Refrigerant Category" : "Fuel Category";
    const fuelLabel = fuelQueryType === "REFRIGERANT" ? "Refrigerant" : "Fuel";

    const createMutation = useCreateCustomFuel();
    const updateMutation = useUpdateCustomFuel();

    // If source changes to non-IPCC (e.g. DEFRA), automatically turn off custom fuel mode
    useEffect(() => {
        if (currentSource && !currentSource.standard.toUpperCase().includes("IPCC")) {
            if (useCustomFuel || selectedCustomFuelId) {
                setUseCustomFuel(false);
                onCustomFuelSelect("");
            }
        }
    }, [currentSource, useCustomFuel, selectedCustomFuelId, onCustomFuelSelect]);

    // When custom fuels list loads or selectedCustomFuelId changes, populate form if in view_edit mode
    useEffect(() => {
        if (selectedCustomFuelId && customFuelsQuery.data) {
            const found = customFuelsQuery.data.find((f) => f.id === selectedCustomFuelId);
            if (found) {
                populateCustomFuelForm(found);
                setCustomMode("view_edit");
                setIsEditing(false);
                setHasFormChangedSinceSave(false);
            }
        }
    }, [selectedCustomFuelId, customFuelsQuery.data]);

    function populateCustomFuelForm(cf: CustomFuelDto) {
        const fp = cf.fuel_properties || {};
        const tc = fp.total_carbon || {};
        const fc = fp.fixed_carbon || {};

        setCustomForm({
            name: cf.name || "",
            category_id: cf.category_id || "",
            description: cf.description || "",
            gcv: fp.gcv != null ? String(fp.gcv) : "",
            ncv: fp.ncv != null ? String(fp.ncv) : "",
            heat_content_unit: fp.heat_content_unit || "KCAL/kg",
            hydrogen_percentage: fp.hydrogen_percentage != null ? String(fp.hydrogen_percentage) : "",
            moisture_percentage: fp.moisture_percentage != null ? String(fp.moisture_percentage) : "",
            oxidation_factor: fp.oxidation_factor != null ? String(fp.oxidation_factor) : "0.96",
            carbon_percentage: tc.carbon_percentage != null ? String(tc.carbon_percentage) : "",
            carbon_content: tc.carbon_content != null ? String(tc.carbon_content) : "",
            carbon_content_unit: tc.carbon_content_unit || "",
            as_received_basis: fc.as_received_basis != null ? String(fc.as_received_basis) : "",
            dry_basis: fc.dry_basis != null ? String(fc.dry_basis) : "",
            total_moisture_percentage: fc.total_moisture_percentage != null ? String(fc.total_moisture_percentage) : "",
            labReportUrl: fp.lab_report || "",
        });
        setLabReportFile(null);
        setCustomFormErrors({});
    }

    function handleCustomFormChange(field: keyof CustomFuelFormState, value: string) {
        setCustomForm((prev) => ({ ...prev, [field]: value }));
        setCustomFormErrors((prev) => ({ ...prev, [field]: "", general: "" }));
        setHasFormChangedSinceSave(true);
    }

    function handleStartAddNew() {
        setUseCustomFuel(true);
        setCustomMode("create");
        setIsEditing(true);
        onCustomFuelSelect("");
        setCustomForm(initialCustomFuelFormState);
        setLabReportFile(null);
        setCustomFormErrors({});
        setHasFormChangedSinceSave(true);
    }

    function handleSelectExistingCustomFuel(cfId: string) {
        if (!cfId) {
            handleStartAddNew();
            return;
        }
        setUseCustomFuel(true);
        const cf = customFuelsQuery.data?.find((item) => item.id === cfId);
        if (cf) {
            onCustomFuelSelect(cf.id, cf.default_fuel_id);
            populateCustomFuelForm(cf);
            setCustomMode("view_edit");
            setIsEditing(false);
            setHasFormChangedSinceSave(false);
        }
    }

    function handleToggleCustomFuelMode(useCustom: boolean) {
        setUseCustomFuel(useCustom);
        if (!useCustom) {
            onCustomFuelSelect("");
        } else if (!selectedCustomFuelId) {
            handleStartAddNew();
        }
    }

    async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLabReportFile(file);
        setHasFormChangedSinceSave(true);
        setCustomFormErrors((prev) => ({ ...prev, labReport: "" }));
    }

    function validateCustomForm(): boolean {
        const errs: Record<string, string> = {};

        if (!customForm.name.trim()) {
            errs.name = "Custom Fuel name is required.";
        }
        if (!customForm.category_id) {
            errs.category_id = "Fuel Category is required.";
        }

        // NCV / GCV Validation: At least one of NCV or GCV must be provided
        const hasGcv = customForm.gcv.trim() !== "";
        const hasNcv = customForm.ncv.trim() !== "";
        if (!hasGcv && !hasNcv) {
            errs.gcv = "At least one of NCV or GCV must be provided.";
            errs.ncv = "At least one of NCV or GCV must be provided.";
        }

        // Total Carbon Validation: user may provide only ONE of carbon_percentage or carbon_content
        const hasCarbonPct = customForm.carbon_percentage.trim() !== "";
        const hasCarbonContent = customForm.carbon_content.trim() !== "";
        if (hasCarbonPct && hasCarbonContent) {
            errs.carbon_percentage = "Provide either Carbon % or Carbon Content, not both.";
            errs.carbon_content = "Provide either Carbon % or Carbon Content, not both.";
        }

        setCustomFormErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSaveCustomFuel() {
        if (!validateCustomForm()) return;

        setIsSubmittingCustom(true);
        setCustomFormErrors({});

        try {
            let finalLabReportUrl = customForm.labReportUrl;

            if (labReportFile) {
                setIsUploadingFile(true);
                finalLabReportUrl = await uploadS3File(labReportFile);
                setIsUploadingFile(false);
            }

            const payload: CreateCustomFuelPayload = {
                name: customForm.name.trim(),
                source_id: sourceId,
                category_id: customForm.category_id,
                description: customForm.description.trim() || undefined,
                fuel_properties: {
                    gcv: customForm.gcv !== "" ? Number(customForm.gcv) : null,
                    ncv: customForm.ncv !== "" ? Number(customForm.ncv) : null,
                    heat_content_unit: customForm.heat_content_unit || null,
                    hydrogen_percentage: customForm.hydrogen_percentage !== "" ? Number(customForm.hydrogen_percentage) : null,
                    moisture_percentage: customForm.moisture_percentage !== "" ? Number(customForm.moisture_percentage) : null,
                    total_carbon: {
                        carbon_percentage: customForm.carbon_percentage !== "" ? Number(customForm.carbon_percentage) : null,
                        carbon_content: customForm.carbon_content !== "" ? Number(customForm.carbon_content) : null,
                        carbon_content_unit: customForm.carbon_content_unit || null,
                    },
                    fixed_carbon: {
                        as_received_basis: customForm.as_received_basis !== "" ? Number(customForm.as_received_basis) : null,
                        dry_basis: customForm.dry_basis !== "" ? Number(customForm.dry_basis) : null,
                        total_moisture_percentage: customForm.total_moisture_percentage !== "" ? Number(customForm.total_moisture_percentage) : null,
                    },
                    oxidation_factor: customForm.oxidation_factor !== "" ? Number(customForm.oxidation_factor) : null,
                    lab_report: finalLabReportUrl || null,
                },
            };

            let savedId = "";
            let defaultFuelId = "";

            if (customMode === "view_edit" && selectedCustomFuelId) {
                const res = await updateMutation.mutateAsync({
                    customFuelId: selectedCustomFuelId,
                    payload,
                });
                savedId = res.data?.id || selectedCustomFuelId;
                defaultFuelId = res.data?.default_fuel_id || selectedCustomFuel?.default_fuel_id || "";
            } else {
                const res = await createMutation.mutateAsync(payload);
                savedId = res.data?.id || "";
                defaultFuelId = res.data?.default_fuel_id || "";
            }

            // Refresh custom fuels and select new/updated item
            await customFuelsQuery.refetch();
            if (savedId) {
                onCustomFuelSelect(savedId, defaultFuelId);
            }

            // UI behavior after success
            setIsEditing(false);
            setHasFormChangedSinceSave(false);
            setShowSuccessOverlay(true);
            setTimeout(() => setShowSuccessOverlay(false), 3000);
        } catch (err) {
            console.error("Custom fuel save error:", err);
            const msg = getErrorMessage(err, "Failed to save custom fuel. Please try again.");
            setCustomFormErrors({ general: msg });
        } finally {
            setIsSubmittingCustom(false);
            setIsUploadingFile(false);
        }
    }

    const isButtonDisabled =
        !isEditing ||
        isSubmittingCustom ||
        isUploadingFile ||
        (!hasFormChangedSinceSave && customMode === "view_edit");

    return (
        <section className="bg-white rounded-xl border border-outline-variant relative overflow-hidden transition-all">
            {/* Header */}
            <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                        <MaterialIcon name="local_gas_station" size="sm" />
                    </div>
                    <div>
                        <h2 className="text-headline-sm font-semibold text-primary">Fuel Details</h2>
                        <p className="text-xs text-on-surface-variant">
                            {isIpccSource
                                ? "Choose standard fuel type or configure a custom fuel blend."
                                : "Choose standard fuel type."}
                        </p>
                    </div>
                </div>

                {/* Workflow mode switches - Only displayed if Emission Standard is IPCC */}
                {isIpccSource && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleToggleCustomFuelMode(false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                !useCustomFuel
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low"
                            }`}
                        >
                            Standard Fuel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggleCustomFuelMode(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                                useCustomFuel
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-white border border-outline-variant text-primary hover:bg-surface-container-low"
                            }`}
                        >
                            <MaterialIcon name="add_circle" size="xs" />
                            Custom Fuel
                        </button>
                    </div>
                )}
            </div>

            {/* Card Content Body */}
            <div className="p-card-padding space-y-6 relative">
                {/* Subtle success animation overlay */}
                {showSuccessOverlay && (
                    <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-2 rounded-b-xl animate-in fade-in duration-300">
                        <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                            <MaterialIcon name="check_circle" size="lg" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-800">
                            Custom fuel saved successfully!
                        </p>
                        <p className="text-xs text-on-surface-variant">
                            It has been selected for this activity.
                        </p>
                    </div>
                )}

                {!isIpccSource || !useCustomFuel ? (
                    /* Standard Fuel Selection Mode */
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div id="form-field-fuelCategory">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                {fuelCategoryLabel} <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={
                                    fuelCategoriesQuery.data?.map((c) => ({
                                        label: c.name,
                                        value: String(c.id),
                                    })) || []
                                }
                                value={fuelCategory}
                                onChange={(val) => onFieldChange("fuelCategory", val)}
                                error={Boolean(errors.fuelType)}
                                placeholder={
                                    fuelCategoriesQuery.isLoading ? "Loading categories..." : "Select category..."
                                }
                                isLoading={fuelCategoriesQuery.isLoading}
                            />
                            {!fuelCategoriesQuery.isLoading &&
                                Array.isArray(fuelCategoriesQuery.data) &&
                                fuelCategoriesQuery.data.length === 0 && (
                                    <p className="mt-2 text-xs text-on-surface-variant">
                                        No {fuelCategoryLabel.toLowerCase()}s found for selected source.
                                    </p>
                                )}
                        </div>

                        <div id="form-field-fuelType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                {fuelLabel} <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={
                                    fuelsQuery.data?.map((f) => ({
                                        label: f.name,
                                        value: String(f.id),
                                    })) || []
                                }
                                value={fuelType}
                                onChange={(val) => onFieldChange("fuelType", val)}
                                error={Boolean(errors.fuelType)}
                                placeholder={
                                    fuelsQuery.isLoading
                                        ? `Loading ${fuelLabel.toLowerCase()}s...`
                                        : !fuelCategory
                                        ? `Select ${fuelCategoryLabel.toLowerCase()} first`
                                        : `Select ${fuelLabel.toLowerCase()}...`
                                }
                                isDisabled={
                                    !fuelCategory ||
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
                                value={quantity}
                                onChange={(event) => onFieldChange("quantity", event.target.value)}
                                className={`${formFieldClass(Boolean(errors.quantity))} border border-outline-variant`}
                                placeholder="0.00"
                            />
                            {errors.quantity && <p className="mt-2 text-xs text-error">{errors.quantity}</p>}
                        </div>

                        {emissionType !== "fugitive" && (
                            <div id="form-field-cost">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Price / Cost <span className="text-error">*</span>
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={cost}
                                    onChange={(event) => onFieldChange("cost", event.target.value)}
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
                                options={
                                     unitsQuery.data?.map((u: { id: string; name: string }) => ({
                                         label: u.name,
                                         value: String(u.id),
                                     })) || []
                                }
                                value={unit}
                                onChange={(val) => onFieldChange("unit", val)}
                                error={Boolean(errors.unit)}
                                placeholder={
                                    unitsQuery.isLoading
                                        ? "Loading units..."
                                        : !fuelType
                                        ? "Select fuel first"
                                        : "Select unit..."
                                }
                                isDisabled={
                                    !fuelType ||
                                    unitsQuery.isLoading ||
                                    (Array.isArray(unitsQuery.data) && unitsQuery.data.length === 0)
                                }
                                isLoading={unitsQuery.isLoading}
                            />
                            {errors.unit && <p className="mt-2 text-xs text-error">{errors.unit}</p>}
                        </div>
                    </div>
                ) : (
                    /* Custom Fuel Workflow Mode */
                    <div className="space-y-6">
                        {/* Selector & Control Toolbar */}
                        <div className="p-4 rounded-xl border border-outline-variant space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <label className="block text-xs font-semibold text-primary">
                                    Select Existing Custom Fuel or Create New
                                </label>
                                <button
                                    type="button"
                                    onClick={handleStartAddNew}
                                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                                >
                                    <MaterialIcon name="add_circle" size="xs" />
                                    Add Custom Fuel
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <CustomSelect
                                        options={[
                                            { label: "+ Add New Custom Fuel", value: "" },
                                            ...(customFuelsQuery.data?.map((cf) => ({
                                                label: `${cf.name} (${cf.fuel_properties?.lab_report ? "Lab Verified" : "Custom"})`,
                                                value: cf.id,
                                            })) || []),
                                        ]}
                                        value={selectedCustomFuelId}
                                        onChange={handleSelectExistingCustomFuel}
                                        placeholder={
                                            customFuelsQuery.isLoading
                                                ? "Loading custom fuels..."
                                                : "Select existing custom fuel..."
                                        }
                                        isLoading={customFuelsQuery.isLoading}
                                    />
                                </div>
                                {selectedCustomFuelId && !isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setHasFormChangedSinceSave(true);
                                        }}
                                        className="h-10 px-3 rounded-lg border border-outline-variant bg-white text-primary hover:bg-surface-container-high flex items-center gap-1.5 text-xs font-medium transition-colors shadow-sm"
                                        title="Edit Custom Fuel"
                                    >
                                        <MaterialIcon name="edit" size="xs" />
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {customFormErrors.general && (
                            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30">
                                {customFormErrors.general}
                            </div>
                        )}

                        {/* Custom Fuel Form */}
                        <div className="space-y-6 pt-2">
                            {/* Basic Details */}
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Custom Fuel Name <span className="text-error">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={customForm.name}
                                        onChange={(e) => handleCustomFormChange("name", e.target.value)}
                                        disabled={!isEditing}
                                        className={formFieldClass(Boolean(customFormErrors.name), !isEditing)}
                                        placeholder="e.g. Coal-[Grade G4]"
                                    />
                                    {customFormErrors.name && (
                                        <p className="mt-1 text-xs text-error">{customFormErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Fuel Category <span className="text-error">*</span>
                                    </label>
                                    <CustomSelect
                                        options={
                                            ipccFuelCategoriesQuery.data?.map((c) => ({
                                                label: c.name,
                                                value: String(c.id),
                                            })) || []
                                        }
                                        value={customForm.category_id}
                                        onChange={(val) => handleCustomFormChange("category_id", val)}
                                        isDisabled={!isEditing || ipccFuelCategoriesQuery.isLoading}
                                        error={Boolean(customFormErrors.category_id)}
                                        placeholder="Select fuel category..."
                                        isLoading={ipccFuelCategoriesQuery.isLoading}
                                    />
                                    {customFormErrors.category_id && (
                                        <p className="mt-1 text-xs text-error">{customFormErrors.category_id}</p>
                                    )}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={customForm.description}
                                        onChange={(e) => handleCustomFormChange("description", e.target.value)}
                                        disabled={!isEditing}
                                        className={`${formFieldClass(false, !isEditing)} min-h-[70px]`}
                                        placeholder="Custom biocoal blend description..."
                                    />
                                </div>
                            </div>

                            {/* Calorific Value / Energy Content */}
                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-4">
                                <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                    <MaterialIcon name="local_fire_department" size="xs" />
                                    Heat Content
                                </h3>
                                <div className="grid gap-4 lg:grid-cols-3">
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            GCV (Gross Calorific Value)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.gcv}
                                            onChange={(e) => handleCustomFormChange("gcv", e.target.value)}
                                            disabled={!isEditing}
                                            className={formFieldClass(Boolean(customFormErrors.gcv), !isEditing)}
                                            placeholder="e.g. 6251"
                                        />
                                        {customFormErrors.gcv && (
                                            <p className="mt-1 text-xs text-error">{customFormErrors.gcv}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            NCV (Net Calorific Value)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.ncv}
                                            onChange={(e) => handleCustomFormChange("ncv", e.target.value)}
                                            disabled={!isEditing}
                                            className={formFieldClass(Boolean(customFormErrors.ncv), !isEditing)}
                                            placeholder="e.g. 5800"
                                        />
                                        {customFormErrors.ncv && (
                                            <p className="mt-1 text-xs text-error">{customFormErrors.ncv}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Heat Content Unit
                                        </label>
                                        <CustomSelect
                                            options={
                                                customForm.heat_content_unit && !HEAT_CONTENT_UNIT_OPTIONS.some((o) => o.value === customForm.heat_content_unit)
                                                    ? [{ label: customForm.heat_content_unit, value: customForm.heat_content_unit }, ...HEAT_CONTENT_UNIT_OPTIONS]
                                                    : HEAT_CONTENT_UNIT_OPTIONS
                                            }
                                            value={customForm.heat_content_unit}
                                            onChange={(val) => handleCustomFormChange("heat_content_unit", val)}
                                            isDisabled={!isEditing}
                                            placeholder="Select unit..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Hydrogen (%)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.hydrogen_percentage}
                                            onChange={(e) => handleCustomFormChange("hydrogen_percentage", e.target.value)}
                                            disabled={!isEditing}
                                            className={formFieldClass(false, !isEditing)}
                                            placeholder="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Moisture (%)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.moisture_percentage}
                                            onChange={(e) => handleCustomFormChange("moisture_percentage", e.target.value)}
                                            disabled={!isEditing}
                                            className={formFieldClass(false, !isEditing)}
                                            placeholder="6"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total Carbon & Fixed Carbon */}
                            <div className="grid gap-4 lg:grid-cols-2">
                                {/* Total Carbon */}
                                <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3">
                                    <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                        <MaterialIcon name="co2" size="xs" />
                                        Total Carbon Content
                                    </h3>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Carbon Percentage (%)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.carbon_percentage}
                                            onChange={(e) => handleCustomFormChange("carbon_percentage", e.target.value)}
                                            disabled={!isEditing || Boolean(customForm.carbon_content.trim())}
                                            className={formFieldClass(
                                                Boolean(customFormErrors.carbon_percentage),
                                                !isEditing || Boolean(customForm.carbon_content.trim())
                                            )}
                                            placeholder="e.g. 66"
                                        />
                                        {customFormErrors.carbon_percentage && (
                                            <p className="mt-1 text-xs text-error">{customFormErrors.carbon_percentage}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Carbon Content
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                step="any"
                                                value={customForm.carbon_content}
                                                onChange={(e) => handleCustomFormChange("carbon_content", e.target.value)}
                                                disabled={!isEditing || Boolean(customForm.carbon_percentage.trim())}
                                                className={formFieldClass(
                                                    Boolean(customFormErrors.carbon_content),
                                                    !isEditing || Boolean(customForm.carbon_percentage.trim())
                                                )}
                                                placeholder="Value"
                                            />
                                            <CustomSelect
                                                options={
                                                    customForm.carbon_content_unit && !CARBON_CONTENT_UNIT_OPTIONS.some((o) => o.value === customForm.carbon_content_unit)
                                                        ? [{ label: customForm.carbon_content_unit, value: customForm.carbon_content_unit }, ...CARBON_CONTENT_UNIT_OPTIONS]
                                                        : CARBON_CONTENT_UNIT_OPTIONS
                                                }
                                                value={customForm.carbon_content_unit}
                                                onChange={(val) => handleCustomFormChange("carbon_content_unit", val)}
                                                isDisabled={!isEditing || Boolean(customForm.carbon_percentage.trim())}
                                                placeholder="Select unit..."
                                            />
                                        </div>
                                        {customFormErrors.carbon_content && (
                                            <p className="mt-1 text-xs text-error">{customFormErrors.carbon_content}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Fixed Carbon */}
                                <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3">
                                    <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                        <MaterialIcon name="science" size="xs" />
                                        Total Carbon / Fixed Carbon
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                                Dry Basis (%)
                                            </label>
                                            <Input
                                                type="number"
                                                step="any"
                                                value={customForm.dry_basis}
                                                onChange={(e) => handleCustomFormChange("dry_basis", e.target.value)}
                                                disabled={!isEditing}
                                                className={formFieldClass(false, !isEditing)}
                                                placeholder="60.0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                                As Received Basis (%)
                                            </label>
                                            <Input
                                                type="number"
                                                step="any"
                                                value={customForm.as_received_basis}
                                                onChange={(e) => handleCustomFormChange("as_received_basis", e.target.value)}
                                                disabled={!isEditing}
                                                className={formFieldClass(false, !isEditing)}
                                                placeholder="55.2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                            Total Moisture (%)
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={customForm.total_moisture_percentage}
                                            onChange={(e) => handleCustomFormChange("total_moisture_percentage", e.target.value)}
                                            disabled={!isEditing}
                                            className={formFieldClass(false, !isEditing)}
                                            placeholder="8"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties & Lab Report */}
                            <div className="grid gap-4 lg:grid-cols-3">
                                <div>
                                    <label className="block font-label-md text-xs text-on-surface-variant mb-1">
                                        Oxidation Factor
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={customForm.oxidation_factor}
                                        onChange={(e) => handleCustomFormChange("oxidation_factor", e.target.value)}
                                        disabled={!isEditing}
                                        className={formFieldClass(false, !isEditing)}
                                        placeholder="0.96"
                                    />
                                </div>
                            </div>

                            {/* Lab Report Attachment */}
                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-2">
                                <label className="block text-xs font-semibold text-primary flex items-center gap-1.5">
                                    <MaterialIcon name="picture_as_pdf" size="xs" />
                                    Lab Report Document
                                </label>
                                {customForm.labReportUrl && (
                                    <div className="flex items-center gap-2 text-xs text-primary mb-2">
                                        <MaterialIcon name="link" size="xs" />
                                        <a
                                            href={customForm.labReportUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-secondary truncate max-w-md"
                                        >
                                            {customForm.labReportUrl}
                                        </a>
                                    </div>
                                )}
                                {isEditing && (
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        disabled={isUploadingFile}
                                        className="block w-full text-xs text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-container-high file:text-primary hover:file:bg-surface-container-highest cursor-pointer"
                                    />
                                )}
                                {labReportFile && (
                                    <p className="text-xs text-emerald-700 font-medium">
                                        Selected: {labReportFile.name} (will be uploaded on save)
                                    </p>
                                )}
                            </div>

                            {/* Custom Fuel Primary Action Button */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveCustomFuel}
                                    disabled={isButtonDisabled}
                                    className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                                        isButtonDisabled
                                            ? "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed border border-outline-variant"
                                            : "bg-primary text-on-primary hover:opacity-90 shadow-md active:scale-[0.98]"
                                    }`}
                                >
                                    {isSubmittingCustom || isUploadingFile ? (
                                        <>
                                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MaterialIcon name="save" size="xs" />
                                            {customMode === "view_edit" && selectedCustomFuelId
                                                ? "Update"
                                                : "Add"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quantity, Cost, Unit for Custom Fuel Activity */}
                        <div className="pt-4 border-t border-outline-variant grid gap-4 lg:grid-cols-3">
                            <div id="form-field-quantity">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Quantity <span className="text-error">*</span>
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={quantity}
                                    onChange={(event) => onFieldChange("quantity", event.target.value)}
                                    className={`${formFieldClass(Boolean(errors.quantity))} border border-outline-variant`}
                                    placeholder="0.00"
                                />
                                {errors.quantity && <p className="mt-2 text-xs text-error">{errors.quantity}</p>}
                            </div>

                            {emissionType !== "fugitive" && (
                                <div id="form-field-cost">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Price / Cost <span className="text-error">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={cost}
                                        onChange={(event) => onFieldChange("cost", event.target.value)}
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
                                    options={
                                         unitsQuery.data?.map((u: { id: string; name: string }) => ({
                                             label: u.name,
                                             value: String(u.id),
                                         })) || []
                                    }
                                    value={unit}
                                    onChange={(val) => onFieldChange("unit", val)}
                                    error={Boolean(errors.unit)}
                                    placeholder={
                                        unitsQuery.isLoading
                                            ? "Loading units..."
                                            : "Select unit..."
                                    }
                                    isLoading={unitsQuery.isLoading}
                                />
                                {errors.unit && <p className="mt-2 text-xs text-error">{errors.unit}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
