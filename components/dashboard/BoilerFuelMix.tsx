import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergyBarItem } from "@/lib/dashboard/types";

type BoilerFuelMixProps = {
    items: EnergyBarItem[];
};

export function BoilerFuelMix({ items }: BoilerFuelMixProps) {
    return (
        <Card className="h-full">
            <CardHeader tone="flat">
                <div>
                    <h3 className="text-headline-sm font-semibold text-primary">Fuel Mix: CFBC & AFBC Boilers</h3>
                </div>
            </CardHeader>

            <CardBody className="flex h-full flex-col gap-6">
                <div className="relative h-56 border-b border-outline-variant/30 pb-4">
                    <div className="absolute inset-x-0 top-0 h-px bg-outline-variant/20" />
                    <div className="flex h-full items-end justify-around gap-4 px-4">
                        {items.map((item) => (
                            <div key={item.label} className="flex h-full flex-col items-center gap-3">
                                <div className="flex h-full items-end">
                                    <div
                                        className="w-16 rounded-t-lg"
                                        style={{ height: `${item.percent}%`, backgroundColor: item.color }}
                                    />
                                </div>
                                <span className="text-[11px] font-semibold text-on-surface text-center">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-3">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-on-surface-variant">
                                {item.label}
                            </span>
                            <div className="mt-2 text-sm font-bold text-on-surface">
                                {item.value.toLocaleString()}{" "}
                                <span className="text-[10px] font-normal opacity-70">MWh</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
