"use client";

import { useEffect, useState } from "react";
import { useBrsrWaterDisclosure } from "@/lib/brsr/hooks";
import { postBrsrWaterReport } from "@/lib/brsr/api";
import { BrsrWaterReportModal } from "@/components/brsr/BrsrWaterReportModal";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { BrsrWaterDisclosurePayload } from "@/lib/brsr/types";

export default function BrsrWaterPage() {
    // Input states on the page (empty per user request)
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

    // Active payload that feeds React Query with dummy data initially
    const [activePayload, setActivePayload] = useState<BrsrWaterDisclosurePayload>({
        financial_year_label: "FY 2025-26",
        turnover_inr: 1000000.00,
        physical_output: 100.00,
        physical_output_unit: "tcs",
        withdrawal: {
            surface_water_kl: 100.50,
            groundwater_kl: 50.00,
            third_party_water_kl: 25.00,
            seawater_desalinated_kl: 10.00,
            others_kl: 5.00,
        },
        discharge: {
            surface_water: { no_treatment_kl: 10.00, with_treatment_kl: 15.00, treatment_level: "RO" },
            groundwater: { no_treatment_kl: 5.00, with_treatment_kl: 10.00, treatment_level: "RO" },
            seawater: { no_treatment_kl: 2.00, with_treatment_kl: 4.00, treatment_level: "STP" },
            third_party: { no_treatment_kl: 5.00, with_treatment_kl: 8.00, treatment_level: "RO" },
            others: { no_treatment_kl: 1.00, with_treatment_kl: 2.00, treatment_level: "RO" },
        },
        total_water_consumption_kl: 190.50,
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
        }
    } = data || {};
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsed by default

    // Auto-update total water consumption input as components change
    /* eslint-disable react-hooks/set-state-in-effect */
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
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel,
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
        a.download = `brsr-water-disclosure-report-${payload.financial_year_label.replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatKl = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                        BRSR Water Disclosure
                    </h1>
                    <p className="text-body-md text-on-surface-variant">
                        Principle 6 (Environmental Performance) water consumption accounting and intensity metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "filter_alt"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Water Controls"}</span>
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

            {/* Inputs & Parameters Panel */}
            {isFilterOpen && (
            <Card>
                <CardHeader tone="strip" className="py-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="tune" size="sm" className="text-primary" />
                        <span className="font-sans text-body-sm font-bold text-on-surface">Water Parameter Settings</span>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* General & Intensity Parameters */}
                    <div className="border-b border-outline-variant/60 pb-5">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">General & Intensity Parameters</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* FY Label */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Turnover */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Physical Output */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Physical Output Unit */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Water Withdrawal by Source */}
                    <div className="border-b border-outline-variant/60 pb-5">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">Water Withdrawal by Source (kL)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                            {/* Surface Water */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Groundwater */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Third Party Water */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Seawater / Desalinated */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Others */}
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
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>

                            {/* Total Consumption (Calculated / Editable) */}
                            <div className="space-y-1">
                                <label htmlFor="total-filter" className="text-xs font-semibold text-on-surface-variant block">
                                    Total Consumption
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
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">Water Discharge by Destination (kL)</span>
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
                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-on-surface-variant block">With Treatment (kL)</label>
                                        <input
                                            type="number"
                                            value={dest.with}
                                            onChange={(e) => dest.setWith(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-on-surface-variant block">Treatment Level</label>
                                        <input
                                            type="text"
                                            value={dest.lvl}
                                            onChange={(e) => dest.setLvl(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-2 py-1 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                            placeholder="e.g. Primary, RO"
                                        />
                                    </div>
                                </div>
                            ))}
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

                    {/* Overall Metrics Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Total Consumption */}
                        <Card interactive className="border-l-4 border-l-primary">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Water Consumption
                                    </p>
                                    <h3 className="text-headline-md font-bold text-on-surface font-mono">
                                        {formatKl(totals.total_water_consumption_kl)} <span className="text-sm font-sans font-medium text-on-surface-variant">kL</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        All source withdrawals combined
                                    </p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MaterialIcon name="opacity" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Intensity */}
                        <Card interactive className="border-l-4 border-l-indigo-500">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Water Intensity / INR
                                    </p>
                                    <h3 className="text-headline-md font-bold text-indigo-600 font-mono">
                                        {totals.water_intensity_per_inr !== null && totals.water_intensity_per_inr !== undefined ? (
                                            <>
                                                {Number(totals.water_intensity_per_inr).toFixed(6)}
                                                <span className="text-[10px] font-sans font-medium text-on-surface-variant block mt-0.5">kL / INR</span>
                                            </>
                                        ) : (
                                            "N/A"
                                        )}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Intensity ratio based on ₹{Number(turnover_inr).toLocaleString()} turnover
                                    </p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                    <MaterialIcon name="analytics" size="md" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Source Diversity Count */}
                        <Card interactive className="border-l-4 border-l-secondary">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Turnover Amount
                                    </p>
                                    <h3 className="text-headline-md font-bold text-secondary font-mono">
                                        ₹{Number(data.turnover_inr).toLocaleString()}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Input business revenue
                                    </p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                    <MaterialIcon name="payments" size="md" />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Bifurcated Source Details Card */}
                    <Card>
                        <CardHeader tone="strip" className="bg-white">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="water_drop" size="sm" className="text-blue-500" />
                                <span className="font-sans text-body-md font-bold text-on-surface">Water Consumption Source Breakdown</span>
                            </div>
                            <Badge variant="tag" size="sm">Principle 6</Badge>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Surface Water Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(totals.withdrawal.surface_water_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Groundwater Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(totals.withdrawal.groundwater_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Third-Party Water Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(totals.withdrawal.third_party_water_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Seawater Desalination</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(totals.withdrawal.seawater_desalinated_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Other Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(totals.withdrawal.others_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1 bg-surface-container/30 px-3 py-1.5 rounded-lg border border-primary/20">
                                    <span className="text-body-sm font-bold text-primary">Total Water Consumption</span>
                                    <span className="font-mono text-body-md font-bold text-primary">
                                        {formatKl(totals.total_water_consumption_kl)} <span className="text-xs font-sans font-normal">kL</span>
                                    </span>
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
