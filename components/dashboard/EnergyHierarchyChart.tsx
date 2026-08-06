import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type EnergyHierarchyChartProps = {
    items: EnergyBarItem[];
};

export function EnergyHierarchyChart({ items }: EnergyHierarchyChartProps) {
    const maxVal = Math.max(...(items.length > 0 ? items.map((it) => it.value) : [100]), 1);

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="equalizer" size="sm" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Energy Hierarchy</h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Value chain breakdown (MWh)
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-between gap-4 p-card-padding">
                <div className="relative overflow-hidden flex-1 min-h-[220px]">
                    {items.length === 0 ? (
                        <div className="flex h-full items-center justify-center font-mono text-sm text-on-surface-variant">
                            No energy hierarchy data available.
                        </div>
                    ) : (
                        <svg className="w-full h-full" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden>
                            {/* grid lines and y labels */}
                            {Array.from({ length: 5 }).map((_, i) => {
                                const y = 20 + (i * 200) / 4;
                                const labelValue = Math.round(((4 - i) * maxVal) / 4).toLocaleString("en-US");
                                return (
                                    <g key={i}>
                                        <line
                                            x1={60}
                                            x2={980}
                                            y1={y}
                                            y2={y}
                                            stroke="var(--gl-chart-grid)"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={36}
                                            y={y + 4}
                                            fill="var(--gl-on-surface-variant)"
                                            fontFamily="var(--font-mono)"
                                            fontSize="11">
                                            {labelValue}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* bars */}
                            {(() => {
                                const plotX = 60;
                                const plotWidth = 920;
                                const plotTop = 20;
                                const plotHeight = 200;
                                const gap = 40;
                                const n = items.length;
                                const rawBarWidth = (plotWidth - gap * (n - 1)) / n;
                                const barWidth = Math.max(24, Math.min(100, rawBarWidth * 0.6));
                                const totalBarsWidth = n * barWidth + gap * (n - 1);
                                const startX = plotX + (plotWidth - totalBarsWidth) / 2;

                                return items.map((item, idx) => {
                                    const x = Math.round(startX + idx * (barWidth + gap));
                                    const h = maxVal > 0 ? (item.value / maxVal) * plotHeight : 0;
                                    const y = Math.round(plotTop + (plotHeight - h));
                                    return (
                                        <g key={item.label}>
                                            <rect
                                                x={x}
                                                y={y}
                                                width={Math.round(barWidth)}
                                                height={Math.max(4, Math.round(h))}
                                                rx={6}
                                                fill={item.color}
                                            />
                                            <text
                                                x={x + barWidth / 2}
                                                y={plotTop + plotHeight + 24}
                                                fill="var(--gl-on-surface-variant)"
                                                fontSize="11"
                                                fontFamily="var(--font-sans)"
                                                textAnchor="middle">
                                                {item.label}
                                            </text>
                                            <text
                                                x={x + barWidth / 2}
                                                y={Math.max(16, y - 8)}
                                                fill="var(--gl-on-surface)"
                                                fontSize="12"
                                                fontWeight={600}
                                                fontFamily="var(--font-sans)"
                                                textAnchor="middle">
                                                {item.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                            </text>
                                        </g>
                                    );
                                });
                            })()}
                        </svg>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
