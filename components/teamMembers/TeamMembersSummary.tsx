import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/teamMembers/types";

type TeamMembersSummaryProps = {
    members: TeamMember[];
};

function InfoCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <Card className="p-card-padding flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                    {label}
                </p>
                <MaterialIcon name={icon} className="text-on-secondary-container" size="sm" />
            </div>
            <div className="text-headline-md font-headline-md font-semibold text-primary">{value}</div>
        </Card>
    );
}

export function TeamMembersSummary({ members }: TeamMembersSummaryProps) {
    const total = members.length;
    const active = members.filter((member) => member.userStatus === "ACTIVE" && member.isActive).length;
    const verified = members.filter((member) => member.isVerified).length;
    const pendingCount = members.filter((member) => member.userStatus === "PENDING_VERIFICATION").length;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard label="Total Members" value={total} icon="group" />
            <InfoCard label="Active Accounts" value={active} icon="check_circle" />
            <InfoCard label="Verified Users" value={verified} icon="verified" />
            <InfoCard label="Pending Verification" value={pendingCount} icon="schedule" />
        </div>
    );
}
