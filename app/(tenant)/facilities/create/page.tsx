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
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

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

function CreateFacilityContent() {
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

        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = "Facility name is required.";
        if (!form.facilityCode.trim()) newErrors.facilityCode = "Facility code is required.";
        if (!form.country.trim()) newErrors.country = "Country is required.";
        if (!form.state.trim()) newErrors.state = "State is required.";
        if (!form.city.trim()) newErrors.city = "City is required.";
        if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address line 1 is required.";
        if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        mutate(
            {
                name: form.name.trim(),
                facilityCode: form.facilityCode.trim(),
                description: form.description.trim() || undefined,
                facilityType: form.facilityType,
                country: form.country.trim(),
                state: form.state.trim() || undefined,
                city: form.city.trim(),
                addressLine1: form.addressLine1.trim(),
                addressLine2: form.addressLine2.trim() || undefined,
                postalCode: form.postalCode.trim() || undefined,
                timezone: form.timezone,
                operationalSince: form.operationalSince || undefined,
                operationalUntil: form.operationalUntil || undefined,
                floorArea: form.floorArea ? Number(form.floorArea) : undefined,
                floorAreaUnit: form.floorAreaUnit,
                employeeCount: form.employeeCount ? Number(form.employeeCount) : undefined,
                scope1Enabled: form.scope1Enabled,
                scope2Enabled: form.scope2Enabled,
                scope3Enabled: form.scope3Enabled,
            },
            {
                onSuccess: () => {
                    router.push("/facilities");
                },
                onError: (error) => {
                    setErrors({ submit: getErrorMessage(error) });
                },
            },
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin animate-fade-up">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/facilities" className="hover:text-primary transition-colors">
                    Facilities
                </Link>
                <MaterialIcon name="chevron_right" size="xs" />
                <span className="text-primary font-semibold">Create New Facility</span>
            </div>

            <header className="mb-10">
                <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Create Facility</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Add a new facility to your organization to track location-specific emissions and sustainability
                    metrics.
                </p>
            </header>

            {errors.submit && <FormErrorSummary errors={errors} submitError={errors.submit} />}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-6">
                    <h2 className="text-headline-sm font-semibold text-primary">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-on-surface-variant uppercase mb-1">
                                Facility Name *
                            </label>
                            <Input
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="e.g. Durgapur Steel Plant"
                            />
                            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-on-surface-variant uppercase mb-1">
                                Facility Code *
                            </label>
                            <Input
                                value={form.facilityCode}
                                onChange={(e) => handleChange("facilityCode", e.target.value)}
                                placeholder="e.g. DSP-01"
                            />
                            {errors.facilityCode && <p className="text-xs text-error mt-1">{errors.facilityCode}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/facilities">
                        <button
                            type="button"
                            className="bg-white border border-outline-variant px-6 py-2.5 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-on-primary px-8 py-2.5 rounded font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isPending ? "Creating..." : "Create Facility"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CreateFacilityPage() {
    return (
        <ProtectedRoute feature="facilities" requiredLevel="write" featureTitle="Create Facility">
            <CreateFacilityContent />
        </ProtectedRoute>
    );
}
