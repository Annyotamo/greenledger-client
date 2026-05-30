import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { SCOPE2_CARBON_INTENSITY, SCOPE2_TOTAL } from "@/lib/dashboard/data";
import type { Scope2Segment } from "@/lib/dashboard/types";

type Scope2DonutProps = {
    segments: Scope2Segment[];
};

/** Donut — SVG stroke rings matching designs/dashboard-light.html */
export function Scope2Donut({ segments }: Scope2DonutProps) {
    const [grid, solar, wind] = segments;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="bolt" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Scope 2 Breakdown (Electricity)
                    </h3>
                </div>
                <Badge
                    variant="active"
                    className="border-0 bg-secondary-container/20 text-on-secondary-container text-[9px]">
                    Electricity Usage
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-center gap-8">
                <div className="flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
                    <div className="space-y-0.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Carbon Intensity
                        </p>
                        <p className="font-mono text-[18px] font-bold text-primary">
                            {SCOPE2_CARBON_INTENSITY}{" "}
                            <span className="text-[12px] font-normal opacity-70">gCO2e/kWh</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-secondary-container/30 px-2.5 py-1 text-secondary">
                        <MaterialIcon name="trending_down" size="xs" className="font-bold" />
                        <span className="font-mono text-[10px] font-bold uppercase">Trending Down</span>
                    </div>
                </div>

                <div className="flex items-center gap-10 py-4">
                    <div className="relative h-40 w-40 shrink-0">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke={grid?.color ?? "var(--gl-chart-esg-teal)"}
                                strokeWidth="4"
                                strokeDasharray={`${grid?.percent ?? 72}, 100`}
                            />
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke={solar?.color ?? "var(--gl-chart-solar)"}
                                strokeWidth="4"
                                strokeDasharray={`${solar?.percent ?? 18}, 100`}
                                strokeDashoffset={-(grid?.percent ?? 72)}
                            />
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke={wind?.color ?? "var(--gl-chart-wind)"}
                                strokeWidth="4"
                                strokeDasharray={`${wind?.percent ?? 10}, 100`}
                                strokeDashoffset={-((grid?.percent ?? 72) + (solar?.percent ?? 18))}
                            />
                        </svg>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="font-mono text-[20px] font-bold leading-none text-primary">
                                {(SCOPE2_TOTAL / 1000).toFixed(1)}k
                            </span>
                            <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
                                tCO2e
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {segments.map((segment) => (
                            <div key={segment.label} className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-sm"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    <span className="text-[13px] text-on-surface">{segment.label}</span>
                                </div>
                                <span className="shrink-0 font-mono text-[12px] font-bold text-primary">
                                    {segment.percent}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>

            <div className="flex h-16 items-center justify-between border-t border-outline-variant px-card-padding bg-surface-container-lowest">
                <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <MaterialIcon name="history" size="xs" />
                    <p className="font-mono text-[10px] uppercase tracking-wide">Last sync: 08:45 AM</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="group inline-flex p-2 items-center gap-2 rounded border border-outline-variant/30 bg-surface-container-low px-4 font-mono text-[11px] text-primary transition-all hover:bg-surface-container-high active:scale-95">
                        <MaterialIcon
                            name="sync"
                            size="xs"
                            className="transition-transform duration-500 group-hover:rotate-180"
                        />
                        Refresh Data
                    </button>
                    <button
                        type="button"
                        className="inline-flex p-2 items-center justify-center rounded bg-primary px-4 font-mono text-[11px] text-on-primary transition-opacity hover:opacity-90">
                        Analysis
                    </button>
                </div>
            </div>
        </Card>
    );
}
