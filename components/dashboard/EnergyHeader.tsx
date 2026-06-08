import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";

export function EnergyHeader() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                            Energy Consumption Dashboard
                        </h1>
                        <p className="text-body-md text-on-surface-variant">
                            DRI / Sponge Iron Plant • Captive vs. Grid energy bifurcation
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="sm">
                        <MaterialIcon name="calendar_today" size="sm" />
                        {DATE_RANGE_LABEL}
                    </Button>
                    <Button variant="secondary" size="sm">
                        <MaterialIcon name="file_download" size="sm" />
                        Export
                    </Button>
                </div>
            </div>
        </div>
    );
}
