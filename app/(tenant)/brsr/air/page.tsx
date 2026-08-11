"use client";

import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { useBrsrAirDisclosure } from "@/lib/brsr/hooks";
import { postBrsrAirReport } from "@/lib/brsr/api";
import { BrsrAirReportModal } from "@/components/brsr/BrsrAirReportModal";
import { BrsrDocumentUploadSection } from "@/components/brsr/BrsrDocumentUploadSection";
import { Calendar } from "@/components/ui/calendar";
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
    AttachedUnitEnum,
    BrsrAirDisclosurePayload,
    BrsrAirStackInput,
    BrsrAirOtherPollutantInput,
} from "@/lib/brsr/types";

const ATTACHED_UNITS: AttachedUnitEnum[] = [
    "DRI",
    "Captive power",
    "Boiler",
    "Furnace",
    "Kiln",
    "Sinter plant",
    "Pellet plant",
    "Coke oven",
    "Foundry",
    "Other",
];

const createCleanStack = (): BrsrAirStackInput => ({
    stack_name: "",
    attached_unit: "Boiler",
    sampling_date: "",
    gas_flow_rate: { value: "" as unknown as number, unit: "nm3_per_hour" },
    operating_hours_per_year: "" as unknown as number,
    permitted_flow_rate: { value: "" as unknown as number, unit: "nm3_per_hour" },
    permitted_limit_nox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    permitted_limit_sox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    permitted_limit_pm: { value: "" as unknown as number, unit: "mg_per_nm3" },
    permitted_limit_pop: null,
    permitted_limit_voc: null,
    permitted_limit_hap: null,
    nox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    sox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    particulate_matter: { value: "" as unknown as number, unit: "mg_per_nm3" },
    pop: null,
    voc: null,
    hap: null,
});

// Demo stack payload for default initial dashboard view
const DEMO_STACK_1: BrsrAirStackInput = {
    stack_name: "Main Boiler Stack",
    attached_unit: "Boiler",
    sampling_date: "2025-04-15",
    gas_flow_rate: { value: 12500, unit: "nm3_per_hour" },
    operating_hours_per_year: 8000,
    permitted_flow_rate: { value: 15000, unit: "nm3_per_hour" },
    permitted_limit_nox: { value: 100, unit: "mg_per_nm3" },
    permitted_limit_sox: { value: 200, unit: "mg_per_nm3" },
    permitted_limit_pm: { value: 50, unit: "mg_per_nm3" },
    permitted_limit_pop: { value: 10, unit: "mg_per_nm3" },
    permitted_limit_voc: { value: 20, unit: "mg_per_nm3" },
    permitted_limit_hap: { value: 15, unit: "mg_per_nm3" },
    nox: { value: 45.0, unit: "mg_per_nm3" },
    sox: { value: 110.0, unit: "mg_per_nm3" },
    particulate_matter: { value: 28.0, unit: "mg_per_nm3" },
    pop: { value: 2.5, unit: "mg_per_nm3" },
    voc: { value: 5.0, unit: "mg_per_nm3" },
    hap: { value: 1.2, unit: "mg_per_nm3" },
};

const DEMO_STACK_2: BrsrAirStackInput = {
    stack_name: "Furnace Stack #1",
    attached_unit: "Furnace",
    sampling_date: "2025-04-10",
    gas_flow_rate: { value: 18000, unit: "nm3_per_hour" },
    operating_hours_per_year: 7200,
    permitted_flow_rate: { value: 20000, unit: "nm3_per_hour" },
    permitted_limit_nox: { value: 150, unit: "mg_per_nm3" },
    permitted_limit_sox: { value: 250, unit: "mg_per_nm3" },
    permitted_limit_pm: { value: 40, unit: "mg_per_nm3" },
    nox: { value: 55.0, unit: "mg_per_nm3" },
    sox: { value: 130.0, unit: "mg_per_nm3" },
    particulate_matter: { value: 32.0, unit: "mg_per_nm3" },
};

function DatePickerInput({
    value,
    onChange,
    placeholder = "Select Date",
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const parsedDate = value ? parseISO(value) : null;
    const validDate = parsedDate && isValid(parsedDate) ? parsedDate : null;

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex h-8.5 items-center justify-between gap-2 rounded-lg border border-outline-variant bg-white px-2.5 py-1 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150 shadow-sm">
                <span className="flex items-center gap-1.5">
                    <MaterialIcon name="calendar_today" size="sm" className="text-on-surface-variant shrink-0 !text-[15px]" />
                    {validDate ? (
                        format(validDate, "yyyy-MM-dd")
                    ) : (
                        <span className="text-on-surface-variant/50 font-sans text-[12px]">{placeholder}</span>
                    )}
                </span>
                <MaterialIcon name="arrow_drop_down" size="sm" className="text-on-surface-variant shrink-0" />
            </button>
            {isOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default bg-transparent"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close calendar"
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 shadow-2xl animate-fade-up">
                        <Calendar
                            date={validDate}
                            onDateChange={(d) => {
                                onChange(format(d, "yyyy-MM-dd"));
                                setIsOpen(false);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default function BrsrAirPage() {
    // Form Input States - Clean Slate initially
    const [fyLabel, setFyLabel] = useState("");
    const [samplingDate, setSamplingDate] = useState("");
    const [operatingHours, setOperatingHours] = useState("");

    // Dynamic Stacks Input State - Clean single stack initially
    const [stacks, setStacks] = useState<BrsrAirStackInput[]>([createCleanStack()]);

    // Dynamic Custom Pollutants State - Empty initially
    const [others, setOthers] = useState<BrsrAirOtherPollutantInput[]>([]);

    // Active payload for React Query backend calls initialized with demonstration data
    const [activePayload, setActivePayload] = useState<BrsrAirDisclosurePayload>({
        financial_year_label: "FY 2024-25",
        sampling_date: "2025-04-15",
        operating_hours: 8000,
        stacks: [DEMO_STACK_1, DEMO_STACK_2],
        others: [{ label: "Carbon Monoxide (CO)", quantity: 18.5 }],
    });

    const { data, isPending, isError, error } = useBrsrAirDisclosure(activePayload);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Stack Handlers
    const handleAddStack = () => {
        setStacks((prev) => [...prev, createCleanStack()]);
    };

    const handleRemoveStack = (index: number) => {
        setStacks((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateStack = (index: number, field: string, value: any) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[index] };

            if (field.includes(".")) {
                const [parent, child] = field.split(".");
                (stack as any)[parent] = {
                    ...(stack as any)[parent],
                    [child]: value,
                };
            } else {
                (stack as any)[field] = value;
            }

            next[index] = stack;
            return next;
        });
    };

    // Custom Pollutants Handlers
    const handleAddOtherPollutant = () => {
        setOthers((prev) => [...prev, { label: "", quantity: "" as unknown as number }]);
    };

    const handleRemoveOtherPollutant = (index: number) => {
        setOthers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateOtherPollutant = (index: number, field: "label" | "quantity", value: any) => {
        setOthers((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Generate API Payload
    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel || "FY 2024-25",
            sampling_date: samplingDate || null,
            operating_hours: operatingHours ? Number(operatingHours) : null,
            stacks: stacks.map((s, idx) => ({
                ...s,
                stack_name: s.stack_name || `Stack #${idx + 1}`,
                gas_flow_rate: { value: Number(s.gas_flow_rate?.value) || 0, unit: "nm3_per_hour" },
                operating_hours_per_year: Number(s.operating_hours_per_year) || 0,
                permitted_flow_rate: { value: Number(s.permitted_flow_rate?.value) || 0, unit: "nm3_per_hour" },
                permitted_limit_nox: { value: Number(s.permitted_limit_nox?.value) || 0, unit: "mg_per_nm3" },
                permitted_limit_sox: { value: Number(s.permitted_limit_sox?.value) || 0, unit: "mg_per_nm3" },
                permitted_limit_pm: { value: Number(s.permitted_limit_pm?.value) || 0, unit: "mg_per_nm3" },
                nox: { value: Number(s.nox?.value) || 0, unit: "mg_per_nm3" },
                sox: { value: Number(s.sox?.value) || 0, unit: "mg_per_nm3" },
                particulate_matter: { value: Number(s.particulate_matter?.value) || 0, unit: "mg_per_nm3" },
                ...(s.pop ? { pop: { value: Number(s.pop.value) || 0, unit: "mg_per_nm3" } } : {}),
                ...(s.permitted_limit_pop ? { permitted_limit_pop: { value: Number(s.permitted_limit_pop.value) || 0, unit: "mg_per_nm3" } } : {}),
                ...(s.voc ? { voc: { value: Number(s.voc.value) || 0, unit: "mg_per_nm3" } } : {}),
                ...(s.permitted_limit_voc ? { permitted_limit_voc: { value: Number(s.permitted_limit_voc.value) || 0, unit: "mg_per_nm3" } } : {}),
                ...(s.hap ? { hap: { value: Number(s.hap.value) || 0, unit: "mg_per_nm3" } } : {}),
                ...(s.permitted_limit_hap ? { permitted_limit_hap: { value: Number(s.permitted_limit_hap.value) || 0, unit: "mg_per_nm3" } } : {}),
            })),
            others: others.filter((o) => o.label.trim() !== "").map((o) => ({ label: o.label, quantity: Number(o.quantity) || 0 })),
        });
    };

    // Clean Slate Reset Form
    const handleReset = () => {
        setFyLabel("");
        setSamplingDate("");
        setOperatingHours("");
        setStacks([createCleanStack()]);
        setOthers([]);
        setActivePayload({
            financial_year_label: "",
            sampling_date: null,
            operating_hours: null,
            stacks: [],
            others: [],
        });
    };

    const handleDownloadReport = async (payload: BrsrAirDisclosurePayload) => {
        const blob = await postBrsrAirReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-air-disclosure-report-${(payload.financial_year_label || "2024").replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatNum = (val: string | number | null | undefined, decimals = 2) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    const totals = data?.totals;
    const plantTotals = totals?.plant_total_per_pollutant;
    const plantAvgs = totals?.plant_average_concentration;

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
                            {data?.financial_year_label || "FY 2024-25"}
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Air Emissions Disclosure & Accounting
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Stack air emission rate calculations (kg/hr), annual totals (tonnes/year), & plant average concentrations (mg/Nm³) under SEBI BRSR guidelines.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Controls"}</span>
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

            {/* Inputs & Parameters Panel */}
            {isFilterOpen && (
                <Card className="shadow-md border-outline-variant/80">
                    <CardHeader tone="strip" className="py-2.5 px-5 bg-white flex items-center justify-between border-b border-outline-variant/60">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Plant & Industrial Stack Parameter Entry
                            </span>
                        </div>
                        <Badge variant="neutral" size="sm" className="font-medium px-2.5 py-0.5 text-xs">
                            {stacks.length} Stack(s) Configured
                        </Badge>
                    </CardHeader>
                    <CardBody className="p-5 space-y-5">
                        {/* Plant Top-Level Inputs */}
                        <div className="border-b border-outline-variant/60 pb-4">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2.5">
                                Plant General Info
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="fy-label" className="text-xs font-semibold text-on-surface-variant block">
                                        FY Reporting Label <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="fy-label"
                                        type="text"
                                        placeholder="e.g. FY 2024-25"
                                        value={fyLabel}
                                        onChange={(e) => setFyLabel(e.target.value)}
                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-sans text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Plant Sampling Date
                                    </label>
                                    <DatePickerInput
                                        value={samplingDate}
                                        onChange={(val) => setSamplingDate(val)}
                                        placeholder="Select Sampling Date"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="plant-operating-hours" className="text-xs font-semibold text-on-surface-variant block">
                                        Plant Operating Hours (per Year)
                                    </label>
                                    <input
                                        id="plant-operating-hours"
                                        type="number"
                                        placeholder="e.g. 8000"
                                        value={operatingHours}
                                        onChange={(e) => setOperatingHours(e.target.value)}
                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-sans text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stack Records Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    Industrial Stack Readings ({stacks.length})
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddStack}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-semibold">
                                    <MaterialIcon name="add" size="sm" />
                                    <span>Add Industrial Stack</span>
                                </Button>
                            </div>

                            {stacks.map((stack, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-outline-variant/60 bg-white p-4 space-y-4 shadow-sm">
                                    <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                                                {idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={stack.stack_name}
                                                onChange={(e) => handleUpdateStack(idx, "stack_name", e.target.value)}
                                                placeholder={`e.g. Stack #${idx + 1} - Boiler`}
                                                className="font-sans text-sm font-bold text-on-surface border-b border-transparent hover:border-outline-variant focus:border-primary focus:outline-none px-1 py-0.5"
                                            />
                                        </div>
                                        {stacks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStack(idx)}
                                                className="text-error hover:text-error/80 text-xs flex items-center gap-1 font-semibold transition">
                                                <MaterialIcon name="delete" size="sm" />
                                                <span>Remove Stack</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Stack Basic Info & Flow Rates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                Attached Unit <span className="text-error">*</span>
                                            </label>
                                            <select
                                                value={stack.attached_unit}
                                                onChange={(e) => handleUpdateStack(idx, "attached_unit", e.target.value)}
                                                className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm">
                                                {ATTACHED_UNITS.map((unit) => (
                                                    <option key={unit} value={unit}>
                                                        {unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                Sampling Date <span className="text-error">*</span>
                                            </label>
                                            <DatePickerInput
                                                value={stack.sampling_date}
                                                onChange={(val) => handleUpdateStack(idx, "sampling_date", val)}
                                                placeholder="Select Date"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                Operating Hours / Year <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 8000"
                                                value={stack.operating_hours_per_year || ""}
                                                onChange={(e) => handleUpdateStack(idx, "operating_hours_per_year", e.target.value)}
                                                className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                Gas Flow Rate (Nm³/hr) <span className="text-error">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 12500"
                                                    value={stack.gas_flow_rate.value || ""}
                                                    onChange={(e) => handleUpdateStack(idx, "gas_flow_rate.value", e.target.value)}
                                                    className="w-full h-8.5 rounded-l-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                                />
                                                <span className="text-[10px] font-mono font-bold text-on-surface-variant whitespace-nowrap bg-surface-container-high px-2 h-8.5 flex items-center rounded-r-lg border border-l-0 border-outline-variant">
                                                    Nm³/hr
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Permitted Limits vs Actual Readings Grid */}
                                    <div className="space-y-2 border-t border-outline-variant/30 pt-3">
                                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                                            Pollutant Readings & Permitted Limits (mg/Nm³)
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {/* NOx */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-primary block">NOx (Oxides of Nitrogen)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.nox.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "nox.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_nox.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "permitted_limit_nox.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SOx */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-primary block">SOx (Oxides of Sulfur)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.sox.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "sox.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_sox.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "permitted_limit_sox.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PM */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-primary block">Particulate Matter (PM)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.particulate_matter.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "particulate_matter.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_pm.value || ""}
                                                            onChange={(e) => handleUpdateStack(idx, "permitted_limit_pm.value", e.target.value)}
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* POP (Optional) */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-on-surface block">POP (Persistent Organic)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.pop?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "pop",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_pop?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "permitted_limit_pop",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* VOC (Optional) */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-on-surface block">VOC (Volatile Organic)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.voc?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "voc",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_voc?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "permitted_limit_voc",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* HAP (Optional) */}
                                            <div className="rounded-lg border border-outline-variant/40 p-3 bg-surface-container-lowest space-y-2">
                                                <span className="text-xs font-bold text-on-surface block">HAP (Hazardous Air)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Actual (mg/Nm³)</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.hap?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "hap",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-on-surface-variant block mb-0.5">Permitted Limit</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            value={stack.permitted_limit_hap?.value || ""}
                                                            onChange={(e) =>
                                                                handleUpdateStack(
                                                                    idx,
                                                                    "permitted_limit_hap",
                                                                    e.target.value !== ""
                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Other Air Parameters Section */}
                        <div className="border-t border-outline-variant/60 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    Additional Custom Air Parameters (Optional)
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddOtherPollutant}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1 font-semibold">
                                    <MaterialIcon name="add" size="sm" />
                                    <span>Add Parameter</span>
                                </Button>
                            </div>

                            {others.length > 0 && (
                                <div className="space-y-2">
                                    {others.map((other, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="Pollutant Name / Label (e.g. Carbon Monoxide)"
                                                value={other.label}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "label", e.target.value)}
                                                className="w-1/2 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Quantity (tonnes)"
                                                value={other.quantity || ""}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "quantity", e.target.value)}
                                                className="w-1/3 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOtherPollutant(idx)}
                                                className="text-error hover:text-error/80 p-1.5 rounded-lg hover:bg-error/10 transition">
                                                <MaterialIcon name="close" size="sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Document Evidence Upload Section */}
                        <div className="border-t border-outline-variant/60 pt-4">
                            <BrsrDocumentUploadSection />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2.5 border-t border-outline-variant/60 pt-4">
                            <Button variant="secondary" size="md" onClick={handleReset} disabled={isPending} className="px-4 py-2 text-xs font-semibold">
                                Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="flex items-center gap-2 px-5 py-2 text-xs font-bold shadow-md">
                                <MaterialIcon name="refresh" size="sm" />
                                Compute Air Disclosure Totals
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Loading & Error States */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Industrial Stack Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please enter stack gas flow rates and pollutant concentration readings in the control panel above, then click Compute Air Disclosure Totals.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating stack air emissions totals...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error">
                    <MaterialIcon name="warning" className="mx-auto mb-2" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate air disclosure."}</p>
                </div>
            ) : (
                data && (
                    <>
                        {/* 4-Card Overview Metrics Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* 1. Total NOx */}
                            <Card interactive className="border-l-4 border-l-blue-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant NOx Total
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <MaterialIcon name="cloud" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-primary">
                                                {formatNum(plantTotals?.nox)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.nox)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 2. Total SOx */}
                            <Card interactive className="border-l-4 border-l-amber-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant SOx Total
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                            <MaterialIcon name="air" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-amber-600">
                                                {formatNum(plantTotals?.sox)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.sox)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 3. Total PM */}
                            <Card interactive className="border-l-4 border-l-secondary">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Particulate Matter (PM)
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                            <MaterialIcon name="grain" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-secondary">
                                                {formatNum(plantTotals?.particulate_matter)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.particulate_matter)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 4. Toxics (POP/VOC/HAP) Total */}
                            <Card interactive className="border-l-4 border-l-purple-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            POP / VOC / HAP Total
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                                            <MaterialIcon name="warning" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-purple-600">
                                                {formatNum(
                                                    (Number(plantTotals?.pop) || 0) +
                                                    (Number(plantTotals?.voc) || 0) +
                                                    (Number(plantTotals?.hap) || 0)
                                                )}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Toxic emissions sum
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Stack Results Audit Table */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="precision_manufacturing" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Stack-by-Stack Air Emissions Breakdown
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Hourly emission rates (kg/hr) & annual emission totals (tonnes/year) per industrial stack
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="active" size="md">
                                    {totals?.stack_results?.length || 0} Stack Results
                                </Badge>
                            </CardHeader>
                            <CardBody className="!p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Stack Name</TableHead>
                                                <TableHead>Attached Unit</TableHead>
                                                <TableHead className="text-right">NOx (t/yr)</TableHead>
                                                <TableHead className="text-right">SOx (t/yr)</TableHead>
                                                <TableHead className="text-right">PM (t/yr)</TableHead>
                                                <TableHead className="text-right">POP (t/yr)</TableHead>
                                                <TableHead className="text-right">VOC (t/yr)</TableHead>
                                                <TableHead className="text-right">HAP (t/yr)</TableHead>
                                                <TableHead className="text-center">Hourly Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {totals?.stack_results?.map((res, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-sans font-bold text-primary text-xs">
                                                        {res.stack_name}
                                                    </TableCell>
                                                    <TableCell className="font-sans text-xs">
                                                        <Badge variant="neutral" size="sm">
                                                            {res.attached_unit}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs">
                                                        {formatNum(res.emission_per_year?.nox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-amber-700">
                                                        {formatNum(res.emission_per_year?.sox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-secondary">
                                                        {formatNum(res.emission_per_year?.particulate_matter)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {formatNum(res.emission_per_year?.pop)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {formatNum(res.emission_per_year?.voc)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {formatNum(res.emission_per_year?.hap)}
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono text-[11px] text-on-surface-variant">
                                                        <div title="Hourly Emission Rate in kg/hr">
                                                            NOx: {formatNum(res.emission_per_hour?.nox)} kg/h
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Plant Average Concentrations Card */}
                        <Card>
                            <CardHeader tone="flat">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="analytics" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Plant Average Concentrations & Total Summary
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Weighted plant average concentrations (mg/Nm³) & annual pollutant totals (tonnes/year)
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="p-card-padding">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-primary block">NOx</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.nox)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.nox)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-amber-700 block">SOx</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.sox)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.sox)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-secondary block">PM</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.particulate_matter)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.particulate_matter)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-purple-700 block">POP</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.pop)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.pop)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-purple-700 block">VOC</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.voc)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.voc)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-purple-700 block">HAP</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.hap)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.hap)} mg/Nm³
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )
            )}

            {/* Report Download Modal */}
            <BrsrAirReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                payload={activePayload}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
