"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

type BrsrEnergyReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (payload: {
        start_date: string;
        end_date: string;
        turnover_inr: number;
        ppp_conversion_factor?: number;
        physical_output?: number | null;
        physical_output_tonnes?: number | null;
        physical_output_unit?: string | null;
    }) => Promise<void>;
};

export function BrsrEnergyReportModal({ isOpen, onClose, onDownload }: BrsrEnergyReportModalProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [turnover, setTurnover] = useState<number | null>(null);
    const [physicalOutputTonnes, setPhysicalOutputTonnes] = useState<number | null>(null);
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState<string>("");
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && mounted) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, mounted]);

    if (!mounted || !isOpen) return null;

    const handleDownload = async () => {
        if (!startDate || !endDate || turnover === null || turnover === undefined) {
            setError("Start Date, End Date, and Turnover are required.");
            return;
        }

        if (startDate > endDate) {
            setError("Start date cannot be after end date.");
            return;
        }

        setError(null);
        setIsDownloading(true);

        try {
            const formattedStart = format(startDate, "yyyy-MM-dd");
            const formattedEnd = format(endDate, "yyyy-MM-dd");
            await onDownload({
                start_date: formattedStart,
                end_date: formattedEnd,
                turnover_inr: turnover,
                physical_output: physicalOutputTonnes,
                physical_output_tonnes: physicalOutputTonnes,
                physical_output_unit: physicalOutputUnit || undefined,
            });
            onClose();
        } catch (err) {
            console.error("Failed to download report:", err);
            setError("Download failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const isFormValid = startDate && endDate && turnover !== null && turnover > 0 && !isDownloading;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Backdrop underlay */}
            <button
                type="button"
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-label="Close download options"
                disabled={isDownloading}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-3xl max-h-[85vh] my-auto flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-2xl animate-fade-up overflow-hidden">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-outline-variant px-6 py-4 sm:flex-row sm:items-center sm:justify-between shrink-0 bg-white">
                    <div>
                        <h2 className="text-headline-sm font-semibold text-primary">
                            Download BRSR Energy Report
                        </h2>
                        <p className="text-body-sm text-on-surface-variant">
                            Choose a date range and specify the parameters to download the XLSX report.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDownloading}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-50"
                        aria-label="Close dialog">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Scrollable Modal Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
                    {/* Date Selectors (Calendars Side-by-Side, Centered) */}
                    <div className="grid gap-6 md:grid-cols-2 justify-items-center">
                        {/* Start Date */}
                        <div className="flex flex-col items-center space-y-3 w-full max-w-[320px]">
                            <div className="flex items-center justify-between w-full">
                                <label className="text-sm font-semibold text-on-surface">Start Date</label>
                                {startDate ? (
                                    <time className="text-xs text-on-surface-variant font-mono">
                                        {format(startDate, "PPP")}
                                    </time>
                                ) : (
                                    <span className="text-xs text-on-surface-variant/60">Not selected</span>
                                )}
                            </div>
                            <Calendar
                                date={startDate}
                                onDateChange={(date) => {
                                    setStartDate(date);
                                    setError(null);
                                }}
                                className="bg-white shadow-sm border border-outline-variant/70"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col items-center space-y-3 w-full max-w-[320px]">
                            <div className="flex items-center justify-between w-full">
                                <label className="text-sm font-semibold text-on-surface">End Date</label>
                                {endDate ? (
                                    <time className="text-xs text-on-surface-variant font-mono">
                                        {format(endDate, "PPP")}
                                    </time>
                                ) : (
                                    <span className="text-xs text-on-surface-variant/60">Not selected</span>
                                )}
                            </div>
                            <Calendar
                                date={endDate}
                                onDateChange={(date) => {
                                    setEndDate(date);
                                    setError(null);
                                }}
                                className="bg-white shadow-sm border border-outline-variant/70"
                            />
                        </div>
                    </div>

                    {/* Turnover & Physical Output inputs */}
                    <div className="border-t border-outline-variant/60 pt-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="turnover" className="text-xs font-semibold text-on-surface">
                                    Turnover (INR) <span className="text-error">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <div className="pointer-events-none absolute left-3 text-on-surface-variant/70">
                                        <span className="font-mono text-xs">₹</span>
                                    </div>
                                    <input
                                        id="turnover"
                                        type="number"
                                        min="1"
                                        placeholder="Enter turnover"
                                        value={turnover === null ? "" : turnover}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setTurnover(val === "" ? null : Number(val));
                                            setError(null);
                                        }}
                                        disabled={isDownloading}
                                        className="w-full rounded-lg border border-outline-variant bg-white py-2 pl-7 pr-3 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="physical_output_tonnes" className="text-xs font-semibold text-on-surface">
                                    Physical Output (Tonnes)
                                </label>
                                <input
                                    id="physical_output_tonnes"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 100"
                                    value={physicalOutputTonnes === null ? "" : physicalOutputTonnes}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setPhysicalOutputTonnes(val === "" ? null : Number(val));
                                        setError(null);
                                    }}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white py-2 px-3 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="physical_output_unit" className="text-xs font-semibold text-on-surface">
                                    Output Unit
                                </label>
                                <input
                                    id="physical_output_unit"
                                    type="text"
                                    placeholder="e.g. tonnes, tcs"
                                    value={physicalOutputUnit}
                                    onChange={(e) => {
                                        setPhysicalOutputUnit(e.target.value);
                                        setError(null);
                                    }}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white py-2 px-3 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-on-surface-variant text-center">
                            Turnover and physical output tonnes are used to calculate output energy intensity metrics.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-error-container/20 border border-error/20 p-3 text-xs text-error font-medium">
                            <MaterialIcon name="error" size="sm" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col gap-3 border-t border-outline-variant bg-white p-5 sm:flex-row sm:justify-end shrink-0">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onClose}
                        disabled={isDownloading}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        onClick={handleDownload}
                        disabled={!isFormValid}
                        className="min-w-[140px] flex items-center justify-center gap-2">
                        {isDownloading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <MaterialIcon name="download" size="sm" />
                                Download XLSX
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
