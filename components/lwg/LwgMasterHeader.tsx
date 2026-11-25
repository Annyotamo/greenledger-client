// components/lwg/LwgMasterHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { downloadLwgAuditorPack } from "@/lib/lwg/api";
import { useLwgProfile } from "@/lib/lwg/hooks";
import { cn } from "@/lib/utils/cn";
import { LwgExcelQuickUploadModal } from "./LwgExcelQuickUploadModal";

export type LwgTabId =
    | "dashboard"
    | "production"
    | "energy"
    | "water"
    | "evidence"
    | "audit-simulation"
    | "departments"
    | "excel-tools";

interface LwgMasterHeaderProps {
    activeTab: LwgTabId;
}

interface NavTabItem {
    id: LwgTabId;
    label: string;
    icon: string;
    href: string;
}

const TABS: readonly NavTabItem[] = [
    { id: "dashboard", label: "Executive Dashboard", icon: "dashboard", href: "/lwg" },
    { id: "production", label: "Production (Sec 5)", icon: "inventory_2", href: "/lwg/production" },
    { id: "energy", label: "Energy (Sec 10)", icon: "bolt", href: "/lwg/energy" },
    { id: "water", label: "Water (Sec 11)", icon: "water_drop", href: "/lwg/water" },
    { id: "evidence", label: "Evidence Vault", icon: "folder_shared", href: "/lwg/evidence" },
    { id: "audit-simulation", label: "Medal Simulator", icon: "military_tech", href: "/lwg/audit-simulation" },
    { id: "departments", label: "Departments", icon: "domain", href: "/lwg/departments" },
    { id: "excel-tools", label: "Excel Tools", icon: "table_view", href: "/lwg/excel-tools" },
] as const;

function formatWindowMonth(dateStr: string): string {
    if (!dateStr) return "";
    try {
        const [year, month] = dateStr.split("-");
        const date = new Date(Number(year), Number(month) - 1, 1);
        return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
    } catch {
        return dateStr;
    }
}

export function LwgMasterHeader({ activeTab }: LwgMasterHeaderProps) {
    const { data: profile } = useLwgProfile();
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDownloadingPack, setIsDownloadingPack] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await queryClient.refetchQueries({ queryKey: ["lwg"] });
        } catch (err) {
            console.error("Failed to refresh LWG data", err);
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
            }, 600);
        }
    };

    const handleDownloadAuditorPack = async () => {
        try {
            setDownloadError(null);
            setIsDownloadingPack(true);
            const { blob, filename } = await downloadLwgAuditorPack();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || "LWG_Auditor_Data_Pack.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to export auditor pack", err);
            setDownloadError("Unable to export Auditor Data Pack. Please try again.");
        } finally {
            setIsDownloadingPack(false);
        }
    };

    const windowStartLabel = profile?.dataWindowStart ? formatWindowMonth(profile.dataWindowStart) : "Month 1";
    const windowEndLabel = profile?.dataWindowEnd ? formatWindowMonth(profile.dataWindowEnd) : "Month 24";

    return (
        <>
            <div className="space-y-4 mb-6">
                {/* Master Metadata & Action Row with Tannery Hero Backdrop */}
                <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 sm:px-7 sm:py-7 min-h-[160px] sm:min-h-[175px] shadow-sm flex flex-col justify-between">
                    {/* Industry-specific visual backdrop: LWG Tannery Production */}
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                        <Image
                            src="/images/lwg/leather-tannery-banner.webp"
                            alt="Leather Tannery Operations"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 1400px"
                            className="object-cover object-[75%_35%] opacity-90 transition-opacity duration-300"
                        />
                        {/* Directional gradient mask ensuring text readability on the left while keeping the craftsman and leather machinery on the right 100% crisp & clear */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 via-48% to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
                    </div>

                    {/* Facility Identity & Actions Content Layer */}
                    <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between h-full">
                        {/* Facility Identity & Meta */}
                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                            {/* Facility Emblem */}
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shrink-0 backdrop-blur-md">
                                <MaterialIcon name="domain" size="md" className="text-emerald-400" />
                            </div>

                            <div className="space-y-2 min-w-0">
                                {/* Line 1: Tannery Name & Location Pin */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                                        {profile?.tanneryName || "GreenLedger Leather Facility"}
                                    </h1>
                                    {profile?.city && profile?.state && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 font-sans text-xs font-medium text-slate-200 backdrop-blur-md shadow-2xs">
                                            <MaterialIcon name="location_on" size="xs" className="text-emerald-400" />
                                            <span>{profile.city}, {profile.state}</span>
                                        </span>
                                    )}
                                </div>

                                {/* Line 2: Audit Window & Preferred Unit Badges */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* 24-Month Window Badge */}
                                    <span className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-950/70 px-3 py-1 font-sans text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-2xs">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Audit Window: {windowStartLabel} – {windowEndLabel}</span>
                                    </span>

                                    {/* Preferred Unit Badge */}
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-3 py-1 font-mono text-xs font-medium text-slate-200 backdrop-blur-md shadow-2xs">
                                        <MaterialIcon name="straighten" size="xs" className="text-slate-300" />
                                        <span>Unit: {profile?.outputUnit === "sq_ft" ? "Square Feet (sq ft)" : "Square Meters (m²)"}</span>
                                    </span>

                                    {/* Subcontractor indicator */}
                                    {profile?.usesSubcontractors && (
                                        <span className="inline-flex items-center rounded-md border border-amber-400/30 bg-amber-950/60 px-2.5 py-1 font-sans text-xs font-medium text-amber-300 backdrop-blur-md">
                                            Subcontracted Operations
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="h-9 px-3.5 text-xs gap-1.5 font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-sm transition-all">
                                <MaterialIcon name="table_chart" size="xs" className="text-slate-200" />
                                <span>Bulk Excel Ingest</span>
                            </Button>

                            <Button
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={handleDownloadAuditorPack}
                                disabled={isDownloadingPack}
                                className="h-9 px-4 text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-500/40 transition-all">
                                <MaterialIcon name="download" size="xs" />
                                <span>{isDownloadingPack ? "Generating Pack..." : "Export Auditor Pack"}</span>
                            </Button>

                            {/* Fully Functional Refresh Icon Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                title="Refresh All Leather Data & Metrics"
                                aria-label="Refresh All Leather Data"
                                className="h-9 w-9 p-0 flex items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-sm transition-all">
                                <MaterialIcon
                                    name="refresh"
                                    size="xs"
                                    className={cn("transition-transform duration-500", isRefreshing && "animate-spin text-emerald-400")}
                                />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Download error alert */}
                {downloadError && (
                    <div className="flex items-center justify-between rounded-lg border border-error/30 bg-error/5 p-3 text-xs text-error">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="error" size="xs" />
                            <span>{downloadError}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDownloadError(null)}
                            className="font-bold underline cursor-pointer">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Clean Tab Bar */}
                <div className="flex items-center overflow-x-auto rounded-lg border border-outline-variant/60 bg-surface-container-low/70 p-1 gl-dashboard-scroll">
                    <div className="flex items-center gap-1 min-w-max">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all select-none cursor-pointer",
                                        isActive
                                            ? "bg-surface-container-lowest text-primary font-semibold shadow-2xs border border-outline-variant/60"
                                            : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60",
                                    )}>
                                    <MaterialIcon
                                        name={tab.icon}
                                        size="xs"
                                        className={cn(isActive ? "text-emerald-700" : "text-outline")}
                                    />
                                    <span>{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Upload Modal */}
            <LwgExcelQuickUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </>
    );
}
