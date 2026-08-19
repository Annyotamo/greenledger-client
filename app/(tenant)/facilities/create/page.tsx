"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Input } from "@/components/ui/input";
import { useCreateFacility } from "@/lib/facility/hooks";
import Link from "next/link";
import { CustomSelect } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { getErrorMessage } from "@/lib/utils/error";

const initialState = {
    name: "",
    facilityCode: "",
    description: "",
    facilityType: "manufacturing",
    operationalControl: true,
    financialControl: false,
    ownershipPercent: "100.00",
    country: "India",
    state: "West Bengal",
    city: "Kolkata",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    timezone: "Asia/Kolkata",
    operationalSince: "",
    operationalUntil: "",
    floorArea: "",
    floorAreaUnit: "sqft",
    employeeCount: "",
    scope1Enabled: true,
    scope2Enabled: true,
    scope3Enabled: true,
};

export default function CreateFacilityPage() {
    const router = useRouter();
    const { mutate, isPending } = useCreateFacility();
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (key: keyof typeof initialState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: "" }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        // 1. Mandatory fields validation
        if (!form.name.trim()) nextErrors.name = "Facility name is required.";
        if (!form.facilityType) nextErrors.facilityType = "Facility type is required.";
        if (!form.country.trim()) nextErrors.country = "Country is required.";
        if (!form.city.trim()) nextErrors.city = "City is required.";
        if (!form.addressLine1.trim()) nextErrors.addressLine1 = "Address Line 1 is required.";

        // 2. operational_until must be after operational_since
        if (form.operationalSince && form.operationalUntil) {
            const since = new Date(form.operationalSince);
            const until = new Date(form.operationalUntil);
            if (until < since) {
                nextErrors.operationalUntil = "Operational until date must be after operational since date.";
            }
        }

        // 3. floor_area_unit is required when floor_area is provided
        if (form.floorArea.trim() && !form.floorAreaUnit) {
            nextErrors.floorAreaUnit = "Floor area unit is required when floor area is specified.";
        }

        // 4. ownershipPercent validation
        if (form.ownershipPercent) {
            const pct = Number(form.ownershipPercent);
            if (isNaN(pct) || pct < 0 || pct > 100) {
                nextErrors.ownershipPercent = "Ownership percentage must be a number between 0 and 100.";
            }
        }

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

        mutate(
            {
                name: form.name.trim(),
                facilityType: form.facilityType,
                country: form.country.trim(),
                city: form.city.trim(),
                addressLine1: form.addressLine1.trim(),
                description: form.description.trim() || undefined,
                facilityCode: form.facilityCode.trim() || undefined,
                ownershipPercent: form.ownershipPercent !== "" ? Number(form.ownershipPercent) : undefined,
                state: form.state.trim() || undefined,
                addressLine2: form.addressLine2.trim() || undefined,
                postalCode: form.postalCode.trim() || undefined,
                timezone: form.timezone || undefined,
                operationalSince: form.operationalSince || undefined,
                operationalUntil: form.operationalUntil || undefined,
                floorArea: form.floorArea ? Number(form.floorArea) : undefined,
                floorAreaUnit: form.floorAreaUnit || undefined,
                employeeCount: form.employeeCount ? Number(form.employeeCount) : undefined,
                scope1Enabled: form.scope1Enabled,
                scope2Enabled: form.scope2Enabled,
                scope3Enabled: form.scope3Enabled,
            },
            {
                onSuccess: () => {
                    router.push("/facilities");
                },
                onError: (err) => {
                    console.error(err);
                    const message = getErrorMessage(err, "Failed to create facility. Please try again.");
                    setErrors({ submit: message });
                    setTimeout(() => {
                        const element = document.getElementById("logFacilityForm");
                        if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }, 100);
                }
            },
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/facilities" className="hover:text-primary transition-colors">
                    Facilities
                </Link>
                <MaterialIcon name="chevron_right" size="xs" />
                <span className="text-primary font-semibold">Add New Facility</span>
            </div>

            {/* Page Header */}
            <header className="mb-10">
                <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Facility Registration</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Define a new operational node for GHG accounting and impact tracking.
                </p>
            </header>

            <FormErrorSummary errors={errors} />

            {/* Form */}
            <form id="logFacilityForm" className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="info" size="sm" className="text-primary" />
                            <h2 className="text-headline-sm font-headline-sm text-primary">Basic Information</h2>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface-variant opacity-60">
                            * Mandatory fields
                        </span>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="form-field-name" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Facility Name <span className="text-error">*</span>
                            </label>
                            <Input
                                value={form.name}
                                onChange={(event) => handleChange("name", event.target.value)}
                                placeholder="e.g., GreenLedger Facility 001"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                        </div>
                        <div id="form-field-facilityCode" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Facility Unit (Code)
                            </label>
                            <Input
                                value={form.facilityCode}
                                onChange={(event) => handleChange("facilityCode", event.target.value)}
                                placeholder="e.g., GRNL-01/17 (optional)"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                        </div>
                        <div id="form-field-description" className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(event) => handleChange("description", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="Briefly describe the facility's core function..."
                            />
                        </div>
                        <div id="form-field-facilityType" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Facility Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: "Manufacturing", value: "manufacturing" },
                                    { label: "Office", value: "office" },
                                    { label: "Warehouse", value: "warehouse" },
                                    { label: "Retail", value: "retail" },
                                    { label: "Data Center", value: "data_center" },
                                ]}
                                value={form.facilityType}
                                onChange={(val) => handleChange("facilityType", val)}
                                placeholder="Select type..."
                            />
                            {errors.facilityType && <p className="text-xs text-error mt-1">{errors.facilityType}</p>}
                        </div>
                        <div id="form-field-ownershipPercent" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Ownership Percentage (%)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={form.ownershipPercent}
                                onChange={(event) => handleChange("ownershipPercent", event.target.value)}
                                placeholder="100.00 (optional)"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                            {errors.ownershipPercent && (
                                <p className="text-xs text-error mt-1">{errors.ownershipPercent}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Location Details Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center gap-3">
                        <MaterialIcon name="location_on" size="sm" className="text-primary" />
                        <h2 className="text-headline-sm font-headline-sm text-primary">Location Details</h2>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div id="form-field-country" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Country <span className="text-error">*</span></label>
                            <Input
                                value={form.country}
                                onChange={(event) => handleChange("country", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                            {errors.country && <p className="text-xs text-error mt-1">{errors.country}</p>}
                        </div>
                        <div id="form-field-state" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                State / Province
                            </label>
                            <Input
                                value={form.state}
                                onChange={(event) => handleChange("state", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                        </div>
                        <div id="form-field-city" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">City <span className="text-error">*</span></label>
                            <Input
                                value={form.city}
                                onChange={(event) => handleChange("city", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                            {errors.city && <p className="text-xs text-error mt-1">{errors.city}</p>}
                        </div>
                        <div id="form-field-addressLine1" className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Address Line 1 <span className="text-error">*</span>
                            </label>
                            <Input
                                value={form.addressLine1}
                                onChange={(event) => handleChange("addressLine1", event.target.value)}
                                placeholder="Street address, P.O. box"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                            {errors.addressLine1 && <p className="text-xs text-error mt-1">{errors.addressLine1}</p>}
                        </div>
                        <div id="form-field-addressLine2" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Address Line 2
                            </label>
                            <Input
                                value={form.addressLine2}
                                onChange={(event) => handleChange("addressLine2", event.target.value)}
                                placeholder="Apartment, suite, unit, building (optional)"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                        </div>
                        <div id="form-field-postalCode" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Postal Code
                            </label>
                            <Input
                                value={form.postalCode}
                                onChange={(event) => handleChange("postalCode", event.target.value)}
                                placeholder="700001"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                        </div>
                        <div id="form-field-timezone" className="space-y-2 md:col-span-3">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Timezone <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: "Asia/Kolkata" },
                                    { label: "(GMT+00:00) UTC", value: "UTC" },
                                    { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "America/New_York" },
                                ]}
                                value={form.timezone}
                                onChange={(val) => handleChange("timezone", val)}
                                placeholder="Select timezone..."
                            />
                        </div>
                    </div>
                </section>

                {/* Operational Details Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center gap-3">
                        <MaterialIcon name="settings_input_component" size="sm" className="text-primary" />
                        <h2 className="text-headline-sm font-headline-sm text-primary">Operational Details</h2>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="form-field-operationalSince" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Operational Since
                            </label>
                            <DatePicker
                                value={form.operationalSince}
                                onChange={(val) => handleChange("operationalSince", val)}
                            />
                        </div>
                        <div id="form-field-operationalUntil" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Operational Until (Optional)
                            </label>
                            <DatePicker
                                value={form.operationalUntil}
                                onChange={(val) => handleChange("operationalUntil", val)}
                            />
                            {errors.operationalUntil && <p className="text-xs text-error mt-1">{errors.operationalUntil}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div id="form-field-floorArea" className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Floor Area
                                </label>
                                <Input
                                    value={form.floorArea}
                                    onChange={(event) => handleChange("floorArea", event.target.value)}
                                    placeholder="e.g., 1570"
                                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                                />
                            </div>
                            <div id="form-field-floorAreaUnit" className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Unit
                                </label>
                                <CustomSelect
                                    options={[
                                        { label: "sqft", value: "sqft" },
                                        { label: "sqm", value: "sqm" },
                                    ]}
                                    value={form.floorAreaUnit}
                                    onChange={(val) => handleChange("floorAreaUnit", val)}
                                    placeholder="Unit"
                                />
                                {errors.floorAreaUnit && <p className="text-xs text-error mt-1">{errors.floorAreaUnit}</p>}
                            </div>
                        </div>
                        <div id="form-field-employeeCount" className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Employee Count
                            </label>
                            <Input
                                type="number"
                                value={form.employeeCount}
                                onChange={(event) => handleChange("employeeCount", event.target.value)}
                                placeholder="e.g., 250"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Scope Configuration Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center gap-3">
                        <MaterialIcon name="analytics" size="sm" className="text-primary" />
                        <h2 className="text-headline-sm font-headline-sm text-primary">Scope Configuration</h2>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "Scope 1", field: "scope1Enabled", description: "Direct Emissions" },
                            { label: "Scope 2", field: "scope2Enabled", description: "Indirect Energy" },
                            { label: "Scope 3", field: "scope3Enabled", description: "Value Chain" },
                        ].map((scope) => (
                            <div
                                key={scope.label}
                                className="flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-lg">
                                <div>
                                    <h3 className="text-headline-sm font-headline-sm text-primary">{scope.label}</h3>
                                    <p className="text-label-md font-label-md text-on-surface-variant">
                                        {scope.description}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form[scope.field as keyof typeof form] as boolean}
                                        onChange={(event) =>
                                            handleChange(scope.field as keyof typeof form, event.target.checked)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:bg-secondary transition-colors duration-200" />
                                    <span className="peer-checked:translate-x-5 pointer-events-none absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform duration-200" />
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Action Footer */}
                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => router.push("/facilities")}
                        className="px-8 py-3 rounded-lg font-label-md text-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:opacity-90 shadow-md transition-all active:scale-[0.98] disabled:opacity-60">
                        {isPending ? "Saving..." : "Save Facility"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
