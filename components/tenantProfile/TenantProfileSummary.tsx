import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import type { TenantProfile } from "@/lib/tenantProfile/types";

type TenantProfileSummaryProps = {
    profile: TenantProfile;
};

function StatTile({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <Card className="p-card-padding flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                    {label}
                </p>
                <MaterialIcon name={icon} className="text-on-secondary-container" size="sm" />
            </div>
            <p className="text-headline-md font-headline-md font-semibold text-primary">{value}</p>
        </Card>
    );
}

export function TenantProfileSummary({ profile }: TenantProfileSummaryProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-4">
            <StatTile label="Tenant Status" value={profile.tenantStatus} icon="verified_user" />
            <StatTile label="Users" value={profile.maxUsers} icon="group" />
            <StatTile label="Facilities" value={profile.maxFacilities} icon="domain" />
            <StatTile label="Verified" value={profile.isVerified ? "Yes" : "No"} icon="check_circle" />
        </div>
    );
}
