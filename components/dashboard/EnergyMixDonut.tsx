import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ENERGY_MIX_TOTAL } from "@/lib/dashboard/data";
import type { Scope2Segment } from "@/lib/dashboard/types";

type EnergyMixDonutProps = {
    segments: Scope2Segment[];
};

export function EnergyMixDonut({ segments }: EnergyMixDonutProps) {
    const [primary, secondary] = segments;
    const total = ENERGY_MIX_TOTAL;
    const primaryValue = Math.round((primary.percent / 100) * total);
    const secondaryValue = total - primaryValue;

    return (
        <Card className="h-full">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Dec 2024 Mix
                    </h3>
                </div>
                <Badge variant="active" className="text-[9px]">
                    Energy Mix
                </Badge>
            </CardHeader>

            <CardBody className="flex h-full flex-col items-center gap-6 px-6 pt-4 pb-4">
                <div className="relative flex h-56 w-56 items-center justify-center">
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
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
                        <span className="font-mono text-[28px] font-bold text-primary">{primary.percent}%</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Captive Share
                        </span>
                    </div>
                </div>

                <div className="w-full grid gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-sm bg-secondary" />
                            <div>
                                <div className="text-sm font-semibold text-on-surface">{primary.label}</div>
                                <div className="font-mono text-[11px] text-on-surface-variant">
                                    {primary.percent}% of total
                                </div>
                            </div>
                        </div>
                        <div className="font-label-md text-[12px] font-bold text-primary">
                            {primaryValue.toLocaleString()} MWh
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-sm bg-[#fb923c]" />
                            <div>
                                <div className="text-sm font-semibold text-on-surface">{secondary.label}</div>
                                <div className="font-mono text-[11px] text-on-surface-variant">
                                    {secondary.percent}% of total
                                </div>
                            </div>
                        </div>
                        <div className="font-label-md text-[12px] font-bold text-primary">
                            {secondaryValue.toLocaleString()} MWh
                        </div>
                    </div>
                </div>
            </CardBody>

            <div className="border-t border-outline-variant px-card-padding py-4 bg-surface-container-lowest">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                            Energy mix overview
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                            Captive share remains strong, while grid support fills the balance.
                        </p>
                    </div>
                    <Button variant="secondary" className="h-10 rounded-full px-4 text-[11px] tracking-wide">
                        Review details
                    </Button>
                </div>
            </div>
        </Card>
    );
}
