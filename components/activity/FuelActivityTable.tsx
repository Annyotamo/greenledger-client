"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, isAfter } from "date-fns";
import { getScope1Report } from "@/lib/ghg/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyFuelActivity, rejectFuelActivity, submitFuelActivity, deleteFuelActivity } from "@/lib/activity/api";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FuelActivity } from "@/lib/activity/types";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";
import { FuelActivityDetailModal } from "./FuelActivityDetailModal";

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

const emissionTypeStyles: Record<string, string> = {
    stationary: "bg-amber-500/10 text-amber-800 border border-amber-500/20",
    mobile: "bg-sky-500/10 text-sky-800 border border-sky-500/20",
    process: "bg-purple-500/10 text-purple-800 border border-purple-500/20",
    fugitive: "bg-rose-500/10 text-rose-800 border border-rose-500/20",
    default: "bg-slate-100 text-slate-700 border border-slate-200",
};

const emissionTypeLabels: Record<string, string> = {
    stationary: "Stationary",
    mobile: "Mobile",
    process: "Process",
    fugitive: "Fugitive",
};

function getStatusClass(status: string) {
    return statusStyles[status.toLowerCase()] ?? statusStyles.default;
}

function getStatusLabel(status: string) {
    return StatusLabel[status.toLowerCase()] ?? status;
}

function getEmissionTypeClass(emissionType: string) {
    return emissionTypeStyles[emissionType.toLowerCase()] ?? emissionTypeStyles.default;
}

function getEmissionTypeLabel(emissionType: string) {
    return emissionTypeLabels[emissionType.toLowerCase()] ?? emissionType;
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

type DateRange = {
    start: Date | null;
    end: Date | null;
};

export function FuelActivityTable({
    activities,
    isLoading,
    isError,
    searchTerm = "",
    selectedFacility,
    selectedFuel,
    status,
    emissionType,
    onSearchChange,
    onFacilityChange,
    onFuelChange,
    onStatusChange,
    onEmissionTypeChange,
    facilityOptions,
    fuelOptions,
    showFilters,
    onToggleFilters,
}: {
    activities: FuelActivity[];
    isLoading: boolean;
    isError: boolean;
    searchTerm?: string;
    selectedFacility: string;
    selectedFuel: string;
    status: string;
    emissionType: string;
    onSearchChange?: (value: string) => void;
    onFacilityChange: (value: string) => void;
    onFuelChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onEmissionTypeChange: (value: string) => void;
    facilityOptions: Array<{ id: string; name: string }>;
    fuelOptions: string[];
    showFilters?: boolean;
    onToggleFilters?: (v: boolean) => void;
}) {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
    const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);
    const [isExporting, setIsExporting] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        action: "verify" | "reject" | "submit" | "delete" | null;
        activityId?: string | null;
    }>({ open: false, action: null, activityId: null });
    const [rejectReason, setRejectReason] = useState("");

    const queryClient = useQueryClient();

    const selectedActivity = activities.find((a) => a.id === selectedActivityId);

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

    const verifyMutation = useMutation<unknown, Error, string>({
        mutationFn: verifyFuelActivity,
        onSuccess: () => {
            setConfirmState({ open: false, action: null, activityId: null });
            setSelectedActivityId(null);
            setRejectReason("");
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity"] });
        },
        onError: (error: Error) => {
            console.error("Verify failed", error);
        },
    });

    const rejectMutation = useMutation<unknown, Error, { activityId: string; rejected_reason: string }>({
        mutationFn: ({ activityId, rejected_reason }) => rejectFuelActivity(activityId, rejected_reason),
        onSuccess: () => {
            setConfirmState({ open: false, action: null, activityId: null });
            setSelectedActivityId(null);
            setRejectReason("");
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity"] });
        },
        onError: (error: Error) => {
            console.error("Reject failed", error);
        },
    });

    const submitMutation = useMutation<unknown, Error, string>({
        mutationFn: submitFuelActivity,
        onSuccess: () => {
            setConfirmState({ open: false, action: null, activityId: null });
            setSelectedActivityId(null);
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity"] });
        },
        onError: (error: Error) => {
            console.error("Submit failed", error);
        },
    });

    const deleteMutation = useMutation<unknown, Error, string>({
        mutationFn: deleteFuelActivity,
        onSuccess: () => {
            setConfirmState({ open: false, action: null, activityId: null });
            setSelectedActivityId(null);
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity"] });
        },
        onError: (error: Error) => {
            console.error("Delete failed", error);
        },
    });

    const isSubmitting =
        verifyMutation.status === "pending" ||
        rejectMutation.status === "pending" ||
        submitMutation.status === "pending" ||
        deleteMutation.status === "pending";

    async function performVerify(activityId?: string | null) {
        if (!activityId) return;
        setSelectedActivityId(null);
        await verifyMutation.mutateAsync(activityId);
    }

    async function performReject(activityId?: string | null, reason?: string) {
        if (!activityId) return;
        if (!reason || reason.length < 1 || reason.length > 2000) return;
        setSelectedActivityId(null);
        await rejectMutation.mutateAsync({ activityId, rejected_reason: reason });
    }

    async function performSubmit(activityId?: string | null) {
        if (!activityId) return;
        setSelectedActivityId(null);
        await submitMutation.mutateAsync(activityId);
    }

    async function performDelete(activityId?: string | null) {
        if (!activityId) return;
        setSelectedActivityId(null);
        await deleteMutation.mutateAsync(activityId);
    }

    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const inMenu = !!target.closest("[data-action-menu]");
            const inToggle = !!target.closest("[data-action-toggle]");
            if (!inMenu && !inToggle) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", handleDocClick);
        return () => document.removeEventListener("click", handleDocClick);
    }, []);

    async function handleExport() {
        if (!selectedRange.start || !selectedRange.end) return;
        setIsExporting(true);

        try {
            const startDate = format(selectedRange.start, "yyyy-MM-dd");
            const endDate = format(selectedRange.end, "yyyy-MM-dd");
            const blob = await getScope1Report(startDate, endDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fileName = `scope1-report-${startDate}-to-${endDate}.xlsx`;
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
            <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface p-4">
                <div className="space-y-1">
                    <h3 className="text-headline-sm font-semibold text-primary">Fuel Activity Details</h3>
                    <p className="text-body-md text-on-surface-variant">
                        Monitor activity records, emissions and quality tiers across all fuel sources.
                    </p>
                    {onSearchChange ? (
                        <div className="mt-4 w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search activities"
                                className="w-full rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="secondary" size="md" onClick={openDateModal}>
                            <MaterialIcon name="calendar_today" size="sm" />
                            {selectedRangeLabel}
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleExport}
                            disabled={!canExport || isExporting}>
                            <MaterialIcon name="download" size="sm" />
                            {isExporting ? "Exporting" : "Export"}
                        </Button>
                    </div>
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
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest shadow-2xl">
                        <div className="flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">
                                    Select export date range
                                </h2>
                                <p className="text-body-sm text-on-surface-variant">
                                    Choose a start date and end date to generate the scope 1 export.
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
                            <Button
                                size="md"
                                variant="primary"
                                onClick={applyDateRange}
                                disabled={!draftRange.start || !draftRange.end}>
                                Save range
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 border-b border-outline-variant/60">
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Period</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Fuel Source</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantity</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Emissions</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Docs</TableHead>
                            <TableHead className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                            <TableHead className="py-2.5 px-4" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-on-surface-variant" colSpan={8}>
                                    Loading fuel activities...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-error font-medium" colSpan={8}>
                                    Unable to load fuel activities. Refresh to try again.
                                </TableCell>
                            </TableRow>
                        ) : activities.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 text-center text-xs text-on-surface-variant" colSpan={8}>
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
                                    <TableRow
                                        key={activity.id}
                                        onClick={() => setSelectedActivityId(activity.id)}
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
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase ${getEmissionTypeClass(
                                                    activity.emissionType,
                                                )}`}>
                                                {getEmissionTypeLabel(activity.emissionType)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <div className="font-bold text-xs text-slate-900">{activity.fuelName}</div>
                                            <div className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                                                {activity.fuelFactorStandard} {activity.fuelFactorVersion ? `(GWP: ${activity.fuelFactorVersion})` : ""}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 font-mono text-xs">
                                            <span className="font-bold text-slate-900">
                                                {activity.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </span>
                                            <span className="ml-1 text-[10px] text-slate-500 uppercase font-semibold">
                                                {activity.unitSymbol}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 font-mono text-xs">
                                            <div className="font-bold text-slate-900">
                                                {activity.calculatedTCo2e.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO₂e
                                            </div>
                                            {activity.energyContentGJ > 0 ? (
                                                <div className="text-[10px] text-slate-500 font-medium">
                                                    {activity.energyContentGJ.toFixed(1)} GJ
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 text-xs">
                                            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                                <MaterialIcon name="insert_drive_file" size="xs" className="text-slate-500" />
                                                {activity.documentsCount} docs
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusClass}`}>
                                                {status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <button
                                                aria-label="Open actions"
                                                data-action-toggle
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // toggle menu for this activity
                                                    const id = activity.id;
                                                    setOpenMenuId((current) => (current === id ? null : id));
                                                }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container-high">
                                                <MaterialIcon name="more_horiz" size="sm" />
                                            </button>

                                            {openMenuId === activity.id ? (
                                                <div
                                                    data-action-menu
                                                    className="absolute right-0 top-8 z-50 w-44 rounded-md border border-outline-variant bg-white shadow-lg">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedActivityId(activity.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-surface-container-high">
                                                        <div className="flex items-center gap-2">
                                                            <MaterialIcon name="visibility" size="sm" />
                                                            <span>View</span>
                                                        </div>
                                                    </button>
                                                    <Link
                                                        href={`/activities/fuel/${activity.id}/edit`}
                                                        className="block px-3 py-2 hover:bg-surface-container-high">
                                                        <div className="flex items-center gap-2">
                                                            <MaterialIcon name="edit" size="sm" />
                                                            <span>Edit</span>
                                                        </div>
                                                    </Link>                                                    {activity.workflowStatus.toLowerCase() === "draft" ? (
                                                        <button
                                                            onClick={() => {
                                                                setConfirmState({
                                                                    open: true,
                                                                    action: "submit",
                                                                    activityId: activity.id,
                                                                });
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-3 py-2 hover:bg-surface-container-high">
                                                            <div className="flex items-center gap-2 text-primary font-medium">
                                                                <MaterialIcon name="send" size="sm" />
                                                                <span>Submit</span>
                                                            </div>
                                                        </button>
                                                    ) : null}

                                                    {["draft", "submitted", "pending"].includes(
                                                        activity.workflowStatus.toLowerCase(),
                                                    ) ? (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setConfirmState({
                                                                        open: true,
                                                                        action: "verify",
                                                                        activityId: activity.id,
                                                                    });
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full text-left px-3 py-2 hover:bg-surface-container-high">
                                                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                                                    <MaterialIcon name="check_circle" size="sm" />
                                                                    <span>Verify</span>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setConfirmState({
                                                                        open: true,
                                                                        action: "reject",
                                                                        activityId: activity.id,
                                                                    });
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full text-left px-3 py-2 hover:bg-surface-container-high">
                                                                <div className="flex items-center gap-2 text-amber-600 font-medium">
                                                                    <MaterialIcon name="block" size="sm" />
                                                                    <span>Reject</span>
                                                                </div>
                                                            </button>
                                                        </>
                                                    ) : null}

                                                    <button
                                                        onClick={() => {
                                                            setConfirmState({
                                                                open: true,
                                                                action: "delete",
                                                                activityId: activity.id,
                                                            });
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-surface-container-high border-t border-slate-100">
                                                        <div className="flex items-center gap-2 text-rose-600 font-medium">
                                                            <MaterialIcon name="delete" size="sm" />
                                                            <span>Delete</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            ) : null}
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
                    Showing 1-{Math.min(activities.length, 15)} of {activities.length} activities
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="rounded border border-outline-variant bg-white p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
                        disabled>
                        <MaterialIcon name="chevron_left" size="sm" />
                    </button>
                    <div className="flex items-center gap-1 rounded border border-outline-variant bg-white px-2 py-1">
                        <span className="px-3 py-1 rounded bg-primary text-on-primary text-xs font-semibold">1</span>
                    </div>
                    <button
                        className="rounded border border-outline-variant bg-white p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
                        disabled>
                        <MaterialIcon name="chevron_right" size="sm" />
                    </button>
                </div>
            </div>

            {selectedActivity && (
                <FuelActivityDetailModal
                    activity={selectedActivity}
                    onClose={() => setSelectedActivityId(null)}
                    onVerify={(id) => {
                        setSelectedActivityId(null);
                        setConfirmState({ open: true, action: "verify", activityId: id });
                    }}
                    onReject={(id) => {
                        setSelectedActivityId(null);
                        setConfirmState({ open: true, action: "reject", activityId: id });
                    }}
                    onSubmit={(id) => {
                        setSelectedActivityId(null);
                        setConfirmState({ open: true, action: "submit", activityId: id });
                    }}
                />
            )}

            {confirmState.open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setConfirmState({ open: false, action: null, activityId: null })}
                        aria-label="Close modal"
                    />
                    <div className="relative w-full max-w-lg overflow-hidden rounded-md border border-outline-variant bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 px-6 py-5">
                            <div>
                                <h3 className="text-headline-sm font-semibold text-primary">
                                    {confirmState.action === "verify" && "Verify activity"}
                                    {confirmState.action === "reject" && "Reject activity"}
                                    {confirmState.action === "submit" && "Submit activity"}
                                    {confirmState.action === "delete" && "Delete activity"}
                                </h3>
                                <p className="text-body-sm text-on-surface-variant mt-1">
                                    {confirmState.action === "verify" && "This will mark the activity as verified."}
                                    {confirmState.action === "reject" && "Please provide a reason for rejecting this activity (1-2000 characters)."}
                                    {confirmState.action === "submit" && "This will submit the activity for reviewer verification."}
                                    {confirmState.action === "delete" && "Are you sure you want to delete this fuel activity? This action cannot be undone."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfirmState({ open: false, action: null, activityId: null })}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high">
                                <MaterialIcon name="close" size="sm" />
                            </button>
                        </div>

                        {confirmState.action === "reject" ? (
                            <div className="p-6 pt-0">
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                    className="w-full rounded border border-outline-variant p-3 text-sm"
                                    rows={5}
                                    maxLength={2000}
                                />
                            </div>
                        ) : null}

                        <div className="flex items-center gap-3 border-t border-outline-variant bg-surface p-4 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmState({ open: false, action: null, activityId: null })}>
                                Cancel
                            </Button>
                            {confirmState.action === "verify" && (
                                <button
                                    className="bg-emerald-600 text-white px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm disabled:opacity-70 font-mono text-xs font-bold uppercase"
                                    onClick={() => performVerify(confirmState.activityId)}
                                    disabled={isSubmitting}>
                                    <MaterialIcon name="check_circle" size="sm" />
                                    <span>{verifyMutation.status === "pending" ? "Verifying..." : "Confirm verify"}</span>
                                </button>
                            )}
                            {confirmState.action === "submit" && (
                                <button
                                    className="bg-primary text-white px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm disabled:opacity-70 font-mono text-xs font-bold uppercase"
                                    onClick={() => performSubmit(confirmState.activityId)}
                                    disabled={isSubmitting}>
                                    <MaterialIcon name="send" size="sm" />
                                    <span>{submitMutation.status === "pending" ? "Submitting..." : "Confirm submit"}</span>
                                </button>
                            )}
                            {confirmState.action === "reject" && (
                                <Button
                                    variant="danger"
                                    onClick={() => performReject(confirmState.activityId, rejectReason)}
                                    disabled={isSubmitting || rejectReason.length < 1 || rejectReason.length > 2000}>
                                    {rejectMutation.status === "pending" ? "Rejecting..." : "Confirm reject"}
                                </Button>
                            )}
                            {confirmState.action === "delete" && (
                                <Button
                                    variant="danger"
                                    onClick={() => performDelete(confirmState.activityId)}
                                    disabled={isSubmitting}>
                                    {deleteMutation.status === "pending" ? "Deleting..." : "Confirm delete"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </Card>
    );
}
