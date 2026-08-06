"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type BoilerFuelMixProps = {
    items: EnergyBarItem[];
};

export function BoilerFuelMix({ items }: BoilerFuelMixProps) {
    const totalGen = items.reduce((acc, item) => acc + item.value, 0);

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="local_fire_department" size="sm" className="text-orange-500" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Fuel Mix & Activity Summary</h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Fuel-to-electricity conversion metrics
                        </p>
                    </div>
                </div>
                <Badge variant="neutral" size="md">
                    {items.length} {items.length === 1 ? "Fuel Source" : "Fuel Sources"}
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-between gap-5 p-card-padding">
                {items.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center font-mono text-sm text-on-surface-variant py-8">
                        No fuel mix summary records available.
                    </div>
                ) : (
                    <>
                        {/* Vertical Bar Visualization Area */}
                        <div className="relative flex flex-1 flex-col justify-end rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-4">
                            <div className="absolute inset-x-4 top-3 flex justify-between font-mono text-[10px] text-on-surface-variant opacity-70">
                                <span>Thermal Fuel Conversion</span>
                                <span>{totalGen.toLocaleString("en-US", { maximumFractionDigits: 1 })} MWh Total</span>
                            </div>

                            <div className="mt-6 flex h-36 items-end justify-around gap-4 border-b border-outline-variant/40 pb-2">
                                {items.map((item) => {
                                    const pct = Math.min(100, Math.max(15, item.percent || 20));
                                    return (
                                        <div
                                            key={item.label}
                                            className="flex flex-1 flex-col items-center justify-end gap-2 h-full max-w-[120px]">
                                            <div className="flex h-full items-end w-full justify-center">
                                                <div
                                                    className="w-12 rounded-t-md transition-all duration-700 shadow-sm"
                                                    style={{ height: `${pct}%`, backgroundColor: item.color || "#fb923c" }}
                                                />
                                            </div>
                                            <span className="font-mono text-[11px] font-semibold text-primary text-center line-clamp-1">
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Metric Tiles inside CardBody */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {items.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 border-l-4 border-l-orange-400">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant line-clamp-1">
                                            {item.label}
                                        </span>
                                        <span className="font-mono text-[9px] rounded bg-surface-container-high px-1.5 py-0.5 font-bold text-on-surface">
                                            {item.percent}%
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-1 font-mono text-sm font-bold text-primary">
                                        <span>
                                            {item.value.toLocaleString("en-US", {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1,
                                            })}
                                        </span>
                                        <span className="text-[10px] font-normal text-on-surface-variant">MWh Gen</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
