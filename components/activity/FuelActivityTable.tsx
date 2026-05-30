"use client";

import Link from "next/link";
import { useState } from "react";
import { getScope1Report } from "@/lib/ghg/api";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FuelActivity } from "@/lib/activity/types";

const statusStyles: Record<string, string> = {
    verified: "bg-secondary text-white",
    pending: "bg-surface-container-high text-on-surface-variant",
    rejected: "bg-error text-white",
    default: "bg-surface-container-high text-on-surface-variant",
};

const StatusLabel: Record<string, string> = {
    verified: "Verified",
    pending: "Pending",
    rejected: "Rejected",
};

function getStatusClass(status: string) {
    return statusStyles[status.toLowerCase()] ?? statusStyles.default;
}

function getStatusLabel(status: string) {
    return StatusLabel[status.toLowerCase()] ?? status;
}

export function FuelActivityTable({
    activities,
    isLoading,
    isError,
    searchTerm,
    selectedFacility,
    selectedFuel,
    onSearchChange,
    onFacilityChange,
    onFuelChange,
    facilityOptions,
    fuelOptions,
}: {
    activities: FuelActivity[];
    isLoading: boolean;
    isError: boolean;
    searchTerm: string;
    selectedFacility: string;
    selectedFuel: string;
    onSearchChange: (value: string) => void;
    onFacilityChange: (value: string) => void;
    onFuelChange: (value: string) => void;
    facilityOptions: string[];
    fuelOptions: string[];
}) {
    const [exportStart, setExportStart] = useState("");
    const [exportEnd, setExportEnd] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    async function handleExport() {
        if (!exportStart || !exportEnd) return;
        setIsExporting(true);
        try {
            const blob = await getScope1Report(exportStart, exportEnd);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fileName = `scope1-report-${exportStart}-to-${exportEnd}.xlsx`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <h3 className="text-headline-sm font-semibold text-primary">Fuel Activity Details</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Monitor activity records, emissions and quality tiers across all fuel sources.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleExport}
                            disabled={!exportStart || !exportEnd || isExporting}>
                            <MaterialIcon name="download" size="sm" />
                            {isExporting ? "Exporting" : "Download XLSX"}
                        </Button>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                        Select a start and end date below to download the scope 1 activity report.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr] lg:flex-1">
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            Search activities
                        </label>
                        <input
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search by facility, fuel or status"
                        />
                    </div>
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            Facility
                        </label>
                        <select
                            value={selectedFacility}
                            onChange={(event) => onFacilityChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All facilities</option>
                            {facilityOptions.map((facility) => (
                                <option key={facility} value={facility}>
                                    {facility}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            Fuel Type
                        </label>
                        <select
                            value={selectedFuel}
                            onChange={(event) => onFuelChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All fuel types</option>
                            {fuelOptions.map((fuel) => (
                                <option key={fuel} value={fuel}>
                                    {fuel}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid gap-3 grid-cols-2 lg:w-96">
                    <input
                        type="date"
                        value={exportStart}
                        onChange={(e) => setExportStart(e.target.value)}
                        className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface"
                        aria-label="Export start date"
                    />
                    <input
                        type="date"
                        value={exportEnd}
                        onChange={(e) => setExportEnd(e.target.value)}
                        className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface"
                        aria-label="Export end date"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant">
                            <TableHead>Period</TableHead>
                            <TableHead>Facility</TableHead>
                            <TableHead>Fuel / Usage</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Energy / Emissions</TableHead>
                            <TableHead>Quality</TableHead>
                            <TableHead>Docs</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-on-surface-variant" colSpan={8}>
                                    Loading fuel activities...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-error" colSpan={8}>
                                    Unable to load fuel activities. Refresh to try again.
                                </TableCell>
                            </TableRow>
                        ) : activities.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-on-surface-variant" colSpan={8}>
                                    No fuel activity records available.
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

                                return (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <div className="font-semibold text-body-md text-primary">
                                                {activity.activityStartDate} - {activity.activityEndDate}
                                            </div>
                                            <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">
                                                {activeDays} days
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-body-md text-primary">
                                                {activity.facilityId}
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant">
                                                {activity.scopeType}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
                                                {activity.fuelName}
                                            </div>
                                            <div className="mt-2 text-body-md text-primary capitalize">
                                                {activity.usageType.replaceAll("_", " ")}
                                            </div>
                                            <div className="mt-1 text-[11px] text-on-surface-variant">
                                                {activity.fuelFactorRegion} • {activity.fuelFactorVersion}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-body-md text-primary">
                                                {activity.quantity.toFixed(2)}
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {activity.unitSymbol}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-body-md text-primary">
                                                {activity.energyContentGJ.toFixed(1)} GJ
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant">
                                                {activity.calculatedTCo2e.toFixed(2)} tCO₂e
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-body-md text-primary capitalize">
                                                {activity.dataQualityTier}
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {activity.estimationBasis ?? "—"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-2 py-1 text-[11px] text-on-surface-variant">
                                                <MaterialIcon name="insert_drive_file" size="xs" />
                                                {activity.documentsCount} docs
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}>
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
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded">
                            3
                        </button>
                        <span className="px-3 py-1 text-xs font-medium text-on-surface-variant">...</span>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded">
                            5
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
