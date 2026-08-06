"use client";

import { useEffect, useState } from "react";
import { useBrsrWaterDisclosure } from "@/lib/brsr/hooks";
import { postBrsrWaterReport } from "@/lib/brsr/api";
import { BrsrWaterReportModal } from "@/components/brsr/BrsrWaterReportModal";
import { BrsrDocumentUploadSection } from "@/components/brsr/BrsrDocumentUploadSection";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrWaterDisclosurePayload } from "@/lib/brsr/types";

export default function BrsrWaterPage() {
    // Input states on the page
    const [fyLabel, setFyLabel] = useState("");
    const [turnover, setTurnover] = useState("");
    const [physicalOutput, setPhysicalOutput] = useState("");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("");

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

    // Active payload initialized with demonstration data
    const [activePayload, setActivePayload] = useState<BrsrWaterDisclosurePayload>({
        financial_year_label: "FY 2025-26",
        turnover_inr: 1000000.0,
        physical_output: 100.0,
        physical_output_unit: "tcs",
        withdrawal: {
            surface_water_kl: 100.5,
            groundwater_kl: 50.0,
            third_party_water_kl: 25.0,
            seawater_desalinated_kl: 10.0,
            others_kl: 5.0,
        },
        discharge: {
            surface_water: { no_treatment_kl: 10.0, with_treatment_kl: 15.0, treatment_level: "RO" },
            groundwater: { no_treatment_kl: 5.0, with_treatment_kl: 10.0, treatment_level: "RO" },
            seawater: { no_treatment_kl: 2.0, with_treatment_kl: 4.0, treatment_level: "STP" },
            third_party: { no_treatment_kl: 5.0, with_treatment_kl: 8.0, treatment_level: "RO" },
            others: { no_treatment_kl: 1.0, with_treatment_kl: 2.0, treatment_level: "RO" },
        },
        total_water_consumption_kl: 190.5,
    });

    const { data, isPending, isError, error } = useBrsrWaterDisclosure(activePayload);
    const {
        turnover_inr = 0,
        totals = {
            withdrawal: {
                surface_water_kl: "0",
                groundwater_kl: "0",
                third_party_water_kl: "0",
                seawater_desalinated_kl: "0",
                others_kl: "0",
            },
            total_water_withdrawal_kl: "0",
            discharge: {
                surface_water: { no_treatment_kl: "0", with_treatment_kl: "0", treatment_level: null },
                groundwater: { no_treatment_kl: "0", with_treatment_kl: "0", treatment_level: null },
                seawater: { no_treatment_kl: "0", with_treatment_kl: "0", treatment_level: null },
                third_party: { no_treatment_kl: "0", with_treatment_kl: "0", treatment_level: null },
                others: { no_treatment_kl: "0", with_treatment_kl: "0", treatment_level: null },
            },
            total_water_discharge_kl: "0",
            total_water_consumption_kl: "0",
            water_intensity_per_inr: null,
            water_intensity_ppp: null,
            water_intensity_physical: null,
            water_intensity_physical_unit: null,
        },
    } = data || {};

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Auto-update total water consumption input as components change
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

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel || "FY 2025-26",
            turnover_inr: Number(turnover) || 0,
            physical_output: physicalOutput ? Number(physicalOutput) : null,
            physical_output_unit: physicalOutputUnit || null,
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
    };

    const handleReset = () => {
        setFyLabel("");
        setTurnover("");
        setPhysicalOutput("");
        setPhysicalOutputUnit("");
        setSurfaceWater("");
        setGroundwater("");
        setThirdParty("");
        setSeawater("");
        setOthers("");
        setDischargeSurfaceNoTreatment("");
        setDischargeSurfaceWithTreatment("");
        setDischargeSurfaceLevel("");
        setDischargeGroundNoTreatment("");
        setDischargeGroundWithTreatment("");
        setDischargeGroundLevel("");
        setDischargeSeawaterNoTreatment("");
        setDischargeSeawaterWithTreatment("");
        setDischargeSeawaterLevel("");
        setDischargeThirdPartyNoTreatment("");
        setDischargeThirdPartyWithTreatment("");
        setDischargeThirdPartyLevel("");
        setDischargeOthersNoTreatment("");
        setDischargeOthersWithTreatment("");
        setDischargeOthersLevel("");
        setTotalWater("");

        setActivePayload({
            financial_year_label: "",
            turnover_inr: 0,
            withdrawal: {
                surface_water_kl: 0,
                groundwater_kl: 0,
                third_party_water_kl: 0,
                seawater_desalinated_kl: 0,
                others_kl: 0,
            },
            discharge: {
                surface_water: { no_treatment_kl: 0, with_treatment_kl: 0 },
                groundwater: { no_treatment_kl: 0, with_treatment_kl: 0 },
                seawater: { no_treatment_kl: 0, with_treatment_kl: 0 },
                third_party: { no_treatment_kl: 0, with_treatment_kl: 0 },
                others: { no_treatment_kl: 0, with_treatment_kl: 0 },
            },
        });
    };

    const handleDownloadReport = async (payload: BrsrWaterDisclosurePayload) => {
        const blob = await postBrsrWaterReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-water-disclosure-report-${(payload.financial_year_label || "2025").replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatKl = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate derived totals
    const totalWithdrawal = Number(totals.total_water_withdrawal_kl) || 0;
    const totalDischarge = Number(totals.total_water_discharge_kl) || 0;
    const totalConsumption = Number(totals.total_water_consumption_kl) || 0;

    // Calculate treated vs untreated discharge sum
    const dischargeEntries = [
        { label: "Surface Water", d: totals.discharge.surface_water },
        { label: "Groundwater", d: totals.discharge.groundwater },
        { label: "Seawater", d: totals.discharge.seawater },
        { label: "Third-Party Water", d: totals.discharge.third_party },
        { label: "Other Sources", d: totals.discharge.others },
    ];

    let totalTreatedDischarge = 0;
    let totalUntreatedDischarge = 0;

    dischargeEntries.forEach(({ d }) => {
        totalUntreatedDischarge += Number(d.no_treatment_kl) || 0;
        totalTreatedDischarge += Number(d.with_treatment_kl) || 0;
    });

    const treatmentRatio = totalDischarge > 0 ? (totalTreatedDischarge / totalDischarge) * 100 : 0;

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
                        BRSR Water Disclosure & Accounting
                    </h1>
                    <p className="text-sm  text-on-surface-variant">
                        Comprehensive accounting of Water Intake/Withdrawal, Effluent Discharge, Net Consumption & Intensity Ratios under SEBI BRSR guidelines.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Water Controls"}</span>
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
                <Card>
                    <CardHeader tone="strip" className="py-2.5 bg-white">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Water Parameter Settings & Entry
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {/* General & Intensity Parameters */}
                        <div className="border-b border-outline-variant/60 pb-5">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">
                                General & Intensity Parameters
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="fy-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        FY Label <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="fy-filter"
                                        type="text"
                                        placeholder="e.g. FY 2025-26"
                                        value={fyLabel}
                                        onChange={(e) => setFyLabel(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="turnover-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Turnover (INR) <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="turnover-filter"
                                        type="number"
                                        placeholder="e.g. 1000000"
                                        value={turnover}
                                        onChange={(e) => setTurnover(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="physical-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Physical Output
                                    </label>
                                    <input
                                        id="physical-filter"
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 100"
                                        value={physicalOutput}
                                        onChange={(e) => setPhysicalOutput(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="physical-unit-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Physical Output Unit
                                    </label>
                                    <input
                                        id="physical-unit-filter"
                                        type="text"
                                        placeholder="e.g. litres, tcs"
                                        value={physicalOutputUnit}
                                        onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Water Withdrawal by Source */}
                        <div className="border-b border-outline-variant/60 pb-5">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">
                                Water Withdrawal by Source (kL)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="surface-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Surface Water
                                    </label>
                                    <input
                                        id="surface-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={surfaceWater}
                                        onChange={(e) => setSurfaceWater(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="ground-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Groundwater
                                    </label>
                                    <input
                                        id="ground-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={groundwater}
                                        onChange={(e) => setGroundwater(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="thirdparty-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Third Party Water
                                    </label>
                                    <input
                                        id="thirdparty-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={thirdParty}
                                        onChange={(e) => setThirdParty(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="seawater-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Seawater/Desalinated
                                    </label>
                                    <input
                                        id="seawater-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={seawater}
                                        onChange={(e) => setSeawater(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="others-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Others
                                    </label>
                                    <input
                                        id="others-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={others}
                                        onChange={(e) => setOthers(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="total-filter" className="text-xs font-semibold text-on-surface-variant block">
                                        Net Consumption
                                    </label>
                                    <input
                                        id="total-filter"
                                        type="number"
                                        placeholder="0.00"
                                        value={totalWater}
                                        onChange={(e) => setTotalWater(e.target.value)}
                                        className="w-full rounded-lg border border-primary bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
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
                                                className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                                placeholder="e.g. RO, STP, ETP"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Document Upload & Verification Source Section */}
                        <BrsrDocumentUploadSection />

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

            {/* Content Loading State */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Water Disclosure Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please enter the Financial Year, Turnover, and water withdrawal/discharge quantities in the controls panel above, then click Generate Metrics to calculate water accounting details.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating water metrics...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error">
                    <MaterialIcon name="warning" className="mx-auto mb-2" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate water disclosure."}</p>
                </div>
            ) : (
                <>
                    {/* Overall 4-Card Metrics Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Water Withdrawal */}
                        <Card interactive className="border-l-4 border-l-blue-500">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Water Intake
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                        <MaterialIcon name="water_drop" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-primary">
                                            {formatKl(totals.total_water_withdrawal_kl)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">kL</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        Combined withdrawal across 5 sources
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 2. Total Water Discharge */}
                        <Card interactive className="border-l-4 border-l-amber-500">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Water Discharge
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                        <MaterialIcon name="waves" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-amber-600">
                                            {formatKl(totals.total_water_discharge_kl)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">kL</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        {treatmentRatio.toFixed(1)}% treated before release
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 3. Net Water Consumption */}
                        <Card interactive className="border-l-4 border-l-secondary">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Net Water Consumption
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                        <MaterialIcon name="opacity" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-secondary">
                                            {formatKl(totals.total_water_consumption_kl)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">kL</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        Net consumed in business operations
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 4. Water Intensity */}
                        <Card interactive className="border-l-4 border-l-indigo-500">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Water Intensity / INR
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                        <MaterialIcon name="analytics" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-headline-md font-bold text-indigo-600">
                                        {totals.water_intensity_per_inr !== null && totals.water_intensity_per_inr !== undefined
                                            ? Number(totals.water_intensity_per_inr).toFixed(6)
                                            : "N/A"}
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        kL per ₹{Number(turnover_inr).toLocaleString()} turnover
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Water Withdrawal by Source Breakdown Card */}
                    <Card>
                        <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="water_drop" size="sm" className="text-blue-500" />
                                <div>
                                    <h3 className="text-headline-sm font-semibold text-primary">
                                        Water Withdrawal by Source
                                    </h3>
                                    <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                        Total volume of water withdrawn from different sources (kL)
                                    </p>
                                </div>
                            </div>
                            <Badge variant="active" size="md">
                                {formatKl(totals.total_water_withdrawal_kl)} kL Total Intake
                            </Badge>
                        </CardHeader>
                        <CardBody className="space-y-5 p-card-padding">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Surface, Groundwater, Third Party */}
                                <div className="space-y-4">
                                    <SourceWithdrawalRow
                                        label="Surface Water Withdrawals"
                                        val={totals.withdrawal.surface_water_kl}
                                        total={totalWithdrawal}
                                        color="#3b82f6"
                                    />
                                    <SourceWithdrawalRow
                                        label="Groundwater Withdrawals"
                                        val={totals.withdrawal.groundwater_kl}
                                        total={totalWithdrawal}
                                        color="#06b6d4"
                                    />
                                    <SourceWithdrawalRow
                                        label="Third-Party Water Withdrawals"
                                        val={totals.withdrawal.third_party_water_kl}
                                        total={totalWithdrawal}
                                        color="#6366f1"
                                    />
                                </div>

                                {/* Right Column: Seawater, Others, Total Summary */}
                                <div className="space-y-4">
                                    <SourceWithdrawalRow
                                        label="Seawater / Desalinated Water"
                                        val={totals.withdrawal.seawater_desalinated_kl}
                                        total={totalWithdrawal}
                                        color="#0284c7"
                                    />
                                    <SourceWithdrawalRow
                                        label="Other Sources Withdrawals"
                                        val={totals.withdrawal.others_kl}
                                        total={totalWithdrawal}
                                        color="#64748b"
                                    />

                                    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3.5 mt-2">
                                        <div className="flex items-center gap-2">
                                            <MaterialIcon name="waves" size="sm" className="text-primary" />
                                            <span className="text-sm font-bold text-primary">
                                                Total Water Withdrawal
                                            </span>
                                        </div>
                                        <span className="font-mono text-base font-bold text-primary">
                                            {formatKl(totals.total_water_withdrawal_kl)}{" "}
                                            <span className="text-xs font-sans font-normal text-on-surface-variant">kL</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Water Discharge & Treatment Breakdown Card */}
                    <Card>
                        <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="alt_route" size="sm" className="text-amber-500" />
                                <div>
                                    <h3 className="text-headline-sm font-semibold text-primary">
                                        Water Discharge by Destination & Treatment Level
                                    </h3>
                                    <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                        Volume of water discharged by destination & treatment status (kL)
                                    </p>
                                </div>
                            </div>
                            <Badge variant="neutral" size="md">
                                {formatKl(totals.total_water_discharge_kl)} kL Discharged
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {dischargeEntries.map(({ label, d }) => {
                                    const noTrt = Number(d.no_treatment_kl) || 0;
                                    const withTrt = Number(d.with_treatment_kl) || 0;
                                    const destTotal = noTrt + withTrt;

                                    return (
                                        <div
                                            key={label}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 transition-colors hover:border-outline-variant">
                                            <div className="space-y-1 min-w-[200px]">
                                                <span className="text-sm font-bold text-primary">{label}</span>
                                                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
                                                    <span>Total: {formatKl(destTotal)} kL</span>
                                                    {d.treatment_level && (
                                                        <Badge variant="active" size="sm" className="text-[9px]">
                                                            Lvl: {d.treatment_level}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
                                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-outline-variant/40">
                                                    <span className="text-on-surface-variant font-sans text-[11px]">No Treatment:</span>
                                                    <span className="font-bold text-amber-600">{formatKl(noTrt)} kL</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-outline-variant/40">
                                                    <span className="text-on-surface-variant font-sans text-[11px]">With Treatment:</span>
                                                    <span className="font-bold text-secondary">{formatKl(withTrt)} kL</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 mt-4">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="clean_hands" size="sm" className="text-amber-600" />
                                    <span className="text-sm font-bold text-amber-900">
                                        Total Water Discharge Summary
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 font-mono text-sm font-bold text-amber-900">
                                    <span>Treated: {formatKl(totalTreatedDischarge)} kL</span>
                                    <span>Untreated: {formatKl(totalUntreatedDischarge)} kL</span>
                                    <span className="text-primary border-l border-amber-500/30 pl-4">
                                        Total: {formatKl(totals.total_water_discharge_kl)} kL
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Net Consumption & Mass Balance Card */}
                    <Card>
                        <CardHeader tone="flat">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="account_balance" size="sm" className="text-secondary" />
                                <div>
                                    <h3 className="text-headline-sm font-semibold text-primary">
                                        Water Accounting
                                    </h3>
                                    <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                        Net Water Consumption = Total Water Withdrawal (kL) - Total Water Discharge (kL)
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                                        1. Total Withdrawal (Intake)
                                    </span>
                                    <span className="font-mono text-xl font-bold text-blue-900 mt-1 block">
                                        {formatKl(totalWithdrawal)} kL
                                    </span>
                                </div>

                                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                                        2. Total Discharge (Returned)
                                    </span>
                                    <span className="font-mono text-xl font-bold text-amber-900 mt-1 block">
                                        {formatKl(totalDischarge)} kL
                                    </span>
                                </div>

                                <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block">
                                        3. Net Water Consumption
                                    </span>
                                    <span className="font-mono text-xl font-bold text-secondary mt-1 block">
                                        {formatKl(totalConsumption)} kL
                                    </span>
                                </div>
                            </div>

                            {/* Proportion Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                                    <span>Discharge vs Consumption Split of Intake</span>
                                    <span>
                                        {totalWithdrawal > 0
                                            ? `${((totalConsumption / totalWithdrawal) * 100).toFixed(1)}% Consumed`
                                            : "0%"}
                                    </span>
                                </div>
                                <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-700"
                                        style={{
                                            width: `${totalWithdrawal > 0 ? (totalDischarge / totalWithdrawal) * 100 : 0}%`,
                                        }}
                                        title={`Discharged: ${formatKl(totalDischarge)} kL`}
                                    />
                                    <div
                                        className="h-full bg-secondary transition-all duration-700"
                                        style={{
                                            width: `${totalWithdrawal > 0 ? (totalConsumption / totalWithdrawal) * 100 : 0}%`,
                                        }}
                                        title={`Consumed: ${formatKl(totalConsumption)} kL`}
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-4 text-[11px] font-mono">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                                        <span className="text-on-surface-variant">Discharged Water</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-secondary" />
                                        <span className="text-on-surface-variant">Net Consumed Water</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}

            {/* Download Report Modal */}
            <BrsrWaterReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}

function SourceWithdrawalRow({
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
                    <span className="text-[10px] text-on-surface-variant">kL</span>
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
