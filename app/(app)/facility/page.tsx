"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

type Facility = {
    id: string;
    name: string;
    facility_code: string;
    facility_type: string;
    facility_status: string;
    country?: string;
    state?: string;
    city?: string;
    address_line_1?: string;
    operational_since?: string;
};

export default function FacilityPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addSubmitting, setAddSubmitting] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [newFacility, setNewFacility] = useState({
        name: "",
        description: "",
        facility_code: "",
        facility_type: "",
        ownership_type: "owned",
        country: "",
        state: "",
        city: "",
        address_line_1: "",
        address_line_2: "",
        postal_code: "",
        timezone: "",
        operational_since: "",
        operational_until: "",
        floor_area: "",
        floor_area_unit: "sqft",
        employee_count: "",
        scope1_enabled: true,
        scope2_enabled: true,
        scope3_enabled: true,
    });

    useEffect(() => {
        setActiveSection("facility");
        fetchFacilities();
    }, [setActiveSection]);

    async function fetchFacilities() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/facility/get");
            if (!res.ok) {
                throw new Error("Failed to fetch facilities");
            }
            const body = await res.json();
            if (body.data) {
                setFacilities(body.data);
            } else if (Array.isArray(body)) {
                setFacilities(body);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error fetching facilities");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateFacility(e: FormEvent) {
        e.preventDefault();
        setAddError(null);
        setAddSubmitting(true);

        try {
            const res = await fetch("/api/facility/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFacility),
            });

            const body = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(body?.message || "Failed to create facility");
            }

            setIsAddOpen(false);
            setNewFacility({
                name: "",
                description: "",
                facility_code: "",
                facility_type: "",
                ownership_type: "owned",
                country: "",
                state: "",
                city: "",
                address_line_1: "",
                address_line_2: "",
                postal_code: "",
                timezone: "",
                operational_since: "",
                operational_until: "",
                floor_area: "",
                floor_area_unit: "sqft",
                employee_count: "",
                scope1_enabled: true,
                scope2_enabled: true,
                scope3_enabled: true,
            });
            fetchFacilities();
        } catch (err: unknown) {
            setAddError(err instanceof Error ? err.message : "Failed to create facility");
        } finally {
            setAddSubmitting(false);
        }
    }

    function handleNewFacilityChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (name === "scope1_enabled" || name === "scope2_enabled" || name === "scope3_enabled") {
            setNewFacility((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        setNewFacility((prev) => ({ ...prev, [name]: type === "number" ? value : value }));
    }

    async function handleDeleteFacility(id: string) {
        if (!confirm("Are you sure you want to delete this facility?")) return;
        try {
            const res = await fetch(`/api/facility/delete/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete facility");
            }
            fetchFacilities();
        } catch (error: any) {
            alert(error.message);
        }
    }

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
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                Facilities
                            </h1>
                            <p className="mt-2 text-base font-medium text-slate-600 max-w-2xl">
                                Manage and track your operational facilities across different locations.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-700 hover:shadow-[0_12px_25px_-8px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                            <FiPlus className="text-lg" />
                            New Facility
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {isAddOpen && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/70 px-4 py-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>
                                <motion.div
                                    className="w-full max-w-3xl overflow-hidden rounded-4xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
                                    initial={{ y: 24, opacity: 0, scale: 0.98 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: 24, opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}>
                                    <div className="flex h-full min-h-[40vh] max-h-[calc(100vh-4.5rem)] flex-col overflow-hidden">
                                        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400/70">
                                                    Facility action
                                                </p>
                                                <h2 className="mt-3 text-3xl font-extrabold text-white">
                                                    Create facility
                                                </h2>
                                                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                                                    Add a new operational facility with the required fields.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddOpen(false)}
                                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10">
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <form className="flex h-full flex-col" onSubmit={handleCreateFacility}>
                                            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
                                                {addError ? (
                                                    <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200">
                                                        {addError}
                                                    </div>
                                                ) : null}

                                                <div className="space-y-6">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Name</span>
                                                            <input
                                                                name="name"
                                                                value={newFacility.name}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Facility code</span>
                                                            <input
                                                                name="facility_code"
                                                                value={newFacility.facility_code}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Facility type</span>
                                                            <input
                                                                name="facility_type"
                                                                value={newFacility.facility_type}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Ownership type</span>
                                                            <select
                                                                name="ownership_type"
                                                                value={newFacility.ownership_type}
                                                                onChange={handleNewFacilityChange}
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10">
                                                                <option value="owned">Owned</option>
                                                                <option value="leased">Leased</option>
                                                                <option value="managed">Managed</option>
                                                            </select>
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Country</span>
                                                            <input
                                                                name="country"
                                                                value={newFacility.country}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>State</span>
                                                            <input
                                                                name="state"
                                                                value={newFacility.state}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>City</span>
                                                            <input
                                                                name="city"
                                                                value={newFacility.city}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Postal code</span>
                                                            <input
                                                                name="postal_code"
                                                                value={newFacility.postal_code}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Address line 1</span>
                                                            <input
                                                                name="address_line_1"
                                                                value={newFacility.address_line_1}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Address line 2</span>
                                                            <input
                                                                name="address_line_2"
                                                                value={newFacility.address_line_2}
                                                                onChange={handleNewFacilityChange}
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Timezone</span>
                                                            <input
                                                                name="timezone"
                                                                value={newFacility.timezone}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Operational since</span>
                                                            <input
                                                                name="operational_since"
                                                                type="date"
                                                                value={newFacility.operational_since}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Floor area</span>
                                                            <input
                                                                name="floor_area"
                                                                value={newFacility.floor_area}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                        <label className="space-y-2 text-sm font-semibold text-slate-300">
                                                            <span>Employees</span>
                                                            <input
                                                                name="employee_count"
                                                                type="number"
                                                                value={newFacility.employee_count}
                                                                onChange={handleNewFacilityChange}
                                                                required
                                                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/10 bg-slate-950/90 px-6 py-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAddOpen(false)}
                                                        className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={addSubmitting}
                                                        className="inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                                                        {addSubmitting ? "Saving..." : "Create Facility"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-24">
                                <div className="text-center">
                                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-3 border-emerald-500 border-r-transparent mb-4" />
                                    <p className="text-lg font-semibold text-slate-600">Loading facilities...</p>
                                </div>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-2xl border border-red-200/50 bg-red-50/80 p-6 text-center backdrop-blur-md">
                                <p className="text-lg font-semibold text-red-600">{error}</p>
                                <button
                                    onClick={fetchFacilities}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-700 transition-all duration-200">
                                    Retry
                                </button>
                            </motion.div>
                        ) : facilities.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/50 text-sm text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <LuBuilding2 className="mb-3 text-5xl text-emerald-600/30" />
                                <p className="text-lg font-bold text-slate-700">No facilities found</p>
                                <p className="mt-1 font-medium text-slate-500">
                                    Add your first facility to get started.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1 }}
                                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {facilities.map((facility) => (
                                    <motion.div
                                        key={facility.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                                        className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all">
                                        <div className="p-6">
                                            <div className="mb-5 flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
                                                        {facility.facility_type}
                                                    </p>
                                                    <h3 className="mt-3 text-xl font-semibold text-slate-900">
                                                        {facility.name}
                                                    </h3>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {facility.city}, {facility.country}
                                                    </p>
                                                </div>
                                                <div className="rounded-3xl bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                                                    {facility.facility_status}
                                                </div>
                                            </div>
                                            <div className="grid gap-3 text-sm text-slate-600">
                                                <div className="rounded-3xl bg-slate-100/80 p-4">
                                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                                        Code
                                                    </p>
                                                    <p className="mt-2 font-semibold text-slate-900">
                                                        {facility.facility_code}
                                                    </p>
                                                </div>
                                                <div className="rounded-3xl bg-slate-100/80 p-4">
                                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                                        Since
                                                    </p>
                                                    <p className="mt-2 font-semibold text-slate-900">
                                                        {facility.operational_since || "—"}
                                                    </p>
                                                </div>
                                                <div className="rounded-3xl bg-slate-100/80 p-4">
                                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                                        Location
                                                    </p>
                                                    <p className="mt-2 font-semibold text-slate-900">
                                                        {facility.address_line_1 || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
