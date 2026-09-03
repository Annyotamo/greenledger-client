"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ExportReportModal } from "@/components/activity/ExportReportModal";
import { getScope2Report } from "@/lib/ghg/api";

type EnergyHeaderProps = {
    reportingPeriod?: string;
    facilitiesCount?: number;
};

export function EnergyHeader({ reportingPeriod, facilitiesCount }: EnergyHeaderProps) {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="text-[11px] font-bold tracking-widest text-secondary uppercase">
                            GreenLedger • Energy Module {facilitiesCount ? `• ${facilitiesCount} Facilities` : ""}
                        </div>
                        <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                            Energy Consumption Dashboard
                        </h1>
                        <p className="text-body-md text-on-surface-variant">
                            Comprehensive Tenant Energy Accounting • Captive Generation vs. Grid Sourced Bifurcation
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => setIsExportModalOpen(true)}>
                        <MaterialIcon name="file_download" size="sm" />
                        <span>Export Report</span>
                    </Button>
                </div>
            </div>

            <ExportReportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Energy Consumption Report"
                description="Select a date range to generate and download the energy consumption report (.xlsx)."
                onExport={async (startDate, endDate) => {
                    const blob = await getScope2Report(startDate, endDate);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `energy-report-${startDate}-to-${endDate}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }}
            />
        </div>
    );
}
