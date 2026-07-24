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
    const [turnover, setTurnover] = useState("");

    // Withdrawal
    const [surfaceWater, setSurfaceWater] = useState("");
    const [groundwater, setGroundwater] = useState("");
    const [thirdParty, setThirdParty] = useState("");
    const [seawater, setSeawater] = useState("");
    const [others, setOthers] = useState("");

    // Discharge
    const [dischargeSurfaceNoTreatment, setDischargeSurfaceNoTreatment] = useState("");
    const [dischargeSurfaceWithTreatment, setDischargeSurfaceWithTreatment] = useState("");
    const [dischargeSurfaceLevel, setDischargeSurfaceLevel] = useState("");

    const [dischargeGroundNoTreatment, setDischargeGroundNoTreatment] = useState("");
    const [dischargeGroundWithTreatment, setDischargeGroundWithTreatment] = useState("");
    const [dischargeGroundLevel, setDischargeGroundLevel] = useState("");

    const [dischargeSeawaterNoTreatment, setDischargeSeawaterNoTreatment] = useState("");
    const [dischargeSeawaterWithTreatment, setDischargeSeawaterWithTreatment] = useState("");
    const [dischargeSeawaterLevel, setDischargeSeawaterLevel] = useState("");

    const [dischargeThirdPartyNoTreatment, setDischargeThirdPartyNoTreatment] = useState("");
    const [dischargeThirdPartyWithTreatment, setDischargeThirdPartyWithTreatment] = useState("");
    const [dischargeThirdPartyLevel, setDischargeThirdPartyLevel] = useState("");

    const [dischargeOthersNoTreatment, setDischargeOthersNoTreatment] = useState("");
    const [dischargeOthersWithTreatment, setDischargeOthersWithTreatment] = useState("");
    const [dischargeOthersLevel, setDischargeOthersLevel] = useState("");

    const [totalWater, setTotalWater] = useState("");

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
        } else {
            setTotalWater("");
        }
    }, [surfaceWater, groundwater, thirdParty, seawater, others]);

    if (!mounted || !isOpen) return null;

    const handleDownload = async () => {
        if (!fyLabel || !turnover) {
            setError("Financial Year Label and Turnover are required.");
            return;
        }

        setError(null);
        setIsDownloading(true);

        try {
            await onDownload({
                financial_year_label: fyLabel,
                turnover_inr: Number(turnover) || 0,
                withdrawal: {
                    surface_water_kl: Number(surfaceWater) || 0,
                    groundwater_kl: Number(groundwater) || 0,
                    third_party_water_kl: Number(thirdParty) || 0,
                    seawater_desalinated_kl: Number(seawater) || 0,
                    others_kl: Number(others) || 0,
                },
                discharge: {
                    surface_water: {
                        no_treatment_kl: Number(dischargeSurfaceNoTreatment) || 0,
                        with_treatment_kl: Number(dischargeSurfaceWithTreatment) || 0,
                        treatment_level: dischargeSurfaceLevel || null,
                    },
                    groundwater: {
                        no_treatment_kl: Number(dischargeGroundNoTreatment) || 0,
                        with_treatment_kl: Number(dischargeGroundWithTreatment) || 0,
                        treatment_level: dischargeGroundLevel || null,
                    },
                    seawater: {
                        no_treatment_kl: Number(dischargeSeawaterNoTreatment) || 0,
                        with_treatment_kl: Number(dischargeSeawaterWithTreatment) || 0,
                        treatment_level: dischargeSeawaterLevel || null,
                    },
                    third_party: {
                        no_treatment_kl: Number(dischargeThirdPartyNoTreatment) || 0,
                        with_treatment_kl: Number(dischargeThirdPartyWithTreatment) || 0,
                        treatment_level: dischargeThirdPartyLevel || null,
                    },
                    others: {
                        no_treatment_kl: Number(dischargeOthersNoTreatment) || 0,
                        with_treatment_kl: Number(dischargeOthersWithTreatment) || 0,
                        treatment_level: dischargeOthersLevel || null,
                    },
                },
                total_water_consumption_kl: totalWater ? Number(totalWater) : null,
            });
            onClose();
        } catch (err) {
            console.error("Failed to download report:", err);
            setError("Download failed. Please check inputs and try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const isFormValid = fyLabel.trim() !== "" && turnover.trim() !== "" && !isDownloading;

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
                <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 shrink-0 bg-white">
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-50"
                        aria-label="Close dialog">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans text-body-md text-on-surface bg-white">
                    {/* General Parameters */}
                    <div className="border-b border-outline-variant/60 pb-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">General Parameters</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="fy-label" className="text-xs font-semibold text-on-surface-variant">
                                    Financial Year Label <span className="text-error">*</span>
                                </label>
                                <input
                                    id="fy-label"
                                    type="text"
                                    placeholder="e.g. FY 2025-26"
                                    value={fyLabel}
                                    onChange={(e) => setFyLabel(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

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
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Water Withdrawal by Source */}
                    <div className="border-b border-outline-variant/60 pb-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">
                            Water Source Quantities (kL)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="surface" className="text-xs font-semibold text-on-surface-variant">
                                    Surface Water (kL)
                                </label>
                                <input
                                    id="surface"
                                    type="number"
                                    placeholder="e.g. 2500"
                                    value={surfaceWater}
                                    onChange={(e) => setSurfaceWater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="groundwater" className="text-xs font-semibold text-on-surface-variant">
                                    Groundwater (kL)
                                </label>
                                <input
                                    id="groundwater"
                                    type="number"
                                    placeholder="e.g. 1200"
                                    value={groundwater}
                                    onChange={(e) => setGroundwater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="thirdparty" className="text-xs font-semibold text-on-surface-variant">
                                    Third Party Water (kL)
                                </label>
                                <input
                                    id="thirdparty"
                                    type="number"
                                    placeholder="e.g. 5600"
                                    value={thirdParty}
                                    onChange={(e) => setThirdParty(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="seawater" className="text-xs font-semibold text-on-surface-variant">
                                    Seawater / Desalinated (kL)
                                </label>
                                <input
                                    id="seawater"
                                    type="number"
                                    placeholder="e.g. 2000"
                                    value={seawater}
                                    onChange={(e) => setSeawater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="others" className="text-xs font-semibold text-on-surface-variant">
                                    Others (kL)
                                </label>
                                <input
                                    id="others"
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={others}
                                    onChange={(e) => setOthers(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="total-water" className="text-xs font-semibold text-on-surface-variant">
                                    Total Water Consumption (kL)
                                </label>
                                <input
                                    id="total-water"
                                    type="number"
                                    placeholder="e.g. 11800"
                                    value={totalWater}
                                    onChange={(e) => setTotalWater(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-primary/40 bg-white px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Water Discharge by Destination */}
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">
                            Water Discharge by Destination (kL)
                        </span>
                        <div className="space-y-3">
                            {[
                                { key: "Surface Water", no: dischargeSurfaceNoTreatment, setNo: setDischargeSurfaceNoTreatment, with: dischargeSurfaceWithTreatment, setWith: setDischargeSurfaceWithTreatment, lvl: dischargeSurfaceLevel, setLvl: setDischargeSurfaceLevel },
                                { key: "Groundwater", no: dischargeGroundNoTreatment, setNo: setDischargeGroundNoTreatment, with: dischargeGroundWithTreatment, setWith: setDischargeGroundWithTreatment, lvl: dischargeGroundLevel, setLvl: setDischargeGroundLevel },
                                { key: "Seawater", no: dischargeSeawaterNoTreatment, setNo: setDischargeSeawaterNoTreatment, with: dischargeSeawaterWithTreatment, setWith: setDischargeSeawaterWithTreatment, lvl: dischargeSeawaterLevel, setLvl: setDischargeSeawaterLevel },
                                { key: "Third Party Water", no: dischargeThirdPartyNoTreatment, setNo: setDischargeThirdPartyNoTreatment, with: dischargeThirdPartyWithTreatment, setWith: setDischargeThirdPartyWithTreatment, lvl: dischargeThirdPartyLevel, setLvl: setDischargeThirdPartyLevel },
                                { key: "Others", no: dischargeOthersNoTreatment, setNo: setDischargeOthersNoTreatment, with: dischargeOthersWithTreatment, setWith: setDischargeOthersWithTreatment, lvl: dischargeOthersLevel, setLvl: setDischargeOthersLevel },
                            ].map((dest) => (
                                <div key={dest.key} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center border border-outline-variant/40 p-3 rounded-xl bg-surface-container-lowest">
                                    <span className="text-xs font-bold text-on-surface-variant">{dest.key}</span>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-on-surface-variant block">No Treatment (kL)</label>
                                        <input
                                            type="number"
                                            value={dest.no}
                                            onChange={(e) => dest.setNo(e.target.value)}
                                            disabled={isDownloading}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-on-surface-variant block">With Treatment (kL)</label>
                                        <input
                                            type="number"
                                            value={dest.with}
                                            onChange={(e) => dest.setWith(e.target.value)}
                                            disabled={isDownloading}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-on-surface-variant block">Treatment Level</label>
                                        <input
                                            type="text"
                                            value={dest.lvl}
                                            onChange={(e) => dest.setLvl(e.target.value)}
                                            disabled={isDownloading}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                            placeholder="e.g. Primary, RO"
                                        />
                                    </div>
                                </div>
                            ))}
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
