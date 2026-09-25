import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SCOPE1_BUILDING_IMAGE } from "@/lib/dashboard/data";
import type { Scope1FuelItem } from "@/lib/dashboard/types";

type Scope1BreakdownProps = {
    fuels: Scope1FuelItem[];
};

export function Scope1Breakdown({ fuels }: Scope1BreakdownProps) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="factory" size="sm" className="text-primary" />
                    <h3 className="font-display text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Scope 1 Breakdown (Fuel)
                    </h3>
                </div>
                <Badge variant="tag" className="text-[11px] font-sans">
                    Fuel Consumption
                </Badge>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col justify-center gap-6">
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <Image
                        src={SCOPE1_BUILDING_IMAGE}
                        alt="Sustainable office building"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <div className="space-y-4">
                    {fuels.map((fuel) => (
                        <div key={fuel.label} className="space-y-1.5">
                            <div className="flex items-baseline justify-between">
                                <span className="font-sans text-body-md text-on-surface-variant font-medium">{fuel.label}</span>
                                <span className="font-sans text-label-md font-bold text-primary">
                                    <span className="font-display font-bold tabular-nums">{fuel.value.toLocaleString()}</span>{" "}
                                    <span className="text-[11px] font-normal opacity-70">{fuel.unit}</span>
                                </span>
                            </div>
                            <ProgressBar
                                percent={fuel.percent}
                                trackClassName="bg-surface-container"
                                className="bg-primary-container"
                            />
                        </div>
                    ))}
                </div>
            </CardBody>

            <div className="mt-auto p-card-padding pt-0">
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded border border-outline-variant py-2.5 font-sans text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
                    Scope Dashboard
                    <MaterialIcon name="arrow_forward" size="xs" />
                </button>
            </div>
        </Card>
    );
}
