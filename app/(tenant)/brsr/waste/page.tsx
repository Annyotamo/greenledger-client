"use client";

import { useState } from "react";
import { useBrsrWasteDisclosure } from "@/lib/brsr/hooks";
import { postBrsrWasteReport } from "@/lib/brsr/api";
import { BrsrWasteReportModal } from "@/components/brsr/BrsrWasteReportModal";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrWasteDisclosurePayload } from "@/lib/brsr/types";

export default function BrsrWastePage() {
    // General parameters (empty initially)
    const [fyLabel, setFyLabel] = useState("");
    const [turnover, setTurnover] = useState("");
    const [physicalOutput, setPhysicalOutput] = useState("");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("");

    // Waste generation
    const [plastic, setPlastic] = useState("");
    const [ewaste, setEwaste] = useState("");
    const [bioMedical, setBioMedical] = useState("");
    const [construction, setConstruction] = useState("");
    const [battery, setBattery] = useState("");
    const [radioactive, setRadioactive] = useState("");
    const [otherHazardous, setOtherHazardous] = useState("");
    const [flyAsh, setFlyAsh] = useState("");
    const [nonHazardousSolid, setNonHazardousSolid] = useState("");

    // Waste recovery
    const [recycled, setRecycled] = useState("");
    const [reused, setReused] = useState("");
    const [otherRecovery, setOtherRecovery] = useState("");

    // Waste disposal
    const [incineration, setIncineration] = useState("");
    const [landfilling, setLandfilling] = useState("");
    const [otherDisposal, setOtherDisposal] = useState("");

    // Payload for query caching initialized with dummy data
    const [activePayload, setActivePayload] = useState<BrsrWasteDisclosurePayload>({
        financial_year_label: "FY 2025-26",
        turnover_inr: 1000000.00,
        physical_output_tonnes: 100.00,
        physical_output_unit: "tcs",
        plastic_waste_tonne: 10.00,
        ewaste_tonne: 5.00,
        bio_medical_waste_tonne: 2.00,
        construction_and_demolition_waste_tonne: 1.00,
        battery_waste_tonne: 0.50,
        radioactive_waste_tonne: 0.00,
        other_hazardous_waste_tonne: 1.50,
        fly_ash_tonne: 15.00,
        non_hazardous_solid_waste_tonne: 5.00,
        recycled_tonne: 8.00,
        reused_tonne: 4.00,
        other_recovery_tonne: 2.00,
        incineration_tonne: 3.00,
        landfilling_tonne: 2.00,
        other_disposal_tonne: 1.00,
    });

    const { data, isPending, isError, error } = useBrsrWasteDisclosure(activePayload);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsed by default

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel,
            turnover_inr: Number(turnover) || 0,
            physical_output_tonnes: Number(physicalOutput) || 0,
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
    };

    const handleReset = () => {
        setFyLabel("");
        setTurnover("");
        setPhysicalOutput("");
        setPhysicalOutputUnit("");
        setPlastic("");
        setEwaste("");
        setBioMedical("");
        setConstruction("");
        setBattery("");
        setRadioactive("");
        setOtherHazardous("");
        setFlyAsh("");
        setNonHazardousSolid("");
        setRecycled("");
        setReused("");
        setOtherRecovery("");
        setIncineration("");
        setLandfilling("");
        setOtherDisposal("");

        setActivePayload({
            financial_year_label: "",
            turnover_inr: 0,
            physical_output_tonnes: 0,
            plastic_waste_tonne: 0,
            ewaste_tonne: 0,
            bio_medical_waste_tonne: 0,
            construction_and_demolition_waste_tonne: 0,
            battery_waste_tonne: 0,
            radioactive_waste_tonne: 0,
            other_hazardous_waste_tonne: 0,
            recycled_tonne: 0,
            reused_tonne: 0,
            other_recovery_tonne: 0,
            incineration_tonne: 0,
            landfilling_tonne: 0,
            other_disposal_tonne: 0,
        });
    };

    const handleDownloadReport = async (payload: BrsrWasteDisclosurePayload) => {
        const blob = await postBrsrWasteReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-waste-report-${payload.financial_year_label.replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatTonne = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                        BRSR Waste Management
                    </h1>
                    <p className="text-body-md text-on-surface-variant">
                        Principle 6 (Environmental Performance) waste generation, treatment, recovery, and intensity indicators.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "filter_alt"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Waste Controls"}</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 shadow-md">
                        <MaterialIcon name="download" size="sm" />
                        <span>Download Report</span>
                    </Button>
                </div>
            </div>

            {/* Inputs & Parameters settings */}
            {isFilterOpen && (
            <Card>
                <CardHeader tone="strip" className="py-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="tune" size="sm" className="text-primary" />
                        <span className="font-sans text-body-sm font-bold text-on-surface">Waste Parametric Controls</span>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* General Parameters */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wider block">
                            General Info
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="fy-lbl" className="text-xs font-semibold text-on-surface-variant block">FY Label <span className="text-error">*</span></label>
                                <input
                                    id="fy-lbl"
                                    type="text"
                                    placeholder="e.g. FY 2025-26"
                                    value={fyLabel}
                                    onChange={(e) => setFyLabel(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="turnover-in" className="text-xs font-semibold text-on-surface-variant block">Turnover (INR) <span className="text-error">*</span></label>
                                <input
                                    id="turnover-in"
                                    type="number"
                                    placeholder="e.g. 1000000"
                                    value={turnover}
                                    onChange={(e) => setTurnover(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="output-in" className="text-xs font-semibold text-on-surface-variant block">Physical Output <span className="text-error">*</span></label>
                                <input
                                    id="output-in"
                                    type="number"
                                    placeholder="e.g. 200"
                                    value={physicalOutput}
                                    onChange={(e) => setPhysicalOutput(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="physical-unit-in" className="text-xs font-semibold text-on-surface-variant block">Output Unit</label>
                                <input
                                    id="physical-unit-in"
                                    type="text"
                                    placeholder="e.g. tonnes, pcs"
                                    value={physicalOutputUnit}
                                    onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Waste Generation */}
                    <div className="border-t border-outline-variant/60 pt-4 space-y-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wider block">
                            Waste Generation (Tonnes)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="plastic-in" className="text-xs font-semibold text-on-surface-variant block">Plastic</label>
                                <input
                                    id="plastic-in"
                                    type="number"
                                    value={plastic}
                                    onChange={(e) => setPlastic(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="ewaste-in" className="text-xs font-semibold text-on-surface-variant block">E-waste</label>
                                <input
                                    id="ewaste-in"
                                    type="number"
                                    value={ewaste}
                                    onChange={(e) => setEwaste(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="biomed-in" className="text-xs font-semibold text-on-surface-variant block">Bio-medical</label>
                                <input
                                    id="biomed-in"
                                    type="number"
                                    value={bioMedical}
                                    onChange={(e) => setBioMedical(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="construct-in" className="text-xs font-semibold text-on-surface-variant block">Construction</label>
                                <input
                                    id="construct-in"
                                    type="number"
                                    value={construction}
                                    onChange={(e) => setConstruction(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="battery-in" className="text-xs font-semibold text-on-surface-variant block">Battery</label>
                                <input
                                    id="battery-in"
                                    type="number"
                                    value={battery}
                                    onChange={(e) => setBattery(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="radio-in" className="text-xs font-semibold text-on-surface-variant block">Radioactive</label>
                                <input
                                    id="radio-in"
                                    type="number"
                                    value={radioactive}
                                    onChange={(e) => setRadioactive(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="haz-in" className="text-xs font-semibold text-on-surface-variant block">Other Hazardous</label>
                                <input
                                    id="haz-in"
                                    type="number"
                                    value={otherHazardous}
                                    onChange={(e) => setOtherHazardous(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="fly-ash-in" className="text-xs font-semibold text-on-surface-variant block">Fly Ash</label>
                                <input
                                    id="fly-ash-in"
                                    type="number"
                                    value={flyAsh}
                                    onChange={(e) => setFlyAsh(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <label htmlFor="solid-waste-in" className="text-xs font-semibold text-on-surface-variant block">Non-hazardous Solid</label>
                                <input
                                    id="solid-waste-in"
                                    type="number"
                                    value={nonHazardousSolid}
                                    onChange={(e) => setNonHazardousSolid(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Waste Recovery & Treatment */}
                    <div className="border-t border-outline-variant/60 pt-4 space-y-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wider block">
                            Waste Treatment & Recovery (Tonnes)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="recycled-in" className="text-xs font-semibold text-on-surface-variant block">Recycled</label>
                                <input
                                    id="recycled-in"
                                    type="number"
                                    value={recycled}
                                    onChange={(e) => setRecycled(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="reused-in" className="text-xs font-semibold text-on-surface-variant block">Reused</label>
                                <input
                                    id="reused-in"
                                    type="number"
                                    value={reused}
                                    onChange={(e) => setReused(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="recovery-in" className="text-xs font-semibold text-on-surface-variant block">Other Recovery</label>
                                <input
                                    id="recovery-in"
                                    type="number"
                                    value={otherRecovery}
                                    onChange={(e) => setOtherRecovery(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="incin-in" className="text-xs font-semibold text-on-surface-variant block">Incineration</label>
                                <input
                                    id="incin-in"
                                    type="number"
                                    value={incineration}
                                    onChange={(e) => setIncineration(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="landfill-in" className="text-xs font-semibold text-on-surface-variant block">Landfilling</label>
                                <input
                                    id="landfill-in"
                                    type="number"
                                    value={landfilling}
                                    onChange={(e) => setLandfilling(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                            <div className="space-y-1 col-span-1 sm:col-span-2">
                                <label htmlFor="disposal-in" className="text-xs font-semibold text-on-surface-variant block">Other Disposal</label>
                                <input
                                    id="disposal-in"
                                    type="number"
                                    value={otherDisposal}
                                    onChange={(e) => setOtherDisposal(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleReset}
                            disabled={isPending}>
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleGenerate}
                            disabled={isPending}
                            className="flex items-center gap-2">
                            <MaterialIcon name="refresh" size="sm" />
                            Generate Metrics
                        </Button>
                    </div>
                </CardBody>
            </Card>
            )}

            {/* Content Display */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Waste Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please specify the Financial Year, Turnover, and waste quantities in the panel above, then click Generate Metrics to calculate waste totals and intensity ratios.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating waste metrics...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error shadow-sm">
                    <MaterialIcon name="warning" className="mx-auto mb-2 text-error" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate waste metrics."}</p>
                </div>
            ) : (
                <>
                    {/* Status Info Bar */}
                    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/30 text-on-secondary-container">
                                <MaterialIcon name="delete_sweep" size="lg" />
                            </div>
                            <div>
                                <span className="font-sans text-body-lg font-bold text-on-surface">
                                    Waste Management Disclosure Status
                                </span>
                                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                                    Active Financial Year: {data.financial_year_label}
                                </p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right font-mono text-[11px] text-on-surface-variant opacity-80">
                            <p>Status: Calculated successfully</p>
                        </div>
                    </div>

                    {/* Overall Metrics Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Total Generated */}
                        <Card interactive className="border-l-4 border-l-red-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Waste Generated
                                    </p>
                                    <h3 className="text-lg font-bold text-on-surface font-mono">
                                        {formatTonne(data.totals.total_waste_tonne)} <span className="text-[10px] font-sans font-medium text-on-surface-variant">t</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">Total waste output</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                                    <MaterialIcon name="delete" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Total Recovered */}
                        <Card interactive className="border-l-4 border-l-emerald-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Recovered
                                    </p>
                                    <h3 className="text-lg font-bold text-emerald-600 font-mono">
                                        {formatTonne(data.totals.total_recovered_tonne)} <span className="text-[10px] font-sans font-medium text-on-surface-variant">t</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">Recycled/Reused</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <MaterialIcon name="recycling" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Total Disposed */}
                        <Card interactive className="border-l-4 border-l-amber-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Disposed
                                    </p>
                                    <h3 className="text-lg font-bold text-amber-600 font-mono">
                                        {formatTonne(data.totals.total_disposed_tonne)} <span className="text-[10px] font-sans font-medium text-on-surface-variant">t</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">Landfilled/Incinerated</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                    <MaterialIcon name="delete_outline" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Intensity / INR */}
                        <Card interactive className="border-l-4 border-l-indigo-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Intensity / Turnover
                                    </p>
                                    <h3 className="text-lg font-bold text-indigo-600 font-mono">
                                        {Number(data.totals.waste_intensity_per_inr).toFixed(8)}
                                        <span className="text-[9px] font-sans font-medium text-on-surface-variant block mt-0.5">tonnes / INR</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">Turnover ratio</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                    <MaterialIcon name="trending_up" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Intensity / Physical Output */}
                        <Card interactive className="border-l-4 border-l-teal-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Intensity / Output
                                    </p>
                                    <h3 className="text-lg font-bold text-teal-600 font-mono">
                                        {Number(data.totals.waste_intensity_per_physical_output).toFixed(4)}
                                        <span className="text-[9px] font-sans font-medium text-on-surface-variant block mt-0.5">t / output t</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">Production ratio</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                                    <MaterialIcon name="scale" size="md" />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Bifurcated Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Generation Breakdown */}
                        <Card>
                            <CardHeader tone="strip" className="bg-white">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="delete_sweep" size="sm" className="text-red-500" />
                                    <span className="font-sans text-body-md font-bold text-on-surface">Waste Generation Breakdown</span>
                                </div>
                                <Badge variant="neutral" size="sm">Sources</Badge>
                            </CardHeader>
                            <CardBody className="space-y-3.5">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">Plastic Waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.plastic_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">E-waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.ewaste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">Bio-medical Waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.bio_medical_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">Construction/Demolition</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.construction_and_demolition_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">Battery Waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.battery_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant">Radioactive Waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.radioactive_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1">
                                    <span className="text-body-sm text-on-surface-variant">Other Hazardous Waste</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.other_hazardous_waste_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Recovery & Disposal Breakdown */}
                        <Card>
                            <CardHeader tone="strip" className="bg-white">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="recycling" size="sm" className="text-emerald-500" />
                                    <span className="font-sans text-body-md font-bold text-on-surface">Waste Treatment & Disposal</span>
                                </div>
                                <Badge variant="positive" size="sm">Methods</Badge>
                            </CardHeader>
                            <CardBody className="space-y-3.5 font-sans">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Recycled</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.recycled_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Reused</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.reused_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Other Recovery</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.other_recovery_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Incineration</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.incineration_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Landfilling</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.landfilling_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Other Disposal</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatTonne(data.totals.other_disposal_tonne)} <span className="text-xs text-on-surface-variant font-sans font-normal">t</span>
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </>
            )}

            {/* Waste report modal picker */}
            <BrsrWasteReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
