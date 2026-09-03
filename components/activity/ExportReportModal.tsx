"use client";

import { useEffect, useState, useMemo } from "react";
import {
    format,
    addDays,
    isSameDay,
    isSameMonth,
    isAfter,
    isBefore,
    startOfMonth,
    startOfWeek,
    subMonths,
    addMonths,
    subDays,
} from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { CustomSelect, type CustomSelectOption } from "@/components/ui/select";

type ExportReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    reportType?: string;
    defaultStartDate?: Date | null;
    defaultEndDate?: Date | null;
    onExport: (startDate: string, endDate: string) => Promise<void>;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const months = [
    { label: "January", value: "0" },
    { label: "February", value: "1" },
    { label: "March", value: "2" },
    { label: "April", value: "3" },
    { label: "May", value: "4" },
    { label: "June", value: "5" },
    { label: "July", value: "6" },
    { label: "August", value: "7" },
    { label: "September", value: "8" },
    { label: "October", value: "9" },
    { label: "November", value: "10" },
    { label: "December", value: "11" },
];

export function ExportReportModal({
    isOpen,
    onClose,
    title = "Export Activity Report",
    description = "Select a date range to generate and download the report (.xlsx).",
    reportType = "Excel Report",
    defaultStartDate = null,
    defaultEndDate = null,
    onExport,
}: ExportReportModalProps) {
    // Current FY default fallback (Apr 1 of previous/current year to Mar 31 of next year)
    const currentYear = new Date().getFullYear();
    const defaultFYStart = new Date(currentYear, 3, 1); // Apr 1
    const defaultFYEnd = new Date(currentYear + 1, 2, 31); // Mar 31

    const years = useMemo(() => {
        const list = [];
        for (let y = currentYear - 6; y <= currentYear + 5; y++) {
            list.push({ label: String(y), value: String(y) });
        }
        return list;
    }, [currentYear]);

    const [startDate, setStartDate] = useState<Date | null>(defaultStartDate || defaultFYStart);
    const [endDate, setEndDate] = useState<Date | null>(defaultEndDate || defaultFYEnd);
    const [activeSelectionSide, setActiveSelectionSide] = useState<"start" | "end">("start");
    const [currentMonth, setCurrentMonth] = useState<Date>(defaultStartDate || defaultFYStart);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reset or initialize on open
    useEffect(() => {
        if (isOpen) {
            setStartDate(defaultStartDate || defaultFYStart);
            setEndDate(defaultEndDate || defaultFYEnd);
            setCurrentMonth(defaultStartDate || defaultFYStart);
            setActiveSelectionSide("start");
            setErrorMessage(null);
            setIsDownloading(false);
        }
    }, [isOpen, defaultStartDate, defaultEndDate]);

    // Handle Quick Date Range Presets
    const handleSelectPreset = (preset: "current_fy" | "prev_fy" | "last_30" | "last_90") => {
        const today = new Date();
        const y = today.getFullYear();
        if (preset === "current_fy") {
            const s = new Date(y, 3, 1);
            const e = new Date(y + 1, 2, 31);
            setStartDate(s);
            setEndDate(e);
            setCurrentMonth(s);
        } else if (preset === "prev_fy") {
            const s = new Date(y - 1, 3, 1);
            const e = new Date(y, 2, 31);
            setStartDate(s);
            setEndDate(e);
            setCurrentMonth(s);
        } else if (preset === "last_30") {
            const s = subDays(today, 30);
            setStartDate(s);
            setEndDate(today);
            setCurrentMonth(s);
        } else if (preset === "last_90") {
            const s = subDays(today, 90);
            setStartDate(s);
            setEndDate(today);
            setCurrentMonth(s);
        }
    };

    // Calendar grid calculations
    const monthStart = startOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarDays = useMemo(
        () => Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index)),
        [calendarStart],
    );

    // Date click in compact calendar
    const handleDayClick = (day: Date) => {
        if (activeSelectionSide === "start") {
            setStartDate(day);
            if (endDate && isAfter(day, endDate)) {
                setEndDate(day);
            }
            setActiveSelectionSide("end");
        } else {
            if (startDate && isBefore(day, startDate)) {
                setStartDate(day);
                setEndDate(startDate);
            } else {
                setEndDate(day);
            }
            setActiveSelectionSide("start");
        }
    };

    const isRangeValid = Boolean(startDate && endDate);

    // Calculate duration in days
    const totalDays =
        startDate && endDate
            ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
            : 0;

    const handleDownloadClick = async () => {
        if (!startDate || !endDate) return;
        setIsDownloading(true);
        setErrorMessage(null);

        try {
            const startStr = format(startDate, "yyyy-MM-dd");
            const endStr = format(endDate, "yyyy-MM-dd");
            await onExport(startStr, endStr);
            onClose();
        } catch (err) {
            console.error("Export failed:", err);
            setErrorMessage(err instanceof Error ? err.message : "Failed to download export report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
            <button
                type="button"
                className="absolute inset-0 bg-transparent cursor-default"
                onClick={onClose}
                aria-label="Close modal overlay"
            />
            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl flex flex-col z-10 animate-scale-in">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/60 px-5 py-4 bg-surface-container-lowest">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <MaterialIcon name="file_download" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-headline-sm text-sm font-bold text-primary">{title}</h3>
                            <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">{description}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high">
                        <MaterialIcon name="close" size="xs" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                    {/* Quick Preset Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pb-1">
                        <button
                            type="button"
                            onClick={() => handleSelectPreset("current_fy")}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface-container border border-outline-variant/50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors">
                            Current FY
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectPreset("prev_fy")}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface-container border border-outline-variant/50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors">
                            Prev FY
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectPreset("last_90")}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface-container border border-outline-variant/50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors">
                            Last 90 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectPreset("last_30")}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface-container border border-outline-variant/50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors">
                            Last 30 Days
                        </button>
                    </div>

                    {/* Date Selector Row */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Start Date Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveSelectionSide("start");
                                if (startDate) setCurrentMonth(startDate);
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                                activeSelectionSide === "start"
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                    : "border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low"
                            }`}>
                            <span className="font-mono text-[9.5px] uppercase font-bold text-on-surface-variant block">Start Date</span>
                            <span className="font-mono text-xs font-bold text-primary mt-0.5 block truncate">
                                {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
                            </span>
                        </button>

                        {/* End Date Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveSelectionSide("end");
                                if (endDate) setCurrentMonth(endDate);
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                                activeSelectionSide === "end"
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                    : "border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low"
                            }`}>
                            <span className="font-mono text-[9.5px] uppercase font-bold text-on-surface-variant block">End Date</span>
                            <span className="font-mono text-xs font-bold text-primary mt-0.5 block truncate">
                                {endDate ? format(endDate, "MMM d, yyyy") : "Select date"}
                            </span>
                        </button>
                    </div>

                    {/* Compact Calendar Container */}
                    <div className="rounded-lg border border-outline-variant/70 bg-white p-3 shadow-2xs">
                        {/* Month & Year Navigation with react-select CustomSelect */}
                        <div className="flex items-center justify-between pb-2 mb-1 border-b border-outline-variant/40">
                            <button
                                type="button"
                                onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                                aria-label="Previous month">
                                <MaterialIcon name="chevron_left" size="xs" />
                            </button>

                            <div className="flex items-center gap-1 font-mono">
                                <CustomSelect
                                    variant="compact"
                                    options={months}
                                    value={String(currentMonth.getMonth())}
                                    isSearchable={false}
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                                    onChange={(val) => {
                                        const newMonth = new Date(currentMonth.getFullYear(), Number(val), 1);
                                        setCurrentMonth(newMonth);
                                    }}
                                />

                                <CustomSelect
                                    variant="compact"
                                    options={years}
                                    value={String(currentMonth.getFullYear())}
                                    isSearchable={false}
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                                    onChange={(val) => {
                                        const newMonth = new Date(Number(val), currentMonth.getMonth(), 1);
                                        setCurrentMonth(newMonth);
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                                aria-label="Next month">
                                <MaterialIcon name="chevron_right" size="xs" />
                            </button>
                        </div>

                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-on-surface-variant font-semibold py-1">
                            {weekdays.map((day) => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>

                        {/* Day Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs mt-1">
                            {calendarDays.slice(0, 35).map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isStart = startDate && isSameDay(day, startDate);
                                const isEnd = endDate && isSameDay(day, endDate);
                                const isInRange =
                                    startDate &&
                                    endDate &&
                                    isAfter(day, startDate) &&
                                    isBefore(day, endDate);

                                let cellStyles = "text-slate-700 hover:bg-slate-100";
                                if (!isCurrentMonth) {
                                    cellStyles = "text-slate-300 hover:bg-slate-50";
                                }

                                if (isStart || isEnd) {
                                    cellStyles = "bg-primary text-white font-bold hover:bg-primary";
                                } else if (isInRange) {
                                    cellStyles = "bg-emerald-50 text-emerald-950 font-medium";
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleDayClick(day)}
                                        className={`h-7 w-full flex items-center justify-center rounded text-[11px] transition-colors ${cellStyles}`}>
                                        {format(day, "d")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Info Banner */}
                    {isRangeValid ? (
                        <div className="rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20 text-xs font-mono text-emerald-800 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <MaterialIcon name="date_range" size="xs" className="text-emerald-700" />
                                <span>Duration:</span>
                            </div>
                            <span className="font-bold">{totalDays} Days Selected</span>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                            <MaterialIcon name="info" size="xs" />
                            <span>Select both start and end dates to proceed.</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="rounded-lg bg-rose-50 p-2.5 border border-rose-200 text-xs font-mono text-rose-700">
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 border-t border-outline-variant/60 bg-surface-container-low px-5 py-3.5">
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={isDownloading}>
                        Cancel
                    </Button>
                    <button
                        type="button"
                        onClick={handleDownloadClick}
                        disabled={!isRangeValid || isDownloading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <MaterialIcon name={isDownloading ? "hourglass_empty" : "download"} size="xs" />
                        <span>{isDownloading ? "Generating Excel..." : "Download Report"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
