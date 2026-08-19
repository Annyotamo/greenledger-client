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
    let cumulative = 0;
    const circles = segments.map((seg) => {
        const offset = cumulative;
        cumulative += seg.percent;
        return {
            ...seg,
            offset,
        };
    });

    const totalPercent = Math.round(cumulative);

    return (
        <Card className="flex h-full flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="pie_chart" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Gas Breakdown (% CO2e)
                    </h3>
                </div>
                <Badge
                    variant="active"
                    className="border-0 bg-secondary-container/20 text-on-secondary-container text-[9px]">
                    GHG Composition
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-center gap-8">
                <div className="flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
                    <div className="space-y-0.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                            GHG Protocol Accounting
                        </p>
                        <p className="font-mono text-[18px] font-bold text-primary">
                            100% <span className="text-[12px] font-normal opacity-70">Audited Factors</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-secondary-container/30 px-2.5 py-1 text-secondary">
                        <MaterialIcon name="verified" size="xs" className="font-bold" />
                        <span className="font-mono text-[10px] font-bold uppercase">IPCC / DEFRA</span>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-8 py-2">
                    <div className="relative h-56 w-56 shrink-0">
                        <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 36 36" aria-hidden>
                            {circles.map((circle) => (
                                <circle
                                    key={circle.label}
                                    cx="18"
                                    cy="18"
                                    r="15.5"
                                    fill="none"
                                    stroke={circle.color}
                                    strokeWidth="4.5"
                                    strokeDasharray={`${circle.percent}, 100`}
                                    strokeDashoffset={-circle.offset}
                                    className="transition-all duration-700 ease-out"
                                />
                            ))}
                        </svg>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="font-mono text-[28px] font-bold leading-none text-primary">
                                {totalPercent}%
                            </span>
                            <span className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                                Accounted
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 pr-2">
                        {segments.map((segment) => (
                            <div key={segment.label} className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <span
                                        className="h-3.5 w-3.5 shrink-0 rounded-sm shadow-sm"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    <span className="text-[14px] font-medium text-on-surface truncate">{segment.label}</span>
                                </div>
                                <span className="shrink-0 font-mono text-[14px] font-bold text-primary">
                                    {segment.percent.toFixed(1)}%
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
