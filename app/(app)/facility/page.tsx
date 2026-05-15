"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import { LuBuilding2, LuTrash2, LuCircleDashed, LuChevronDown } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

type Facility = {
    id: string;
    tenantId: string;
    companyName: string | null;
    facilityId: string;
    operationalStatus: string;
    facilityName: string;
    facilityType: string;
    address: string | null;
    addedBy: string;
    createDate: string;
    updateDate: string;
};

export default function FacilityPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dropdown and accordion states
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [expandedEmissionAccordionId, setExpandedEmissionAccordionId] = useState<string | null>(null);

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

    useEffect(() => {
        fetchFacilities();
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
            {/* Click-away overlay for dropdown */}
            {openDropdownId && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setOpenDropdownId(null);
                        setExpandedEmissionAccordionId(null);
                    }}
                />
            )}

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
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Facilities</h1>
                            <p className="mt-2 text-base font-medium text-slate-600 max-w-2xl">
                                Manage and track your operational facilities across different locations.
                            </p>
                        </div>
                        <Link
                            href="/facility/add"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-700 hover:shadow-[0_12px_25px_-8px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                            <FiPlus className="text-lg" />
                            Add Facility
                        </Link>
                    </motion.div>

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
                                <button onClick={fetchFacilities} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-700 transition-all duration-200">
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
                                <p className="mt-1 font-medium text-slate-500">Add your first facility to get started.</p>
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
                            <div className="flex-1 p-6 relative z-0">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10 transition-colors group-hover:bg-emerald-100">
                                        <LuBuilding2 className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={[
                                                "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize tracking-wide ring-1 ring-inset",
                                                facility.operationalStatus === "active"
                                                    ? "bg-emerald-100/50 text-emerald-700 ring-emerald-600/20"
                                                    : facility.operationalStatus === "suspended"
                                                    ? "bg-amber-100/50 text-amber-700 ring-amber-600/20"
                                                    : "bg-rose-100/50 text-rose-700 ring-rose-600/20",
                                            ].join(" ")}>
                                            {facility.operationalStatus}
                                        </span>
                                        <div className="relative z-50">
                                            <button
                                                onClick={() => {
                                                    if (openDropdownId === facility.id) {
                                                        setOpenDropdownId(null);
                                                        setExpandedEmissionAccordionId(null);
                                                    } else {
                                                        setOpenDropdownId(facility.id);
                                                        setExpandedEmissionAccordionId(null);
                                                    }
                                                }}
                                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
                                                <FiMoreVertical className="text-lg" />
                                            </button>

                                            <AnimatePresence>
                                                {openDropdownId === facility.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl">

                                                        {/* Add Emission Accordion Toggle */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedEmissionAccordionId(
                                                                    expandedEmissionAccordionId === facility.id ? null : facility.id
                                                                );
                                                            }}
                                                            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                            <div className="flex items-center gap-2">
                                                                <LuCircleDashed className="text-lg" />
                                                                Add Emission
                                                            </div>
                                                            <LuChevronDown className={`transition-transform duration-200 ${expandedEmissionAccordionId === facility.id ? "rotate-180" : ""}`} />
                                                        </button>

                                                        {/* Accordion Content */}
                                                        <AnimatePresence>
                                                            {expandedEmissionAccordionId === facility.id && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden">
                                                                    <div className="ml-5 mt-1 mb-1 flex flex-col gap-1 border-l-2 border-emerald-100 pl-3 pb-1">
                                                                        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                                            Scope 1
                                                                        </button>
                                                                        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                                            Scope 2
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <div className="my-1 h-px w-full bg-slate-100" />

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setOpenDropdownId(null);
                                                                handleDeleteFacility(facility.id);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                                                            <LuTrash2 className="text-lg pointer-events-none" />
                                                            <span className="pointer-events-none">Delete Facility</span>
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                                <h3
                                    className="truncate text-xl font-bold text-slate-900"
                                    title={facility.facilityName}>
                                    {facility.facilityName}
                                </h3>
                                <p className="mt-1.5 truncate text-sm font-semibold text-emerald-600/80">
                                    {facility.facilityType}
                                </p>
                            </div>

                            <div className="border-t border-white/40 bg-white/30 px-6 py-5">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                    <div>
                                        <dt className="text-slate-500 font-bold uppercase tracking-widest text-[0.65rem]">Added By</dt>
                                        <dd
                                            className="mt-1 truncate font-bold text-slate-900"
                                            title={facility.addedBy}>
                                            {facility.addedBy.split("@")[0]}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 font-bold uppercase tracking-widest text-[0.65rem]">Created</dt>
                                        <dd className="mt-1 font-bold text-slate-900">
                                            {new Date(facility.createDate).toLocaleDateString()}
                                        </dd>
                                    </div>
                                </dl>
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
