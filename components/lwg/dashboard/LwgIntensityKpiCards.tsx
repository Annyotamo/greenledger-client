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

export interface LwgEnergyIntensityCardProps {
    energyIntensity: LwgEnergyIntensityTile;
}

export function LwgEnergyIntensityCard({ energyIntensity }: LwgEnergyIntensityCardProps) {
    const isZeroYoY = energyIntensity.yoyChangePercent === 0;

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                            <MaterialIcon name="bolt" size="xs" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary truncate">
                                Energy Intensity
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant truncate">
                                Section 10 Benchmark
                            </p>
                        </div>
                    </div>

                    {/* YoY Badge */}
                    <div
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border shrink-0 whitespace-nowrap",
                            isZeroYoY
                                ? "bg-surface-container-high text-on-surface-variant border-outline-variant/60"
                                : energyIntensity.isFavorable
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200",
                        )}>
                        {isZeroYoY ? (
                            <span>0.0% YoY</span>
                        ) : (
                            <>
                                <MaterialIcon
                                    name={energyIntensity.isFavorable ? "trending_down" : "trending_up"}
                                    size="xs"
                                    className={energyIntensity.isFavorable ? "text-emerald-700" : "text-rose-700"}
                                />
                                <span>
                                    {energyIntensity.yoyChangePercent > 0 ? "+" : ""}
                                    {energyIntensity.yoyChangePercent.toFixed(1)}% YoY
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-3xl font-bold tracking-tight text-primary tabular-nums">
                            {energyIntensity.currentL12.toFixed(1)}
                        </span>
                        <span className="font-sans text-xs font-semibold text-on-surface-variant">
                            {energyIntensity.unit}
                        </span>
                    </div>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                        Latest 12 Months (L12) Consumption Rate
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-xs">
                    <span className="text-on-surface-variant font-medium">Previous 12M Baseline</span>
                    <span className="font-mono font-bold text-primary tabular-nums">
                        {energyIntensity.previousP12.toFixed(1)} {energyIntensity.unit}
                    </span>
                </div>

                <p className="font-sans text-[11px] text-on-surface-variant/75 leading-relaxed">
                    Evaluated against highest completed leather stage (MJ normalized per m² leather).
                </p>
            </CardBody>
        </Card>
    );
}

export interface LwgWaterIntensityCardProps {
    waterIntensity: LwgWaterIntensityTile;
}

export function LwgWaterIntensityCard({ waterIntensity }: LwgWaterIntensityCardProps) {
    const isZeroYoY = waterIntensity.yoyChangePercent === 0;

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200/60 shrink-0">
                            <MaterialIcon name="water_drop" size="xs" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary truncate">
                                Water Intensity
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant truncate">
                                Section 11 Benchmark
                            </p>
                        </div>
                    </div>

                    {/* YoY Badge */}
                    <div
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border shrink-0 whitespace-nowrap",
                            isZeroYoY
                                ? "bg-surface-container-high text-on-surface-variant border-outline-variant/60"
                                : waterIntensity.isFavorable
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200",
                        )}>
                        {isZeroYoY ? (
                            <span>0.0% YoY</span>
                        ) : (
                            <>
                                <MaterialIcon
                                    name={waterIntensity.isFavorable ? "trending_down" : "trending_up"}
                                    size="xs"
                                    className={waterIntensity.isFavorable ? "text-emerald-700" : "text-rose-700"}
                                />
                                <span>
                                    {waterIntensity.yoyChangePercent > 0 ? "+" : ""}
                                    {waterIntensity.yoyChangePercent.toFixed(1)}% YoY
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-3xl font-bold tracking-tight text-primary tabular-nums">
                            {waterIntensity.currentL12.toFixed(1)}
                        </span>
                        <span className="font-sans text-xs font-semibold text-on-surface-variant">
                            {waterIntensity.unit}
                        </span>
                    </div>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                        Latest 12 Months (L12) Total Water Intake
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-xs">
                    <span className="text-on-surface-variant font-medium">Previous 12M Baseline</span>
                    <span className="font-mono font-bold text-primary tabular-nums">
                        {waterIntensity.previousP12.toFixed(1)} {waterIntensity.unit}
                    </span>
                </div>

                <p className="font-sans text-[11px] text-on-surface-variant/75 leading-relaxed">
                    Total extraction (borewell + municipal + tanker) normalized per m² leather output.
                </p>
            </CardBody>
        </Card>
    );
}

export interface LwgEnvironmentalSharesCardProps {
    renewableShare: LwgShareTile;
    onsiteRenewableShare?: LwgShareTile;
    recycledWaterShare: LwgShareTile;
}

export function LwgEnvironmentalSharesCard({
    renewableShare,
    onsiteRenewableShare,
    recycledWaterShare,
}: LwgEnvironmentalSharesCardProps) {
    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                            <MaterialIcon name="eco" size="xs" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary truncate">
                                Environmental Shares
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant truncate">
                                Clean Energy & Water Recovery
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-outline-variant/60 bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-semibold text-on-surface-variant shrink-0">
                        Issue 7
                    </span>
                </div>
            </CardHeader>

            <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Renewable Energy Share */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-primary flex items-center gap-1.5 truncate">
                            <MaterialIcon name="solar_power" size="xs" className="text-amber-600 shrink-0" />
                            <span>Renewable Energy</span>
                        </span>
                        <span className="font-mono font-bold text-primary tabular-nums shrink-0 ml-2">
                            {renewableShare.percentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                        <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-700"
                            style={{ width: `${Math.min(renewableShare.percentage, 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant/80 font-sans">
                        <span className="truncate">
                            {onsiteRenewableShare && onsiteRenewableShare.percentage > 0
                                ? `${onsiteRenewableShare.percentage.toFixed(1)}% on-site solar PV`
                                : "On-site solar & grid PPA"}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant shrink-0 ml-2">
                            {renewableShare.detail}
                        </span>
                    </div>
                </div>

                {/* Recycled Water Share */}
                <div className="space-y-1.5 border-t border-outline-variant/40 pt-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-primary flex items-center gap-1.5 truncate">
                            <MaterialIcon name="autorenew" size="xs" className="text-cyan-600 shrink-0" />
                            <span>Recycled Water Share</span>
                        </span>
                        <span className="font-mono font-bold text-primary tabular-nums shrink-0 ml-2">
                            {recycledWaterShare.percentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                        <div
                            className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                            style={{ width: `${Math.min(recycledWaterShare.percentage, 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant/80 font-sans">
                        <span className="truncate">Treated effluent recycled</span>
                        <span className="font-mono text-[10px] text-on-surface-variant shrink-0 ml-2">
                            {recycledWaterShare.detail}
                        </span>
                    </div>
                </div>

                <p className="font-sans text-[11px] text-on-surface-variant/75 leading-relaxed">
                    Clean utility offsets verified against metering logs & utility declarations.
                </p>
            </CardBody>
        </Card>
    );
}

/** Backward compatibility wrapper rendering the 3 cards in a grid if used standalone */
export interface LwgIntensityKpiCardsProps {
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
        <>
            <LwgEnergyIntensityCard energyIntensity={energyIntensity} />
            <LwgWaterIntensityCard waterIntensity={waterIntensity} />
            <LwgEnvironmentalSharesCard
                renewableShare={renewableShare}
                onsiteRenewableShare={onsiteRenewableShare}
                recycledWaterShare={recycledWaterShare}
            />
        </>
    );
}
