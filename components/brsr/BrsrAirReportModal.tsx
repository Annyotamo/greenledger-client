"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrAirDisclosurePayload } from "@/lib/brsr/types";

type BrsrAirReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    payload: BrsrAirDisclosurePayload;
    onDownload: (payload: BrsrAirDisclosurePayload) => Promise<void>;
};

export function BrsrAirReportModal({ isOpen, onClose, payload, onDownload }: BrsrAirReportModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && mounted) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, mounted]);

    if (!isOpen || !mounted) return null;

    const handleDownload = async () => {
        setIsDownloading(true);
        setError(null);
        try {
            await onDownload(payload);
            onClose();
        } catch (err) {
            console.error("Failed to generate Air report:", err);
            setError(err instanceof Error ? err.message : "Failed to download Air report.");
        } finally {
            setIsDownloading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md rounded-2xl border border-outline-variant/60 bg-white p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                            <MaterialIcon name="air" size="sm" />
                        </div>
                        <h3 className="font-sans text-body-lg font-bold text-on-surface">
                            Download Air Emissions Report
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-high transition">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                <div className="space-y-3 text-xs text-on-surface-variant">
                    <p>
                        Export official SEBI BRSR Principle 6 Air Emissions report (.xlsx) containing stack pollutant emission rates (kg/hr), annual totals (tonnes/year), and plant average concentrations (mg/Nm³).
                    </p>
                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">FY Period:</span>
                            <span className="font-bold text-on-surface">{payload.financial_year_label || "FY 2024-25"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">Active Stacks Count:</span>
                            <span className="font-bold text-on-surface">{payload.stacks?.length || 0} stack(s)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">Total Readings Logged:</span>
                            <span className="font-bold text-on-surface">
                                {payload.stacks?.reduce((acc, s) => acc + (s.readings?.length || 0), 0) || 0} reading(s)
                            </span>
                        </div>
                    </div>
                    {error && <p className="text-xs text-error font-medium">{error}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/60">
                    <Button variant="secondary" size="md" onClick={onClose} disabled={isDownloading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2">
                        {isDownloading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <MaterialIcon name="download" size="sm" />
                                <span>Download Excel</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
