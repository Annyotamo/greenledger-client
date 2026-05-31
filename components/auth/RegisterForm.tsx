"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerTenant, type RegisterTenantPayload } from "@/lib/auth/api";

const stepTitles = ["Company details", "Admin user", "Optional onboarding", "Review & verify"];

const initialFormState = {
    companyName: "",
    legalCompanyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    industryType: "",
    sector: "",
    organizationSize: "",
    country: "",
    state: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminJobTitle: "",
    adminPhoneNumber: "",
    createReportingPeriod: false,
    reportingPeriodName: "",
    reportingYear: new Date().getFullYear(),
    reportingPeriodStart: "",
    reportingPeriodEnd: "",
    createFacility: false,
    facilityName: "",
    facilityCode: "",
    facilityDescription: "",
    facilityCountry: "",
    facilityState: "",
    facilityCity: "",
    facilityAddressLine1: "",
    facilityAddressLine2: "",
    facilityPostalCode: "",
    facilityTimezone: "UTC",
};

type FormState = typeof initialFormState;

export default function RegisterForm() {
    const router = useRouter();
    const formId = useId();
    const [form, setForm] = useState<FormState>(initialFormState);
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (key: keyof FormState, value: string | boolean | number) => {
        setForm((current) => ({ ...current, [key]: value }));
        setError(null);
    };

    const validateStep = () => {
        if (step === 0) {
            if (!form.companyName.trim()) {
                setError("Company name is required.");
                return false;
            }
            if (!form.legalCompanyName.trim()) {
                setError("Legal company name is required.");
                return false;
            }
            if (!form.companyEmail.includes("@")) {
                setError("A valid company email is required.");
                return false;
            }
            if (!form.companyPhone.trim()) {
                setError("Company phone number is required.");
                return false;
            }
            if (!form.industryType.trim()) {
                setError("Industry type is required.");
                return false;
            }
            if (!form.sector.trim()) {
                setError("Sector is required.");
                return false;
            }
            if (!form.organizationSize.trim()) {
                setError("Organization size is required.");
                return false;
            }
            if (!form.addressLine1.trim()) {
                setError("Company address is required.");
                return false;
            }
            if (!form.city.trim() || !form.state.trim() || !form.country.trim()) {
                setError("Company location is required.");
                return false;
            }
            return true;
        }

        if (step === 1) {
            if (!form.adminFirstName.trim() || !form.adminLastName.trim()) {
                setError("Admin first and last name are required.");
                return false;
            }
            if (!form.adminEmail.includes("@")) {
                setError("A valid admin email is required.");
                return false;
            }
            if (form.adminPassword.length < 8) {
                setError("Password must be at least 8 characters.");
                return false;
            }
            return true;
        }

        if (step === 2) {
            if (form.createReportingPeriod) {
                if (!form.reportingPeriodName.trim()) {
                    setError("Reporting period name is required.");
                    return false;
                }
                if (!form.reportingPeriodStart || !form.reportingPeriodEnd) {
                    setError("Reporting period dates are required.");
                    return false;
                }
                if (new Date(form.reportingPeriodStart) >= new Date(form.reportingPeriodEnd)) {
                    setError("Reporting period end date must be after start date.");
                    return false;
                }
            }
            if (form.createFacility) {
                if (!form.facilityName.trim() || !form.facilityCode.trim()) {
                    setError("Facility name and code are required.");
                    return false;
                }
                if (!form.facilityCountry.trim() || !form.facilityState.trim() || !form.facilityCity.trim()) {
                    setError("Facility location is required.");
                    return false;
                }
                if (!form.facilityAddressLine1.trim()) {
                    setError("Facility address is required.");
                    return false;
                }
            }
            return true;
        }

        return true;
    };

    const handleNext = async () => {
        if (!validateStep()) return;
        setStep((current) => Math.min(current + 1, stepTitles.length - 1));
    };

    const handleBack = () => {
        setError(null);
        setStep((current) => Math.max(current - 1, 0));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateStep()) return;

        setIsSubmitting(true);
        setError(null);

        const payload: RegisterTenantPayload = {
            companyName: form.companyName.trim(),
            legalCompanyName: form.legalCompanyName.trim(),
            companyEmail: form.companyEmail.trim(),
            companyPhone: form.companyPhone.trim(),
            website: form.website.trim(),
            industryType: form.industryType.trim(),
            sector: form.sector.trim(),
            organizationSize: form.organizationSize.trim(),
            country: form.country.trim(),
            state: form.state.trim(),
            city: form.city.trim(),
            addressLine1: form.addressLine1.trim(),
            addressLine2: form.addressLine2.trim(),
            postalCode: form.postalCode.trim(),
            adminFirstName: form.adminFirstName.trim(),
            adminLastName: form.adminLastName.trim(),
            adminEmail: form.adminEmail.trim(),
            adminPassword: form.adminPassword,
            adminJobTitle: form.adminJobTitle.trim(),
            adminPhoneNumber: form.adminPhoneNumber.trim(),
            createReportingPeriod: form.createReportingPeriod,
            reportingPeriodName: form.reportingPeriodName.trim(),
            reportingYear: Number(form.reportingYear),
            reportingPeriodStart: form.reportingPeriodStart,
            reportingPeriodEnd: form.reportingPeriodEnd,
            createFacility: form.createFacility,
            facilityName: form.facilityName.trim(),
            facilityCode: form.facilityCode.trim(),
            facilityDescription: form.facilityDescription.trim(),
            facilityCountry: form.facilityCountry.trim(),
            facilityState: form.facilityState.trim(),
            facilityCity: form.facilityCity.trim(),
            facilityAddressLine1: form.facilityAddressLine1.trim(),
            facilityAddressLine2: form.facilityAddressLine2.trim(),
            facilityPostalCode: form.facilityPostalCode.trim(),
            facilityTimezone: form.facilityTimezone,
        };

        try {
            const response = await registerTenant(payload);
            if (!response.success) {
                throw new Error(response.message ?? "Unable to complete registration.");
            }
            setSuccessMessage(
                response.message ?? "Registration completed. A verification link has been sent to your email address.",
            );
            setIsSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unable to complete registration. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <MaterialIcon name="check_circle" size="lg" className="text-3xl" />
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold text-primary">Registration sent</h2>
                    <p className="mt-3 text-body-md text-on-surface-variant">{successMessage}</p>
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        className="mt-6"
                        onClick={() => router.push("/login")}>
                        Go to sign in
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit} aria-labelledby={`${formId}-title`}>
            <div className="space-y-4 rounded-3xl border border-outline-variant bg-surface-container-low p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                            Step {step + 1} of {stepTitles.length}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">{stepTitles[step]}</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {stepTitles.map((title, index) => (
                            <div
                                key={title}
                                className={`h-2 rounded-full ${index <= step ? "bg-primary" : "bg-outline-variant"}`}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-error/20 bg-error/5 p-4">
                    <div className="flex items-start gap-3">
                        <MaterialIcon name="error" size="sm" className="text-error mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-label-md text-label-md text-error font-semibold uppercase">Error</p>
                            <p className="text-body-md text-error mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {step === 0 && (
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="business" size="sm" className="text-on-secondary-container" />
                            <h3 className="text-headline-sm font-semibold text-primary">Company details</h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Company name
                                </label>
                                <Input
                                    value={form.companyName}
                                    onChange={(e) => handleChange("companyName", e.target.value)}
                                    placeholder="GreenLedger Inc."
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Legal name
                                </label>
                                <Input
                                    value={form.legalCompanyName}
                                    onChange={(e) => handleChange("legalCompanyName", e.target.value)}
                                    placeholder="GreenLedger Incorporated"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Business email
                                </label>
                                <Input
                                    type="email"
                                    value={form.companyEmail}
                                    onChange={(e) => handleChange("companyEmail", e.target.value)}
                                    placeholder="hello@greenledger.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Phone number
                                </label>
                                <Input
                                    type="tel"
                                    value={form.companyPhone}
                                    onChange={(e) => handleChange("companyPhone", e.target.value)}
                                    placeholder="+1 555 0100"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Industry type
                                </label>
                                <Input
                                    value={form.industryType}
                                    onChange={(e) => handleChange("industryType", e.target.value)}
                                    placeholder="Energy, manufacturing, finance"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Sector
                                </label>
                                <Input
                                    value={form.sector}
                                    onChange={(e) => handleChange("sector", e.target.value)}
                                    placeholder="Sustainability software"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Organization size
                                </label>
                                <Input
                                    value={form.organizationSize}
                                    onChange={(e) => handleChange("organizationSize", e.target.value)}
                                    placeholder="50–250 employees"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Website
                                </label>
                                <Input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => handleChange("website", e.target.value)}
                                    placeholder="https://greenledger.com"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Country
                                </label>
                                <Input
                                    value={form.country}
                                    onChange={(e) => handleChange("country", e.target.value)}
                                    placeholder="USA"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    State / region
                                </label>
                                <Input
                                    value={form.state}
                                    onChange={(e) => handleChange("state", e.target.value)}
                                    placeholder="California"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    City
                                </label>
                                <Input
                                    value={form.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    placeholder="San Francisco"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Postal code
                                </label>
                                <Input
                                    value={form.postalCode}
                                    onChange={(e) => handleChange("postalCode", e.target.value)}
                                    placeholder="94107"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Address line 1
                            </label>
                            <Input
                                value={form.addressLine1}
                                onChange={(e) => handleChange("addressLine1", e.target.value)}
                                placeholder="123 GreenLedger Street"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Address line 2
                            </label>
                            <Input
                                value={form.addressLine2}
                                onChange={(e) => handleChange("addressLine2", e.target.value)}
                                placeholder="Suite 400"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {step === 1 && (
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="person_add" size="sm" className="text-on-secondary-container" />
                            <h3 className="text-headline-sm font-semibold text-primary">Admin account</h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    First name
                                </label>
                                <Input
                                    value={form.adminFirstName}
                                    onChange={(e) => handleChange("adminFirstName", e.target.value)}
                                    placeholder="Alex"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Last name
                                </label>
                                <Input
                                    value={form.adminLastName}
                                    onChange={(e) => handleChange("adminLastName", e.target.value)}
                                    placeholder="Jordan"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    value={form.adminEmail}
                                    onChange={(e) => handleChange("adminEmail", e.target.value)}
                                    placeholder="admin@greenledger.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    value={form.adminPassword}
                                    onChange={(e) => handleChange("adminPassword", e.target.value)}
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Job title
                                </label>
                                <Input
                                    value={form.adminJobTitle}
                                    onChange={(e) => handleChange("adminJobTitle", e.target.value)}
                                    placeholder="Sustainability lead"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                    Phone number
                                </label>
                                <Input
                                    type="tel"
                                    value={form.adminPhoneNumber}
                                    onChange={(e) => handleChange("adminPhoneNumber", e.target.value)}
                                    placeholder="+1 555 0100"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="build_circle" size="sm" className="text-on-secondary-container" />
                            <h3 className="text-headline-sm font-semibold text-primary">Optional onboarding</h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="space-y-4 rounded-3xl border border-outline-variant bg-surface-container-low p-4">
                            <label className="flex items-center gap-3 text-on-surface">
                                <input
                                    type="checkbox"
                                    checked={form.createReportingPeriod}
                                    onChange={(e) => handleChange("createReportingPeriod", e.target.checked)}
                                    className="h-4 w-4 rounded border border-outline-variant text-primary focus:ring-primary"
                                />
                                <span className="font-semibold">Create a reporting period during onboarding</span>
                            </label>

                            {form.createReportingPeriod && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Period name
                                        </label>
                                        <Input
                                            value={form.reportingPeriodName}
                                            onChange={(e) => handleChange("reportingPeriodName", e.target.value)}
                                            placeholder="Q1 2025"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Reporting year
                                        </label>
                                        <Input
                                            type="number"
                                            value={form.reportingYear}
                                            onChange={(e) => handleChange("reportingYear", Number(e.target.value))}
                                            min={2000}
                                            max={2100}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Start date
                                        </label>
                                        <Input
                                            type="date"
                                            value={form.reportingPeriodStart}
                                            onChange={(e) => handleChange("reportingPeriodStart", e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            End date
                                        </label>
                                        <Input
                                            type="date"
                                            value={form.reportingPeriodEnd}
                                            onChange={(e) => handleChange("reportingPeriodEnd", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 rounded-3xl border border-outline-variant bg-surface-container-low p-4">
                            <label className="flex items-center gap-3 text-on-surface">
                                <input
                                    type="checkbox"
                                    checked={form.createFacility}
                                    onChange={(e) => handleChange("createFacility", e.target.checked)}
                                    className="h-4 w-4 rounded border border-outline-variant text-primary focus:ring-primary"
                                />
                                <span className="font-semibold">Create a facility during onboarding</span>
                            </label>

                            {form.createFacility && (
                                <div className="grid gap-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                Facility name
                                            </label>
                                            <Input
                                                value={form.facilityName}
                                                onChange={(e) => handleChange("facilityName", e.target.value)}
                                                placeholder="East Coast Plant"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                Facility code
                                            </label>
                                            <Input
                                                value={form.facilityCode}
                                                onChange={(e) => handleChange("facilityCode", e.target.value)}
                                                placeholder="GRNL-FC-001"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                Country
                                            </label>
                                            <Input
                                                value={form.facilityCountry}
                                                onChange={(e) => handleChange("facilityCountry", e.target.value)}
                                                placeholder="USA"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                State / region
                                            </label>
                                            <Input
                                                value={form.facilityState}
                                                onChange={(e) => handleChange("facilityState", e.target.value)}
                                                placeholder="California"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                City
                                            </label>
                                            <Input
                                                value={form.facilityCity}
                                                onChange={(e) => handleChange("facilityCity", e.target.value)}
                                                placeholder="Oakland"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                                Postal code
                                            </label>
                                            <Input
                                                value={form.facilityPostalCode}
                                                onChange={(e) => handleChange("facilityPostalCode", e.target.value)}
                                                placeholder="94607"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Address line 1
                                        </label>
                                        <Input
                                            value={form.facilityAddressLine1}
                                            onChange={(e) => handleChange("facilityAddressLine1", e.target.value)}
                                            placeholder="350 Main Street"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Address line 2
                                        </label>
                                        <Input
                                            value={form.facilityAddressLine2}
                                            onChange={(e) => handleChange("facilityAddressLine2", e.target.value)}
                                            placeholder="Building 2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Timezone
                                        </label>
                                        <Input
                                            value={form.facilityTimezone}
                                            onChange={(e) => handleChange("facilityTimezone", e.target.value)}
                                            placeholder="UTC"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                            Description
                                        </label>
                                        <Input
                                            value={form.facilityDescription}
                                            onChange={(e) => handleChange("facilityDescription", e.target.value)}
                                            placeholder="Core production facility"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader bordered tone="strip">
                            <div className="flex items-center gap-3">
                                <MaterialIcon name="fact_check" size="sm" className="text-on-secondary-container" />
                                <h3 className="text-headline-sm font-semibold text-primary">Review your setup</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                <p className="font-medium text-on-surface">Company</p>
                                <p className="text-body-md text-on-surface-variant">{form.companyName}</p>
                                <p className="text-body-sm text-on-surface-variant">{form.companyEmail}</p>
                            </div>
                            <div className="grid gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                <p className="font-medium text-on-surface">Admin user</p>
                                <p className="text-body-md text-on-surface-variant">
                                    {form.adminFirstName} {form.adminLastName}
                                </p>
                                <p className="text-body-sm text-on-surface-variant">{form.adminEmail}</p>
                            </div>
                            {form.createReportingPeriod && (
                                <div className="grid gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                    <p className="font-medium text-on-surface">Reporting period</p>
                                    <p className="text-body-md text-on-surface-variant">{form.reportingPeriodName}</p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        {form.reportingPeriodStart} to {form.reportingPeriodEnd}
                                    </p>
                                </div>
                            )}
                            {form.createFacility && (
                                <div className="grid gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                    <p className="font-medium text-on-surface">Facility</p>
                                    <p className="text-body-md text-on-surface-variant">{form.facilityName}</p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        {form.facilityCity}, {form.facilityCountry}
                                    </p>
                                </div>
                            )}
                            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
                                <p className="font-semibold">Verification</p>
                                <p className="mt-2">
                                    After registration, you will receive a verification email for your admin account.
                                    Please verify the email before signing in.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleBack}
                    disabled={step === 0 || isSubmitting}>
                    Back
                </Button>
                <div className="flex gap-3 justify-end">
                    {step < stepTitles.length - 1 ? (
                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-10 h-12 bg-secondary text-on-secondary font-headline-sm text-headline-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Continue
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-10 h-12 bg-secondary text-on-secondary font-headline-sm text-headline-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            {isSubmitting ? "Submitting…" : "Create workspace"}
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
