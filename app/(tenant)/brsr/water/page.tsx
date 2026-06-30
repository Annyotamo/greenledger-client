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
    // Input states on the page
    const [fyLabel, setFyLabel] = useState("FY 2024-2025");
    const [surfaceWater, setSurfaceWater] = useState("2500");
    const [groundwater, setGroundwater] = useState("1200");
    const [thirdParty, setThirdParty] = useState("5600");
    const [seawater, setSeawater] = useState("2000");
    const [others, setOthers] = useState("500");
    const [totalWater, setTotalWater] = useState("11800");
    const [turnover, setTurnover] = useState("50000");

    // Active payload that feeds React Query
    const [activePayload, setActivePayload] = useState<BrsrWaterDisclosurePayload>({
        financial_year_label: "FY 2024-2025",
        surface_water_kl: "2500",
        groundwater_kl: "1200",
        third_party_water_kl: "5600",
        seawater_desalinated_kl: "2000",
        others_kl: "500",
        total_water_consumption_kl: "11800",
        turnover_inr: "50000",
    });

    const { data, isPending, isError, error } = useBrsrWaterDisclosure(activePayload);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

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
        }
    }, [surfaceWater, groundwater, thirdParty, seawater, others]);

    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel,
            surface_water_kl: surfaceWater,
            groundwater_kl: groundwater,
            third_party_water_kl: thirdParty,
            seawater_desalinated_kl: seawater,
            others_kl: others,
            total_water_consumption_kl: totalWater,
            turnover_inr: turnover,
        });
    };

    const handleReset = () => {
        setFyLabel("FY 2024-2025");
        setSurfaceWater("2500");
        setGroundwater("1200");
        setThirdParty("5600");
        setSeawater("2000");
        setOthers("500");
        setTotalWater("11800");
        setTurnover("50000");
        setActivePayload({
            financial_year_label: "FY 2024-2025",
            surface_water_kl: "2500",
            groundwater_kl: "1200",
            third_party_water_kl: "5600",
            seawater_desalinated_kl: "2000",
            others_kl: "500",
            total_water_consumption_kl: "11800",
            turnover_inr: "50000",
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
                <div>
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
            <Card>
                <CardHeader tone="strip" className="py-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="tune" size="sm" className="text-primary" />
                        <span className="font-sans text-body-sm font-bold text-on-surface">Water Parameter Settings</span>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Financial Year Label */}
                        <div className="space-y-1">
                            <label htmlFor="fy-filter" className="text-xs font-semibold text-on-surface-variant block">
                                FY Label
                            </label>
                            <input
                                id="fy-filter"
                                type="text"
                                value={fyLabel}
                                onChange={(e) => setFyLabel(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Turnover */}
                        <div className="space-y-1">
                            <label htmlFor="turnover-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Turnover (INR)
                            </label>
                            <input
                                id="turnover-filter"
                                type="number"
                                value={turnover}
                                onChange={(e) => setTurnover(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Surface Water */}
                        <div className="space-y-1">
                            <label htmlFor="surface-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Surface Water (kL)
                            </label>
                            <input
                                id="surface-filter"
                                type="number"
                                value={surfaceWater}
                                onChange={(e) => setSurfaceWater(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Groundwater */}
                        <div className="space-y-1">
                            <label htmlFor="ground-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Groundwater (kL)
                            </label>
                            <input
                                id="ground-filter"
                                type="number"
                                value={groundwater}
                                onChange={(e) => setGroundwater(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Third Party Water */}
                        <div className="space-y-1">
                            <label htmlFor="thirdparty-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Third Party Water (kL)
                            </label>
                            <input
                                id="thirdparty-filter"
                                type="number"
                                value={thirdParty}
                                onChange={(e) => setThirdParty(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Seawater / Desalinated */}
                        <div className="space-y-1">
                            <label htmlFor="seawater-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Seawater/Desalinated (kL)
                            </label>
                            <input
                                id="seawater-filter"
                                type="number"
                                value={seawater}
                                onChange={(e) => setSeawater(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Others */}
                        <div className="space-y-1">
                            <label htmlFor="others-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Others (kL)
                            </label>
                            <input
                                id="others-filter"
                                type="number"
                                value={others}
                                onChange={(e) => setOthers(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Total Consumption (Calculated / Editable) */}
                        <div className="space-y-1">
                            <label htmlFor="total-filter" className="text-xs font-semibold text-on-surface-variant block">
                                Total Consumption (kL)
                            </label>
                            <input
                                id="total-filter"
                                type="number"
                                value={totalWater}
                                onChange={(e) => setTotalWater(e.target.value)}
                                className="w-full rounded-lg border border-primary bg-surface-container-low px-3 py-1.5 font-sans text-body-md text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                            />
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

            {/* Content Loading State */}
            {isPending ? (
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
                    {/* Financial Year Summary Bar */}
                    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/30 text-on-secondary-container">
                                <MaterialIcon name="water_drop" size="lg" />
                            </div>
                            <div>
                                <span className="font-sans text-body-lg font-bold text-on-surface">
                                    Water Disclosure Status
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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Total Consumption */}
                        <Card interactive className="border-l-4 border-l-primary">
                            <CardBody className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Total Water Consumption
                                    </p>
                                    <h3 className="text-headline-md font-bold text-on-surface font-mono">
                                        {formatKl(data.total_water_consumption_kl)} <span className="text-sm font-sans font-medium text-on-surface-variant">kL</span>
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
                                    <h3 className="text-headline-md font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                                        {data.water_intensity_per_inr !== null && data.water_intensity_per_inr !== undefined ? (
                                            <>
                                                {Number(data.water_intensity_per_inr).toFixed(6)}
                                                <span className="text-[10px] font-sans font-medium text-on-surface-variant block mt-0.5">kL / INR</span>
                                            </>
                                        ) : (
                                            "N/A"
                                        )}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Intensity ratio based on ₹{Number(data.turnover_inr).toLocaleString()} turnover
                                    </p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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
                                        {formatKl(data.surface_water_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Groundwater Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(data.groundwater_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Third-Party Water Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(data.third_party_water_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Seawater Desalination</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(data.seawater_desalinated_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <span className="text-body-sm text-on-surface-variant font-medium">Other Withdrawals</span>
                                    <span className="font-mono text-body-md font-bold text-on-surface">
                                        {formatKl(data.others_kl)} <span className="text-xs text-on-surface-variant font-sans font-normal">kL</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-1 bg-surface-container/30 px-3 py-1.5 rounded-lg border border-primary/20">
                                    <span className="text-body-sm font-bold text-primary">Total Water Consumption</span>
                                    <span className="font-mono text-body-md font-bold text-primary">
                                        {formatKl(data.total_water_consumption_kl)} <span className="text-xs font-sans font-normal">kL</span>
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
