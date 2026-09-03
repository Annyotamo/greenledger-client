"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { getScope2Report } from "@/lib/ghg/api";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElectricityActivity } from "@/lib/activity/electricityTypes";
import { ExportReportModal } from "./ExportReportModal";

const statusStyles: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-bold",
    pending: "bg-amber-500/10 text-amber-800 border border-amber-500/20 font-semibold",
    submitted: "bg-blue-500/10 text-blue-800 border border-blue-500/20 font-semibold",
    draft: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    rejected: "bg-rose-500/10 text-rose-800 border border-rose-500/20 font-semibold",
    default: "bg-slate-100 text-slate-700 border border-slate-200",
};

const StatusLabel: Record<string, string> = {
    verified: "Verified",
    pending: "Pending",
    submitted: "Submitted",
    draft: "Draft",
    rejected: "Rejected",
};

const activityTypeStyles: Record<string, string> = {
    grid_import: "bg-sky-500/10 text-sky-800 border border-sky-500/20",
    market_instruments: "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20",
    renewable: "bg-teal-500/10 text-teal-800 border border-teal-500/20",
    captive: "bg-amber-500/10 text-amber-800 border border-amber-500/20",
    other: "bg-purple-500/10 text-purple-800 border border-purple-500/20",
    default: "bg-slate-100 text-slate-700 border border-slate-200",
};

function getStatusClass(status: string) {
    return statusStyles[status.toLowerCase()] ?? statusStyles.default;
}

function getStatusLabel(status: string) {
    return StatusLabel[status.toLowerCase()] ?? status;
}

function getActivityTypeClass(type: string) {
    return activityTypeStyles[type.toLowerCase()] ?? activityTypeStyles.default;
}

function formatNumber(value: number, digits = 0) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

function formatShortPeriod(startDateStr: string, endDateStr: string) {
    if (!startDateStr || !endDateStr) return "N/A";
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return `${startDateStr} - ${endDateStr}`;

    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
        return `${format(start, "MMM d")}–${format(end, "d, yyyy")}`;
    } if (sameYear) {
        return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    } 
        return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
    
}

const sourceLabels: Record<string, string> = {
    renewable_ppa: "Renewable PPA",
    non_renewable_ppa: "Non-Renewable PPA",
    rec_backed_electricity: "REC Backed",
    irec_backed_electricity: "I-REC Backed",
    national_grid: "National Grid",
    solar: "Solar",
    hydro: "Hydro",
    wind: "Wind",
    whrb: "WHRB",
    fbc: "FBC",
    waste_fuel: "Waste Fuel",
};

const activityTypeLabels: Record<string, string> = {
    grid_import: "Grid Import",
    market_instruments: "Market Instruments",
    renewable: "Renewable",
    captive: "Captive",
    other: "Other",
};

function formatSourceType(type: string) {
    return sourceLabels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatActivityType(type: string) {
    return activityTypeLabels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

type DateRange = {
    start: Date | null;
    end: Date | null;
};

export function ElectricityActivityTable({
    activities,
    isLoading,
    isError,
    status,
    electricityActivityType,
    dataQualityTier,
    sourceType,
    selectedFacility,
    onStatusChange,
    onElectricityActivityTypeChange,
    onDataQualityTierChange,
    onSourceTypeChange,
    onFacilityChange,
    facilityOptions,
}: {
    activities: ElectricityActivity[];
    isLoading: boolean;
    isError: boolean;
    status: string;
    electricityActivityType: string;
    dataQualityTier: string;
    sourceType: string;
    selectedFacility: string;
    onStatusChange: (value: string) => void;
    onElectricityActivityTypeChange: (value: string) => void;
    onDataQualityTierChange: (value: string) => void;
    onSourceTypeChange: (value: string) => void;
    onFacilityChange: (value: string) => void;
    facilityOptions: string[];
}) {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col gap-6 border-b border-outline-variant bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <h3 className="text-headline-sm font-semibold text-primary">Electricity Activity Details</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Monitor on-site and grid electricity activity across tenant facilities.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => setIsExportModalOpen(true)}>
                        <MaterialIcon name="file_download" size="sm" />
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            <ExportReportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Scope 2 Electricity Report"
                description="Select a date range to generate and download the Scope 2 electricity report (.xlsx)."
                onExport={async (startDate, endDate) => {
                    const blob = await getScope2Report(startDate, endDate);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    const fileName = `scope2-electricity-report-${startDate}-to-${endDate}.xlsx`;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }}
            />

            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 border-b border-outline-variant/60">
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Period & Method</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Activity Type</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Source</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Electricity</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Emissions</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-on-surface-variant" colSpan={6}>
                                    Loading activities...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-error font-medium" colSpan={6}>
                                    Unable to load activities. Refresh to try again.
                                </TableCell>
                            </TableRow>
                        ) : activities.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-on-surface-variant" colSpan={6}>
                                    No activity records available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            activities.map((activity) => {
                                const status = getStatusLabel(activity.workflowStatus);
                                const statusClass = getStatusClass(activity.workflowStatus);
                                const activityStart = new Date(activity.activityStartDate);
                                const activityEnd = new Date(activity.activityEndDate);
                                const activeDays = Math.max(
                                    1,
                                    Math.ceil(
                                        (activityEnd.getTime() - activityStart.getTime()) / (1000 * 60 * 60 * 24),
                                    ) + 1,
                                );
                                const isMarketBased = activity.accountingMethod === "market_based";

                                return (
                                    <TableRow
                                        key={activity.id}
                                        className="hover:bg-slate-50/90 transition-colors cursor-pointer border-b border-slate-100 last:border-none">
                                        <TableCell className="py-2.5 px-4 text-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs text-slate-900">
                                                    {formatShortPeriod(activity.activityStartDate, activity.activityEndDate)}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-600">
                                                    {activeDays}d
                                                </span>
                                            </div>
                                            {activity.accountingMethod && (
                                                <div className="mt-1">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-tight uppercase ${
                                                            isMarketBased
                                                                ? "bg-purple-500/10 text-purple-800 border border-purple-500/20"
                                                                : "bg-slate-100 text-slate-700 border border-slate-200"
                                                        }`}>
                                                        <MaterialIcon name={isMarketBased ? "verified" : "grid_view"} size="xs" />
                                                        {isMarketBased ? "Market-Based" : "Location-Based"}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase ${getActivityTypeClass(
                                                    activity.electricityActivityType,
                                                )}`}>
                                                {formatActivityType(activity.electricityActivityType)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <div className="font-bold text-xs text-slate-900">
                                                {formatSourceType(activity.sourceType)}
                                            </div>
                                            {activity.supplierName ? (
                                                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                                                    {activity.supplierName}
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 font-mono text-xs">
                                            <div className="font-bold text-slate-900">
                                                {formatNumber(activity.electricityMwh, 2)} MWh
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium">
                                                {formatNumber(activity.electricityKwh, 0)} kWh
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 font-mono text-xs">
                                            <div className="font-bold text-slate-900">
                                                {formatNumber(activity.calculatedTCo2e, 2)} tCO₂e
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase font-semibold">
                                                {activity.dataQualityTier}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusClass}`}>
                                                {status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant bg-surface p-4 md:flex-row md:items-center md:justify-between">
                <span className="text-label-md text-on-surface-variant">
                    Showing 1-{Math.min(10, activities.length)} of {activities.length} activities
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="rounded border border-outline-variant bg-white p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
                        disabled>
                        <MaterialIcon name="chevron_left" size="sm" />
                    </button>
                    <div className="flex items-center gap-1 rounded border border-outline-variant bg-white px-2 py-1">
                        <span className="px-3 py-1 rounded bg-primary text-on-primary text-xs font-semibold">1</span>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded">
                            2
                        </button>
                    </div>
                    <button className="rounded border border-outline-variant bg-white p-2 text-on-surface-variant hover:bg-surface-container-high">
                        <MaterialIcon name="chevron_right" size="sm" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export default ElectricityActivityTable;
