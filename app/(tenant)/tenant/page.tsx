"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { TenantProfileSummary } from "@/components/tenantProfile/TenantProfileSummary";
import { useTenantProfile } from "@/lib/tenantProfile/hooks";

function formatApproach(val: string | null | undefined): string {
    if (!val) return "Operational Control";
    if (val.toLowerCase() === "operational_control") return "Operational Control";
    if (val.toLowerCase() === "financial_control") return "Financial Control";
    if (val.toLowerCase() === "equity_share") return "Equity Share";
    return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getApproachDescription(val: string | null | undefined, companyName: string): string {
    const formatted = formatApproach(val);
    if (formatted === "Operational Control") {
        return `Under Operational Control, 100% of GHG emissions from all operations and facilities over which ${companyName || "the organization"} has authority to introduce and implement operating policies are accounted for.`;
    }
    if (formatted === "Financial Control") {
        return `Under Financial Control, 100% of GHG emissions from operations where ${companyName || "the organization"} has the ability to direct financial and operating policies are consolidated.`;
    }
    if (formatted === "Equity Share") {
        return `Under Equity Share, GHG emissions are accounted according to ${companyName || "the organization"}'s economic interest and equity percentage in operations.`;
    }
    return `Consolidation boundary configured for ${companyName || "the organization"} in accordance with GHG Protocol Corporate Standard.`;
}

function DetailRow({
    label,
    value,
    icon,
    mono,
}: {
    label: string;
    value: ReactNode;
    icon?: string;
    mono?: boolean;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-3 border-b border-slate-100 last:border-b-0 text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
                {icon && <MaterialIcon name={icon} size="xs" className="text-slate-400" />}
                <span>{label}</span>
            </div>
            <div className={`text-slate-900 font-semibold ${mono ? "font-mono text-[11px]" : ""}`}>
                {value}
            </div>
        </div>
    );
}

export default function TenantProfilePage() {
    const { data: profile, isPending, isError } = useTenantProfile();
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isPending) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto font-sans animate-pulse">
                <div className="h-48 w-full bg-slate-100 rounded-3xl" />
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-28 bg-slate-100 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center max-w-2xl mx-auto my-12 font-sans">
                <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                    <MaterialIcon name="warning" size="md" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Unable to Load Tenant Profile</h3>
                <p className="text-xs text-slate-600 mt-1">
                    Failed to fetch tenant configuration from the server. Please check your credentials or network.
                </p>
            </div>
        );
    }

    const approachText = formatApproach(profile.consolidationApproach);
    const approachDesc = getApproachDescription(profile.consolidationApproach, profile.companyName);

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans animate-fade-up">
            {/* Page Title & Breadcrumb Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Tenant Workspace
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-500 font-medium">Governance &amp; Profile</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Tenant Profile
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleCopyCode(profile.tenantCode)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <MaterialIcon
                            name={copied ? "check" : "content_copy"}
                            size="xs"
                            className={copied ? "text-emerald-600" : "text-slate-400"}
                        />
                        <span>{copied ? "Tenant Code Copied!" : `Code: ${profile.tenantCode}`}</span>
                    </button>
                </div>
            </div>

            {/* Aesthetic Cover & Floating Organization Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* Banner Cover Image / Ambient Gradient */}
                <div className="relative h-44 w-full sm:h-56 md:h-64 overflow-hidden">
                    {profile.bannerImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.bannerImageUrl}
                            alt={`${profile.companyName} Cover`}
                            className="h-full w-full object-cover select-none"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900" />
                    )}
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Overlapping Identity Bar */}
                <div className="px-6 pb-6 pt-3 relative">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                        {/* Logo Container */}
                        <div className="-mt-16 relative z-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-1.5 shadow-xl sm:-mt-20 sm:h-28 sm:w-28 md:-mt-24 md:h-32 md:w-32">
                            {profile.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.logoUrl}
                                    alt={`${profile.companyName} Logo`}
                                    className="h-full w-full object-contain select-none"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-3xl font-extrabold shadow-inner">
                                    {profile.companyName.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between pb-1">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                                        {profile.companyName}
                                    </h2>
                                    {profile.isVerified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-sans text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                            <MaterialIcon name="verified" size="xs" className="text-emerald-600" />
                                            VERIFIED
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 border border-slate-200">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {profile.tenantStatus}
                                    </span>
                                </div>
                                <p className="mt-1 font-mono text-xs text-slate-500">
                                    {profile.sector} &bull; {profile.industryType}
                                </p>
                            </div>

                            {/* Direct External Links */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all">
                                        <MaterialIcon name="language" size="xs" className="text-slate-400" />
                                        <span>Website</span>
                                        <MaterialIcon name="open_in_new" size="xs" className="text-slate-400 text-[10px]" />
                                    </a>
                                )}
                                <a
                                    href={`mailto:${profile.companyEmail}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-all">
                                    <MaterialIcon name="mail" size="xs" />
                                    <span>Contact HQ</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 4 Animated KPI / Governance Highlights */}
            <TenantProfileSummary profile={profile} />

            {/* Main Content Details Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left 7 Cols: Corporate Identity & Accounting Boundary */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="lg:col-span-7 space-y-6">
                    <Card className="rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <CardHeader tone="flat" className="bg-slate-50/60 border-b border-slate-100 py-3.5 px-6">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center">
                                    <MaterialIcon name="domain" size="xs" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Corporate Identity &amp; Boundary Setup
                                    </h3>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-6 space-y-5">
                            {/* Featured Consolidation Approach Hero Block */}
                            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-4 sm:p-5 shadow-2xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                        <MaterialIcon name="account_tree" size="xs" className="text-emerald-700" />
                                        GHG Consolidation Approach
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-2xs">
                                        {approachText}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    {approachDesc}
                                </p>
                            </div>

                            {/* Detailed Rows */}
                            <div className="space-y-1">
                                <DetailRow
                                    icon="badge"
                                    label="Trading Company Name"
                                    value={profile.companyName}
                                />
                                <DetailRow
                                    icon="gavel"
                                    label="Legal Registered Name"
                                    value={profile.legalCompanyName || profile.companyName}
                                />
                                <DetailRow
                                    icon="category"
                                    label="Industry Classification"
                                    value={profile.industryType}
                                />
                                <DetailRow
                                    icon="pie_chart"
                                    label="Reporting Sector"
                                    value={profile.sector}
                                />
                                <DetailRow
                                    icon="tag"
                                    label="Tenant Workspace Slug"
                                    value={profile.slug}
                                    mono
                                />
                                <DetailRow
                                    icon="fingerprint"
                                    label="Unique System Tenant ID"
                                    value={profile.id}
                                    mono
                                />
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Right 5 Cols: HQ Location, Contact & Security */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                    className="lg:col-span-5 space-y-6">
                    {/* Location & Communications */}
                    <Card className="rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <CardHeader tone="flat" className="bg-slate-50/60 border-b border-slate-100 py-3.5 px-6">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center">
                                    <MaterialIcon name="location_on" size="xs" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    HQ Location &amp; Communications
                                </h3>
                            </div>
                        </CardHeader>
                        <CardBody className="p-6 space-y-1">
                            <DetailRow
                                icon="mail"
                                label="Official Email"
                                value={
                                    <a href={`mailto:${profile.companyEmail}`} className="text-primary hover:underline font-mono text-[11px]">
                                        {profile.companyEmail}
                                    </a>
                                }
                            />
                            <DetailRow
                                icon="phone"
                                label="Phone Contact"
                                value={
                                    <a href={`tel:${profile.companyPhone}`} className="text-slate-800 hover:text-primary font-mono text-[11px]">
                                        {profile.companyPhone}
                                    </a>
                                }
                            />
                            <DetailRow
                                icon="home_work"
                                label="Address Line 1"
                                value={profile.addressLine1}
                            />
                            {profile.addressLine2 && (
                                <DetailRow
                                    icon="apartment"
                                    label="Address Line 2"
                                    value={profile.addressLine2}
                                />
                            )}
                            <DetailRow
                                icon="location_city"
                                label="City / Municipality"
                                value={profile.city}
                            />
                            <DetailRow
                                icon="map"
                                label="State / Province"
                                value={profile.state}
                            />
                            <DetailRow
                                icon="markunread_mailbox"
                                label="Postal Code"
                                value={profile.postalCode}
                                mono
                            />
                            <DetailRow
                                icon="public"
                                label="Country Jurisdiction"
                                value={profile.country}
                            />
                        </CardBody>
                    </Card>

                    {/* Infrastructure & Security Status */}
                    <Card className="rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <CardHeader tone="flat" className="bg-slate-50/60 border-b border-slate-100 py-3.5 px-6">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center">
                                    <MaterialIcon name="security" size="xs" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Workspace &amp; Audit Health
                                </h3>
                            </div>
                        </CardHeader>
                        <CardBody className="p-6 space-y-1">
                            <DetailRow
                                icon="toggle_on"
                                label="Workspace Status"
                                value={
                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        {profile.tenantStatus}
                                    </span>
                                }
                            />
                            <DetailRow
                                icon="verified_user"
                                label="Tenant Verification"
                                value={profile.isVerified ? "Verified (Tier 1)" : "Pending"}
                            />
                            <DetailRow
                                icon="task_alt"
                                label="Onboarding State"
                                value={profile.onboardingCompleted ? "100% Completed" : "In Progress"}
                            />
                            <DetailRow
                                icon="bolt"
                                label="System Active"
                                value={profile.isActive ? "Yes" : "Suspended"}
                            />
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
