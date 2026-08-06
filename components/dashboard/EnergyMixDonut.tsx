import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ENERGY_MIX_TOTAL } from "@/lib/dashboard/data";
import type { Scope2Segment } from "@/lib/dashboard/types";

type EnergyMixDonutProps = {
    segments: Scope2Segment[];
    totalMwh?: number;
};

export function EnergyMixDonut({ segments, totalMwh }: EnergyMixDonutProps) {
    const primary = segments[0] || { label: "Captive Generated", percent: 0, color: "var(--gl-secondary)" };
    const secondary = segments[1] || { label: "Grid Purchase", percent: 0, color: "#fb923c" };

    const total = totalMwh ?? ENERGY_MIX_TOTAL;
    const primaryValue = Math.round((primary.percent / 100) * total);
    const secondaryValue = Math.max(0, Math.round(total - primaryValue));

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Energy Mix Breakdown
                    </h3>
                </div>
                <Badge variant="active" className="text-[9px]">
                    Live Mix
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col items-center justify-between gap-5 p-card-padding">
                <div className="relative flex h-48 w-48 items-center justify-center my-auto">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="var(--gl-surface-container-high)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={primary.color}
                            strokeWidth="4"
                            strokeDasharray={`${primary.percent}, 100`}
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={secondary.color}
                            strokeWidth="4"
                            strokeDasharray={`${secondary.percent}, 100`}
                            strokeDashoffset={-primary.percent}
                        />
                    </svg>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
                        <span className="font-mono text-[24px] font-bold text-primary">{primary.percent.toFixed(1)}%</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
                            Captive Share
                        </span>
                    </div>
                </div>

                <div className="w-full grid gap-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="h-3 w-3 rounded-sm bg-secondary" />
                            <div>
                                <div className="text-xs font-semibold text-on-surface">{primary.label}</div>
                                <div className="font-mono text-[10px] text-on-surface-variant">
                                    {primary.percent.toFixed(1)}% of total
                                </div>
                            </div>
                        </div>
                        <div className="font-label-md text-[12px] font-bold text-primary">
                            {primaryValue.toLocaleString("en-US")} MWh
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="h-3 w-3 rounded-sm bg-[#fb923c]" />
                            <div>
                                <div className="text-xs font-semibold text-on-surface">{secondary.label}</div>
                                <div className="font-mono text-[10px] text-on-surface-variant">
                                    {secondary.percent.toFixed(1)}% of total
                                </div>
                            </div>
                        </div>
                        <div className="font-label-md text-[12px] font-bold text-primary">
                            {secondaryValue.toLocaleString("en-US")} MWh
                        </div>
                    </div>
                </div>
            </CardBody>

            <div className="border-t border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
                        Total Energy Consumed
                    </span>
                    <span className="font-mono text-[12px] font-bold text-primary">
                        {total.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MWh
                    </span>
                </div>
            </div>
        </Card>
    );
}
