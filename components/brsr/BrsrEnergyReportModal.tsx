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
        physical_output_unit?: string | null;
    }) => Promise<void>;
};

export function BrsrEnergyReportModal({ isOpen, onClose, onDownload }: BrsrEnergyReportModalProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [turnover, setTurnover] = useState<number | null>(null);
    const [pppFactor, setPppFactor] = useState<number | null>(null);
    const [physicalOutput, setPhysicalOutput] = useState<number | null>(null);
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
                ppp_conversion_factor: pppFactor !== null ? pppFactor : undefined,
                physical_output: physicalOutput,
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Backdrop underlay */}
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Close download options"
                disabled={isDownloading}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-2xl animate-fade-up">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-headline-sm font-semibold text-primary">
                            Download BRSR Energy Report
                        </h2>
                        <p className="text-body-sm text-on-surface-variant">
                            Choose a date range and specify the turnover to download the XLSX report.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDownloading}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-50"
                        aria-label="Close dialog">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Date Selectors (Calendars Side-by-Side) */}
                <div className="grid gap-6 p-6 md:grid-cols-2">
                    {/* Start Date */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
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
                            className="bg-surface-container-low"
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
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
                            className="bg-surface-container-low"
                        />
                    </div>
                </div>

                {/* Turnover & Optional Intensity inputs */}
                <div className="border-t border-outline-variant p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="turnover" className="text-sm font-semibold text-on-surface">
                                Turnover (INR) <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="pointer-events-none absolute left-3 text-on-surface-variant/70">
                                    <span className="font-mono text-body-md">₹</span>
                                </div>
                                <input
                                    id="turnover"
                                    type="number"
                                    min="1"
                                    placeholder="Enter total turnover in INR"
                                    value={turnover === null ? "" : turnover}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTurnover(val === "" ? null : Number(val));
                                        setError(null);
                                    }}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 pl-8 pr-4 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="pppFactor" className="text-sm font-semibold text-on-surface">
                                PPP Conversion Factor
                            </label>
                            <input
                                id="pppFactor"
                                type="number"
                                step="any"
                                placeholder="Enter conversion factor (default: 1.0)"
                                value={pppFactor === null ? "" : pppFactor}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPppFactor(val === "" ? null : Number(val));
                                    setError(null);
                                }}
                                disabled={isDownloading}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 px-4 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="physicalOutput" className="text-sm font-semibold text-on-surface">
                                Physical Output
                            </label>
                            <input
                                id="physicalOutput"
                                type="number"
                                step="any"
                                placeholder="Enter physical output amount"
                                value={physicalOutput === null ? "" : physicalOutput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPhysicalOutput(val === "" ? null : Number(val));
                                    setError(null);
                                }}
                                disabled={isDownloading}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 px-4 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="physicalOutputUnit" className="text-sm font-semibold text-on-surface">
                                Physical Output Unit
                            </label>
                            <input
                                id="physicalOutputUnit"
                                type="text"
                                placeholder="e.g. tonnes, tcs, pcs"
                                value={physicalOutputUnit}
                                onChange={(e) => {
                                    setPhysicalOutputUnit(e.target.value);
                                    setError(null);
                                }}
                                disabled={isDownloading}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 px-4 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                        Turnover value is required to calculate output energy intensity metrics. Conversion factor and physical output options are optional.
                    </p>
                </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-error-container/20 border border-error/20 p-3 text-xs text-error font-medium">
                            <MaterialIcon name="error" size="sm" />
                            <span>{error}</span>
                        </div>
                    )}

                {/* Footer Controls */}
                <div className="flex flex-col gap-3 border-t border-outline-variant bg-surface p-5 sm:flex-row sm:justify-end">
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
