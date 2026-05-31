import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TeamMember } from "@/lib/teamMembers/types";

function getStatusVariant(status: string) {
    switch (status) {
        case "ACTIVE":
            return "active";
        case "PENDING_VERIFICATION":
            return "tag";
        case "INACTIVE":
            return "negative";
        default:
            return "neutral";
    }
}

function formatDate(dateString: string | null) {
    if (!dateString) {
        return "Never";
    }
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export function TeamMembersTable({
    members,
    isLoading = false,
    isError = false,
}: {
    members: TeamMember[];
    isLoading?: boolean;
    isError?: boolean;
}) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">Loading...</div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-error">Failed to load team members.</div>
            </Card>
        );
    }

    if (members.length === 0) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">No team members found.</div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="group" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Team Members
                    </h3>
                </div>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="font-bold">{m.fullName}</p>
                                        <p className="text-[12px] text-on-surface-variant">{m.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-on-surface-variant">{m.role}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(m.userStatus)} size="md">
                                        {m.userStatus.replaceAll("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={m.isVerified ? "positive" : "negative"} size="md">
                                        {m.isVerified ? "Verified" : "Unverified"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-on-surface-variant">
                                    {formatDate(m.lastLoginAt)}
                                </TableCell>
                                <TableCell className="text-sm text-on-surface-variant">
                                    {formatDate(m.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={`mailto:${m.email}`}
                                        className="text-on-tertiary-container hover:underline font-mono text-[11px] font-bold">
                                        Email
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
