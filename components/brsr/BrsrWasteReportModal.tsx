"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrWasteDisclosurePayload } from "@/lib/brsr/types";

type BrsrWasteReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (payload: BrsrWasteDisclosurePayload) => Promise<void>;
};

export function BrsrWasteReportModal({ isOpen, onClose, onDownload }: BrsrWasteReportModalProps) {
    const [fyLabel, setFyLabel] = useState("");
    const [turnover, setTurnover] = useState("");
    const [physicalOutputTonnes, setPhysicalOutputTonnes] = useState("");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("");

    const [plastic, setPlastic] = useState("");
    const [ewaste, setEwaste] = useState("");
    const [bioMedical, setBioMedical] = useState("");
    const [construction, setConstruction] = useState("");
    const [battery, setBattery] = useState("");
    const [radioactive, setRadioactive] = useState("");
    const [otherHazardous, setOtherHazardous] = useState("");
    const [flyAsh, setFlyAsh] = useState("");
    const [nonHazardousSolid, setNonHazardousSolid] = useState("");
    
    const [recycled, setRecycled] = useState("");
    const [reused, setReused] = useState("");
    const [otherRecovery, setOtherRecovery] = useState("");
    
    const [incineration, setIncineration] = useState("");
    const [landfilling, setLandfilling] = useState("");
    const [otherDisposal, setOtherDisposal] = useState("");

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
                physical_output_tonnes: Number(physicalOutputTonnes) || 0,
                physical_output_unit: physicalOutputUnit || undefined,
                plastic_waste_tonne: Number(plastic) || 0,
                ewaste_tonne: Number(ewaste) || 0,
                bio_medical_waste_tonne: Number(bioMedical) || 0,
                construction_and_demolition_waste_tonne: Number(construction) || 0,
                battery_waste_tonne: Number(battery) || 0,
                radioactive_waste_tonne: Number(radioactive) || 0,
                other_hazardous_waste_tonne: Number(otherHazardous) || 0,
                fly_ash_tonne: Number(flyAsh) || 0,
                non_hazardous_solid_waste_tonne: Number(nonHazardousSolid) || 0,
                recycled_tonne: Number(recycled) || 0,
                reused_tonne: Number(reused) || 0,
                other_recovery_tonne: Number(otherRecovery) || 0,
                incineration_tonne: Number(incineration) || 0,
                landfilling_tonne: Number(landfilling) || 0,
                other_disposal_tonne: Number(otherDisposal) || 0,
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
                            Download BRSR Waste Report
                        </h2>
                        <p className="text-body-sm text-on-surface-variant">
                            Manually enter all waste metrics to export the XLSX report.
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
                <div className="p-6 space-y-5 overflow-y-auto flex-1 font-sans text-body-md text-on-surface bg-white">
                    
                    {/* General Information */}
                    <div className="space-y-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                            General Parameters
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="modal-fy" className="text-xs font-semibold text-on-surface-variant">
                                    Financial Year Label <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-fy"
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
                                    placeholder="e.g. 100000000"
                                    value={turnover}
                                    onChange={(e) => setTurnover(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-physical-output" className="text-xs font-semibold text-on-surface-variant">
                                    Physical Output (Tonnes)
                                </label>
                                <input
                                    id="modal-physical-output"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 200"
                                    value={physicalOutputTonnes}
                                    onChange={(e) => setPhysicalOutputTonnes(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-physical-unit" className="text-xs font-semibold text-on-surface-variant">
                                    Output Unit
                                </label>
                                <input
                                    id="modal-physical-unit"
                                    type="text"
                                    placeholder="e.g. tonnes, pcs"
                                    value={physicalOutputUnit}
                                    onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Waste Generation */}
                    <div className="border-t border-outline-variant/60 pt-4 space-y-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                            Waste Generation Tonnage (Tonnes)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="modal-plastic" className="text-xs font-semibold text-on-surface-variant">
                                    Plastic Waste
                                 </label>
                                <input
                                    id="modal-plastic"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 591.05"
                                    value={plastic}
                                    onChange={(e) => setPlastic(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-ewaste" className="text-xs font-semibold text-on-surface-variant">
                                    E-waste
                                </label>
                                <input
                                    id="modal-ewaste"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 155.02"
                                    value={ewaste}
                                    onChange={(e) => setEwaste(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-biomed" className="text-xs font-semibold text-on-surface-variant">
                                    Bio-medical Waste
                                </label>
                                <input
                                    id="modal-biomed"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.1958"
                                    value={bioMedical}
                                    onChange={(e) => setBioMedical(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-construction" className="text-xs font-semibold text-on-surface-variant">
                                    Construction/Demolition
                                </label>
                                <input
                                    id="modal-construction"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={construction}
                                    onChange={(e) => setConstruction(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-battery" className="text-xs font-semibold text-on-surface-variant">
                                    Battery Waste
                                </label>
                                <input
                                    id="modal-battery"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 158.57"
                                    value={battery}
                                    onChange={(e) => setBattery(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-radioactive" className="text-xs font-semibold text-on-surface-variant">
                                    Radioactive Waste
                                </label>
                                <input
                                    id="modal-radioactive"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={radioactive}
                                    onChange={(e) => setRadioactive(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-hazardous" className="text-xs font-semibold text-on-surface-variant">
                                    Other Hazardous Waste
                                </label>
                                <input
                                    id="modal-hazardous"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 1548.148181"
                                    value={otherHazardous}
                                    onChange={(e) => setOtherHazardous(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-flyash" className="text-xs font-semibold text-on-surface-variant">
                                    Fly Ash
                                </label>
                                <input
                                    id="modal-flyash"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={flyAsh}
                                    onChange={(e) => setFlyAsh(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-1">
                                <label htmlFor="modal-solid" className="text-xs font-semibold text-on-surface-variant">
                                    Non-hazardous Solid
                                </label>
                                <input
                                    id="modal-solid"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={nonHazardousSolid}
                                    onChange={(e) => setNonHazardousSolid(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Waste Recovery / Treatment */}
                    <div className="border-t border-outline-variant/60 pt-4 space-y-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                            Waste Recovery & Treatment Tonnage (Tonnes)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="modal-recycled" className="text-xs font-semibold text-on-surface-variant">
                                    Recycled Waste <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-recycled"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 16546749.84"
                                    value={recycled}
                                    onChange={(e) => setRecycled(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-reused" className="text-xs font-semibold text-on-surface-variant">
                                    Reused Waste <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-reused"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={reused}
                                    onChange={(e) => setReused(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-recovery" className="text-xs font-semibold text-on-surface-variant">
                                    Other Recovery <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-recovery"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={otherRecovery}
                                    onChange={(e) => setOtherRecovery(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-incin" className="text-xs font-semibold text-on-surface-variant">
                                    Incineration <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-incin"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 154.02"
                                    value={incineration}
                                    onChange={(e) => setIncineration(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-landfill" className="text-xs font-semibold text-on-surface-variant">
                                    Landfilling <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-landfill"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 3221.835"
                                    value={landfilling}
                                    onChange={(e) => setLandfilling(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="modal-disposal" className="text-xs font-semibold text-on-surface-variant">
                                    Other Disposal <span className="text-error">*</span>
                                </label>
                                <input
                                    id="modal-disposal"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 0.0"
                                    value={otherDisposal}
                                    onChange={(e) => setOtherDisposal(e.target.value)}
                                    disabled={isDownloading}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
