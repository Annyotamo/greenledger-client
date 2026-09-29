"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { useActiveCbamInstallation, useExportCbamExcel } from "@/lib/cbam/hooks";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const NAV_TABS = [
    { label: "Executive Overview", href: "/cbam", icon: "dashboard" },
    { label: "Installation Setup (Sheet A)", href: "/cbam/installation", icon: "domain" },
    { label: "Source Streams & Emissions (Sheet B)", href: "/cbam/source-streams", icon: "tune" },
    { label: "Guided CN Catalog & IPCC Fuels", href: "/cbam/catalog", icon: "menu_book" },
];

export function CBAMNavbar() {
    const pathname = usePathname();
    const { data: installation } = useActiveCbamInstallation();
    const exportMutation = useExportCbamExcel();
    const [downloading, setDownloading] = useState(false);

    async function handleExport() {
        if (!installation?.id) return;
        try {
            setDownloading(true);
            await exportMutation.mutateAsync({
                installationId: installation.id,
                filename: `CBAM_SEE_Communication_${installation.unlocode || "SEE"}_${installation.id.slice(0, 8)}.xlsx`,
            });
        } catch (err) {
            console.error("Failed to download CBAM Excel export", err);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="sticky top-16 z-30 w-[calc(100%+2*var(--spacing-gutter))] -mx-gutter -mt-6 mb-6 border-b border-outline-variant/50 bg-surface-container/80 backdrop-blur-xl shadow-xs transition-all duration-200">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
                <div className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30">
                    <div className="flex items-center gap-3">
                        <Link href="/cbam" className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 border border-emerald-700/20 transition-transform group-hover:scale-105">
                                <MaterialIcon name="verified" size="sm" className="text-emerald-800" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-primary tracking-tight font-display">
                                        EU CBAM Declaration
                                    </h2>
                                    <span className="rounded bg-emerald-100/70 border border-emerald-300/60 px-1.5 py-0.2 font-sans text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                                        EU 2023/956
                                    </span>
                                </div>
                                <p className="font-sans text-[11px] text-slate-500 truncate max-w-[280px] sm:max-w-md">
                                    {installation ? `${installation.installation_name_english} (${installation.unlocode || installation.country})` : "Industrial Installation Template"}
                                </p>
                            </div>
                        </Link>
                    </div>

                    {installation && (
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleExport}
                                disabled={downloading || exportMutation.isPending}
                                className="gap-1.5 font-sans text-xs font-semibold text-emerald-900 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                                <MaterialIcon name="file_download" size="sm" className="text-emerald-800" />
                                <span>{downloading ? "Exporting..." : "Download Official .XLSX"}</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                    {NAV_TABS.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-sans text-xs transition-colors duration-150",
                                    isActive
                                        ? "bg-surface-container-high font-semibold text-primary shadow-2xs"
                                        : "font-medium text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface",
                                )}>
                                <MaterialIcon
                                    name={tab.icon}
                                    size="sm"
                                    className={cn("!text-[15px]", isActive ? "text-primary" : "text-on-surface-variant")}
                                />
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
