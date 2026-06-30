"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrWaterDisclosurePayload } from "@/lib/brsr/types";

type BrsrWaterReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (payload: BrsrWaterDisclosurePayload) => Promise<void>;
};

export function BrsrWaterReportModal({ isOpen, onClose, onDownload }: BrsrWaterReportModalProps) {
    const [fyLabel, setFyLabel] = useState("");
    const [surfaceWater, setSurfaceWater] = useState("");
    const [groundwater, setGroundwater] = useState("");
    const [thirdParty, setThirdParty] = useState("");
    const [seawater, setSeawater] = useState("");
    const [others, setOthers] = useState("");
    const [totalWater, setTotalWater] = useState("");
    const [turnover, setTurnover] = useState("");

    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Disable body scroll when open
    useEffect(() => {
        if (isOpen && mounted) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, mounted]);

    // Automatically calculate the sum of water fields as a helper
    useEffect(() => {
        const sum =
            (Number(surfaceWater) || 0) +
            (Number(groundwater) || 0) +
            (Number(thirdParty) || 0) +
            (Number(seawater) || 0) +
            (Number(others) || 0);
        
        if (sum > 0) {
            setTotalWater(String(sum));
        }
    }, [surfaceWater, groundwater, thirdParty, seawater, others]);

    if (!mounted || !isOpen) return null;

    const handleDownload = async () => {
        if (
            !fyLabel ||
            !surfaceWater ||
            !groundwater ||
            !thirdParty ||
            !seawater ||
            !others ||
            !totalWater ||
            !turnover
        ) {
            setError("All fields are mandatory.");
            return;
        }

        setError(null);
        setIsDownloading(true);

        try {
            await onDownload({
                financial_year_label: fyLabel,
                surface_water_kl: surfaceWater,
                groundwater_kl: groundwater,
                third_party_water_kl: thirdParty,
                seawater_desalinated_kl: seawater,
                others_kl: others,
                total_water_consumption_kl: totalWater,
                turnover_inr: turnover,
            });
            onClose();
        } catch (err) {
            console.error("Failed to download report:", err);
            setError("Download failed. Please check inputs and try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const isFormValid =
        fyLabel.trim() !== "" &&
        surfaceWater.trim() !== "" &&
        groundwater.trim() !== "" &&
        thirdParty.trim() !== "" &&
        seawater.trim() !== "" &&
        others.trim() !== "" &&
        totalWater.trim() !== "" &&
        turnover.trim() !== "" &&
        !isDownloading;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-y-auto py-8">
            {/* Backdrop underlay */}
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-default"
                onClick={onClose}
                aria-label="Close download options"
                disabled={isDownloading}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-2xl animate-fade-up flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 shrink-0">
                    <div>
                        <h2 className="text-headline-sm font-semibold text-primary">
                            Download BRSR Water Report
                        </h2>
                        <p className="text-body-sm text-on-surface-variant">
                            Manually enter the water disclosure parameters to export the XLSX report.
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

                {/* Form Fields */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans text-body-md text-on-surface">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Financial Year */}
                        <div className="space-y-1">
                            <label htmlFor="fy-label" className="text-xs font-semibold text-on-surface-variant">
                                Financial Year Label <span className="text-error">*</span>
                            </label>
                            <input
                                id="fy-label"
                                type="text"
                                placeholder="e.g. FY 2024-2025"
                                value={fyLabel}
                                onChange={(e) => setFyLabel(e.target.value)}
                                disabled={isDownloading}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>

                        {/* Turnover */}
                        <div className="space-y-1">
                            <label htmlFor="modal-turnover" className="text-xs font-semibold text-on-surface-variant">
                                Turnover (INR) <span className="text-error">*</span>
                            </label>
                            <input
                                id="modal-turnover"
                                type="number"
                                placeholder="e.g. 50000"
                                value={turnover}
                                onChange={(e) => setTurnover(e.target.value)}
                                disabled={isDownloading}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="border-t border-outline-variant/60 my-2 pt-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">
                            Water Source Quantities (kL)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Surface water */}
                            <div className="space-y-1">
                                <label htmlFor="surface" className="text-xs font-semibold text-on-surface-variant">
                                    Surface Water (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="surface"
                                    type="number"
                                    placeholder="e.g. 2500"
                                    value={surfaceWater}
                                    onChange={(e) => setSurfaceWater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Groundwater */}
                            <div className="space-y-1">
                                <label htmlFor="groundwater" className="text-xs font-semibold text-on-surface-variant">
                                    Groundwater (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="groundwater"
                                    type="number"
                                    placeholder="e.g. 1200"
                                    value={groundwater}
                                    onChange={(e) => setGroundwater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Third Party Water */}
                            <div className="space-y-1">
                                <label htmlFor="thirdparty" className="text-xs font-semibold text-on-surface-variant">
                                    Third Party Water (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="thirdparty"
                                    type="number"
                                    placeholder="e.g. 5600"
                                    value={thirdParty}
                                    onChange={(e) => setThirdParty(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Seawater Desalinated */}
                            <div className="space-y-1">
                                <label htmlFor="seawater" className="text-xs font-semibold text-on-surface-variant">
                                    Seawater / Desalinated (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="seawater"
                                    type="number"
                                    placeholder="e.g. 2000"
                                    value={seawater}
                                    onChange={(e) => setSeawater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Others */}
                            <div className="space-y-1">
                                <label htmlFor="others" className="text-xs font-semibold text-on-surface-variant">
                                    Others (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="others"
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={others}
                                    onChange={(e) => setOthers(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Total Water */}
                            <div className="space-y-1">
                                <label htmlFor="total-water" className="text-xs font-semibold text-on-surface-variant">
                                    Total Water Consumption (kL) <span className="text-error">*</span>
                                </label>
                                <input
                                    id="total-water"
                                    type="number"
                                    placeholder="e.g. 11800"
                                    value={totalWater}
                                    onChange={(e) => setTotalWater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-primary/40 bg-surface-container-low px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-error-container/20 border border-error/20 p-3 text-xs text-error font-medium">
                            <MaterialIcon name="error" size="sm" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-outline-variant bg-surface p-5 sm:flex-row sm:justify-end shrink-0">
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
