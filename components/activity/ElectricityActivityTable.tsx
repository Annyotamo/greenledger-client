"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElectricityActivity } from "@/lib/activity/electricityTypes";

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

function formatNumber(value: number, digits = 0) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function ElectricityActivityTable({
    activities,
    isLoading,
    isError,
    searchTerm,
    selectedFacility,
    onSearchChange,
    onFacilityChange,
    facilityOptions,
}: {
    activities: ElectricityActivity[];
    isLoading: boolean;
    isError: boolean;
    searchTerm: string;
    selectedFacility: string;
    onSearchChange: (value: string) => void;
    onFacilityChange: (value: string) => void;
    facilityOptions: string[];
}) {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col gap-6 border-b border-outline-variant bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <h3 className="text-headline-sm font-semibold text-primary">Electricity Activity Details</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Monitor on-site and grid electricity activity across tenant facilities.
                    </p>
                </div>
                <Button variant="secondary" size="md">
                    <MaterialIcon name="filter_list" size="sm" />
                    Filter
                </Button>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr] lg:flex-1">
                    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            Search activities
                        </label>
                        <input
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search by facility, source or status"
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
                </div>
            </div>

            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant">
                            <TableHead>Period</TableHead>
                            <TableHead>Facility</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Electricity</TableHead>
                            <TableHead>Emissions</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-on-surface-variant" colSpan={6}>
                                    Loading activities...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-error" colSpan={6}>
                                    Unable to load activities. Refresh to try again.
                                </TableCell>
                            </TableRow>
                        ) : activities.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-on-surface-variant" colSpan={6}>
                                    No activity records available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            activities.map((activity) => {
                                const status = getStatusLabel(activity.workflowStatus);
                                const statusClass = getStatusClass(activity.workflowStatus);
                                return (
                                    <TableRow key={activity.id} className="hover:bg-surface-container-lowest">
                                        <TableCell>
                                            <div className="font-semibold text-body-md text-primary">
                                                {activity.activityStartDate} - {activity.activityEndDate}
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant">
                                                {activity.reportingPeriodId}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-body-md text-primary">{activity.facilityId}</div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant">
                                                {activity.scopeType}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
                                                {activity.sourceType}
                                            </span>
                                            <div className="mt-2 text-body-md text-primary capitalize">
                                                {activity.electricityActivityType}
                                            </div>
                                            {activity.supplierName ? (
                                                <div className="mt-1 text-[11px] text-on-surface-variant">
                                                    {activity.supplierName}
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-body-md text-primary">
                                                {formatNumber(activity.electricityKwh, 0)} kWh
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {formatNumber(activity.electricityMwh, 2)} MWh
                                            </div>
                                            <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">
                                                {activity.isRenewableCertified ? "Certified renewable" : "Uncertified"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-body-md text-primary">
                                                {formatNumber(activity.calculatedTCo2e, 2)} tCO₂e
                                            </div>
                                            <div className="mt-2 text-[11px] text-on-surface-variant uppercase tracking-[0.12em]">
                                                {activity.dataQualityTier}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}>
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
