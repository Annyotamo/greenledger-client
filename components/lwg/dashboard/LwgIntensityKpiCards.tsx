// components/lwg/dashboard/LwgIntensityKpiCards.tsx
"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type {
    LwgEnergyIntensityTile,
    LwgShareTile,
    LwgWaterIntensityTile,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgIntensityKpiCardsProps {
    energyIntensity: LwgEnergyIntensityTile;
    waterIntensity: LwgWaterIntensityTile;
    renewableShare: LwgShareTile;
    onsiteRenewableShare?: LwgShareTile;
    recycledWaterShare: LwgShareTile;
}

export function LwgIntensityKpiCards({
    energyIntensity,
    waterIntensity,
    renewableShare,
    onsiteRenewableShare,
    recycledWaterShare,
}: LwgIntensityKpiCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Energy Intensity Card */}
            <Card className="flex flex-col justify-between">
                <CardHeader bordered tone="strip">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                                <MaterialIcon name="bolt" size="xs" />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                    Energy Intensity
                                </h3>
                                <p className="font-sans text-[11px] text-on-surface-variant">
                                    LWG Section 10 Benchmark
                                </p>
                            </div>
                        </div>

                        {/* YoY Badge */}
                        <div
                            className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border",
                                energyIntensity.isFavorable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200",
                            )}>
                            <MaterialIcon
                                name={energyIntensity.isFavorable ? "trending_down" : "trending_up"}
                                size="xs"
                            />
                            <span>
                                {energyIntensity.yoyChangePercent > 0 ? "+" : ""}
                                {energyIntensity.yoyChangePercent.toFixed(1)}% YoY
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="space-y-4">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-3xl font-bold tracking-tight text-primary tabular-nums">
                                {energyIntensity.currentL12.toFixed(1)}
                            </span>
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">
                                {energyIntensity.unit}
                            </span>
                        </div>
                        <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                            Latest 12 Months (L12) Consumption Rate
                        </p>
                    </div>

                    <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-2.5 text-xs flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">Previous 12M Baseline:</span>
                        <span className="font-mono font-bold text-primary tabular-nums">
                            {energyIntensity.previousP12.toFixed(1)} {energyIntensity.unit}
                        </span>
                    </div>

                    <p className="font-sans text-[10px] text-on-surface-variant/70 leading-relaxed">
                        Evaluated against highest completed leather stage (MJ normalized per m² leather).
                    </p>
                </CardBody>
            </Card>

            {/* 2. Water Intensity Card */}
            <Card className="flex flex-col justify-between">
                <CardHeader bordered tone="strip">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
                                <MaterialIcon name="water_drop" size="xs" />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                    Water Intensity
                                </h3>
                                <p className="font-sans text-[11px] text-on-surface-variant">
                                    LWG Section 11 Benchmark
                                </p>
                            </div>
                        </div>

                        {/* YoY Badge */}
                        <div
                            className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border",
                                waterIntensity.isFavorable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200",
                            )}>
                            <MaterialIcon
                                name={waterIntensity.isFavorable ? "trending_down" : "trending_up"}
                                size="xs"
                            />
                            <span>
                                {waterIntensity.yoyChangePercent > 0 ? "+" : ""}
                                {waterIntensity.yoyChangePercent.toFixed(1)}% YoY
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="space-y-4">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-3xl font-bold tracking-tight text-primary tabular-nums">
                                {waterIntensity.currentL12.toFixed(1)}
                            </span>
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">
                                {waterIntensity.unit}
                            </span>
                        </div>
                        <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                            Latest 12 Months (L12) Total Water Intake
                        </p>
                    </div>

                    <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-2.5 text-xs flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">Previous 12M Baseline:</span>
                        <span className="font-mono font-bold text-primary tabular-nums">
                            {waterIntensity.previousP12.toFixed(1)} {waterIntensity.unit}
                        </span>
                    </div>

                    <p className="font-sans text-[10px] text-on-surface-variant/70 leading-relaxed">
                        Total extraction (borewell + municipal + tanker) normalized per m² leather output.
                    </p>
                </CardBody>
            </Card>

            {/* 3. Environmental Shares Card */}
            <Card className="flex flex-col justify-between">
                <CardHeader bordered tone="strip">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="eco" size="xs" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Environmental Shares
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Clean Energy & Water Recovery
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="space-y-4">
                    {/* Renewable Energy Share */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-primary flex items-center gap-1.5">
                                <MaterialIcon name="solar_power" size="xs" className="text-amber-500" />
                                Renewable Energy
                            </span>
                            <span className="font-mono font-bold text-primary tabular-nums">
                                {renewableShare.percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                style={{ width: `${Math.min(renewableShare.percentage, 100)}%` }}
                            />
                        </div>
                        <p className="font-sans text-[10px] text-on-surface-variant truncate">
                            {onsiteRenewableShare
                                ? `${onsiteRenewableShare.percentage.toFixed(1)}% on-site solar PV • ${renewableShare.detail}`
                                : renewableShare.detail}
                        </p>
                    </div>

                    {/* Recycled Water Share */}
                    <div className="space-y-1.5 border-t border-outline-variant/50 pt-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-primary flex items-center gap-1.5">
                                <MaterialIcon name="autorenew" size="xs" className="text-cyan-500" />
                                Recycled Water Share
                            </span>
                            <span className="font-mono font-bold text-primary tabular-nums">
                                {recycledWaterShare.percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                            <div
                                className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                                style={{ width: `${Math.min(recycledWaterShare.percentage, 100)}%` }}
                            />
                        </div>
                        <p className="font-sans text-[10px] text-on-surface-variant truncate">
                            {recycledWaterShare.detail}
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
