"use client";

import Link from "next/link";
import { useState } from "react";
import { getScope1Report } from "@/lib/ghg/api";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
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
            <div className="flex flex-col gap-6 border-b border-outline-variant bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <h3 className="text-headline-sm font-semibold text-primary">Fuel Consumption (Scope 1)</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Direct emissions from stationary combustion sources
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={exportStart}
                        onChange={(e) => setExportStart(e.target.value)}
                        className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface"
                    />
                    <input
                        type="date"
                        value={exportEnd}
                        onChange={(e) => setExportEnd(e.target.value)}
                        className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface"
                    />
                    <button
                        onClick={handleExport}
                        disabled={!exportStart || !exportEnd || isExporting}
                        className="inline-flex items-center gap-2 rounded border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50">
                        <MaterialIcon name="download" size="sm" />
                        {isExporting ? "Exporting..." : "Export CSV"}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            Search activities...
                        </label>
                        <input
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search activities..."
                        />
                    </div>
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            All Facilities
                        </label>
                        <select
                            value={selectedFacility}
                            onChange={(event) => onFacilityChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Facilities</option>
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
                            <option value="">All</option>
                            {fuelOptions.map((fuel) => (
                                <option key={fuel} value={fuel}>
                                    {fuel}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button className="inline-flex h-11 items-center gap-2 rounded border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </button>
                    <Link
                        href="/activities/fuel/create"
                        className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
                        Log Activity
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto bg-white">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant text-left text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                            <th className="py-4 px-4">Date Range</th>
                            <th className="py-4 px-4">Facility & ID</th>
                            <th className="py-4 px-4">Fuel & Usage</th>
                            <th className="py-4 px-4">Quantity</th>
                            <th className="py-4 px-4">Emissions</th>
                            <th className="py-4 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td className="py-12 px-4 text-center text-on-surface-variant" colSpan={6}>
                                    Loading activities...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td className="py-12 px-4 text-center text-error" colSpan={6}>
                                    Unable to load activities. Refresh to try again.
                                </td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td className="py-12 px-4 text-center text-on-surface-variant" colSpan={6}>
                                    No activity records available.
                                </td>
                            </tr>
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
                                    <tr
                                        key={activity.id}
                                        className="border-b border-outline-variant hover:bg-surface-container-lowest">
                                        <td className="py-5 px-4 align-top">
                                            <div className="font-semibold text-body-md text-primary">
                                                {activity.activityStartDate} - {activity.activityEndDate}
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {activeDays} Days Active
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 align-top">
                                            <div className="font-semibold text-body-md text-primary">Facility</div>
                                            <div className="mt-1 text-[11px] text-on-surface-variant">
                                                {activity.facilityId}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 align-top">
                                            <span className="inline-flex rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
                                                {activity.fuelName}
                                            </span>
                                            <div className="mt-2 text-body-md text-primary capitalize">
                                                {activity.usageType.replaceAll("_", " ")}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 align-top text-body-md text-primary">
                                            {activity.quantity.toFixed(2)}
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {activity.unitSymbol}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 align-top text-body-md text-primary">
                                            {activity.calculatedTCo2e.toFixed(2)}
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                Calculated
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 align-top">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
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
