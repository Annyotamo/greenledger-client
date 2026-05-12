"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuArrowLeft, LuBuilding2, LuMapPin, LuBarcode, LuDollarSign, LuCircleCheck, LuCircleX } from "react-icons/lu";
import { getCompanyDetails } from "@/lib/report/api";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { CompanyDetails } from "@/types/report";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
        },
    },
    hover: {
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        transition: { duration: 0.2 },
    },
};

export default function CompanyPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);
    const router = useRouter();

    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setActiveSection("company");
        loadCompanyDetails();
    }, [setActiveSection]);

    async function loadCompanyDetails() {
        try {
            setLoading(true);
            setError(null);
            const details = await getCompanyDetails();
            setCompanyDetails(details);
        } catch (err) {
            console.error("Failed to load company details:", err);
            setError("Failed to load company details. Please try again.");
        } finally {
            setLoading(false);
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
                    "relative z-10 px-4 pb-16 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    sidebarOpen ? "lg:pl-80" : "lg:pl-28",
                    "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}>
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/50 bg-white/60 text-slate-600 shadow-sm hover:bg-white hover:text-emerald-600 transition-all duration-200 backdrop-blur-md">
                            <LuArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                Company Details
                            </h1>
                            <p className="mt-2 text-base font-medium text-slate-600">
                                Complete information about your organization
                            </p>
                        </div>
                    </motion.div>

                    {/* Loading State */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-24">
                                <div className="text-center">
                                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-3 border-emerald-500 border-r-transparent mb-4" />
                                    <p className="text-lg font-semibold text-slate-600">Loading company details...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error State */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-2xl border border-red-200/50 bg-red-50/80 p-6 text-center backdrop-blur-md">
                                <p className="text-lg font-semibold text-red-600">{error}</p>
                                <button
                                    onClick={loadCompanyDetails}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-700 transition-all duration-200">
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    {!loading && !error && companyDetails && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8">
                            {/* Hero Card with Logo */}
                            <motion.div
                                variants={itemVariants}
                                whileHover="hover"
                                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50" />
                                <div className="relative px-8 py-12 sm:px-12 sm:py-16">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                                        {/* Logo */}
                                        {/* <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                            className="h-24 w-24 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg flex items-center justify-center overflow-hidden">
                                            {companyDetails.logoUrl ? (
                                                <Image
                                                    src={companyDetails.logoUrl || "https://via.placeholder.com/150"}
                                                    alt={companyDetails.displayName}
                                                    width={96}
                                                    height={96}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuBuilding2 className="h-10 w-10" />
                                                </div>
                                            )}
                                        </motion.div> */}

                                        {/* Company Info */}
                                        <div className="flex-1 min-w-0">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}>
                                                <p className="text-sm font-bold uppercase tracking-widest text-emerald-600/80 mb-2">
                                                    Organization
                                                </p>
                                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 break-words">
                                                    {companyDetails.displayName}
                                                </h2>
                                                <p className="text-base font-medium text-slate-600 mb-4">
                                                    {companyDetails.industrySector}
                                                </p>
                                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/50 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur-sm">
                                                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                                    Active Organization
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Two Column Grid */}
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Left Column - Legal & Contact Info */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Legal Information */}
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="px-8 py-6 border-b border-white/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuBuilding2 className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">Legal Information</h3>
                                            </div>
                                        </div>
                                        <div className="px-8 py-8 space-y-6">
                                            <motion.div variants={itemVariants}>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                                    Legal Company Name
                                                </p>
                                                <p className="text-lg font-bold text-slate-900">
                                                    {companyDetails.legalCompanyName}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="border-t border-slate-100/50 pt-6">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                                    Display Name
                                                </p>
                                                <p className="text-lg font-bold text-slate-900">
                                                    {companyDetails.displayName}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Tax & Identification */}
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="px-8 py-6 border-b border-white/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuBarcode className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">Tax & Registration</h3>
                                            </div>
                                        </div>
                                        <div className="px-8 py-8 space-y-6">
                                            <motion.div variants={itemVariants}>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                                    CIN Number
                                                </p>
                                                <div className="flex items-center gap-3 rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 font-mono">
                                                    <LuBarcode className="h-5 w-5 text-emerald-600 shrink-0" />
                                                    <code className="text-sm font-semibold text-slate-900">
                                                        {companyDetails.cinNumber}
                                                    </code>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="border-t border-slate-100/50 pt-6">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                                    GST Number
                                                </p>
                                                <div className="flex items-center gap-3 rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 font-mono">
                                                    <LuBarcode className="h-5 w-5 text-emerald-600 shrink-0" />
                                                    <code className="text-sm font-semibold text-slate-900">
                                                        {companyDetails.gstNumber}
                                                    </code>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Address */}
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="px-8 py-6 border-b border-white/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuMapPin className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">Registered Address</h3>
                                            </div>
                                        </div>
                                        <div className="px-8 py-8">
                                            <motion.div
                                                variants={itemVariants}
                                                className="space-y-4 rounded-xl border border-emerald-200/30 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {companyDetails.registeredAddress.line1}
                                                    </p>
                                                    {companyDetails.registeredAddress.line2 && (
                                                        <p className="text-sm text-slate-600">
                                                            {companyDetails.registeredAddress.line2}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="border-t border-emerald-200/40 pt-4">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-semibold text-slate-700">
                                                                {companyDetails.registeredAddress.city}
                                                            </p>
                                                            <p className="text-slate-600">
                                                                {companyDetails.registeredAddress.state}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-700">
                                                                {companyDetails.registeredAddress.country}
                                                            </p>
                                                            <p className="text-slate-600">
                                                                {companyDetails.registeredAddress.postalCode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right Column - Financial & Configuration */}
                                <div className="space-y-8">
                                    {/* Financial Settings */}
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="px-6 py-5 border-b border-white/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuDollarSign className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">Financial</h3>
                                            </div>
                                        </div>
                                        <div className="px-6 py-6 space-y-5">
                                            <motion.div variants={itemVariants}>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                                    Reporting Currency
                                                </p>
                                                <p className="text-2xl font-bold text-emerald-600">
                                                    {companyDetails.reportingCurrency}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="border-t border-slate-100/50 pt-5">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                                    Baseline Year
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {companyDetails.baselineYear}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="border-t border-slate-100/50 pt-5">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                                    Fiscal Year Start
                                                </p>
                                                <p className="text-lg font-bold text-slate-900">
                                                    Month {companyDetails.fiscalYearStartMonth}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Scope Configuration */}
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="px-6 py-5 border-b border-white/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                    <LuCircleCheck className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">Scopes</h3>
                                            </div>
                                        </div>
                                        <div className="px-6 py-6 space-y-4">
                                            <motion.div
                                                variants={itemVariants}
                                                className="flex items-center justify-between rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                                                <span className="font-semibold text-slate-900">Scope-1 (Direct)</span>
                                                {companyDetails.scope1Enabled ? (
                                                    <LuCircleCheck className="h-5 w-5 text-emerald-500" />
                                                ) : (
                                                    <LuCircleX className="h-5 w-5 text-slate-300" />
                                                )}
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="flex items-center justify-between rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                                                <span className="font-semibold text-slate-900">Scope-2 (Indirect)</span>
                                                {companyDetails.scope2Enabled ? (
                                                    <LuCircleCheck className="h-5 w-5 text-emerald-500" />
                                                ) : (
                                                    <LuCircleX className="h-5 w-5 text-slate-300" />
                                                )}
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="flex items-center justify-between rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                                                <span className="font-semibold text-slate-900">Scope-3 (Other)</span>
                                                {companyDetails.scope3Enabled ? (
                                                    <LuCircleCheck className="h-5 w-5 text-emerald-500" />
                                                ) : (
                                                    <LuCircleX className="h-5 w-5 text-slate-300" />
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-12 rounded-2xl border border-white/40 bg-white/30 px-8 py-6 text-center backdrop-blur-md">
                                <p className="text-sm font-medium text-slate-600">
                                    Last updated on{" "}
                                    <span className="font-semibold text-slate-900">
                                        {new Date(companyDetails.updateDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
