"use client";

import { useState } from "react";
import { useBrsrWasteDisclosure } from "@/lib/brsr/hooks";
import { postBrsrWasteReport } from "@/lib/brsr/api";
import { BrsrWasteReportModal } from "@/components/brsr/BrsrWasteReportModal";
import { BrsrDocumentUploadSection } from "@/components/brsr/BrsrDocumentUploadSection";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type {
    BRSRWasteDisclosurePayload,
    BRSRWasteCategoryBreakdown,
    BRSRWasteRecoveryInput,
    BRSRWasteDisposalInput,
} from "@/lib/brsr/types";

// Standard category descriptors aligned with BRSR Principle 6 (A through H)
const WASTE_CATEGORIES = [
    { key: "plastic_waste_tonne", code: "A", label: "Plastic Waste", isHazardous: true },
    { key: "ewaste_tonne", code: "B", label: "E-Waste", isHazardous: true },
    { key: "bio_medical_waste_tonne", code: "C", label: "Bio-Medical Waste", isHazardous: true },
    { key: "construction_and_demolition_waste_tonne", code: "D", label: "Construction & Demolition", isHazardous: true },
    { key: "battery_waste_tonne", code: "E", label: "Battery Waste", isHazardous: true },
    { key: "radioactive_waste_tonne", code: "F", label: "Radioactive Waste", isHazardous: true },
    { key: "other_hazardous_waste_tonne", code: "G", label: "Other Hazardous Waste", isHazardous: true },
    { key: "fly_ash_tonne", code: "H.i", label: "Fly Ash Waste", isHazardous: false },
    { key: "non_hazardous_solid_waste_tonne", code: "H.ii", label: "Non-Hazardous Solid Waste", isHazardous: false },
] as const;

// Initial demonstration payload matching backend schema
const INITIAL_PAYLOAD: BRSRWasteDisclosurePayload = {
    financial_year_label: "FY 2024-25",
    turnover_inr: 50000000.0,
    physical_output_tonnes: 1000.0,
    physical_output_unit: "tonnes",

    // Root-level fields (required for backend validation)
    plastic_waste_tonne: 10.5,
    ewaste_tonne: 2.0,
    bio_medical_waste_tonne: 1.5,
    construction_and_demolition_waste_tonne: 50.0,
    battery_waste_tonne: 0.8,
    radioactive_waste_tonne: 0.0,
    other_hazardous_waste_tonne: 5.2,
    fly_ash_tonne: 100.0,
    non_hazardous_solid_waste_tonne: 30.0,
    recycled_tonne: 100.0,
    reused_tonne: 50.0,
    other_recovery_tonne: 17.1,
    incineration_tonne: 10.0,
    landfilling_tonne: 20.0,
    other_disposal_tonne: 2.9,

    // Nested objects (for 9-category breakdown)
    generation: {
        plastic_waste_tonne: 10.5,
        ewaste_tonne: 2.0,
        bio_medical_waste_tonne: 1.5,
        construction_and_demolition_waste_tonne: 50.0,
        battery_waste_tonne: 0.8,
        radioactive_waste_tonne: 0.0,
        other_hazardous_waste_tonne: 5.2,
        fly_ash_tonne: 100.0,
        non_hazardous_solid_waste_tonne: 30.0,
    },
    recovery: {
        plastic_waste_tonne: 8.0,
        ewaste_tonne: 1.5,
        bio_medical_waste_tonne: 0.0,
        construction_and_demolition_waste_tonne: 40.0,
        battery_waste_tonne: 0.6,
        radioactive_waste_tonne: 0.0,
        other_hazardous_waste_tonne: 2.0,
        fly_ash_tonne: 90.0,
        non_hazardous_solid_waste_tonne: 25.0,
        recycled_tonne: 100.0,
        reused_tonne: 50.0,
        other_recovery_tonne: 17.1,
    },
    disposal: {
        plastic_waste_tonne: 2.5,
        ewaste_tonne: 0.5,
        bio_medical_waste_tonne: 1.5,
        construction_and_demolition_waste_tonne: 10.0,
        battery_waste_tonne: 0.2,
        radioactive_waste_tonne: 0.0,
        other_hazardous_waste_tonne: 3.2,
        fly_ash_tonne: 10.0,
        non_hazardous_solid_waste_tonne: 5.0,
        incineration_tonne: 10.0,
        landfilling_tonne: 20.0,
        other_disposal_tonne: 2.9,
    },
};

const createEmptyBreakdown = (): BRSRWasteCategoryBreakdown => ({
    plastic_waste_tonne: 0,
    ewaste_tonne: 0,
    bio_medical_waste_tonne: 0,
    construction_and_demolition_waste_tonne: 0,
    battery_waste_tonne: 0,
    radioactive_waste_tonne: 0,
    other_hazardous_waste_tonne: 0,
    fly_ash_tonne: 0,
    non_hazardous_solid_waste_tonne: 0,
});

export default function BrsrWastePage() {
    // Form Input States
    const [fyLabel, setFyLabel] = useState("FY 2024-25");
    const [turnover, setTurnover] = useState("50000000");
    const [physicalOutput, setPhysicalOutput] = useState("1000");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("tonnes");

    // Symmetric 9-category stream states
    const [genInputs, setGenInputs] = useState<BRSRWasteCategoryBreakdown>(INITIAL_PAYLOAD.generation);
    const [recInputs, setRecInputs] = useState<BRSRWasteRecoveryInput>(INITIAL_PAYLOAD.recovery);
    const [dispInputs, setDispInputs] = useState<BRSRWasteDisposalInput>(INITIAL_PAYLOAD.disposal);

    // Active payload for API calculation
    const [activePayload, setActivePayload] = useState<BRSRWasteDisclosurePayload>(INITIAL_PAYLOAD);

    // Drawer / Tab Controls
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [activeInputTab, setActiveInputTab] = useState<"general" | "generation" | "recovery" | "disposal">("generation");

    const { data, isPending, isError, error } = useBrsrWasteDisclosure(activePayload);

    // Handlers
    const handleGenFieldChange = (key: keyof BRSRWasteCategoryBreakdown, value: string) => {
        setGenInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    };

    const handleRecFieldChange = (key: keyof BRSRWasteRecoveryInput, value: string) => {
        setRecInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    };

    const handleDispFieldChange = (key: keyof BRSRWasteDisposalInput, value: string) => {
        setDispInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    };

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel.trim() || "FY 2024-25",
            turnover_inr: Number(turnover) || 0,
            physical_output_tonnes: Number(physicalOutput) || 0,
            physical_output_unit: physicalOutputUnit.trim() || "tonnes",

            // Root-level fields (required for backend validation)
            plastic_waste_tonne: genInputs.plastic_waste_tonne ?? 0,
            ewaste_tonne: genInputs.ewaste_tonne ?? 0,
            bio_medical_waste_tonne: genInputs.bio_medical_waste_tonne ?? 0,
            construction_and_demolition_waste_tonne: genInputs.construction_and_demolition_waste_tonne ?? 0,
            battery_waste_tonne: genInputs.battery_waste_tonne ?? 0,
            radioactive_waste_tonne: genInputs.radioactive_waste_tonne ?? 0,
            other_hazardous_waste_tonne: genInputs.other_hazardous_waste_tonne ?? 0,
            fly_ash_tonne: genInputs.fly_ash_tonne ?? 0,
            non_hazardous_solid_waste_tonne: genInputs.non_hazardous_solid_waste_tonne ?? 0,
            recycled_tonne: recInputs.recycled_tonne ?? 0,
            reused_tonne: recInputs.reused_tonne ?? 0,
            other_recovery_tonne: recInputs.other_recovery_tonne ?? 0,
            incineration_tonne: dispInputs.incineration_tonne ?? 0,
            landfilling_tonne: dispInputs.landfilling_tonne ?? 0,
            other_disposal_tonne: dispInputs.other_disposal_tonne ?? 0,

            // Nested objects
            generation: genInputs,
            recovery: recInputs,
            disposal: dispInputs,
        });
    };

    const handleReset = () => {
        setFyLabel("");
        setTurnover("");
        setPhysicalOutput("");
        setPhysicalOutputUnit("");

        const empty = createEmptyBreakdown();
        setGenInputs(empty);
        setRecInputs({ ...empty, recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 });
        setDispInputs({ ...empty, incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 });

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
            fly_ash_tonne: 0,
            non_hazardous_solid_waste_tonne: 0,
            recycled_tonne: 0,
            reused_tonne: 0,
            other_recovery_tonne: 0,
            incineration_tonne: 0,
            landfilling_tonne: 0,
            other_disposal_tonne: 0,

            generation: empty,
            recovery: { ...empty, recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
            disposal: { ...empty, incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
        });
    };

    const handleDownloadReport = async (payload: BRSRWasteDisclosurePayload) => {
        const blob = await postBrsrWasteReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-waste-disclosure-report-${(payload.financial_year_label || "2024").replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatTonne = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num)
            ? "0.00"
            : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const { totals } = data || {};
    const totalGen = Number(totals?.total_waste_tonne) || 0;
    const totalRec = Number(totals?.total_recovered_tonne) || 0;
    const totalDisp = Number(totals?.total_disposed_tonne) || 0;

    const recoveryRate = totalGen > 0 ? (totalRec / totalGen) * 100 : 0;
    const disposalRate = totalGen > 0 ? (totalDisp / totalGen) * 100 : 0;

    // Subtotal for other non-hazardous waste (Fly ash + Solid waste)
    const genFlyAsh = Number(totals?.generation?.fly_ash_tonne ?? totals?.fly_ash_tonne) || 0;
    const genSolid = Number(totals?.generation?.non_hazardous_solid_waste_tonne ?? totals?.non_hazardous_solid_waste_tonne) || 0;
    const genOtherNonHaz = totals?.generation?.other_non_hazardous_waste_tonne
        ? Number(totals.generation.other_non_hazardous_waste_tonne)
        : genFlyAsh + genSolid;

    const recFlyAsh = Number(totals?.recovery?.fly_ash_tonne) || 0;
    const recSolid = Number(totals?.recovery?.non_hazardous_solid_waste_tonne) || 0;
    const recOtherNonHaz = totals?.recovery?.other_non_hazardous_waste_tonne
        ? Number(totals.recovery.other_non_hazardous_waste_tonne)
        : recFlyAsh + recSolid;

    const dispFlyAsh = Number(totals?.disposal?.fly_ash_tonne) || 0;
    const dispSolid = Number(totals?.disposal?.non_hazardous_solid_waste_tonne) || 0;
    const dispOtherNonHaz = totals?.disposal?.other_non_hazardous_waste_tonne
        ? Number(totals.disposal.other_non_hazardous_waste_tonne)
        : dispFlyAsh + dispSolid;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up font-sans">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Badge variant="active" size="md">
                            SEBI BRSR • Principle 6
                        </Badge>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-semibold text-slate-700">GRI:</span>
                            <span>Corresponds to GRI 306-3 (generated), 306-4 (recovered), 306-5 (disposed) — Waste 2020</span>
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Waste Disclosure &amp; Management
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Symmetric 9-category breakdown for waste generation, circular economy recovery, and final disposal in accordance with BRSR Principle 6.
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
                        <span>Download Report</span>
                    </Button>
                </div>
            </div>

            {/* Inputs & Parameters Settings Drawer */}
            {isFilterOpen && (
                <Card className="border border-outline-variant shadow-md">
                    <CardHeader tone="strip" className="py-3 bg-slate-50 flex items-center justify-between border-b border-outline-variant/60">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                9-Category Waste Parameter Entry &amp; Configuration
                            </span>
                        </div>
                        {/* Tab Switcher for Controls */}
                        <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveInputTab("general")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    activeInputTab === "general" ? "bg-white text-primary shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                                }`}>
                                General
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveInputTab("generation")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    activeInputTab === "generation" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                                }`}>
                                1. Generation
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveInputTab("recovery")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    activeInputTab === "recovery" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                                }`}>
                                2. Recovery
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveInputTab("disposal")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    activeInputTab === "disposal" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                                }`}>
                                3. Disposal
                            </button>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6 p-6">
                        {/* Tab 1: General Info */}
                        {activeInputTab === "general" && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    General Parameters &amp; Intensities Context
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="fy-lbl" className="text-xs font-semibold text-on-surface-variant block">
                                            FY Label <span className="text-error">*</span>
                                        </label>
                                        <input
                                            id="fy-lbl"
                                            type="text"
                                            placeholder="e.g. FY 2024-25"
                                            value={fyLabel}
                                            onChange={(e) => setFyLabel(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="turnover-in" className="text-xs font-semibold text-on-surface-variant block">
                                            Turnover (INR) <span className="text-error">*</span>
                                        </label>
                                        <input
                                            id="turnover-in"
                                            type="number"
                                            placeholder="e.g. 50000000"
                                            value={turnover}
                                            onChange={(e) => setTurnover(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="output-in" className="text-xs font-semibold text-on-surface-variant block">
                                            Physical Output <span className="text-error">*</span>
                                        </label>
                                        <input
                                            id="output-in"
                                            type="number"
                                            placeholder="e.g. 1000"
                                            value={physicalOutput}
                                            onChange={(e) => setPhysicalOutput(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="physical-unit-in" className="text-xs font-semibold text-on-surface-variant block">
                                            Output Unit
                                        </label>
                                        <input
                                            id="physical-unit-in"
                                            type="text"
                                            placeholder="e.g. tonnes"
                                            value={physicalOutputUnit}
                                            onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Waste Generation (9 Categories) */}
                        {activeInputTab === "generation" && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                                        1. Waste Generation — 9 Categories (Tonnes)
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        Total: {Object.values(genInputs).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2)} t
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                    {WASTE_CATEGORIES.map((cat) => (
                                        <div key={cat.key} className="space-y-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/80">
                                            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                <span>{cat.label}</span>
                                                <span className="font-mono text-[10px] text-slate-400 font-bold">({cat.code})</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={genInputs[cat.key] || ""}
                                                onChange={(e) => handleGenFieldChange(cat.key, e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Waste Recovery (9 Categories + Methods) */}
                        {activeInputTab === "recovery" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                                        2. Waste Recovery — 9 Categories &amp; Methods (Tonnes)
                                    </span>
                                </div>

                                {/* Category Streams in Recovery */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                                        Recovery by Category Stream
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                        {WASTE_CATEGORIES.map((cat) => (
                                            <div key={cat.key} className="space-y-1 bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-200/60">
                                                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                    <span>{cat.label}</span>
                                                    <span className="font-mono text-[10px] text-emerald-700 font-bold">({cat.code})</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={recInputs[cat.key] || ""}
                                                    onChange={(e) => handleRecFieldChange(cat.key, e.target.value)}
                                                    className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface focus:outline-none focus:border-emerald-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recovery by Method */}
                                <div className="border-t border-slate-200 pt-3 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                                        Recovery by Destination Method
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Recycled (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={recInputs.recycled_tonne || ""}
                                                onChange={(e) => handleRecFieldChange("recycled_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Reused (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={recInputs.reused_tonne || ""}
                                                onChange={(e) => handleRecFieldChange("reused_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Other Recovery Operations (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={recInputs.other_recovery_tonne || ""}
                                                onChange={(e) => handleRecFieldChange("other_recovery_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Waste Disposal (9 Categories + Methods) */}
                        {activeInputTab === "disposal" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                                        3. Waste Disposal — 9 Categories &amp; Methods (Tonnes)
                                    </span>
                                </div>

                                {/* Category Streams in Disposal */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                                        Disposal by Category Stream
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                        {WASTE_CATEGORIES.map((cat) => (
                                            <div key={cat.key} className="space-y-1 bg-amber-50/30 p-2.5 rounded-lg border border-amber-200/60">
                                                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                    <span>{cat.label}</span>
                                                    <span className="font-mono text-[10px] text-amber-700 font-bold">({cat.code})</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={dispInputs[cat.key] || ""}
                                                    onChange={(e) => handleDispFieldChange(cat.key, e.target.value)}
                                                    className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface focus:outline-none focus:border-amber-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Disposal by Method */}
                                <div className="border-t border-slate-200 pt-3 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                                        Disposal by Treatment Method
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Incineration (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={dispInputs.incineration_tonne || ""}
                                                onChange={(e) => handleDispFieldChange("incineration_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Landfilling (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={dispInputs.landfilling_tonne || ""}
                                                onChange={(e) => handleDispFieldChange("landfilling_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                                            <label className="text-xs font-semibold text-slate-800 block">Other Disposal Operations (t)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={dispInputs.other_disposal_tonne || ""}
                                                onChange={(e) => handleDispFieldChange("other_disposal_tonne", e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Document Upload Section */}
                        <BrsrDocumentUploadSection />

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                            <Button variant="secondary" size="md" onClick={handleReset} disabled={isPending}>
                                Reset Form
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="flex items-center gap-2">
                                <MaterialIcon name="refresh" size="sm" />
                                Generate 9-Category Metrics
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Computation Loading & Error States */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Waste Disclosure Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Enter the Financial Year, Turnover, and 9-category waste streams in the controls panel above, then click Generate 9-Category Metrics.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">
                        Calculating 9-category waste metrics...
                    </p>
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
                                            Section Total (A through H)
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
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-semibold text-emerald-700">
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
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-semibold text-amber-700">
                                            {disposalRate.toFixed(1)}% Final Treatment Rate
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 4. Waste Intensity */}
                            <Card interactive className="border-l-4 border-l-indigo-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Waste Intensity / Turnover
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
                                            tonnes / ₹ turnover ({formatTonne(totals.waste_intensity_per_physical_output)} t/output)
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Symmetric 9-Category Master Comparison Table */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="table_chart" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Symmetric 9-Category Waste Balance Table
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            BRSR Standard Categories (A through H): Generation, Recovery, and Disposal streams (tonnes)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="active" size="md">
                                        {formatTonne(totals.total_waste_tonne)} t Generated
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardBody className="p-0 overflow-x-auto">
                                <Table className="min-w-[760px]">
                                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-3 pl-6 font-semibold text-xs text-slate-700">Code</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Category Parameter</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Stream Type</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-blue-700">Generated (t)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-emerald-700">Recovered (t)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-amber-700">Disposed (t)</TableHead>
                                            <TableHead className="py-3 pr-6 font-semibold text-xs text-right text-slate-700">Recovery Rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-slate-100">
                                        {WASTE_CATEGORIES.map((cat) => {
                                            const genVal = Number(totals.generation?.[cat.key] ?? totals[cat.key]) || 0;
                                            const recVal = Number(totals.recovery?.[cat.key]) || 0;
                                            const dispVal = Number(totals.disposal?.[cat.key]) || 0;
                                            const catRecRate = genVal > 0 ? (recVal / genVal) * 100 : 0;

                                            return (
                                                <TableRow key={cat.key} className="hover:bg-slate-50/80 transition-colors">
                                                    <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-500">
                                                        {cat.code}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-medium text-xs text-slate-900">
                                                        {cat.label}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        {cat.isHazardous ? (
                                                            <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                                                                Hazardous
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                                                Non-Hazardous
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right font-semibold text-slate-800">
                                                        {formatTonne(genVal)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right font-semibold text-emerald-700">
                                                        {formatTonne(recVal)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right font-semibold text-amber-700">
                                                        {formatTonne(dispVal)}
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-3 font-mono text-xs text-right text-slate-600">
                                                        {genVal > 0 ? `${catRecRate.toFixed(1)}%` : "—"}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* Subtotal Category H (Other Non-Hazardous Waste = Fly ash + Solid waste) */}
                                        <TableRow className="bg-slate-50/60 font-semibold border-t-2 border-slate-200">
                                            <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-700">
                                                H
                                            </TableCell>
                                            <TableCell className="py-3 text-xs text-slate-900" colSpan={2}>
                                                Total Other Non-Hazardous Waste (H.i + H.ii)
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(genOtherNonHaz)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-emerald-800">
                                                {formatTonne(recOtherNonHaz)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-amber-800">
                                                {formatTonne(dispOtherNonHaz)}
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-slate-700">
                                                {genOtherNonHaz > 0 ? `${((recOtherNonHaz / genOtherNonHaz) * 100).toFixed(1)}%` : "—"}
                                            </TableCell>
                                        </TableRow>

                                        {/* Section Grand Totals (A through H) */}
                                        <TableRow className="bg-primary/5 font-bold border-t-2 border-primary/20">
                                            <TableCell className="pl-6 py-3.5 font-mono text-xs text-primary">
                                                TOTAL
                                            </TableCell>
                                            <TableCell className="py-3.5 text-xs text-primary font-bold" colSpan={2}>
                                                Section Grand Total (A + B + C + D + E + F + G + H)
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-sm text-right text-primary font-bold">
                                                {formatTonne(totals.total_waste_tonne)} t
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-sm text-right text-emerald-800 font-bold">
                                                {formatTonne(totals.total_recovered_tonne)} t
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-sm text-right text-amber-800 font-bold">
                                                {formatTonne(totals.total_disposed_tonne)} t
                                            </TableCell>
                                            <TableCell className="pr-6 py-3.5 font-mono text-sm text-right text-emerald-700 font-bold">
                                                {recoveryRate.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* Recovery & Disposal Method Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Circular Recovery by Method Card */}
                            <Card>
                                <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="recycling" size="sm" className="text-emerald-500" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Circular Economy Recovery by Method
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Destination breakdown for recycled, reused, and recovered waste (tonnes)
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="positive" size="sm">
                                        {formatTonne(totals.total_recovered_by_method_tonne ?? totals.total_recovered_tonne)} t
                                    </Badge>
                                </CardHeader>
                                <CardBody className="p-card-padding space-y-4">
                                    <WasteStreamRow label="Recycled Waste" val={totals.recycled_tonne} total={totalGen} color="#10b981" />
                                    <WasteStreamRow label="Reused Waste" val={totals.reused_tonne} total={totalGen} color="#059669" />
                                    <WasteStreamRow label="Other Recovery Operations" val={totals.other_recovery_tonne} total={totalGen} color="#047857" />

                                    <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 mt-2">
                                        <span className="text-sm font-bold text-emerald-900">Total Recovered by Method</span>
                                        <span className="font-mono text-base font-bold text-emerald-900">
                                            {formatTonne(totals.total_recovered_by_method_tonne ?? totals.total_recovered_tonne)} <span className="text-xs font-sans font-normal">t</span>
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Final Disposal by Method Card */}
                            <Card>
                                <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="delete_outline" size="sm" className="text-amber-500" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Final Waste Disposal by Method
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Treatment breakdown for incinerated, landfilled, and disposed waste (tonnes)
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="neutral" size="sm">
                                        {formatTonne(totals.total_disposed_by_method_tonne ?? totals.total_disposed_tonne)} t
                                    </Badge>
                                </CardHeader>
                                <CardBody className="p-card-padding space-y-4">
                                    <WasteStreamRow label="Incineration" val={totals.incineration_tonne} total={totalGen} color="#f59e0b" />
                                    <WasteStreamRow label="Landfilling" val={totals.landfilling_tonne} total={totalGen} color="#d97706" />
                                    <WasteStreamRow label="Other Disposal Operations" val={totals.other_disposal_tonne} total={totalGen} color="#b45309" />

                                    <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 mt-2">
                                        <span className="text-sm font-bold text-amber-900">Total Disposed by Method</span>
                                        <span className="font-mono text-base font-bold text-amber-900">
                                            {formatTonne(totals.total_disposed_by_method_tonne ?? totals.total_disposed_tonne)} <span className="text-xs font-sans font-normal">t</span>
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                )
            )}

            {/* Waste Report Download Modal */}
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
    val: string | number | undefined;
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
