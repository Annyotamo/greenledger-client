"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

export default function AddFacilityPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const router = useRouter();

    useEffect(() => {
        setActiveSection("facility");
    }, [setActiveSection]);
    
    const [formData, setFormData] = useState({
        tenantId: "Green_Ledger_69fce4430e5bf3e87a812fda",
        facilityName: "",
        operationalStatus: "active",
        facilityType: "",
        registeredAddress: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
        },
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("addr_")) {
            const field = name.replace("addr_", "");
            setFormData((prev) => ({
                ...prev,
                registeredAddress: {
                    ...prev.registeredAddress,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch("/api/facility/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to add facility");
            }
            
            router.push("/facility");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
            {/* Animated Background Elements */}
            <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-0">
                <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/15 blur-[140px] animate-pulse" />
                <div
                    className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/15 blur-[120px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-green-300/10 blur-[100px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-4 pb-16 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12">
                        <Link
                            href="/facility"
                            className="mb-8 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200/50 bg-white/60 px-4 text-sm font-bold text-slate-600 shadow-sm hover:bg-white hover:text-emerald-600 transition-all duration-200 backdrop-blur-md">
                            <FiArrowLeft className="text-lg" />
                            Back to Facilities
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg">
                                <LuBuilding2 className="text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Add New Facility</h1>
                                <p className="mt-2 text-base font-medium text-slate-600">
                                    Register a new operational facility for your organization.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="p-8 sm:p-10">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="overflow-hidden">
                                        <div className="rounded-2xl border border-rose-200/50 bg-rose-50/80 p-5 text-sm font-semibold text-rose-700 backdrop-blur-sm">
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid gap-10">
                                {/* Basic Info Section */}
                                <section>
                                    <h2 className="mb-6 flex items-center gap-3 text-xl font-extrabold text-slate-900">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-sm">1</span>
                                        Basic Information
                                    </h2>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="tenantId" className="text-sm font-semibold text-slate-700">
                                        Tenant ID
                                    </label>
                                        <input
                                            id="tenantId"
                                            name="tenantId"
                                            value={formData.tenantId}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="facilityName" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Facility Name
                                        </label>
                                        <input
                                            id="facilityName"
                                            name="facilityName"
                                            placeholder="e.g. Main Center"
                                            value={formData.facilityName}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="facilityType" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Facility Type
                                        </label>
                                        <input
                                            id="facilityType"
                                            name="facilityType"
                                            placeholder="e.g. Warehouse"
                                            value={formData.facilityType}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="operationalStatus" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Operational Status
                                        </label>
                                        <select
                                            id="operationalStatus"
                                            name="operationalStatus"
                                            value={formData.operationalStatus}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_16px_center]">
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="removed">Removed</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                            <hr className="border-white/40" />

                            {/* Address Section */}
                            <section>
                                <h2 className="mb-6 flex items-center gap-3 text-xl font-extrabold text-slate-900">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-sm">2</span>
                                    Registered Address
                                </h2>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2.5 sm:col-span-2">
                                        <label htmlFor="addr_line1" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Address Line 1
                                        </label>
                                        <input
                                            id="addr_line1"
                                            name="addr_line1"
                                            placeholder="e.g. Block B, 4th Floor, Horizon Park"
                                            value={formData.registeredAddress.line1}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5 sm:col-span-2">
                                        <label htmlFor="addr_line2" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            id="addr_line2"
                                            name="addr_line2"
                                            placeholder="e.g. Tagore Park"
                                            value={formData.registeredAddress.line2}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="addr_city" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        City
                                    </label>
                                        <input
                                            id="addr_city"
                                            name="addr_city"
                                            placeholder="e.g. Kolkata"
                                            value={formData.registeredAddress.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="addr_state" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            State
                                        </label>
                                        <input
                                            id="addr_state"
                                            name="addr_state"
                                            placeholder="e.g. WB"
                                            value={formData.registeredAddress.state}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="addr_country" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Country
                                        </label>
                                        <input
                                            id="addr_country"
                                            name="addr_country"
                                            placeholder="e.g. India"
                                            value={formData.registeredAddress.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="addr_postalCode" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Postal Code
                                        </label>
                                        <input
                                            id="addr_postalCode"
                                            name="addr_postalCode"
                                            placeholder="e.g. 400051"
                                            value={formData.registeredAddress.postalCode}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:bg-white/60"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/40 bg-white/30 -mx-8 -mb-10 px-8 py-6 backdrop-blur-sm">
                            <Link
                                href="/facility"
                                className="rounded-2xl bg-white/60 px-6 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-emerald-900/5 hover:bg-white hover:text-slate-900 transition-all duration-200">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.6)] ring-1 ring-inset ring-emerald-600/20 transition-all duration-200 hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_12px_25px_-8px_rgba(16,185,129,0.7)] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
                                {submitting ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-3 border-white/80 border-t-transparent" />
                                ) : (
                                    <FiSave className="text-lg" />
                                )}
                                Save Facility
                            </button>
                        </div>
                    </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
