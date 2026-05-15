"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Select from "react-select";
import { publicApi } from "@/lib/http/client";
import { LuArrowLeft, LuBuilding, LuCheck, LuChevronRight, LuUser, LuEye, LuEyeOff } from "react-icons/lu";

type CompanyData = {
    legalCompanyName: string;
    displayName: string;
    industrySector: string;
    cinNumber: string;
    gstNumber: string;
    registeredAddress: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    baselineYear: number;
    reportingCurrency: string;
    fiscalYearStartMonth: number;
    logoUrl: string;
    scope1Enabled: boolean;
    scope2Enabled: boolean;
    scope3Enabled: boolean;
};

type UserData = {
    firstName: string;
    lastName: string;
    email: string;
    phNo: string;
    userName: string;
    password: string;
    confirmPassword: string;
};

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

const CURRENCIES = [
    { value: "INR", label: "🇮🇳 INR - Indian Rupee" },
    { value: "USD", label: "🇺🇸 USD - US Dollar" },
    { value: "EUR", label: "🇪🇺 EUR - Euro" },
    { value: "GBP", label: "🇬🇧 GBP - British Pound" },
    { value: "AUD", label: "🇦🇺 AUD - Australian Dollar" },
    { value: "CAD", label: "🇨🇦 CAD - Canadian Dollar" },
    { value: "SGD", label: "🇸🇬 SGD - Singapore Dollar" },
    { value: "JPY", label: "🇯🇵 JPY - Japanese Yen" },
];

export default function ApplicationPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);

    const [company, setCompany] = useState<CompanyData>({
        legalCompanyName: "",
        displayName: "",
        industrySector: "Renewable Energy",
        cinNumber: "",
        gstNumber: "",
        registeredAddress: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
        },
        baselineYear: 2025,
        reportingCurrency: "INR",
        fiscalYearStartMonth: 4,
        logoUrl: "",
        scope1Enabled: true,
        scope2Enabled: true,
        scope3Enabled: false,
    });

    const [user, setUser] = useState<UserData>({
        firstName: "",
        lastName: "",
        email: "",
        phNo: "",
        userName: "",
        password: "",
        confirmPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateCompany = (field: keyof CompanyData, value: any) => {
        setCompany((prev) => ({ ...prev, [field]: value }));
    };

    const updateAddress = (field: keyof CompanyData["registeredAddress"], value: string) => {
        setCompany((prev) => ({
            ...prev,
            registeredAddress: { ...prev.registeredAddress, [field]: value },
        }));
    };

    const updateUser = (field: keyof UserData, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // basic validation for step 1
        if (!company.legalCompanyName || !company.displayName || !company.industrySector) {
            setError("Please fill out the required company details.");
            return;
        }
        setError(null);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setError(null);
    };

    const handleSubmit = async () => {
        if (
            !user.firstName ||
            !user.lastName ||
            !user.email ||
            !user.userName ||
            !user.password ||
            !user.confirmPassword
        ) {
            setError("Please fill out all required user fields.");
            return;
        }

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create Company
            const companyRes = await publicApi.post("/company/register", company);
            const tenantId = companyRes.data?.data?.tenantId;

            if (!tenantId) {
                throw new Error("Failed to retrieve tenant ID from company registration.");
            }

            // 2. Create User
            const userPayload = {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                phNo: Number(user.phNo) || 0,
                userName: user.userName,
                password: user.password,
                company: company.legalCompanyName,
                tenantId: tenantId,
                role: "ADMIN",
            };

            await publicApi.post("/user/registerUser", userPayload);

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            if (err instanceof AxiosError) {
                const msg = err.response?.data?.message || err.response?.data?.response || "Registration failed.";
                setError(msg);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 px-4">
                <div className="w-full max-w-md animate-fade-up rounded-3xl border border-emerald-800/50 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50">
                        <LuCheck className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">Registration Complete</h2>
                    <p className="mt-3 text-sm text-emerald-100/80">
                        Your company and admin account have been successfully created. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-slate-900">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="gl-orb gl-drift absolute -left-20 top-20 h-96 w-96 bg-emerald-500/10 blur-3xl" />
                <div className="gl-orb gl-drift-2 absolute bottom-20 right-20 h-96 w-96 bg-teal-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
                <Link
                    href="/get-started"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 transition hover:bg-white/10">
                    <LuArrowLeft className="h-3.5 w-3.5" />
                    Back
                </Link>

                <div className="mt-8 flex flex-col gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Setup your GreenLedger
                    </h1>
                    <p className="text-emerald-100/80">Create your company profile and admin account to get started.</p>
                </div>

                {/* Step indicator */}
                <div className="mt-10 flex items-center gap-4">
                    <div
                        className={`flex items-center gap-3 ${step >= 1 ? "text-emerald-300" : "text-emerald-100/40"}`}>
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border ${step >= 1 ? "border-emerald-400 bg-emerald-500/20" : "border-emerald-100/20 bg-transparent"} text-sm font-bold`}>
                            1
                        </div>
                        <span className="font-semibold tracking-wide">Company</span>
                    </div>
                    <div className="h-px w-12 bg-white/10 sm:w-24" />
                    <div
                        className={`flex items-center gap-3 ${step >= 2 ? "text-emerald-300" : "text-emerald-100/40"}`}>
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border ${step >= 2 ? "border-emerald-400 bg-emerald-500/20" : "border-emerald-100/20 bg-transparent"} text-sm font-bold`}>
                            2
                        </div>
                        <span className="font-semibold tracking-wide">Admin User</span>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="mt-8 rounded-3xl border border-white/15 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-fade-up">
                            <div className="mb-6 flex items-center gap-3 border-b border-emerald-900/10 pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                                    <LuBuilding className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-emerald-950">Company Details</h2>
                                    <p className="text-xs text-slate-500">Official registry and reporting config.</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Legal Company Name"
                                    required
                                    value={company.legalCompanyName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("legalCompanyName", e.target.value)
                                    }
                                />
                                <Field
                                    label="Display Name"
                                    required
                                    value={company.displayName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("displayName", e.target.value)
                                    }
                                />
                                <Field
                                    label="Industry Sector"
                                    required
                                    value={company.industrySector}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("industrySector", e.target.value)
                                    }
                                />
                                <Field
                                    label="CIN Number"
                                    value={company.cinNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("cinNumber", e.target.value)
                                    }
                                />
                                <Field
                                    label="GST Number"
                                    value={company.gstNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("gstNumber", e.target.value)
                                    }
                                />
                                <Field
                                    label="Baseline Year"
                                    type="number"
                                    required
                                    value={company.baselineYear.toString()}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCompany("baselineYear", parseInt(e.target.value) || 2025)
                                    }
                                />
                            </div>

                            <div className="mt-8 border-t border-emerald-900/10 pt-6">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-emerald-900/60">
                                    Registered Address
                                </h3>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field
                                        label="Address Line 1"
                                        value={company.registeredAddress.line1}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("line1", e.target.value)
                                        }
                                    />
                                    <Field
                                        label="Address Line 2"
                                        value={company.registeredAddress.line2}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("line2", e.target.value)
                                        }
                                    />
                                    <Field
                                        label="City"
                                        value={company.registeredAddress.city}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("city", e.target.value)
                                        }
                                    />
                                    <Field
                                        label="State / Province"
                                        value={company.registeredAddress.state}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("state", e.target.value)
                                        }
                                    />
                                    <Field
                                        label="Country"
                                        value={company.registeredAddress.country}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("country", e.target.value)
                                        }
                                    />
                                    <Field
                                        label="Postal Code"
                                        value={company.registeredAddress.postalCode}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateAddress("postalCode", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="mt-8 border-t border-emerald-900/10 pt-6">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-emerald-900/60">
                                    Reporting Configuration
                                </h3>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <label className="grid gap-1.5">
                                        <span className="text-xs font-semibold text-emerald-950">
                                            Reporting Currency <span className="text-red-500">*</span>
                                        </span>
                                        <Select
                                            options={CURRENCIES}
                                            value={
                                                CURRENCIES.find((c) => c.value === company.reportingCurrency) ||
                                                CURRENCIES[0]
                                            }
                                            onChange={(option) =>
                                                updateCompany("reportingCurrency", option?.value || "INR")
                                            }
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "44px",
                                                    borderRadius: "0.75rem",
                                                    borderColor: "rgba(6, 78, 59, 0.1)",
                                                    boxShadow: "none",
                                                    "&:hover": { borderColor: "rgba(16, 185, 129, 0.5)" },
                                                }),
                                            }}
                                        />
                                    </label>
                                    <label className="grid gap-1.5">
                                        <span className="text-xs font-semibold text-emerald-950">
                                            Fiscal Year Start Month <span className="text-red-500">*</span>
                                        </span>
                                        <select
                                            value={company.fiscalYearStartMonth}
                                            onChange={(e) =>
                                                updateCompany("fiscalYearStartMonth", parseInt(e.target.value) || 4)
                                            }
                                            className="h-11 rounded-xl border border-emerald-900/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-100">
                                            {MONTHS.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <Field
                                        label="Logo URL"
                                        type="url"
                                        value={company.logoUrl}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateCompany("logoUrl", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="mt-8 border-t border-emerald-900/10 pt-6">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-emerald-900/60">
                                    Enabled Modules
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Switch
                                        label="Scope 1 Emissions"
                                        checked={company.scope1Enabled}
                                        onChange={(v) => updateCompany("scope1Enabled", v)}
                                    />
                                    <Switch
                                        label="Scope 2 Emissions"
                                        checked={company.scope2Enabled}
                                        onChange={(v) => updateCompany("scope2Enabled", v)}
                                    />
                                    <Switch
                                        label="Scope 3 Emissions"
                                        checked={company.scope3Enabled}
                                        onChange={(v) => updateCompany("scope3Enabled", v)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end pt-4">
                                <button
                                    onClick={handleNext}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700">
                                    Continue to Step 2
                                    <LuChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-up">
                            <div className="mb-6 flex items-center gap-3 border-b border-emerald-900/10 pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                                    <LuUser className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-emerald-950">Administrator Profile</h2>
                                    <p className="text-xs text-slate-500">
                                        First user account for {company.displayName || "your company"}.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="First Name"
                                    required
                                    value={user.firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("firstName", e.target.value)
                                    }
                                />
                                <Field
                                    label="Last Name"
                                    required
                                    value={user.lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("lastName", e.target.value)
                                    }
                                />

                                <Field
                                    label="Email Address"
                                    type="email"
                                    required
                                    value={user.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("email", e.target.value)
                                    }
                                />
                                <Field
                                    label="Phone Number"
                                    type="tel"
                                    value={user.phNo}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("phNo", e.target.value)
                                    }
                                />

                                <Field
                                    label="Username"
                                    required
                                    value={user.userName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("userName", e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-5 grid gap-5 sm:grid-cols-2 border-t border-emerald-900/10 pt-5">
                                <PasswordField
                                    label="Password"
                                    required
                                    value={user.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("password", e.target.value)
                                    }
                                />
                                <Field
                                    label="Confirm Password"
                                    type="password"
                                    required
                                    value={user.confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser("confirmPassword", e.target.value)
                                    }
                                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()}
                                />
                            </div>

                            <div className="mt-8 flex items-center justify-between pt-4">
                                <button
                                    onClick={handleBack}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-50">
                                    <LuArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>
                                            Registering...
                                        </>
                                    ) : (
                                        "Complete Registration"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
};

function Field({ label, value, onChange, onPaste, type = "text", required = false }: FieldProps) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-emerald-950">
                {label} {required && <span className="text-red-500">*</span>}
            </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                onPaste={onPaste}
                className="h-11 rounded-xl border border-emerald-900/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-100"
            />
        </label>
    );
}

function PasswordField({ label, value, onChange, required = false }: FieldProps) {
    const [show, setShow] = useState(false);
    return (
        <label className="grid gap-1.5 relative">
            <span className="text-xs font-semibold text-emerald-950">
                {label} {required && <span className="text-red-500">*</span>}
            </span>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className="h-11 w-full rounded-xl border border-emerald-900/10 bg-white pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-100"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-emerald-900/50 transition hover:bg-emerald-50 hover:text-emerald-900">
                    {show ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                </button>
            </div>
        </label>
    );
}

function Switch({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-emerald-900/10 bg-emerald-50/40 px-4 py-3 shadow-sm transition hover:bg-emerald-50/80">
            <span className="text-sm font-semibold text-emerald-950">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 ${checked ? "bg-emerald-600" : "bg-slate-200"}`}>
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
                />
            </button>
        </div>
    );
}
