"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { useActiveCbamInstallation, useExportCbamExcel } from "@/lib/cbam/hooks";
import { useState } from "react";

interface CBAMHeaderProps {
    onOpenStreamModal?: () => void;
}

export function CBAMHeader({ onOpenStreamModal }: CBAMHeaderProps) {
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/40 pb-4">
            <div className="space-y-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    Carbon Border Adjustment Mechanism (CBAM)
                </h1>
                <p className="font-sans text-xs text-slate-500 max-w-3xl leading-relaxed">
                    Official EU CBAM Communication Template reporting. Manage industrial installation profiles (Sheet A_InstData), configure production processes and goods G1..G10, and account for direct emissions across Combustion and Mass Balance source streams (Sheet B_EmInst).
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {installation && (
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleExport}
                        disabled={downloading || exportMutation.isPending}
                        className="gap-2 font-sans text-xs font-semibold shadow-2xs">
                        <MaterialIcon name="file_download" size="sm" />
                        <span>{downloading ? "Exporting..." : "Export EU Template (.xlsx)"}</span>
                    </Button>
                )}

                {onOpenStreamModal && (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onOpenStreamModal}
                        className="gap-2 font-sans text-xs font-semibold shadow-sm">
                        <MaterialIcon name="add" size="sm" />
                        <span>Add Source Stream</span>
                    </Button>
                )}

                {!installation && (
                    <Link href="/tenant-cbam/installation">
                        <Button variant="primary" size="md" className="gap-2 font-sans text-xs font-semibold shadow-sm">
                            <MaterialIcon name="domain" size="sm" />
                            <span>Setup Installation Profile</span>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
