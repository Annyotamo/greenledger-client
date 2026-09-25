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
                <h2 className="text-headline-lg font-bold tracking-tight text-primary font-display">Dashboard Overview</h2>
                <p className="text-body-md text-on-surface-variant font-sans">Real-time environmental performance monitoring</p>
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
