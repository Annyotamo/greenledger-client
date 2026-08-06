"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type CaptiveGenerationChartProps = {
    items: EnergyBarItem[];
};

export function CaptiveGenerationChart({ items }: CaptiveGenerationChartProps) {
    const totalMwh = items.reduce((acc, item) => acc + item.value, 0);

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="factory" size="sm" className="text-secondary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Captive Generation Breakdown</h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Generated MWh by energy source
                        </p>
                    </div>
                </div>
                <Badge variant="active" size="md">
                    {totalMwh.toLocaleString("en-US", { maximumFractionDigits: 1 })} MWh Total
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-between gap-6 p-card-padding">
                {items.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center font-mono text-sm text-on-surface-variant py-8">
                        No captive generation sources logged.
                    </div>
                ) : (
                    <>
                        {/* Visual Share Distribution Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-on-surface-variant">
                                <span>Captive Energy Proportion</span>
                                <span>100% Self-Generated</span>
                            </div>
                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
                                {items.map((item) => {
                                    const share = totalMwh > 0 ? (item.value / totalMwh) * 100 : 0;
                                    if (share <= 0) return null;
                                    return (
                                        <div
                                            key={item.label}
                                            className="h-full transition-all duration-700"
                                            style={{
                                                width: `${share}%`,
                                                backgroundColor: item.color,
                                            }}
                                            title={`${item.label}: ${share.toFixed(1)}%`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* List of Breakdown Items */}
                        <div className="flex flex-1 flex-col justify-center gap-3.5">
                            {items.map((item) => {
                                const share = totalMwh > 0 ? (item.value / totalMwh) * 100 : 0;
                                return (
                                    <div
                                        key={item.label}
                                        className="flex flex-col gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 transition-colors hover:border-outline-variant">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm font-semibold text-primary">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline gap-1.5 font-mono">
                                                <span className="text-sm font-bold text-primary">
                                                    {item.value.toLocaleString("en-US", {
                                                        minimumFractionDigits: 1,
                                                        maximumFractionDigits: 1,
                                                    })}
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant">MWh</span>
                                                <span className="ml-2 rounded bg-surface-container-high px-1.5 py-0.5 text-[10px] font-bold text-on-surface">
                                                    {share.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${Math.min(Math.max(share, 0), 100)}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
