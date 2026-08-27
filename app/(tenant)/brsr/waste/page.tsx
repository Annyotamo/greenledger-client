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
    WasteGenerationInput,
    WasteRecoveryInput,
    WasteDisposalInput,
    WasteRecoveryItem,
    WasteDisposalItem,
} from "@/lib/brsr/types";

// Standard category descriptors aligned with BRSR Principle 6 (A through H)
const WASTE_CATEGORY_KEYS = [
    { key: "plastic_waste", genKey: "plastic_waste_tonne", code: "A", label: "Plastic Waste", isHazardous: true },
    { key: "ewaste", genKey: "ewaste_tonne", code: "B", label: "E-Waste", isHazardous: true },
    { key: "bio_medical_waste", genKey: "bio_medical_waste_tonne", code: "C", label: "Bio-Medical Waste", isHazardous: true },
    { key: "construction_and_demolition_waste", genKey: "construction_and_demolition_waste_tonne", code: "D", label: "Construction & Demolition", isHazardous: true },
    { key: "battery_waste", genKey: "battery_waste_tonne", code: "E", label: "Battery Waste", isHazardous: true },
    { key: "radioactive_waste", genKey: "radioactive_waste_tonne", code: "F", label: "Radioactive Waste", isHazardous: true },
    { key: "other_hazardous_waste", genKey: "other_hazardous_waste_tonne", code: "G", label: "Other Hazardous Waste", isHazardous: true },
    { key: "fly_ash", genKey: "fly_ash_tonne", code: "H.i", label: "Fly Ash Waste", isHazardous: false },
    { key: "non_hazardous_solid_waste", genKey: "non_hazardous_solid_waste_tonne", code: "H.ii", label: "Non-Hazardous Solid Waste", isHazardous: false },
] as const;

type CategoryKey = (typeof WASTE_CATEGORY_KEYS)[number]["key"];
type GenKey = (typeof WASTE_CATEGORY_KEYS)[number]["genKey"];

// Initial demonstration payload matching backend schema
const INITIAL_PAYLOAD: BRSRWasteDisclosurePayload = {
    financial_year_label: "FY 2024-25",
    turnover_inr: 50000000.0,
    physical_output_tonnes: 1000.0,
    physical_output_unit: "tonnes",
    generation: {
        plastic_waste_tonne: 10.0,
        ewaste_tonne: 5.0,
        bio_medical_waste_tonne: 2.0,
        construction_and_demolition_waste_tonne: 50.0,
        battery_waste_tonne: 1.0,
        radioactive_waste_tonne: 0.0,
        other_hazardous_waste_tonne: 4.0,
        fly_ash_tonne: 80.0,
        non_hazardous_solid_waste_tonne: 20.0,
    },
    recovery: {
        plastic_waste: { recycled_tonne: 6.0, reused_tonne: 2.0, other_recovery_tonne: 0.5 },
        ewaste: { recycled_tonne: 3.0, reused_tonne: 1.0, other_recovery_tonne: 0.0 },
        bio_medical_waste: { recycled_tonne: 0.0, reused_tonne: 0.0, other_recovery_tonne: 0.0 },
        construction_and_demolition_waste: { recycled_tonne: 20.0, reused_tonne: 15.0, other_recovery_tonne: 5.0 },
        battery_waste: { recycled_tonne: 0.5, reused_tonne: 0.2, other_recovery_tonne: 0.1 },
        radioactive_waste: { recycled_tonne: 0.0, reused_tonne: 0.0, other_recovery_tonne: 0.0 },
        other_hazardous_waste: { recycled_tonne: 1.0, reused_tonne: 0.5, other_recovery_tonne: 0.5 },
        fly_ash: { recycled_tonne: 50.0, reused_tonne: 20.0, other_recovery_tonne: 5.0 },
        non_hazardous_solid_waste: { recycled_tonne: 10.0, reused_tonne: 5.0, other_recovery_tonne: 2.0 },
    },
    disposal: {
        plastic_waste: { incineration_tonne: 1.0, landfilling_tonne: 0.5, other_disposal_tonne: 0.0 },
        ewaste: { incineration_tonne: 0.5, landfilling_tonne: 0.5, other_disposal_tonne: 0.0 },
        bio_medical_waste: { incineration_tonne: 1.5, landfilling_tonne: 0.5, other_disposal_tonne: 0.0 },
        construction_and_demolition_waste: { incineration_tonne: 0.0, landfilling_tonne: 10.0, other_disposal_tonne: 0.0 },
        battery_waste: { incineration_tonne: 0.0, landfilling_tonne: 0.2, other_disposal_tonne: 0.0 },
        radioactive_waste: { incineration_tonne: 0.0, landfilling_tonne: 0.0, other_disposal_tonne: 0.0 },
        other_hazardous_waste: { incineration_tonne: 1.0, landfilling_tonne: 1.0, other_disposal_tonne: 0.0 },
        fly_ash: { incineration_tonne: 0.0, landfilling_tonne: 5.0, other_disposal_tonne: 0.0 },
        non_hazardous_solid_waste: { incineration_tonne: 0.0, landfilling_tonne: 3.0, other_disposal_tonne: 0.0 },
    },
};

const createEmptyGen = (): WasteGenerationInput => ({
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

const createEmptyRec = (): WasteRecoveryInput => ({
    plastic_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    ewaste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    bio_medical_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    construction_and_demolition_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    battery_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    radioactive_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    other_hazardous_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    fly_ash: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
    non_hazardous_solid_waste: { recycled_tonne: 0, reused_tonne: 0, other_recovery_tonne: 0 },
});

const createEmptyDisp = (): WasteDisposalInput => ({
    plastic_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    ewaste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    bio_medical_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    construction_and_demolition_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    battery_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    radioactive_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    other_hazardous_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    fly_ash: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
    non_hazardous_solid_waste: { incineration_tonne: 0, landfilling_tonne: 0, other_disposal_tonne: 0 },
});

export default function BrsrWastePage() {
    // Form Input States
    const [fyLabel, setFyLabel] = useState("FY 2024-25");
    const [turnover, setTurnover] = useState("50000000");
    const [physicalOutput, setPhysicalOutput] = useState("1000");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("tonnes");

    // Symmetric 9-category stream states
    const [genInputs, setGenInputs] = useState<WasteGenerationInput>(INITIAL_PAYLOAD.generation);
    const [recInputs, setRecInputs] = useState<WasteRecoveryInput>(INITIAL_PAYLOAD.recovery);
    const [dispInputs, setDispInputs] = useState<WasteDisposalInput>(INITIAL_PAYLOAD.disposal);

    // Active payload for API calculation
    const [activePayload, setActivePayload] = useState<BRSRWasteDisclosurePayload>(INITIAL_PAYLOAD);

    // Drawer / Tab Controls
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [activeInputTab, setActiveInputTab] = useState<"general" | "generation" | "recovery" | "disposal">("generation");

    const { data, isPending, isError, error } = useBrsrWasteDisclosure(activePayload);

    // Handlers
    const handleGenFieldChange = (key: GenKey, value: string) => {
        setGenInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    };

    const handleRecMatrixChange = (catKey: CategoryKey, field: keyof WasteRecoveryItem, value: string) => {
        setRecInputs((prev) => ({
            ...prev,
            [catKey]: {
                ...prev[catKey],
                [field]: Number(value) || 0,
            },
        }));
    };

    const handleDispMatrixChange = (catKey: CategoryKey, field: keyof WasteDisposalItem, value: string) => {
        setDispInputs((prev) => ({
            ...prev,
            [catKey]: {
                ...prev[catKey],
                [field]: Number(value) || 0,
            },
        }));
    };

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel.trim() || "FY 2024-25",
            turnover_inr: Number(turnover) || 0,
            physical_output_tonnes: Number(physicalOutput) || 0,
            physical_output_unit: physicalOutputUnit.trim() || "tonnes",
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

        const emptyGen = createEmptyGen();
        const emptyRec = createEmptyRec();
        const emptyDisp = createEmptyDisp();

        setGenInputs(emptyGen);
        setRecInputs(emptyRec);
        setDispInputs(emptyDisp);

        setActivePayload({
            financial_year_label: "",
            turnover_inr: 0,
            physical_output_tonnes: 0,
            generation: emptyGen,
            recovery: emptyRec,
            disposal: emptyDisp,
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
    const totalRec = Number(totals?.recovery?.total_recovered_tonne ?? totals?.total_recovered_tonne) || 0;
    const totalDisp = Number(totals?.disposal?.total_disposed_tonne ?? totals?.total_disposed_tonne) || 0;

    const recoveryRate = totalGen > 0 ? (totalRec / totalGen) * 100 : 0;
    const disposalRate = totalGen > 0 ? (totalDisp / totalGen) * 100 : 0;

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
                        Principle 6 Waste Disclosure: 9-category breakdown across Waste Generation, Recovery matrix (Recycled / Reused / Other), and Disposal matrix (Incineration / Landfill / Other).
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
                                Waste Disclosure Parameter Entry &amp; Operations Matrix
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
                                2. Recovery Matrix
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveInputTab("disposal")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    activeInputTab === "disposal" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                                }`}>
                                3. Disposal Matrix
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

                        {/* Tab 2: Table 1 - Waste Generation (9 Categories) */}
                        {activeInputTab === "generation" && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                                        Table 1: Waste Generation — 9 Categories (Tonnes)
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        Total: {Object.values(genInputs).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2)} t
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                    {WASTE_CATEGORY_KEYS.map((cat) => (
                                        <div key={cat.key} className="space-y-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/80">
                                            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                <span>{cat.label}</span>
                                                <span className="font-mono text-[10px] text-slate-400 font-bold">({cat.code})</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={genInputs[cat.genKey] || ""}
                                                onChange={(e) => handleGenFieldChange(cat.genKey, e.target.value)}
                                                className="w-full rounded-md border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs text-on-surface focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Table 2 - Waste Recovery (Category-Wise Matrix) */}
                        {activeInputTab === "recovery" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                                            Table 2: Waste Recovered — Category-Wise Operations Matrix
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Enter operations for each category. Row totals are calculated automatically.
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                                            <tr>
                                                <th className="py-2.5 px-3">Category</th>
                                                <th className="py-2.5 px-3">Recycled (t)</th>
                                                <th className="py-2.5 px-3">Re-used (t)</th>
                                                <th className="py-2.5 px-3">Other Recovery (t)</th>
                                                <th className="py-2.5 px-3 text-right">Row Total (t)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {WASTE_CATEGORY_KEYS.map((cat) => {
                                                const row = recInputs[cat.key];
                                                const rowTotal = (Number(row.recycled_tonne) || 0) + (Number(row.reused_tonne) || 0) + (Number(row.other_recovery_tonne) || 0);

                                                return (
                                                    <tr key={cat.key} className="hover:bg-slate-50/60">
                                                        <td className="py-2 px-3 font-medium text-slate-900 whitespace-nowrap">
                                                            <span>{cat.label}</span>{" "}
                                                            <span className="text-[10px] text-slate-400 font-mono">({cat.code})</span>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.recycled_tonne || ""}
                                                                onChange={(e) => handleRecMatrixChange(cat.key, "recycled_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-emerald-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.reused_tonne || ""}
                                                                onChange={(e) => handleRecMatrixChange(cat.key, "reused_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-emerald-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.other_recovery_tonne || ""}
                                                                onChange={(e) => handleRecMatrixChange(cat.key, "other_recovery_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-emerald-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                                                            {rowTotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Table 3 - Waste Disposal (Category-Wise Matrix) */}
                        {activeInputTab === "disposal" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                                            Table 3: Waste Disposed — Category-Wise Operations Matrix
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Enter operations for each category. Row totals are calculated automatically.
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                                            <tr>
                                                <th className="py-2.5 px-3">Category</th>
                                                <th className="py-2.5 px-3">Incineration (t)</th>
                                                <th className="py-2.5 px-3">Landfilling (t)</th>
                                                <th className="py-2.5 px-3">Other Disposal (t)</th>
                                                <th className="py-2.5 px-3 text-right">Row Total (t)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {WASTE_CATEGORY_KEYS.map((cat) => {
                                                const row = dispInputs[cat.key];
                                                const rowTotal = (Number(row.incineration_tonne) || 0) + (Number(row.landfilling_tonne) || 0) + (Number(row.other_disposal_tonne) || 0);

                                                return (
                                                    <tr key={cat.key} className="hover:bg-slate-50/60">
                                                        <td className="py-2 px-3 font-medium text-slate-900 whitespace-nowrap">
                                                            <span>{cat.label}</span>{" "}
                                                            <span className="text-[10px] text-slate-400 font-mono">({cat.code})</span>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.incineration_tonne || ""}
                                                                onChange={(e) => handleDispMatrixChange(cat.key, "incineration_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-amber-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.landfilling_tonne || ""}
                                                                onChange={(e) => handleDispMatrixChange(cat.key, "landfilling_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-amber-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={row.other_disposal_tonne || ""}
                                                                onChange={(e) => handleDispMatrixChange(cat.key, "other_disposal_tonne", e.target.value)}
                                                                className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-xs focus:border-amber-600 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-mono font-bold text-amber-700">
                                                            {rowTotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
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
                                Calculate &amp; Preview Report
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
                        Enter the Financial Year, Turnover, and operations matrix in the controls panel above, then click Calculate &amp; Preview Report.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">
                        Calculating BRSR waste disclosure report...
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
                            <Card interactive className="border-l-4 border-l-blue-600">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Total Waste Generated
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <MaterialIcon name="delete_sweep" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-primary">
                                                {formatTonne(totals.total_waste_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">MT</span>
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
                                                {formatTonne(totals.recovery?.total_recovered_tonne ?? totals.total_recovered_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">MT</span>
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
                                                {formatTonne(totals.disposal?.total_disposed_tonne ?? totals.total_disposed_tonne)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">MT</span>
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
                                            MT / ₹ turnover ({formatTonne(totals.waste_intensity_per_physical_output)} MT/output)
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Table 1: Waste Generated (MT) */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="delete_sweep" size="sm" className="text-blue-600" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Table 1: Waste Generated (MT)
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Category breakdown A through G, H (Fly ash + Solid waste), and Total Waste Generated
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="active" size="md">
                                    {formatTonne(totals.total_waste_tonne)} MT Total
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-0 overflow-x-auto">
                                <Table className="min-w-[680px]">
                                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-3 pl-6 font-semibold text-xs text-slate-700">Code</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Category Parameter</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Stream Classification</TableHead>
                                            <TableHead className="py-3 pr-6 font-semibold text-xs text-right text-blue-700">Generated (MT)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-slate-100">
                                        {WASTE_CATEGORY_KEYS.map((cat) => {
                                            const genVal = totals.generation?.[cat.genKey];

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
                                                    <TableCell className="pr-6 py-3 font-mono text-xs text-right font-semibold text-slate-900">
                                                        {formatTonne(genVal)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* Subtotal Category H (Other Non-Hazardous Waste = Fly ash + Solid waste) */}
                                        <TableRow className="bg-slate-50/70 font-semibold border-t-2 border-slate-200">
                                            <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-700">
                                                H
                                            </TableCell>
                                            <TableCell className="py-3 text-xs text-slate-900 font-bold" colSpan={2}>
                                                Total Other Non-Hazardous Waste (H.i + H.ii)
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.generation?.other_non_hazardous_waste_tonne)}
                                            </TableCell>
                                        </TableRow>

                                        {/* Total Waste Generated */}
                                        <TableRow className="bg-primary/5 font-bold border-t-2 border-primary/20">
                                            <TableCell className="pl-6 py-3.5 font-mono text-xs text-primary">
                                                TOTAL
                                            </TableCell>
                                            <TableCell className="py-3.5 text-xs text-primary font-bold" colSpan={2}>
                                                Total Waste Generated (A + B + C + D + E + F + G + H)
                                            </TableCell>
                                            <TableCell className="pr-6 py-3.5 font-mono text-sm text-right text-primary font-bold">
                                                {formatTonne(totals.total_waste_tonne)} MT
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* Table 2: Waste Recovered (MT) - Category-Wise Operations Matrix */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="recycling" size="sm" className="text-emerald-600" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Table 2: Waste Recovered (MT)
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Category-wise recovery operation matrix: Recycled, Re-used, and Other recovery operations
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="positive" size="md">
                                    {formatTonne(totals.recovery?.total_recovered_tonne)} MT Recovered
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-0 overflow-x-auto">
                                <Table className="min-w-[760px]">
                                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-3 pl-6 font-semibold text-xs text-slate-700">Code</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Category Parameter</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-emerald-800">Recycled (MT)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-emerald-800">Re-used (MT)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-emerald-800">Other Recovery (MT)</TableHead>
                                            <TableHead className="py-3 pr-6 font-semibold text-xs text-right text-emerald-900 font-bold">Total (MT)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-slate-100">
                                        {WASTE_CATEGORY_KEYS.map((cat) => {
                                            const recItem = totals.recovery?.[cat.key];

                                            return (
                                                <TableRow key={cat.key} className="hover:bg-slate-50/80 transition-colors">
                                                    <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-500">
                                                        {cat.code}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-medium text-xs text-slate-900">
                                                        {cat.label}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(recItem?.recycled_tonne)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(recItem?.reused_tonne)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(recItem?.other_recovery_tonne)}
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-emerald-700">
                                                        {formatTonne(recItem?.total_tonne)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* Subtotal Category H (Other Non-Hazardous Waste in Recovery) */}
                                        <TableRow className="bg-slate-50/70 font-semibold border-t-2 border-slate-200">
                                            <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-700">
                                                H
                                            </TableCell>
                                            <TableCell className="py-3 text-xs text-slate-900 font-bold">
                                                Other Non-Hazardous Waste (H.i + H.ii)
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.recovery?.other_non_hazardous_waste?.recycled_tonne)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.recovery?.other_non_hazardous_waste?.reused_tonne)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.recovery?.other_non_hazardous_waste?.other_recovery_tonne)}
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-emerald-800">
                                                {formatTonne(totals.recovery?.other_non_hazardous_waste?.total_tonne)}
                                            </TableCell>
                                        </TableRow>

                                        {/* Footer Row: Total Recovered */}
                                        <TableRow className="bg-emerald-500/10 font-bold border-t-2 border-emerald-500/30">
                                            <TableCell className="pl-6 py-3.5 font-mono text-xs text-emerald-950">
                                                TOTAL
                                            </TableCell>
                                            <TableCell className="py-3.5 text-xs text-emerald-950 font-bold">
                                                Total Recovered Operations
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-emerald-950 font-bold">
                                                {formatTonne(totals.recovery?.total_recycled_tonne)} MT
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-emerald-950 font-bold">
                                                {formatTonne(totals.recovery?.total_reused_tonne)} MT
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-emerald-950 font-bold">
                                                {formatTonne(totals.recovery?.total_other_recovery_tonne)} MT
                                            </TableCell>
                                            <TableCell className="pr-6 py-3.5 font-mono text-sm text-right text-emerald-900 font-bold">
                                                {formatTonne(totals.recovery?.total_recovered_tonne)} MT
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* Table 3: Waste Disposed (MT) - Category-Wise Operations Matrix */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="delete_outline" size="sm" className="text-amber-600" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Table 3: Waste Disposed (MT)
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Category-wise disposal operation matrix: Incineration, Landfilling, and Other disposal operations
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="neutral" size="md">
                                    {formatTonne(totals.disposal?.total_disposed_tonne)} MT Disposed
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-0 overflow-x-auto">
                                <Table className="min-w-[760px]">
                                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-3 pl-6 font-semibold text-xs text-slate-700">Code</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-slate-700">Category Parameter</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-amber-800">Incineration (MT)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-amber-800">Landfilling (MT)</TableHead>
                                            <TableHead className="py-3 font-semibold text-xs text-right text-amber-800">Other Disposal (MT)</TableHead>
                                            <TableHead className="py-3 pr-6 font-semibold text-xs text-right text-amber-900 font-bold">Total (MT)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-slate-100">
                                        {WASTE_CATEGORY_KEYS.map((cat) => {
                                            const dispItem = totals.disposal?.[cat.key];

                                            return (
                                                <TableRow key={cat.key} className="hover:bg-slate-50/80 transition-colors">
                                                    <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-500">
                                                        {cat.code}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-medium text-xs text-slate-900">
                                                        {cat.label}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(dispItem?.incineration_tonne)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(dispItem?.landfilling_tonne)}
                                                    </TableCell>
                                                    <TableCell className="py-3 font-mono text-xs text-right text-slate-800">
                                                        {formatTonne(dispItem?.other_disposal_tonne)}
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-amber-700">
                                                        {formatTonne(dispItem?.total_tonne)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* Subtotal Category H (Other Non-Hazardous Waste in Disposal) */}
                                        <TableRow className="bg-slate-50/70 font-semibold border-t-2 border-slate-200">
                                            <TableCell className="pl-6 py-3 font-mono text-xs font-bold text-slate-700">
                                                H
                                            </TableCell>
                                            <TableCell className="py-3 text-xs text-slate-900 font-bold">
                                                Other Non-Hazardous Waste (H.i + H.ii)
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.disposal?.other_non_hazardous_waste?.incineration_tonne)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.disposal?.other_non_hazardous_waste?.landfilling_tonne)}
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-xs text-right font-bold text-slate-900">
                                                {formatTonne(totals.disposal?.other_non_hazardous_waste?.other_disposal_tonne)}
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 font-mono text-xs text-right font-bold text-amber-800">
                                                {formatTonne(totals.disposal?.other_non_hazardous_waste?.total_tonne)}
                                            </TableCell>
                                        </TableRow>

                                        {/* Footer Row: Total Disposed */}
                                        <TableRow className="bg-amber-500/10 font-bold border-t-2 border-amber-500/30">
                                            <TableCell className="pl-6 py-3.5 font-mono text-xs text-amber-950">
                                                TOTAL
                                            </TableCell>
                                            <TableCell className="py-3.5 text-xs text-amber-950 font-bold">
                                                Total Disposed Operations
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-amber-950 font-bold">
                                                {formatTonne(totals.disposal?.total_incineration_tonne)} MT
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-amber-950 font-bold">
                                                {formatTonne(totals.disposal?.total_landfilling_tonne)} MT
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-xs text-right text-amber-950 font-bold">
                                                {formatTonne(totals.disposal?.total_other_disposal_tonne)} MT
                                            </TableCell>
                                            <TableCell className="pr-6 py-3.5 font-mono text-sm text-right text-amber-900 font-bold">
                                                {formatTonne(totals.disposal?.total_disposed_tonne)} MT
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
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
