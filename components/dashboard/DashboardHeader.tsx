"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ExportReportModal } from "@/components/activity/ExportReportModal";
import { getScope1Report } from "@/lib/ghg/api";

export function DashboardHeader() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <h2 className="text-headline-lg font-bold tracking-tight text-primary">Dashboard Overview</h2>
                <p className="text-body-md text-on-surface-variant">Real-time environmental performance monitoring</p>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high cursor-pointer shadow-2xs">
                    <MaterialIcon name="file_download" size="sm" />
                    <span>Export</span>
                </button>
            </div>

            <ExportReportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Emissions Report"
                description="Select a date range to generate and download the GHG emissions report (.xlsx)."
                onExport={async (startDate, endDate) => {
                    const blob = await getScope1Report(startDate, endDate);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `emissions-report-${startDate}-to-${endDate}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }}
            />
        </div>
    );
}
