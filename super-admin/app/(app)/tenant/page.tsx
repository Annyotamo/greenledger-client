"use client";

import { useState } from "react";

type SubmitResult = {
    ok: boolean;
    message: string;
    status?: number;
};

export default function TenantPage() {
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitResult | null>(null);

    const canSubmit = companyName.trim().length > 0 && location.trim().length > 0;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setResult(null);

        if (!canSubmit) {
            setResult({ ok: false, message: "Please enter both company name and location." });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/tenant/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ companyName: companyName.trim(), location: location.trim() }),
            });

            const body = await res.json().catch(() => null);
            const message = body?.message || (res.ok ? "Tenant created successfully." : "Tenant creation failed.");

            setResult({ ok: res.ok, status: res.status, message });
            if (res.ok) {
                setCompanyName("");
                setLocation("");
            }
        } catch (error) {
            setResult({ ok: false, message: error instanceof Error ? error.message : "Request failed." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="gl-card p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Tenant Management</h1>
                    <p className="mt-2 max-w-2xl text-sm text-(--muted)">
                        Create a new tenant using the admin API. This page sends a bearer token-protected request and
                        displays the result.
                    </p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
                    Add New Tenant
                </div>
            </div>

            <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                        Company name
                        <input
                            value={companyName}
                            onChange={(event) => setCompanyName(event.target.value)}
                            placeholder="Sample Company Inc"
                            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                        Location
                        <input
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            placeholder="Kolkata"
                            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
                        />
                    </label>
                </div>

                <div className="space-y-3 rounded-3xl border border-black/5 bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-800">Request body</p>
                    <pre className="overflow-x-auto rounded-2xl bg-white p-3 text-xs text-slate-700">
                        {`{
  "companyName": "Sample Company Inc",
  "location": "kolkata"
}`}
                    </pre>
                </div>

                {result ? (
                    <div
                        className={[
                            "rounded-2xl border p-4 text-sm font-medium",
                            result.ok
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700",
                        ].join(" ")}>
                        {result.message}
                        {result.status ? ` (Status ${result.status})` : ""}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={[
                        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
                        submitting
                            ? "bg-black/10 text-black/40 cursor-not-allowed"
                            : "bg-slate-950 text-white hover:bg-slate-900",
                    ].join(" ")}>
                    {submitting ? "Creating tenant…" : "Create Tenant"}
                </button>
            </form>
        </div>
    );
}
