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
    const maxVal = Math.max(...data.map((row) => Math.max(row.scope1, row.scope2)), 1);

    return (
        <Card>
            <CardHeader tone="flat" className="flex-wrap items-center gap-4 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="equalizer" size="lg" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Scope 1 vs. Scope 2 Comparison</h3>
                        <p className="font-mono text-[10px] uppercase text-on-surface-variant">
                            Monthly tCO2e Distribution
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <LegendDot className="bg-primary-container" label="Scope 1 (Direct)" />
                    <LegendDot style={{ backgroundColor: "var(--gl-chart-esg-teal)" }} label="Scope 2 (Electricity)" />
                </div>
            </CardHeader>

            <CardBody className="p-card-padding">
                <div className="chart-grid-bg flex h-64 w-full items-end gap-4 overflow-x-auto border-b border-outline-variant px-4 pb-2 scrollbar-thin">
                    {data.map((row) => {
                        const h1 = Math.min(100, Math.max(row.scope1 > 0 ? 4 : 0, Math.round((row.scope1 / maxVal) * 100)));
                        const h2 = Math.min(100, Math.max(row.scope2 > 0 ? 4 : 0, Math.round((row.scope2 / maxVal) * 100)));

                        return (
                            <div key={row.month} className="flex h-full min-w-[40px] flex-1 items-end justify-center gap-1.5">
                                <div
                                    className="w-4 rounded-t bg-primary-container shadow-sm transition-[height] duration-700 ease-out"
                                    style={{ height: `${h1}%` }}
                                    title={`Scope 1: ${row.scope1.toFixed(2)} tCO2e`}
                                />
                                <div
                                    className="w-4 rounded-t shadow-sm transition-[height] duration-700 ease-out"
                                    style={{
                                        backgroundColor: "var(--gl-chart-esg-teal)",
                                        height: `${h2}%`,
                                    }}
                                    title={`Scope 2: ${row.scope2.toFixed(2)} tCO2e`}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between px-4 pt-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant overflow-x-auto scrollbar-thin">
                    {data.map((d) => (
                        <span key={d.month} className="min-w-[40px] flex-1 text-center">
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
