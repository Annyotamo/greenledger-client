"use client";

import { useState } from "react";
import { format, isAfter } from "date-fns";
import { getScope2Report } from "@/lib/ghg/api";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElectricityActivity } from "@/lib/activity/electricityTypes";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";

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

type DateRange = {
    start: Date | null;
    end: Date | null;
};

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
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
    const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);
    const [isExporting, setIsExporting] = useState(false);

    const selectedRangeLabel =
        selectedRange.start && selectedRange.end
            ? `${format(selectedRange.start, "MMM d, yyyy")} - ${format(selectedRange.end, "MMM d, yyyy")}`
            : DATE_RANGE_LABEL;

    const canExport = Boolean(selectedRange.start && selectedRange.end);

    function openDateModal() {
        setDraftRange(selectedRange);
        setIsDateModalOpen(true);
    }

    function closeDateModal() {
        setDraftRange(selectedRange);
        setIsDateModalOpen(false);
    }

    function handleDraftDateChange(side: "start" | "end", date: Date) {
        setDraftRange((current) => {
            const next: DateRange = { ...current };

            if (side === "start") {
                next.start = date;
                if (current.end && isAfter(date, current.end)) {
                    next.end = date;
                }
            } else {
                next.end = date;
                if (current.start && isAfter(current.start, date)) {
                    next.start = date;
                }
            }

            return next;
        });
    }

    function applyDateRange() {
        if (!draftRange.start || !draftRange.end) return;
        setSelectedRange(draftRange);
        setIsDateModalOpen(false);
    }

    async function handleExport() {
        if (!selectedRange.start || !selectedRange.end) return;
        setIsExporting(true);

        try {
            const startDate = format(selectedRange.start, "yyyy-MM-dd");
            const endDate = format(selectedRange.end, "yyyy-MM-dd");
            const blob = await getScope2Report(startDate, endDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fileName = `scope2-report-${startDate}-to-${endDate}.xlsx`;
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
                    <h3 className="text-headline-sm font-semibold text-primary">Electricity Activity Details</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Monitor on-site and grid electricity activity across tenant facilities.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={openDateModal}>
                        <MaterialIcon name="calendar_today" size="sm" />
                        {selectedRangeLabel}
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleExport} disabled={!canExport || isExporting}>
                        <MaterialIcon name="download" size="sm" />
                        {isExporting ? "Exporting" : "Export"}
                    </Button>
                </div>
            </div>

            {isDateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={closeDateModal}
                        aria-label="Close date picker"
                    />
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-2xl">
                        <div className="flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">
                                    Select export date range
                                </h2>
                                <p className="text-body-sm text-on-surface-variant">
                                    Choose a start date and end date to generate the scope 2 export.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDateModal}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high">
                                <MaterialIcon name="close" size="sm" />
                            </button>
                        </div>

                        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-semibold text-on-surface">Start date</div>
                                    {draftRange.start ? (
                                        <time className="text-sm text-on-surface-variant">
                                            {format(draftRange.start, "PPP")}
                                        </time>
                                    ) : (
                                        <div className="text-sm text-on-surface-variant">Choose a start date</div>
                                    )}
                                </div>
                                <Calendar
                                    date={draftRange.start}
                                    onDateChange={(date) => handleDraftDateChange("start", date)}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-semibold text-on-surface">End date</div>
                                    {draftRange.end ? (
                                        <time className="text-sm text-on-surface-variant">
                                            {format(draftRange.end, "PPP")}
                                        </time>
                                    ) : (
                                        <div className="text-sm text-on-surface-variant">Choose an end date</div>
                                    )}
                                </div>
                                <Calendar
                                    date={draftRange.end}
                                    onDateChange={(date) => handleDraftDateChange("end", date)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-outline-variant bg-surface p-5 sm:flex-row sm:justify-end">
                            <Button variant="secondary" size="md" onClick={closeDateModal}>
                                Cancel
                            </Button>
                            <Button size="md" onClick={applyDateRange} disabled={!draftRange.start || !draftRange.end}>
                                Save range
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                                            <div className="font-semibold text-body-md text-primary">
                                                {activity.facilityId}
                                            </div>
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
