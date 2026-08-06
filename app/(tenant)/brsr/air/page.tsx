"use client";

import { useState } from "react";
import { BrsrDocumentUploadSection } from "@/components/brsr/BrsrDocumentUploadSection";
import { BrsrAirReportModal } from "@/components/brsr/BrsrAirReportModal";
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

export default function BrsrAirPage() {
    // General parameters with dummy defaults
    const [fyLabel, setFyLabel] = useState("FY 2025-26");
    const [turnover, setTurnover] = useState("1000000");
    const [physicalOutput, setPhysicalOutput] = useState("100");
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState("tonnes");

    // Air Emissions fields (in Metric Tonnes / kg) with dummy defaults
    const [nox, setNox] = useState("12.50");
    const [sox, setSox] = useState("8.20");
    const [pm, setPm] = useState("4.15");
    const [pop, setPop] = useState("0.45");
    const [voc, setVoc] = useState("3.80");
    const [hap, setHap] = useState("1.20");
    const [othersLabel, setOthersLabel] = useState("Flue Gas & Dust");
    const [othersValue, setOthersValue] = useState("0.75");

    // UI state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [calculatedData, setCalculatedData] = useState({
        fyLabel: "FY 2025-26",
        turnover: "1000000",
        physicalOutput: "100",
        physicalOutputUnit: "tonnes",
        nox: "12.50",
        sox: "8.20",
        pm: "4.15",
        pop: "0.45",
        voc: "3.80",
        hap: "1.20",
        othersLabel: "Flue Gas & Dust",
        othersValue: "0.75",
    });

    const handleApplyFilters = () => {
        setCalculatedData({
            fyLabel,
            turnover,
            physicalOutput,
            physicalOutputUnit,
            nox,
            sox,
            pm,
            pop,
            voc,
            hap,
            othersLabel,
            othersValue,
        });
    };

    const handleResetFilters = () => {
        setFyLabel("FY 2025-26");
        setTurnover("1000000");
        setPhysicalOutput("100");
        setPhysicalOutputUnit("tonnes");
        setNox("12.50");
        setSox("8.20");
        setPm("4.15");
        setPop("0.45");
        setVoc("3.80");
        setHap("1.20");
        setOthersLabel("Flue Gas & Dust");
        setOthersValue("0.75");
        setCalculatedData({
            fyLabel: "FY 2025-26",
            turnover: "1000000",
            physicalOutput: "100",
            physicalOutputUnit: "tonnes",
            nox: "12.50",
            sox: "8.20",
            pm: "4.15",
            pop: "0.45",
            voc: "3.80",
            hap: "1.20",
            othersLabel: "Flue Gas & Dust",
            othersValue: "0.75",
        });
    };

    // Calculate totals
    const noxNum = Number(calculatedData.nox) || 0;
    const soxNum = Number(calculatedData.sox) || 0;
    const pmNum = Number(calculatedData.pm) || 0;
    const popNum = Number(calculatedData.pop) || 0;
    const vocNum = Number(calculatedData.voc) || 0;
    const hapNum = Number(calculatedData.hap) || 0;
    const othersNum = Number(calculatedData.othersValue) || 0;

    const criteriaTotal = noxNum + soxNum + pmNum;
    const toxicTotal = popNum + vocNum + hapNum;
    const grandTotalEmissions = criteriaTotal + toxicTotal + othersNum;

    const turnoverNum = Number(calculatedData.turnover) || 0;
    const outputNum = Number(calculatedData.physicalOutput) || 0;

    const intensityPerInr = turnoverNum > 0 ? grandTotalEmissions / turnoverNum : 0;
    const intensityPerOutput = outputNum > 0 ? grandTotalEmissions / outputNum : 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="md">
                            SEBI BRSR • Principle 6
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">
                            {calculatedData.fyLabel || "FY 2025-26"}
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Air Emissions Disclosure & Accounting
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Principle 6 (Environmental Performance) ambient & stack air emissions accounting under SEBI BRSR guidelines.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Air Controls"}</span>
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
                                Air Parameter Entry & Settings
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {/* Air Emissions Entry Section */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                Air Pollutant Emissions (Metric Tonnes / kg)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        NOx (Oxides of Nitrogen)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={nox}
                                        onChange={(e) => setNox(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        SOx (Oxides of Sulfur)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={sox}
                                        onChange={(e) => setSox(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Particulate Matter (PM)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={pm}
                                        onChange={(e) => setPm(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Persistent Organic Pollutants (POP)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={pop}
                                        onChange={(e) => setPop(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Volatile Organic Compounds (VOC)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={voc}
                                        onChange={(e) => setVoc(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Hazardous Air Pollutants (HAP)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={hap}
                                        onChange={(e) => setHap(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                    />
                                </div>

                                {/* Others – please specify */}
                                <div className="space-y-1 sm:col-span-2 md:col-span-2">
                                    <label className="text-xs font-semibold text-on-surface-variant block">
                                        Others – Please Specify Label & Quantity
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Specify label (e.g. Dust, NH3)"
                                            value={othersLabel}
                                            onChange={(e) => setOthersLabel(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={othersValue}
                                            onChange={(e) => setOthersValue(e.target.value)}
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-sans text-body-md text-on-surface text-[12px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload & Verification Source Section */}
                        <BrsrDocumentUploadSection />

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                            <Button variant="secondary" size="md" onClick={handleResetFilters}>
                                Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleApplyFilters}
                                className="flex items-center gap-2">
                                <MaterialIcon name="refresh" size="sm" />
                                Generate Air Metrics
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* 4-Card Overview Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Grand Total Air Emissions */}
                <Card interactive className="border-l-4 border-l-sky-500">
                    <CardBody className="flex flex-col justify-between h-full p-card-padding">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Grand Total Air Emissions
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                                <MaterialIcon name="air" size="sm" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-headline-md font-bold text-sky-600">
                                    {grandTotalEmissions.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs font-sans text-on-surface-variant">MT</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                Total Stack & Ambient Footprint
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* 2. Criteria Air Pollutants */}
                <Card interactive className="border-l-4 border-l-indigo-500">
                    <CardBody className="flex flex-col justify-between h-full p-card-padding">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Criteria Air Pollutants
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                <MaterialIcon name="cloud" size="sm" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-headline-md font-bold text-indigo-600">
                                    {criteriaTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs font-sans text-on-surface-variant">MT</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-1">
                                NOx + SOx + Particulate Matter (PM)
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* 3. Hazardous & Organic Pollutants */}
                <Card interactive className="border-l-4 border-l-amber-500">
                    <CardBody className="flex flex-col justify-between h-full p-card-padding">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Hazardous & Toxic Pollutants
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <MaterialIcon name="warning" size="sm" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-headline-md font-bold text-amber-600">
                                    {toxicTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs font-sans text-on-surface-variant">MT</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-1">
                                POP + VOC + HAP
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* 4. Air Emission Intensity */}
                <Card interactive className="border-l-4 border-l-teal-500">
                    <CardBody className="flex flex-col justify-between h-full p-card-padding">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Air Emission Intensity
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                                <MaterialIcon name="analytics" size="sm" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1 font-mono">
                                <span className="text-headline-md font-bold text-teal-600">
                                    {intensityPerInr > 0 ? intensityPerInr.toFixed(6) : "0.00"}
                                </span>
                                <span className="text-[10px] font-sans text-on-surface-variant">MT/INR</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                {intensityPerOutput > 0 ? `${intensityPerOutput.toFixed(3)} MT / ${calculatedData.physicalOutputUnit || "unit"}` : "Output ratio"}
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Bifurcated Source Breakdown */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Criteria Pollutants */}
                <Card>
                    <CardHeader tone="strip" className="py-2.5">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="filter_drama" size="sm" className="text-indigo-600" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Criteria Air Pollutants
                            </span>
                        </div>
                        <Badge variant="active" size="sm">Stack Monitored</Badge>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <AirPollutantRow
                            label="NOx (Oxides of Nitrogen)"
                            val={noxNum}
                            total={grandTotalEmissions}
                            color="#4f46e5"
                        />
                        <AirPollutantRow
                            label="SOx (Oxides of Sulfur)"
                            val={soxNum}
                            total={grandTotalEmissions}
                            color="#0284c7"
                        />
                        <AirPollutantRow
                            label="Particulate Matter (PM)"
                            val={pmNum}
                            total={grandTotalEmissions}
                            color="#0f766e"
                        />
                    </CardBody>
                </Card>

                {/* Hazardous & Organic Pollutants */}
                <Card>
                    <CardHeader tone="strip" className="py-2.5">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="biotech" size="sm" className="text-amber-600" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Hazardous & Persistent Pollutants
                            </span>
                        </div>
                        <Badge variant="neutral" size="sm">Controlled</Badge>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <AirPollutantRow
                            label="Persistent Organic Pollutants (POP)"
                            val={popNum}
                            total={grandTotalEmissions}
                            color="#d97706"
                        />
                        <AirPollutantRow
                            label="Volatile Organic Compounds (VOC)"
                            val={vocNum}
                            total={grandTotalEmissions}
                            color="#ea580c"
                        />
                        <AirPollutantRow
                            label="Hazardous Air Pollutants (HAP)"
                            val={hapNum}
                            total={grandTotalEmissions}
                            color="#dc2626"
                        />
                        <AirPollutantRow
                            label={calculatedData.othersLabel || "Others"}
                            val={othersNum}
                            total={grandTotalEmissions}
                            color="#64748b"
                        />
                    </CardBody>
                </Card>
            </div>

            {/* SEBI BRSR Principle 6 Air Disclosure Table */}
            <Card>
                <CardHeader tone="strip" className="flex items-center justify-between py-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="table_chart" size="sm" className="text-primary" />
                        <span className="font-sans text-body-sm font-bold text-on-surface">
                            SEBI BRSR Principle 6 Mandatory Air Emissions Audit Table
                        </span>
                    </div>
                    <Badge variant="positive" size="sm">BRSR Compliant</Badge>
                </CardHeader>
                <CardBody className="!p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Parameter / Air Pollutant</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Quantity (Metric Tonnes)</TableHead>
                                    <TableHead className="text-right">% Share</TableHead>
                                    <TableHead>Measurement / Audit Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">NOx (Oxides of Nitrogen)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Criteria Air Pollutant</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{noxNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((noxNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">Continuous Emission Monitoring System (CEMS)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">SOx (Oxides of Sulfur)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Criteria Air Pollutant</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{soxNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((soxNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">Stack Flue Gas Analyzer</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">Particulate Matter (PM)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Criteria Air Pollutant</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{pmNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((pmNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">High-Volume Air Sampler (HVAS)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">Persistent Organic Pollutants (POP)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Persistent Pollutant</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{popNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((popNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">Periodic Accredited Lab Testing</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">Volatile Organic Compounds (VOC)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Volatile Organic</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{vocNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((vocNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">PID / Flame Ionization Detector</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">Hazardous Air Pollutants (HAP)</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Toxic Pollutant</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{hapNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((hapNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">Material Balance & Lab Analysis</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-xs text-on-surface">{calculatedData.othersLabel || "Others"}</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant">Other Emissions</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-on-surface">{othersNum.toFixed(2)} MT</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{grandTotalEmissions > 0 ? ((othersNum / grandTotalEmissions) * 100).toFixed(1) : "0.0"}%</TableCell>
                                    <TableCell className="text-xs text-on-surface-variant font-mono">Operational Logbook Estimation</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardBody>
            </Card>

            {/* Download Report Modal */}
            <BrsrAirReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                data={calculatedData}
            />
        </div>
    );
}

function AirPollutantRow({
    label,
    val,
    total,
    color,
}: {
    label: string;
    val: number;
    total: number;
    color: string;
}) {
    const share = total > 0 ? (val / total) * 100 : 0;

    return (
        <div className="space-y-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 transition-colors hover:border-outline-variant">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">{label}</span>
                <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-sm font-bold text-primary">
                        {val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">MT</span>
                    <span className="ml-1 rounded bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold text-on-surface">
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
