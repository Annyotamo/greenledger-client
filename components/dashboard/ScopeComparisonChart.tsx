import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { ScopeComparisonMonth } from "@/lib/dashboard/types";
import type { CSSProperties } from "react";

type ScopeComparisonChartProps = {
    data: ScopeComparisonMonth[];
};

/**
 * Grouped bar chart — pure CSS flex layout matching designs/dashboard-light.html
 * (no Recharts; preserves symmetric 20×20 grid and exact bar proportions).
 */
export function ScopeComparisonChart({ data }: ScopeComparisonChartProps) {
    return (
        <Card>
            <CardHeader tone="flat" className="flex-wrap items-center gap-4 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="equalizer" size="lg" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Scope 1 vs. Scope 2 Comparison</h3>
                        <p className="font-mono text-[10px] uppercase text-on-surface-variant">
                            Monthly tCO2e Distribution (Last 6 Months)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <LegendDot className="bg-primary-container" label="Scope 1 (Technical Navy)" />
                    <LegendDot style={{ backgroundColor: "var(--gl-chart-esg-teal)" }} label="Scope 2 (ESG Green)" />
                </div>
            </CardHeader>

            <CardBody className="p-card-padding">
                <div className="chart-grid-bg flex h-64 w-full items-end gap-12 border-b border-outline-variant px-6 pb-2">
                    {data.map((row) => (
                        <div key={row.month} className="flex h-full flex-1 items-end justify-center gap-2">
                            <div
                                className="w-6 rounded-t bg-primary-container shadow-sm transition-[height] duration-700 ease-out"
                                style={{ height: `${row.scope1}%` }}
                                role="img"
                                aria-label={`${row.month} Scope 1 ${row.scope1}%`}
                            />
                            <div
                                className="w-6 rounded-t shadow-sm transition-[height] duration-700 ease-out"
                                style={{
                                    backgroundColor: "var(--gl-chart-esg-teal)",
                                    height: `${row.scope2}%`,
                                }}
                                role="img"
                                aria-label={`${row.month} Scope 2 ${row.scope2}%`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-6 pt-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {data.map((d) => (
                        <span key={d.month} className="flex-1 text-center">
                            {d.month}
                        </span>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function LegendDot({ className, label, style }: { className?: string; label: string; style?: CSSProperties }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`h-3 w-3 shrink-0 rounded-full ${className ?? ""}`} style={style} />
            <span className="font-mono text-[11px] text-on-surface">{label}</span>
        </div>
    );
}
