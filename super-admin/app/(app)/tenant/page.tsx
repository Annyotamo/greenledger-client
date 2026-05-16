"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";
import { HiBuildingOffice2 } from "react-icons/hi2";

type Tenant = {
    id: string;
    companyName: string;
    dbName: string;
    location: string;
    status: boolean;
    address: string | null;
    addedBy: string;
    creationDate: string;
    updateDate: string;
};

type SubmitResult = {
    ok: boolean;
    message: string;
    status?: number;
};

export default function TenantPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitResult | null>(null);

    const canSubmit = companyName.trim().length > 0 && location.trim().length > 0;

    async function fetchTenants() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/tenant/getAll");
            if (!res.ok) {
                throw new Error("Failed to fetch tenants");
            }
            const body = await res.json();
            // Assuming response body format: { data: Tenant[], success: boolean, ... }
            if (body.data) {
                setTenants(body.data);
            } else if (Array.isArray(body)) {
                setTenants(body);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error fetching tenants");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTenants();
    }, []);

    async function handleAddSubmit(event: React.FormEvent<HTMLFormElement>) {
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
                fetchTenants(); // Refresh list after adding
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setResult(null);
                }, 1500);
            }
        } catch (err) {
            setResult({ ok: false, message: err instanceof Error ? err.message : "Request failed." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Tenants</h1>
                    <p className="mt-1 max-w-2xl text-sm text-(--muted)">
                        Manage your platform tenants. You can add new organizations and configure their locations here.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition hover:bg-slate-900 hover:shadow-[0_12px_25px_-8px_rgba(0,0,0,0.6)]">
                    <FiPlus className="text-lg" />
                    Add Tenant
                </button>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center rounded-3xl border border-black/5 bg-white/50 text-sm text-slate-500">
                    Loading tenants...
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
                    {error}
                    <button onClick={fetchTenants} className="ml-4 font-semibold text-rose-900 hover:underline">
                        Retry
                    </button>
                </div>
            ) : tenants.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/50 text-sm text-slate-500">
                    <p>No tenants found.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.05)] transition hover:border-black/10 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.1)]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-black/5 group-hover:bg-slate-100 group-hover:text-black transition">
                                <HiBuildingOffice2 className="text-2xl" />
                            </div>
                            <h3 className="truncate text-base font-semibold text-slate-900" title={tenant.companyName}>
                                {tenant.companyName}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="inline-block truncate text-sm text-slate-500">{tenant.location}</span>
                                {tenant.status && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        Active
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 border-t border-black/5 pt-4">
                                <dl className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <dt className="text-slate-400">Added By</dt>
                                        <dd
                                            className="mt-0.5 truncate font-medium text-slate-700"
                                            title={tenant.addedBy ?? "Unknown"}>
                                            {tenant.addedBy ? tenant.addedBy.split("@")[0] : "Unknown"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Created</dt>
                                        <dd className="mt-0.5 font-medium text-slate-700">
                                            {new Date(tenant.creationDate).toLocaleDateString()}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">Add New Tenant</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <div className="p-6">
                                <form className="grid gap-6" onSubmit={handleAddSubmit}>
                                    <div className="grid gap-4">
                                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                                            Company Name
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

                                    {result ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={[
                                                "rounded-2xl border p-4 text-sm font-medium",
                                                result.ok
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-rose-200 bg-rose-50 text-rose-700",
                                            ].join(" ")}>
                                            {result.message}
                                        </motion.div>
                                    ) : null}

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!canSubmit || submitting}
                                            className={[
                                                "inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-semibold transition",
                                                submitting || !canSubmit
                                                    ? "bg-black/10 text-black/40 cursor-not-allowed"
                                                    : "bg-slate-950 text-white hover:bg-slate-900 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]",
                                            ].join(" ")}>
                                            {submitting ? "Creating…" : "Create Tenant"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
