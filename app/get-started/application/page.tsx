"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { LuArrowLeft, LuCircleCheck, LuLeaf, LuSend } from "react-icons/lu";
import greenLedgerLogo from "@/assets/GLLogo.png";

const needs = [
    "CSRD / ESRS Reporting",
    "Scope 1, 2, 3 Carbon Accounting",
    "Financed Emissions (BFSI)",
    "Supply Chain Traceability",
    "Supplier Assessment Program",
    "QR Product Journey",
    "Blockchain Traceability",
    "ESG Advisory and Consulting",
];

export default function CompanyIntakePage() {
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full text-slate-900">
            <main className="mx-auto w-full max-w-400 px-4 sm:px-5 md:px-6 lg:px-7">
                <section className="full-bleed relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 py-12 text-white md:py-16">
                    <div className="gl-orb gl-drift" style={{ top: "10%", left: "8%", width: 260, height: 260 }} />
                    <div className="gl-orb gl-drift-2" style={{ right: "6%", bottom: "8%", width: 320, height: 320 }} />
                    <div className="relative mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-7">
                        <Link
                            href="/get-started"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 transition hover:bg-white/20">
                            <LuArrowLeft className="h-3.5 w-3.5" />
                            Back to options
                        </Link>
                        <h1 className="mt-5 max-w-4xl text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                            Company intake form
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/95 sm:text-base">
                            Share your organization profile, emissions maturity, and reporting priorities. No API is
                            connected yet, but this form captures all key information a carbon accounting and ESG
                            reporting implementation requires.
                        </p>
                    </div>
                </section>

                <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <form
                        onSubmit={onSubmit}
                        className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl backdrop-blur-md sm:p-7 md:p-8">
                        <div className="grid gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950 sm:text-2xl">Organization details</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <Field label="Company name" name="companyName" required />
                                    <Field
                                        label="Website"
                                        name="website"
                                        type="url"
                                        placeholder="https://example.com"
                                    />
                                    <Field label="Primary contact name" name="contactName" required />
                                    <Field label="Work email" name="email" type="email" required />
                                    <Field label="Phone number" name="phone" type="tel" />
                                    <Field label="Headquarter country" name="country" required />
                                    <Field label="Industry / sector" name="industry" required />
                                    <Field
                                        label="Company size (employees)"
                                        name="employeeRange"
                                        placeholder="e.g. 500-2000"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-emerald-950">Operational footprint</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <Field label="Number of legal entities" name="entitiesCount" />
                                    <Field label="Number of operating sites" name="sitesCount" />
                                    <Field
                                        label="Countries of operation"
                                        name="operationCountries"
                                        placeholder="e.g. India, UAE, Germany"
                                    />
                                    <Field label="Supplier count" name="supplierCount" />
                                    <Field label="Annual revenue (optional)" name="revenueBand" />
                                    <Field
                                        label="Current ESG reporting maturity"
                                        name="maturity"
                                        placeholder="Early / Growing / Advanced"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-emerald-950">
                                    What you need from GreenLedger
                                </h3>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {needs.map((item) => (
                                        <label
                                            key={item}
                                            className="card-hover flex items-start gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 px-3 py-3 text-sm font-medium text-slate-800">
                                            <input
                                                type="checkbox"
                                                name="priorityNeeds"
                                                value={item}
                                                className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                                            />
                                            <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-emerald-950">Data and systems</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Current ERP / finance systems"
                                        name="erpSystems"
                                        placeholder="e.g. SAP, Oracle, NetSuite"
                                    />
                                    <Field label="Current ESG tools (if any)" name="esgTools" />
                                    <Field
                                        label="Data availability for Scope 1"
                                        name="scope1Data"
                                        placeholder="Strong / Partial / Not available"
                                    />
                                    <Field
                                        label="Data availability for Scope 2"
                                        name="scope2Data"
                                        placeholder="Strong / Partial / Not available"
                                    />
                                    <Field
                                        label="Data availability for Scope 3"
                                        name="scope3Data"
                                        placeholder="Strong / Partial / Not available"
                                    />
                                    <Field label="Supplier data readiness" name="supplierDataReadiness" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-emerald-950">Implementation timeline</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Target go-live window"
                                        name="goLiveWindow"
                                        placeholder="e.g. Q3 2026"
                                    />
                                    <Field label="Budget range" name="budgetRange" placeholder="e.g. USD 50k - 150k" />
                                    <Field
                                        label="Preferred meeting platform"
                                        name="meetingPlatform"
                                        placeholder="Google Meet / Teams / Zoom"
                                    />
                                    <Field
                                        label="Best time to contact"
                                        name="contactTime"
                                        placeholder="e.g. Weekdays 2 PM - 6 PM IST"
                                    />
                                </div>
                            </div>

                            <TextArea
                                label="Business goals and challenges"
                                name="goals"
                                placeholder="Tell us what success looks like for your ESG, carbon accounting, and traceability roadmap."
                                required
                            />
                            <TextArea
                                label="Anything else we should know?"
                                name="additionalContext"
                                placeholder="Share regulatory pressure, major client asks, board expectations, or special constraints."
                            />

                            <div className="rounded-2xl border border-emerald-300/45 bg-emerald-100/70 p-3 sm:p-4">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/80">
                                    Final step
                                </p>
                                <p className="mt-1 text-sm font-semibold text-emerald-950">
                                    Submit this form to request a tailored onboarding session
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    className="animate-pulse-strong inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/25 transition hover:-translate-y-0.5 hover:bg-emerald-800">
                                    Submit intake
                                    <LuSend className="h-4 w-4" />
                                </button>
                                <Link
                                    href="/get-started"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-900/15 bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50">
                                    Back to options
                                </Link>
                            </div>

                            {submitted && (
                                <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                                    <p className="inline-flex items-center gap-2 font-semibold">
                                        <LuCircleCheck className="h-4 w-4" />
                                        Thanks, your intake is captured in UI mode.
                                    </p>
                                    <p className="mt-1 text-emerald-800">
                                        No backend is connected yet. Once API integration is added, this will submit to
                                        your lead pipeline.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>

                    <aside className="space-y-4">
                        <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg backdrop-blur-md sm:p-6">
                            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                                <LuLeaf className="h-3.5 w-3.5" />
                                Why this form is detailed
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                High-quality onboarding starts with context: operational boundaries, supplier maturity,
                                systems, governance ownership, and timeline expectations.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/80 p-5 shadow-sm sm:p-6">
                            <h3 className="text-base font-semibold text-emerald-950">What happens next</h3>
                            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                                <li className="rounded-xl bg-white/85 px-3 py-2">
                                    1. Team reviews your company context
                                </li>
                                <li className="rounded-xl bg-white/85 px-3 py-2">
                                    2. We build a tailored module recommendation
                                </li>
                                <li className="rounded-xl bg-white/85 px-3 py-2">
                                    3. We schedule a focused demo and roadmap call
                                </li>
                            </ol>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

type FieldProps = {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
};

function Field({ label, name, type = "text", placeholder, required }: FieldProps) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/75">{label}</span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                className="rounded-xl border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
        </label>
    );
}

type TextAreaProps = {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
};

function TextArea({ label, name, placeholder, required }: TextAreaProps) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/75">{label}</span>
            <textarea
                name={name}
                required={required}
                placeholder={placeholder}
                rows={5}
                className="rounded-xl border border-emerald-900/15 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
        </label>
    );
}
