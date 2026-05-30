"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Input } from "@/components/ui/input";
import { useCreateFacility } from "@/lib/facility/hooks";
import Link from "next/link";

const initialState = {
    name: "",
    facilityCode: "",
    description: "",
    facilityType: "manufacturing",
    ownershipType: "owned",
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
    const { mutate, isPending, isError } = useCreateFacility();
    const [form, setForm] = useState(initialState);

    const handleChange = (key: keyof typeof initialState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        mutate(
            {
                name: form.name,
                description: form.description,
                facilityCode: form.facilityCode,
                facilityType: form.facilityType,
                ownershipType: form.ownershipType,
                country: form.country,
                state: form.state,
                city: form.city,
                addressLine1: form.addressLine1,
                addressLine2: form.addressLine2,
                postalCode: form.postalCode,
                timezone: form.timezone,
                operationalSince: form.operationalSince,
                operationalUntil: form.operationalUntil,
                floorArea: form.floorArea,
                floorAreaUnit: form.floorAreaUnit,
                employeeCount: form.employeeCount,
                scope1Enabled: form.scope1Enabled,
                scope2Enabled: form.scope2Enabled,
                scope3Enabled: form.scope3Enabled,
            },
            {
                onSuccess: () => {
                    router.push("/facilities");
                },
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

            {/* Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="info" size="sm" className="text-primary" />
                            <h2 className="text-headline-sm font-headline-sm text-primary">Basic Information</h2>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface-variant opacity-60">
                            * Mandatory fields
                        </span>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Facility Name <span className="text-error">*</span>
                            </label>
                            <Input
                                required
                                value={form.name}
                                onChange={(event) => handleChange("name", event.target.value)}
                                placeholder="e.g., GreenLedger Facility 001"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Facility Code <span className="text-error">*</span>
                            </label>
                            <Input
                                required
                                value={form.facilityCode}
                                onChange={(event) => handleChange("facilityCode", event.target.value)}
                                placeholder="e.g., GRNL-01/17"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
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
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Facility Type
                            </label>
                            <select
                                value={form.facilityType}
                                onChange={(event) => handleChange("facilityType", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white">
                                <option value="manufacturing">Manufacturing</option>
                                <option value="office">Office</option>
                                <option value="warehouse">Warehouse</option>
                                <option value="retail">Retail</option>
                                <option value="data center">Data Center</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Ownership Type
                            </label>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="owned"
                                        checked={form.ownershipType === "owned"}
                                        onChange={(event) => handleChange("ownershipType", event.target.value)}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <span className="font-body-md text-body-md">Owned</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="leased"
                                        checked={form.ownershipType === "leased"}
                                        onChange={(event) => handleChange("ownershipType", event.target.value)}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <span className="font-body-md text-body-md">Leased</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Details Section */}
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center gap-3">
                        <MaterialIcon name="location_on" size="sm" className="text-primary" />
                        <h2 className="text-headline-sm font-headline-sm text-primary">Location Details</h2>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">Country</label>
                            <Input
                                value={form.country}
                                onChange={(event) => handleChange("country", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                State / Province
                            </label>
                            <Input
                                value={form.state}
                                onChange={(event) => handleChange("state", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">City</label>
                            <Input
                                value={form.city}
                                onChange={(event) => handleChange("city", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Address Line 1 <span className="text-error">*</span>
                            </label>
                            <Input
                                required
                                value={form.addressLine1}
                                onChange={(event) => handleChange("addressLine1", event.target.value)}
                                placeholder="Street address, P.O. box"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Postal Code
                            </label>
                            <Input
                                value={form.postalCode}
                                onChange={(event) => handleChange("postalCode", event.target.value)}
                                placeholder="700001"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Timezone
                            </label>
                            <select
                                value={form.timezone}
                                onChange={(event) => handleChange("timezone", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white">
                                <option value="Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                <option value="UTC">(GMT+00:00) UTC</option>
                                <option value="America/New_York">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Operational Details Section */}
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center gap-3">
                        <MaterialIcon name="settings_input_component" size="sm" className="text-primary" />
                        <h2 className="text-headline-sm font-headline-sm text-primary">Operational Details</h2>
                    </div>
                    <div className="p-card-padding grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Operational Since
                            </label>
                            <Input
                                type="date"
                                value={form.operationalSince}
                                onChange={(event) => handleChange("operationalSince", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Operational Until (Optional)
                            </label>
                            <Input
                                type="date"
                                value={form.operationalUntil}
                                onChange={(event) => handleChange("operationalUntil", event.target.value)}
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant">
                                    Floor Area
                                </label>
                                <Input
                                    value={form.floorArea}
                                    onChange={(event) => handleChange("floorArea", event.target.value)}
                                    placeholder="e.g., 1570"
                                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant">
                                    Unit
                                </label>
                                <select
                                    value={form.floorAreaUnit}
                                    onChange={(event) => handleChange("floorAreaUnit", event.target.value)}
                                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none bg-white">
                                    <option value="sqft">sqft</option>
                                    <option value="sqm">sqm</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant">
                                Employee Count
                            </label>
                            <Input
                                type="number"
                                value={form.employeeCount}
                                onChange={(event) => handleChange("employeeCount", event.target.value)}
                                placeholder="e.g., 250"
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Scope Configuration Section */}
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center gap-3">
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

                {/* Error Message */}
                {isError && (
                    <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-error font-body-md">
                        Something went wrong while creating the facility. Please try again.
                    </div>
                )}
            </form>
        </div>
    );
}
