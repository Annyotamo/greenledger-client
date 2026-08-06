import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";

type EnergyHeaderProps = {
    reportingPeriod?: string;
    facilitiesCount?: number;
};

export function EnergyHeader({ reportingPeriod, facilitiesCount }: EnergyHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="text-[11px] font-bold tracking-widest text-secondary uppercase">
                            GreenLedger • Energy Module {facilitiesCount ? `• ${facilitiesCount} Facilities` : ""}
                        </div>
                        <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                            Energy Consumption Dashboard
                        </h1>
                        <p className="text-body-md text-on-surface-variant">
                            Comprehensive Tenant Energy Accounting • Captive Generation vs. Grid Sourced Bifurcation
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="sm">
                        <MaterialIcon name="calendar_today" size="sm" />
                        {reportingPeriod || DATE_RANGE_LABEL}
                    </Button>
                    <Button variant="secondary" size="sm">
                        <MaterialIcon name="file_download" size="sm" />
                        Export Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
