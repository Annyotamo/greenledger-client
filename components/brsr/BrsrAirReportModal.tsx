"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type AirEmissionsData = {
    fyLabel: string;
    turnover: string;
    physicalOutput: string;
    physicalOutputUnit: string;
    nox: string;
    sox: string;
    pm: string;
    pop: string;
    voc: string;
    hap: string;
    othersLabel: string;
    othersValue: string;
};

type BrsrAirReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: AirEmissionsData;
};

export function BrsrAirReportModal({ isOpen, onClose, data }: BrsrAirReportModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
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

    const handleDownloadCSV = () => {
        setIsDownloading(true);
        try {
            const totalEmissions =
                (Number(data.nox) || 0) +
                (Number(data.sox) || 0) +
                (Number(data.pm) || 0) +
                (Number(data.pop) || 0) +
                (Number(data.voc) || 0) +
                (Number(data.hap) || 0) +
                (Number(data.othersValue) || 0);

            const csvContent = [
                ["SEBI BRSR Principle 6 - Air Emissions Disclosure Report"],
                ["Financial Year", data.fyLabel || "FY 2025-26"],
                ["Turnover (INR)", data.turnover || "1000000"],
                ["Physical Output", `${data.physicalOutput || "100"} ${data.physicalOutputUnit || "tonnes"}`],
                [""],
                ["Parameter / Air Pollutant", "Emission Quantity (Metric Tonnes)", "Category"],
                ["NOx (Oxides of Nitrogen)", data.nox || "0.00", "Criteria Air Pollutant"],
                ["SOx (Oxides of Sulfur)", data.sox || "0.00", "Criteria Air Pollutant"],
                ["Particulate Matter (PM)", data.pm || "0.00", "Criteria Air Pollutant"],
                ["Persistent Organic Pollutants (POP)", data.pop || "0.00", "Persistent Organic Pollutant"],
                ["Volatile Organic Compounds (VOC)", data.voc || "0.00", "Volatile Organic Compound"],
                ["Hazardous Air Pollutants (HAP)", data.hap || "0.00", "Hazardous Air Pollutant"],
                [data.othersLabel || "Others", data.othersValue || "0.00", "Other Air Emissions"],
                ["Total Air Emissions", totalEmissions.toFixed(2), "Grand Total"],
            ]
                .map((row) => row.join(","))
                .join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `brsr-air-emissions-report-${data.fyLabel || "FY2025-26"}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            onClose();
        } catch (err) {
            console.error("Failed to generate Air report:", err);
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
                        Export the SEBI BRSR Principle 6 Air Emissions disclosure metrics including NOx, SOx, PM, POP, VOC, HAP, and intensity metrics into a structured CSV report.
                    </p>
                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">FY Period:</span>
                            <span className="font-bold text-on-surface">{data.fyLabel || "FY 2025-26"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">Turnover:</span>
                            <span className="font-bold text-on-surface">₹{Number(data.turnover || 1000000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">Physical Output:</span>
                            <span className="font-bold text-on-surface">{data.physicalOutput || "100"} {data.physicalOutputUnit || "tonnes"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/60">
                    <Button variant="secondary" size="md" onClick={onClose} disabled={isDownloading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleDownloadCSV}
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
                                <span>Download CSV</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
