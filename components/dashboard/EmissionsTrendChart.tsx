import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody } from "@/components/ui/card";
import { EMISSIONS_TREND } from "@/lib/dashboard/data";

type EmissionsTrendChartProps = {
    data?: typeof EMISSIONS_TREND;
};

/**
 * Line chart — inline SVG matching designs/dashboard-dark.html paths
 * (symmetric chart-grid background, no Recharts grid overlay).
 */
export function EmissionsTrendChart({ data = EMISSIONS_TREND }: EmissionsTrendChartProps) {
    const chartPoints = data.length > 0 ? data : EMISSIONS_TREND;
    const maxVal = Math.max(...chartPoints.map((d) => Math.max(d.actual, d.target)), 1) * 1.1;
    const count = chartPoints.length;

    const targetPath = chartPoints
        .map((d, i) => {
            const x = count > 1 ? (i / (count - 1)) * 1000 : 500;
            const y = 180 - (d.target / maxVal) * 160;
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");

    const actualPath = chartPoints
        .map((d, i) => {
            const x = count > 1 ? (i / (count - 1)) * 1000 : 500;
            const y = 180 - (d.actual / maxVal) * 160;
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");

    const lastActual = chartPoints[chartPoints.length - 1];
    const lastY = lastActual ? 180 - (lastActual.actual / maxVal) * 160 : 115;

    return (
        <Card>
            <CardBody>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="analytics" size="sm" className="text-primary" />
                        <div>
                            <h3 className="text-headline-sm font-semibold text-primary">
                                Emissions Trends
                            </h3>
                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                Metric: Tonnes of CO2 equivalent (tCO2e)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="chart-grid-bg relative flex h-64 w-full items-end overflow-hidden rounded border border-outline-variant px-4 py-2">
                    <svg
                        className="absolute inset-0 h-full w-full p-4"
                        preserveAspectRatio="none"
                        viewBox="0 0 1000 200"
                        aria-hidden>
                        {/* Target — dashed green */}
                        <path
                            d={targetPath}
                            fill="none"
                            stroke="var(--gl-data-green)"
                            strokeDasharray="4"
                            strokeWidth="2"
                        />
                        {/* Actual — solid blue */}
                        <path
                            d={actualPath}
                            fill="none"
                            stroke="var(--gl-data-blue)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="1000"
                            cy={lastY.toFixed(1)}
                            r="4"
                            fill="var(--gl-data-blue)"
                            className="drop-shadow-[0_0_4px_rgba(96,165,250,0.8)]"
                        />
                    </svg>
                    <div className="pointer-events-none absolute bottom-1 left-0 right-0 flex justify-between px-4 font-mono text-[10px] text-on-surface-variant">
                        {chartPoints.map((point) => (
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
