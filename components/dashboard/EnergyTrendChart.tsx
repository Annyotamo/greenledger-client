import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergyTrendPoint } from "@/lib/dashboard/types";

type EnergyTrendChartProps = {
    data: EnergyTrendPoint[];
};

function buildPath(values: number[], maxValue: number) {
    const step = values.length > 1 ? 1000 / (values.length - 1) : 0;
    const points = values.map((value, index) => ({
        x: Math.round(index * step),
        y: Math.round(170 - (value / maxValue) * 140),
    }));

    if (points.length < 2) {
        return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
        const current = points[i];
        const next = points[i + 1];
        const deltaX = next.x - current.x;
        const control1X = current.x + deltaX * 0.33;
        const control2X = next.x - deltaX * 0.33;
        path += ` C ${control1X} ${current.y} ${control2X} ${next.y} ${next.x} ${next.y}`;
    }
    return path;
}

function buildPoints(values: number[], maxValue: number) {
    const step = values.length > 1 ? 1000 / (values.length - 1) : 0;
    return values.map((value, index) => ({
        x: Math.round(index * step),
        y: Math.round(170 - (value / maxValue) * 140),
    }));
}

export function EnergyTrendChart({ data }: EnergyTrendChartProps) {
    const maxValue = Math.max(...data.map((point) => Math.max(point.captive, point.grid))) * 1.05;
    const captivePoints = buildPoints(
        data.map((point) => point.captive),
        maxValue,
    );
    const gridPoints = buildPoints(
        data.map((point) => point.grid),
        maxValue,
    );
    const captivePath = buildPath(
        data.map((point) => point.captive),
        maxValue,
    );
    const gridPath = buildPath(
        data.map((point) => point.grid),
        maxValue,
    );

    return (
        <Card className="h-full">
            <CardHeader tone="flat" className="flex-wrap items-center gap-4 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="analytics" size="sm" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Monthly Captive vs. Grid Energy</h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Energy Bifurcation — MWh
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <LegendDot className="bg-secondary" label="Captive" />
                    <LegendDot className="bg-orange-400" label="Grid" />
                </div>
            </CardHeader>

            <CardBody className="p-0">
                <div className="chart-grid-bg relative flex h-96 w-full items-end overflow-hidden rounded-b-lg border border-t-0 border-outline-variant bg-surface-container-low px-4 py-4">
                    <svg
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 1000 180"
                        aria-hidden>
                        <defs>
                            <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--gl-secondary)" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="var(--gl-secondary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={captivePath}
                            fill="none"
                            stroke="var(--gl-secondary)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d={gridPath}
                            fill="none"
                            stroke="#fb923c"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {captivePoints.map((point, index) => (
                            <circle
                                key={`captive-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="var(--gl-secondary)"
                                stroke="var(--gl-surface-container-lowest)"
                                strokeWidth="1.5"
                            />
                        ))}
                        {gridPoints.map((point, index) => (
                            <circle
                                key={`grid-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="#fb923c"
                                stroke="var(--gl-surface-container-lowest)"
                                strokeWidth="1.5"
                            />
                        ))}
                        <path d={`${captivePath} L1000 180 L0 180 Z`} fill="url(#trendGradient)" opacity="0.4" />
                    </svg>
                    <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-between px-4 font-mono text-[10px] text-on-surface-variant">
                        {data.map((point) => (
                            <span key={point.month}>{point.month}</span>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function LegendDot({ className, label }: { className: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${className}`} />
            <span className="font-mono text-[11px] text-on-surface">{label}</span>
        </div>
    );
}
