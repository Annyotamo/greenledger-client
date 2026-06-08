import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type CaptiveGenerationChartProps = {
    items: EnergyBarItem[];
};

export function CaptiveGenerationChart({ items }: CaptiveGenerationChartProps) {
    return (
        <Card className="h-full">
            <CardHeader tone="flat">
                <div>
                    <h3 className="text-headline-sm font-semibold text-primary">Captive Generation by Source</h3>
                </div>
            </CardHeader>

            <CardBody className="flex h-full flex-col gap-6">
                <div className="flex flex-col gap-6">
                    {items.map((item, idx) => (
                        <div key={item.label} className="flex items-center gap-4">
                            <div className="w-48 text-sm text-on-surface-variant">{item.label}</div>

                            <div className="flex-1">
                                <div className="h-3 rounded-full bg-surface-container-high overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>

                            <div className="w-28 text-right font-bold text-on-surface">
                                {item.value.toLocaleString()} MWh
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
