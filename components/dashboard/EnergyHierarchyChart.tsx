import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type EnergyHierarchyChartProps = {
    items: EnergyBarItem[];
};

export function EnergyHierarchyChart({ items }: EnergyHierarchyChartProps) {
    return (
        <Card className="h-full">
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

            <CardBody className="flex h-full flex-col justify-between gap-6">
                <div className="relative overflow-hidden h-full">
                    <svg className="w-full h-full" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden>
                        <defs>
                            <linearGradient id="hierarchyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                                <stop offset="100%" stopColor="rgba(0,0,0,0.03)" />
                            </linearGradient>
                        </defs>
                        {/* grid lines and y labels */}
                        {Array.from({ length: 5 }).map((_, i) => {
                            const y = 24 + (i * 220) / 4;
                            const labelValue = Math.round(
                                ((4 - i) * Math.max(...items.map((it) => it.value))) / 4,
                            ).toLocaleString();
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
                            const plotX = 48;
                            const plotWidth = 904;
                            const plotTop = 20;
                            const plotHeight = 220;
                            const gap = 40;
                            const n = items.length;
                            const rawBarWidth = (plotWidth - gap * (n - 1)) / n;
                            const barWidth = Math.max(18, rawBarWidth * 0.5);
                            const totalBarsWidth = n * barWidth + gap * (n - 1);
                            const startX = plotX + (plotWidth - totalBarsWidth) / 2;
                            const max = Math.max(...items.map((it) => it.value));

                            return items.map((item, idx) => {
                                const x = Math.round(startX + idx * (barWidth + gap));
                                const h = max > 0 ? (item.value / max) * plotHeight : 0;
                                const y = Math.round(plotTop + (plotHeight - h));
                                return (
                                    <g key={item.label}>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={Math.round(barWidth)}
                                            height={Math.round(h)}
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
                                            y={y - 8}
                                            fill="var(--gl-on-surface)"
                                            fontSize="12"
                                            fontWeight={600}
                                            fontFamily="var(--font-sans)"
                                            textAnchor="middle">
                                            {item.value.toLocaleString()}
                                        </text>
                                    </g>
                                );
                            });
                        })()}
                    </svg>
                </div>
            </CardBody>
        </Card>
    );
}
