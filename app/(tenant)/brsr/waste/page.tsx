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
    // General parameters
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

    // Active payload initialized with demonstration data
    const [activePayload, setActivePayload] = useState<BrsrWasteDisclosurePayload>({
        financial_year_label: "FY 2025-26",
        turnover_inr: 1000000.0,
        physical_output_tonnes: 100.0,
        physical_output_unit: "tcs",
        plastic_waste_tonne: 10.0,
        ewaste_tonne: 5.0,
        bio_medical_waste_tonne: 2.0,
        construction_and_demolition_waste_tonne: 1.0,
        battery_waste_tonne: 0.5,
        radioactive_waste_tonne: 0.0,
        other_hazardous_waste_tonne: 1.5,
        fly_ash_tonne: 15.0,
        non_hazardous_solid_waste_tonne: 5.0,
        recycled_tonne: 8.0,
        reused_tonne: 4.0,
        other_recovery_tonne: 2.0,
        incineration_tonne: 3.0,
        landfilling_tonne: 2.0,
        other_disposal_tonne: 1.0,
    });

    const { data, isPending, isError, error } = useBrsrWasteDisclosure(activePayload);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel || "FY 2025-26",
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
        a.download = `brsr-waste-report-${(payload.financial_year_label || "2025").replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatTonne = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const { totals } = data || {};
    const totalGen = Number(totals?.total_waste_tonne) || 0;
    const totalRec = Number(totals?.total_recovered_tonne) || 0;
    const totalDisp = Number(totals?.total_disposed_tonne) || 0;

    const recoveryRate = totalGen > 0 ? (totalRec / totalGen) * 100 : 0;
    const disposalRate = totalGen > 0 ? (totalDisp / totalGen) * 100 : 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="md">
                            SEBI BRSR • Principle 6
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">
                            {data?.financial_year_label || "FY 2025-26"}
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Waste Disclosure & Management
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Principle 6 (Environmental Performance) waste generation, circular economy recovery, disposal & intensity metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Waste Controls"}</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 shadow-md">
                        <MaterialIcon name="download" size="sm" />
                        <span>Download</span>
                    </Button>
                </div>
            </div>

            {/* Inputs & Parameters settings */}
            {isFilterOpen && (
                <Card>
                    <CardHeader tone="strip" className="py-2.5 bg-white">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Waste Parameter Entry & Settings
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {/* General Parameters */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                General Info
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="fy-lbl" className="text-xs font-semibold text-on-surface-variant block">
                                        FY Label <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="fy-lbl"
                                        type="text"
                                        placeholder="e.g. FY 2025-26"
                                        value={fyLabel}
                                        onChange={(e) => setFyLabel(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="turnover-in" className="text-xs font-semibold text-on-surface-variant block">
                                        Turnover (INR) <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="turnover-in"
                                        type="number"
                                        placeholder="e.g. 1000000"
                                        value={turnover}
                                        onChange={(e) => setTurnover(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="output-in" className="text-xs font-semibold text-on-surface-variant block">
                                        Physical Output <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="output-in"
                                        type="number"
                                        placeholder="e.g. 200"
                                        value={physicalOutput}
                                        onChange={(e) => setPhysicalOutput(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="physical-unit-in" className="text-xs font-semibold text-on-surface-variant block">
                                        Output Unit
                                    </label>
                                    <input
                                        id="physical-unit-in"
                                        type="text"
                                        placeholder="e.g. tonnes, pcs"
                                        value={physicalOutputUnit}
                                        onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Waste Generation */}
                        <div className="border-t border-outline-variant/60 pt-4 space-y-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                Waste Generation (Tonnes)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Plastic Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={plastic}
                                        onChange={(e) => setPlastic(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">E-Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={ewaste}
                                        onChange={(e) => setEwaste(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Bio-Medical Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={bioMedical}
                                        onChange={(e) => setBioMedical(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Construction & Demolition</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={construction}
                                        onChange={(e) => setConstruction(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Battery Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={battery}
                                        onChange={(e) => setBattery(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Radioactive Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={radioactive}
                                        onChange={(e) => setRadioactive(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Other Hazardous Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={otherHazardous}
                                        onChange={(e) => setOtherHazardous(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Fly Ash</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={flyAsh}
                                        onChange={(e) => setFlyAsh(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">Non-Hazardous Solid Waste</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={nonHazardousSolid}
                                        onChange={(e) => setNonHazardousSolid(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recovery & Disposal Inputs */}
                        <div className="border-t border-outline-variant/60 pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Recovery */}
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                                        Waste Recovery (Tonnes)
                                    </span>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Recycled</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={recycled}
                                                onChange={(e) => setRecycled(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Reused</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={reused}
                                                onChange={(e) => setReused(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Other Recovery</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={otherRecovery}
                                                onChange={(e) => setOtherRecovery(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Disposal */}
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                                        Waste Disposal (Tonnes)
                                    </span>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Incineration</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={incineration}
                                                onChange={(e) => setIncineration(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Landfilling</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={landfilling}
                                                onChange={(e) => setLandfilling(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">Other Disposal</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={otherDisposal}
                                                onChange={(e) => setOtherDisposal(e.target.value)}
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface text-[12px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                            <Button variant="secondary" size="md" onClick={handleReset} disabled={isPending}>
                                Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="flex items-center gap-2">
                                <MaterialIcon name="refresh" size="sm" />
                                Generate Waste Metrics
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Content Loading State */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Waste Disclosure Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please enter the Financial Year, Turnover, and waste quantities in the controls panel above, then click Generate Waste Metrics to view full audit data.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating waste metrics...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error">
                    <MaterialIcon name="warning" className="mx-auto mb-2" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate waste disclosure."}</p>
                </div>
            ) : (
                totals && (
                    <>
                        {/* 4-Card Overview Metrics Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* 1. Total Generated */}
                            <Card interactive className="border-l-4 border-l-red-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Total Waste Generated
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                                            <MaterialIcon name="delete_sweep" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-primary">
                                                {formatTonne(totals.total_waste_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1">
                                            Hazardous & non-hazardous streams
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 2. Total Recovered */}
                            <Card interactive className="border-l-4 border-l-emerald-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Total Waste Recovered
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                            <MaterialIcon name="recycling" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-emerald-600">
                                                {formatTonne(totals.total_recovered_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1">
                                            {recoveryRate.toFixed(1)}% Circular Recovery Rate
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 3. Total Disposed */}
                            <Card interactive className="border-l-4 border-l-amber-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Total Disposed
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                            <MaterialIcon name="delete_outline" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-amber-600">
                                                {formatTonne(totals.total_disposed_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1">
                                            {disposalRate.toFixed(1)}% Landfilled / Incinerated
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 4. Waste Intensity */}
                            <Card interactive className="border-l-4 border-l-indigo-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Waste Intensity / INR
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                            <MaterialIcon name="trending_up" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-headline-md font-bold text-indigo-600">
                                            {Number(totals.waste_intensity_per_inr).toFixed(8)}
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1">
                                            tonnes per ₹{Number(data.turnover_inr).toLocaleString()} turnover
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Generation Breakdown Grid (Hazardous vs Non-Hazardous) */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="delete_sweep" size="sm" className="text-red-500" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Waste Generation Streams Breakdown
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Hazardous & Non-Hazardous waste generation volumes (tonnes)
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="active" size="md">
                                    {formatTonne(totals.total_waste_tonne)} tonnes Total
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Hazardous Waste Stream */}
                                    <div className="space-y-4">
                                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                                            Hazardous Waste Streams
                                        </span>
                                        <WasteStreamRow label="Plastic Waste" val={totals.plastic_waste_tonne} total={totalGen} color="#ef4444" />
                                        <WasteStreamRow label="E-Waste" val={totals.ewaste_tonne} total={totalGen} color="#f97316" />
                                        <WasteStreamRow label="Bio-Medical Waste" val={totals.bio_medical_waste_tonne} total={totalGen} color="#eab308" />
                                        <WasteStreamRow label="Construction & Demolition" val={totals.construction_and_demolition_waste_tonne} total={totalGen} color="#84cc16" />
                                        <WasteStreamRow label="Battery Waste" val={totals.battery_waste_tonne} total={totalGen} color="#06b6d4" />
                                        <WasteStreamRow label="Radioactive Waste" val={totals.radioactive_waste_tonne} total={totalGen} color="#8b5cf6" />
                                        <WasteStreamRow label="Other Hazardous Waste" val={totals.other_hazardous_waste_tonne} total={totalGen} color="#ec4899" />
                                    </div>

                                    {/* Non-Hazardous Waste Stream */}
                                    <div className="space-y-4">
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                                            Non-Hazardous Waste Streams
                                        </span>
                                        <WasteStreamRow label="Fly Ash Waste" val={totals.fly_ash_tonne} total={totalGen} color="#10b981" />
                                        <WasteStreamRow label="Non-Hazardous Solid Waste" val={totals.non_hazardous_solid_waste_tonne} total={totalGen} color="#14b8a6" />
                                        <WasteStreamRow label="Other Non-Hazardous Waste" val={totals.other_non_hazardous_waste_tonne} total={totalGen} color="#64748b" />

                                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-primary">Total Waste Generation</span>
                                                <span className="font-mono text-base font-bold text-primary">
                                                    {formatTonne(totals.total_waste_tonne)} <span className="text-xs font-sans font-normal text-on-surface-variant">t</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Recovery & Disposal Mass Balance Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Circular Recovery Card */}
                            <Card>
                                <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="recycling" size="sm" className="text-emerald-500" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Circular Economy Recovery
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Recycled, Reused & Recovered waste (tonnes)
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="positive" size="sm">
                                        {recoveryRate.toFixed(1)}% Recovered
                                    </Badge>
                                </CardHeader>
                                <CardBody className="p-card-padding space-y-4">
                                    <WasteStreamRow label="Recycled Waste" val={totals.recycled_tonne} total={totalGen} color="#10b981" />
                                    <WasteStreamRow label="Reused Waste" val={totals.reused_tonne} total={totalGen} color="#059669" />
                                    <WasteStreamRow label="Other Recovery Methods" val={totals.other_recovery_tonne} total={totalGen} color="#047857" />

                                    <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 mt-2">
                                        <span className="text-sm font-bold text-emerald-900">Total Waste Recovered</span>
                                        <span className="font-mono text-base font-bold text-emerald-900">
                                            {formatTonne(totals.total_recovered_tonne)} <span className="text-xs font-sans font-normal">t</span>
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Final Disposal Card */}
                            <Card>
                                <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="delete_outline" size="sm" className="text-amber-500" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Final Waste Disposal
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Incinerated, Landfilled & Disposed waste (tonnes)
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="neutral" size="sm">
                                        {disposalRate.toFixed(1)}% Disposed
                                    </Badge>
                                </CardHeader>
                                <CardBody className="p-card-padding space-y-4">
                                    <WasteStreamRow label="Incineration" val={totals.incineration_tonne} total={totalGen} color="#f59e0b" />
                                    <WasteStreamRow label="Landfilling" val={totals.landfilling_tonne} total={totalGen} color="#d97706" />
                                    <WasteStreamRow label="Other Disposal Methods" val={totals.other_disposal_tonne} total={totalGen} color="#b45309" />

                                    <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 mt-2">
                                        <span className="text-sm font-bold text-amber-900">Total Waste Disposed</span>
                                        <span className="font-mono text-base font-bold text-amber-900">
                                            {formatTonne(totals.total_disposed_tonne)} <span className="text-xs font-sans font-normal">t</span>
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                )
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

function WasteStreamRow({
    label,
    val,
    total,
    color,
}: {
    label: string;
    val: string | number;
    total: number;
    color: string;
}) {
    const num = Number(val) || 0;
    const share = total > 0 ? (num / total) * 100 : 0;

    return (
        <div className="space-y-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 transition-colors hover:border-outline-variant">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">{label}</span>
                <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-sm font-bold text-primary">
                        {num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">t</span>
                    <span className="ml-1.5 rounded bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold text-on-surface">
                        {share.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${Math.min(Math.max(share, 0), 100)}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
}
